"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { papoRetoBruto } from "@content/papo-reto";
import { semPendentes } from "@content/pendentes";
import type { PapoReto as ConteudoPapoReto } from "@content/schema";
import {
  AUDIO_MAX_SEGUNDOS,
  LIMITE_LIVRE,
  rotaPapoReto,
  rotaPapoRetoAudio,
  type Recomendacao,
  type Resposta,
  type RespostaPapoReto,
  type RespostaTranscricao,
  type Turno,
} from "@/shared/papoReto";
import { carregarTurnstile } from "../formulario/turnstile";
import { estilosBotao } from "../ui/estilos";
import { Avatar, type EstadoAvatar, type FormatoAvatar } from "./Avatar";
import { gravacaoSuportada, useGravacao } from "./usarGravacao";
import { useVoz } from "./usarVoz";

// O texto vem direto de content/ e só entra no navegador junto com este painel (import dinâmico no clique).
const papoReto: ConteudoPapoReto = process.env.NODE_ENV === "production" ? semPendentes(papoRetoBruto) : papoRetoBruto;

export type PropsPainel = {
  aoFechar: () => void;
  /** `site.papoReto.videos`. */
  videos: string;
  /** `site.links.ressonancia`. */
  linkRessonancia: string;
  turnstileSiteKey: string;
};

type Mensagem = { id: number; de: "personagem" | "pergunta" | "voce"; texto: string };
type Final = { pontos: string[]; recomendacao: Recomendacao };
type Erro = "limite" | "antirrobo" | "indisponivel";

const ESPERA_TOKEN_MS = 20_000;
const ESPERA_CETICO_MS = 4_500;
// Se a voz do navegador não começar a falar neste prazo, o avatar passa a seguir o tempo estimado.
const INICIO_VOZ_MS = 1_500;

// Só valores simples chegam da rota; qualquer coisa fora do formato vira "indisponível".
function lerResposta(v: unknown): RespostaPapoReto {
  const indisponivel: RespostaPapoReto = { ok: false, erro: "indisponivel" };
  if (typeof v !== "object" || v === null || !("ok" in v)) return indisponivel;
  const r = v as Record<string, unknown>;
  if (r.ok === false) {
    return r.erro === "validacao" || r.erro === "limite" || r.erro === "antirrobo" ? { ok: false, erro: r.erro } : indisponivel;
  }
  const final = r.final;
  const finalOk =
    final === null ||
    (typeof final === "object" &&
      final !== null &&
      Array.isArray((final as Final).pontos) &&
      (final as Final).pontos.every((p) => typeof p === "string") &&
      ["jornada", "ressonancia", "mentoria"].includes((final as Final).recomendacao));
  if (
    r.ok !== true ||
    typeof r.fala !== "string" ||
    (r.avatar !== "falando" && r.avatar !== "cetico") ||
    !(r.pergunta === null || typeof r.pergunta === "number") ||
    !finalOk ||
    typeof r.encerrada !== "boolean" ||
    typeof r.estado !== "string"
  )
    return indisponivel;
  return r as unknown as RespostaPapoReto;
}

function lerTranscricao(v: unknown): RespostaTranscricao {
  if (typeof v === "object" && v !== null && "ok" in v) {
    const r = v as Record<string, unknown>;
    if (r.ok === true && typeof r.texto === "string") return { ok: true, texto: r.texto };
    if (r.ok === false && (r.erro === "validacao" || r.erro === "limite" || r.erro === "antirrobo" || r.erro === "nao-entendido"))
      return { ok: false, erro: r.erro };
  }
  return { ok: false, erro: "indisponivel" };
}

const tempo = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function lerAmbiente() {
  const conexao = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return {
    microfone: gravacaoSuportada(),
    formato: (window.matchMedia("(min-width: 1024px)").matches ? "16x9" : "1x1") as FormatoAvatar,
    somentePoster:
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      conexao?.saveData === true ||
      /(^|-)2g$/.test(conexao?.effectiveType ?? ""),
  };
}

const botaoOpcao =
  "flex min-h-12 w-full items-center rounded-base border border-ouro-escuro px-4 py-2 text-left font-medium text-texto transition-colors duration-200 hover:border-ouro-claro disabled:opacity-60";
const campoBase = "w-full rounded-base border border-chumbo bg-preto px-4 text-corpo text-texto";
const botaoIcone =
  "inline-flex size-12 shrink-0 items-center justify-center rounded-base border border-ouro-escuro text-texto transition-colors duration-200 hover:border-ouro-claro disabled:opacity-60";
const balao = "max-w-[88%] rounded-base border px-4 py-3";

export default function PapoReto({ aoFechar, videos, linkRessonancia, turnstileSiteKey }: PropsPainel) {
  const router = useRouter();
  const dialogo = useRef<HTMLDialogElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const alvoTurnstile = useRef<HTMLDivElement>(null);
  const widget = useRef<string>(undefined);
  const token = useRef("");
  const aguardandoToken = useRef<(() => void) | null>(null);
  const estadoServidor = useRef<string | null>(null);
  const fimCetico = useRef<(() => void) | null>(null);
  const proximoId = useRef(1);
  const campoMensagem = useRef<HTMLTextAreaElement>(null);
  const campoNumero = useRef<HTMLInputElement>(null);
  const aberto = useRef(true);
  const botaoRecomendacao = useRef<HTMLButtonElement>(null);
  const timerFala = useRef<number>(undefined);

  const [{ formato, somentePoster, microfone }] = useState(lerAmbiente);
  const [fase, setFase] = useState<"aviso" | "conversa">("aviso");
  const [consentimento, setConsentimento] = useState<boolean | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [pergunta, setPergunta] = useState<number | null>(null);
  // A conversa é por texto e por voz. As respostas prontas só aparecem quando ele não entendeu a resposta
  // (a mesma pergunta voltou), para a pessoa nunca ficar sem saída.
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  // Voz pedida e nenhuma voz instalada neste navegador: avisa em vez de ficar mudo sem explicação.
  const [semVoz, setSemVoz] = useState(false);
  const [final, setFinal] = useState<Final | null>(null);
  const [encerrada, setEncerrada] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<Erro | null>(null);
  const [avatar, setAvatar] = useState<EstadoAvatar>("ouvindo");
  const [numero, setNumero] = useState("");
  const [livre, setLivre] = useState("");
  const [transcrevendo, setTranscrevendo] = useState(false);
  const [audioNoServidor, setAudioNoServidor] = useState(false);
  const voz = useVoz();
  // O servidor diz se o texto livre é lido por IA. Enquanto não responde (ou se falhar), vale o aviso mais completo.
  const [comIA, setComIA] = useState(true);
  useEffect(() => {
    let vivo = true;
    fetch(rotaPapoReto)
      .then((r) => (r.ok ? (r.json() as Promise<{ comIA?: boolean; audio?: boolean }>) : null))
      .then((j) => {
        if (!vivo || !j) return;
        if (j.comIA === false) setComIA(false);
        setAudioNoServidor(j.audio === true); // ausente = sem áudio
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  const adicionar = useCallback((de: Mensagem["de"], texto: string) => {
    setMensagens((atual) => [...atual, { id: proximoId.current++, de, texto }]);
  }, []);

  const { calar: calarVoz } = voz;
  useEffect(() => {
    aberto.current = true;
    return () => {
      aberto.current = false;
      calarVoz();
    };
  }, [calarVoz]);

  // Janela modal nativa: foco preso, Esc fecha e o foco volta ao botão que abriu.
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (!d.open) d.showModal(); // no modo estrito do dev o efeito roda duas vezes
    const corpo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Sem `d.close()` aqui: o evento `close` é assíncrono e fecharia o painel na segunda execução do efeito.
    // Ao sair da página o elemento some do DOM e leva o diálogo junto.
    return () => {
      document.body.style.overflow = corpo;
    };
  }, []);

  // Turnstile do primeiro turno: o widget carrega enquanto a pessoa lê o aviso.
  useEffect(() => {
    let ativo = true;
    carregarTurnstile()
      .then(() => {
        if (!ativo || !alvoTurnstile.current || !window.turnstile) return;
        widget.current = window.turnstile.render(alvoTurnstile.current, {
          sitekey: turnstileSiteKey,
          theme: "dark",
          language: "pt-br",
          appearance: "interaction-only",
          callback: (t) => {
            token.current = t;
            aguardandoToken.current?.();
          },
          "expired-callback": () => (token.current = ""),
          "error-callback": () => (token.current = ""),
        });
      })
      .catch(() => {}); // sem o widget o primeiro turno mostra o erro de antirrobô
    return () => {
      ativo = false;
      window.clearTimeout(timerFala.current);
      if (widget.current) window.turnstile?.remove(widget.current);
    };
  }, [turnstileSiteKey]);

  // O campo de mensagem cresce com o texto (o teto é o max-h da classe).
  useLayoutEffect(() => {
    const el = campoMensagem.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflowY = el.scrollHeight > 128 ? "auto" : "hidden"; // 128px = max-h-32
  }, [livre, fase]);

  // A conversa rola até a última mensagem; com movimento reduzido, sem animação.
  useEffect(() => {
    const el = log.current;
    if (!el || mensagens.length === 0) return; // o aviso do início fica no topo
    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: suave ? "smooth" : "auto" });
  }, [mensagens, final, erro]);

  // Celular: o teclado virtual não encolhe o dialog (nem o dvh). Acompanha a área realmente visível (visualViewport) para o campo
  // e a última fala não ficarem atrás do teclado.
  const [tela, setTela] = useState<{ altura: number; topo: number } | null>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const ajustar = () => {
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const nova = desktop ? null : { altura: Math.round(vv.height), topo: Math.round(vv.offsetTop) };
      setTela((velha) => (velha?.altura === nova?.altura && velha?.topo === nova?.topo ? velha : nova));
    };
    ajustar();
    vv.addEventListener("resize", ajustar);
    vv.addEventListener("scroll", ajustar);
    return () => {
      vv.removeEventListener("resize", ajustar);
      vv.removeEventListener("scroll", ajustar);
    };
  }, []);
  const tecladoAberto = tela !== null && tela.altura < 560;
  // Depois que o painel encolhe, a última fala continua à vista (o aviso do início fica no topo).
  useEffect(() => {
    const el = log.current;
    if (el && tela && fase === "conversa") el.scrollTop = el.scrollHeight;
  }, [tela, fase]);

  // Depois de cada envio o foco volta ao campo de mensagem (ao campo numérico, se a pergunta só tem ele); no fim, à recomendação.
  useEffect(() => {
    if (enviando || transcrevendo) return;
    if (final) botaoRecomendacao.current?.focus();
    else if (pergunta !== null) (campoNumero.current ?? campoMensagem.current)?.focus();
  }, [pergunta, final, enviando, transcrevendo]);

  const esperarToken = (): Promise<boolean> =>
    new Promise((resolver) => {
      if (token.current) return resolver(true);
      const t = window.setTimeout(() => {
        aguardandoToken.current = null;
        resolver(false);
      }, ESPERA_TOKEN_MS);
      aguardandoToken.current = () => {
        window.clearTimeout(t);
        aguardandoToken.current = null;
        resolver(true);
      };
    });

  const falar = (texto: string) => {
    if (!aberto.current) return;
    window.clearTimeout(timerFala.current);
    const parar = () => {
      window.clearTimeout(timerFala.current);
      setAvatar("ouvindo");
    };
    // Sem voz (ou se ela não começar), a boca se mexe pelo tempo de ler a fala: cerca de 45 ms por caractere, entre 1,5 e 7 s.
    const porEstimativa = () => {
      setAvatar("falando");
      timerFala.current = window.setTimeout(parar, Math.min(7000, Math.max(1500, texto.length * 45)));
    };
    const comVoz = voz.falar(
      texto,
      parar,
      // Com voz, "falando" vale do evento `start` ao `end`/`error` (o tempo longo é só rede de segurança).
      () => {
        window.clearTimeout(timerFala.current);
        setAvatar("falando");
        timerFala.current = window.setTimeout(parar, Math.max(10_000, texto.length * 150));
      },
    );
    if (comVoz) timerFala.current = window.setTimeout(porEstimativa, INICIO_VOZ_MS);
    else porEstimativa();
  };

  const enviar = async (resposta: Resposta | null, rotuloDaResposta?: string) => {
    if (enviando) return;
    setEnviando(true);
    setErro(null);
    const primeiro = estadoServidor.current === null;

    if (primeiro && !(await esperarToken())) {
      setErro("antirrobo");
      setEnviando(false);
      return;
    }
    if (rotuloDaResposta) adicionar("voce", rotuloDaResposta);

    const turno: Turno = {
      estado: estadoServidor.current,
      turnstileToken: primeiro ? token.current : null,
      consentimento: consentimento === true,
      resposta,
    };

    let r: RespostaPapoReto;
    try {
      const http = await fetch(rotaPapoReto, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(turno),
      });
      r = lerResposta(await http.json());
    } catch {
      r = { ok: false, erro: "indisponivel" };
    }

    if (!r.ok) {
      if (primeiro) {
        token.current = ""; // o token vale para um envio só: pede outro
        if (widget.current) window.turnstile?.reset(widget.current);
      }
      setErro(r.erro === "validacao" ? "indisponivel" : r.erro);
      setEnviando(false);
      return;
    }

    estadoServidor.current = r.estado;
    setNumero("");
    setLivre("");

    // Resposta com contradição: o clipe cético toca uma vez, e só depois vem a fala de confronto.
    if (r.avatar === "cetico") {
      setAvatar("cetico");
      await new Promise<void>((pronto) => {
        const t = window.setTimeout(pronto, somentePoster ? 700 : ESPERA_CETICO_MS);
        fimCetico.current = () => {
          window.clearTimeout(t);
          pronto();
        };
      });
      fimCetico.current = null;
    }
    adicionar("personagem", r.fala);
    falar(r.fala);
    if (r.pergunta !== null) adicionar("pergunta", papoReto.perguntas[r.pergunta - 1].texto);
    setMostrarOpcoes(r.pergunta !== null && r.pergunta === pergunta && r.regra === null);
    setPergunta(r.pergunta);
    setFinal(r.final);
    setEncerrada(r.encerrada);
    setFase("conversa");
    setEnviando(false);
  };

  // A tela do aviso fica até o primeiro turno dar certo: se falhar, o botão continua ali para tentar de novo.
  const comecar = () => void enviar(null);

  const ir = (recomendacao: Recomendacao) => {
    aoFechar();
    if (recomendacao === "ressonancia") router.push(linkRessonancia);
    else window.setTimeout(() => document.getElementById(recomendacao)?.scrollIntoView(), 50);
  };

  const atual = pergunta !== null ? papoReto.perguntas[pergunta - 1] : null;
  const rotuloNumero = (n: number) => `${n}${atual?.campoNumero?.sufixo ? ` ${atual.campoNumero.sufixo}` : ""}`;

  const ocupado = enviando || transcrevendo;

  const responderOpcao = (id: string, rotulo: string) => enviar({ opcao: id, numero: null, livre: null }, rotulo);

  const responderCampo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (numero.trim() === "") return;
    const n = Number(numero);
    void enviar({ opcao: null, numero: n, livre: null }, rotuloNumero(n));
  };

  const enviarMensagem = () => {
    const texto = livre.trim();
    if (!texto || ocupado || gravacao.gravando) return;
    setLivre("");
    void enviar({ opcao: null, numero: null, livre: texto }, texto);
  };

  const aoTeclar = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault(); // Enter envia; Shift+Enter quebra a linha
    enviarMensagem();
  };

  // Fala do personagem que não é resposta da rota (áudio não entendido, microfone indisponível): não avança a conversa.
  const dizer = (texto: string, lida: boolean) => {
    adicionar("personagem", texto);
    if (lida) falar(texto);
  };

  const transcrever = async (audio: File) => {
    setTranscrevendo(true);
    setErro(null);
    let r: RespostaTranscricao;
    try {
      const corpo = new FormData();
      corpo.append("audio", audio);
      corpo.append("estado", estadoServidor.current ?? "");
      const http = await fetch(rotaPapoRetoAudio, { method: "POST", body: corpo });
      r = lerTranscricao(await http.json());
    } catch {
      r = { ok: false, erro: "indisponivel" };
    }
    if (!aberto.current) return;
    setTranscrevendo(false);
    if (r.ok && r.texto.trim()) {
      const texto = r.texto.trim().slice(0, LIMITE_LIVRE);
      void enviar({ opcao: null, numero: null, livre: texto }, texto);
    } else if (r.ok || r.erro === "nao-entendido") dizer(papoReto.conversa.audioNaoEntendido, true);
    else setErro(r.erro === "validacao" ? "indisponivel" : r.erro);
  };

  const gravacao = useGravacao(
    (audio) => void transcrever(audio),
    () => dizer(papoReto.conversa.semMicrofone, false),
  );

  const alternarGravacao = () => {
    if (!gravacao.gravando) {
      voz.calar(); // a voz do personagem não pode entrar na gravação
      window.clearTimeout(timerFala.current);
      setAvatar("ouvindo");
    }
    gravacao.alternar();
  };

  const mostrarEntrada = fase === "conversa" && atual !== null && !final && !encerrada;
  const textoVozLigada = voz.ligada ? papoReto.conversa.silenciarFalas : papoReto.conversa.ouvirFalas;
  const avatarProps = {
    estado: avatar,
    pasta: videos,
    alt: papoReto.altVideo,
    somentePoster,
    aoFimCetico: () => fimCetico.current?.(),
  };

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="papo-titulo"
      onClose={aoFechar}
      style={tela ? { height: tela.altura, top: tela.topo, bottom: "auto" } : undefined}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-preto-2 p-0 text-texto backdrop:bg-black/60 lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[min(560px,100vw)] lg:border-l lg:border-chumbo"
    >
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center gap-2 border-b border-chumbo py-2 pr-2 pl-4">
          <h2 id="papo-titulo" className="min-w-0 flex-1 font-titulo text-lead font-medium text-balance max-[400px]:text-legenda lg:text-sub">
            {papoReto.titulo}
          </h2>
          {voz.suportada && (
            <button
              type="button"
              onClick={() => void voz.alternar().then((ok) => setSemVoz(ok === false))}
              aria-label={textoVozLigada}
              title={textoVozLigada}
              className={`${botaoIcone} ${voz.ligada ? "border-ouro bg-marinho" : ""}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-none stroke-current stroke-[1.6]">
                <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" strokeLinejoin="round" />
                {voz.ligada ? (
                  <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" strokeLinecap="round" />
                ) : (
                  <path d="m16 9.5 4 5m0-5-4 5" strokeLinecap="round" />
                )}
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => dialogo.current?.close()}
            className="inline-flex min-h-12 shrink-0 items-center px-2 text-apoio font-medium whitespace-nowrap underline decoration-ouro decoration-1 underline-offset-4 hover:decoration-ouro-claro"
          >
            {papoReto.encerrar}
          </button>
        </header>
        {semVoz && (
          <p role="status" className="shrink-0 border-b border-chumbo px-4 py-2 text-legenda text-texto-2">
            {papoReto.conversa.semVoz}
          </p>
        )}

        {/* Personagem inteiro e em destaque: quadrado de 240px ou mais no celular; no desktop, uns 40% da altura do painel. */}
        {formato === "1x1" ? (
          <div className="shrink-0 border-b border-chumbo bg-preto">
            <Avatar
              {...avatarProps}
              formato="1x1"
              // inteiro só no aviso inicial; na conversa encolhe para sobrar espaço às falas (menor ainda com o teclado aberto)
              className={`mx-auto aspect-square ${fase === "aviso" ? "h-[clamp(240px,30dvh,320px)]" : tecladoAberto ? "h-16" : "h-40"}`}
            />
          </div>
        ) : (
          <Avatar {...avatarProps} formato="16x9" className="h-[34%] max-h-[420px] min-h-[240px] w-full shrink-0 border-b border-chumbo" />
        )}

        {/* Fica montado a conversa toda: o token chega alguns segundos depois e o widget só aparece se a Cloudflare pedir uma ação. */}
        <div ref={alvoTurnstile} className="shrink-0 px-4 empty:hidden" />

        <div ref={log} data-fase={fase} role="log" aria-live="polite" aria-relevant="additions" aria-label={papoReto.titulo} tabIndex={0} className="min-h-24 flex-1 overflow-y-auto p-4">
          {fase === "aviso" ? (
            <div className="grid gap-4">
              <p className="text-apoio text-texto-2">{comIA ? papoReto.avisos.comIA : papoReto.avisos.roteiro}</p>
              <p>{papoReto.consentimento.texto}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { valor: true, rotulo: papoReto.consentimento.aceitar },
                  { valor: false, rotulo: papoReto.consentimento.recusar },
                ].map((o) => (
                  <button
                    key={o.rotulo}
                    type="button"
                    aria-pressed={consentimento === o.valor}
                    onClick={() => setConsentimento(o.valor)}
                    className={`${botaoOpcao} justify-center text-center aria-pressed:border-ouro aria-pressed:bg-marinho`}
                  >
                    {o.rotulo}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={consentimento === null || enviando}
                aria-disabled={consentimento === null || enviando || undefined}
                onClick={comecar}
                className={`${estilosBotao.principal} sm:w-full`}
              >
                {enviando ? papoReto.enviando : papoReto.comecar}
              </button>
              {erro && (
                <p role="alert" className="text-erro">
                  {papoReto.erros[erro]}
                </p>
              )}
            </div>
          ) : (
            <ol className="grid content-start gap-3">
              {mensagens.map((m) => (
                <li
                  key={m.id}
                  className={`${balao} ${tecladoAberto ? "max-w-[94%] py-2 leading-snug" : ""} ${
                    m.de === "voce"
                      ? "justify-self-end border-ouro-escuro bg-marinho"
                      : `justify-self-start border-chumbo bg-preto text-pretty ${m.de === "pergunta" ? "font-medium" : ""}`
                  }`}
                >
                  {m.texto}
                </li>
              ))}
              {(enviando || transcrevendo) && (
                <li className="text-apoio text-texto-2">{transcrevendo ? papoReto.conversa.transcrevendo : papoReto.enviando}</li>
              )}
              {erro && <li className="text-erro">{papoReto.erros[erro]}</li>}
              {final && (
                <li className="grid gap-3 border-t border-ouro pt-5">
                  <h3 className="font-titulo text-sub font-medium">{papoReto.fechamento.titulo}</h3>
                  <p className="text-texto-2">{papoReto.fechamento.abertura}</p>
                  <ul className="grid gap-2">
                    {final.pontos.map((p, i) => (
                      <li key={i} className="border-l border-ouro pl-3">
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p>{papoReto.recomendacoes[final.recomendacao].texto}</p>
                  <button ref={botaoRecomendacao} type="button" onClick={() => ir(final.recomendacao)} className={`${estilosBotao.principal} sm:w-full`}>
                    {papoReto.recomendacoes[final.recomendacao].rotuloBotao}
                  </button>
                </li>
              )}
              {encerrada && <li className="text-apoio text-texto-2">{papoReto.encerrada}</li>}
            </ol>
          )}
        </div>

        {mostrarEntrada && (
          <div className="shrink-0 border-t border-chumbo bg-preto-2">
            {mostrarOpcoes && (atual.opcoes.length > 0 || atual.campoNumero) && (
              <div className="grid max-h-[32dvh] gap-2 overflow-y-auto px-4 pt-3 sm:grid-cols-2">
                {atual.opcoes.length > 0 && <p className="text-legenda text-texto-2 sm:col-span-2">{papoReto.conversa.sugestoes}</p>}
                {atual.opcoes.map((o) => (
                  <button
                    key={`${atual.numero}-${o.id}`}
                    type="button"
                    disabled={ocupado || gravacao.gravando}
                    onClick={() => void responderOpcao(o.id, o.rotulo)}
                    className={botaoOpcao}
                  >
                    {o.rotulo}
                  </button>
                ))}
                {atual.campoNumero && (
                  <form onSubmit={responderCampo} className="grid gap-2 sm:col-span-2">
                    <label htmlFor="papo-numero" className="font-medium">
                      {atual.campoNumero.rotulo}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="papo-numero"
                        ref={atual.opcoes.length === 0 ? campoNumero : undefined}
                        type="number"
                        inputMode="numeric"
                        min={atual.campoNumero.min}
                        max={atual.campoNumero.max}
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        disabled={ocupado || gravacao.gravando}
                        className={`${campoBase} h-12 max-w-40`}
                      />
                      {atual.campoNumero.sufixo && <span className="text-texto-2">{atual.campoNumero.sufixo}</span>}
                      <button
                        type="submit"
                        disabled={ocupado || gravacao.gravando || numero.trim() === ""}
                        className={`${estilosBotao.principal} ml-auto`}
                      >
                        {enviando ? papoReto.enviando : papoReto.responder}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Estado da gravação e da transcrição, anunciado ao leitor de tela; o tempo é só visual (não repete a cada segundo). */}
            <p role="status" className="flex items-center gap-2 px-4 pt-3 text-apoio text-ouro-claro empty:hidden">
              {gravacao.gravando && (
                <>
                  <span aria-hidden="true" className="size-2.5 shrink-0 animate-pulse rounded-full bg-ouro motion-reduce:animate-none" />
                  {papoReto.conversa.gravando}
                  <span aria-hidden="true" className="ml-auto tabular-nums">
                    {tempo(gravacao.segundos)} / {tempo(AUDIO_MAX_SEGUNDOS)}
                  </span>
                </>
              )}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviarMensagem();
              }}
              className={`flex items-end gap-2 px-4 ${tecladoAberto ? "py-2" : "py-4"}`}
            >
              <textarea
                ref={campoMensagem}
                rows={1}
                aria-label={papoReto.conversa.campo}
                placeholder={papoReto.conversa.campo}
                maxLength={LIMITE_LIVRE}
                value={livre}
                onChange={(e) => setLivre(e.target.value)}
                onKeyDown={aoTeclar}
                disabled={ocupado || gravacao.gravando}
                enterKeyHint="send"
                className={`${campoBase} max-h-32 min-h-12 resize-none py-3 leading-snug`}
              />
              {microfone && audioNoServidor && (
                <button
                  type="button"
                  onClick={alternarGravacao}
                  disabled={ocupado}
                  aria-label={gravacao.gravando ? papoReto.conversa.pararGravacao : papoReto.conversa.gravar}
                  title={gravacao.gravando ? papoReto.conversa.pararGravacao : papoReto.conversa.gravar}
                  className={`${botaoIcone} ${gravacao.gravando ? "border-ouro bg-ouro text-preto hover:border-ouro-claro" : ""}`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-none stroke-current stroke-[1.6]">
                    {gravacao.gravando ? (
                      <rect x="6.5" y="6.5" width="11" height="11" rx="1" className="fill-current" />
                    ) : (
                      <>
                        <rect x="9" y="3.5" width="6" height="11" rx="3" />
                        <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" strokeLinecap="round" />
                      </>
                    )}
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={ocupado || gravacao.gravando || livre.trim() === ""}
                aria-label={papoReto.conversa.enviar}
                title={papoReto.conversa.enviar}
                className={`${botaoIcone} border-ouro bg-ouro text-preto hover:border-ouro-claro hover:bg-ouro-claro disabled:border-chumbo disabled:bg-transparent disabled:text-texto-2`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-none stroke-current stroke-[1.8]">
                  <path d="M12 19V5m-6 6 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </dialog>
  );
}
