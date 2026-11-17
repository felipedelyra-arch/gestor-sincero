"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { papoRetoBruto } from "@content/papo-reto";
import { semPendentes } from "@content/pendentes";
import type { PapoReto as ConteudoPapoReto } from "@content/schema";
import { LIMITE_LIVRE, rotaPapoReto, type Recomendacao, type Resposta, type RespostaPapoReto, type Turno } from "@/shared/papoReto";
import { carregarTurnstile } from "../formulario/turnstile";
import { estilosBotao } from "../ui/estilos";
import { Avatar, type EstadoAvatar, type FormatoAvatar } from "./Avatar";

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

function lerAmbiente() {
  const conexao = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return {
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
  const focoNaPergunta = useRef<HTMLButtonElement | HTMLInputElement | null>(null);
  const botaoRecomendacao = useRef<HTMLButtonElement>(null);
  const timerFala = useRef<number>(undefined);

  const [{ formato, somentePoster }] = useState(lerAmbiente);
  const [fase, setFase] = useState<"aviso" | "conversa">("aviso");
  const [consentimento, setConsentimento] = useState<boolean | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [pergunta, setPergunta] = useState<number | null>(null);
  const [final, setFinal] = useState<Final | null>(null);
  const [encerrada, setEncerrada] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<Erro | null>(null);
  const [avatar, setAvatar] = useState<EstadoAvatar>("ouvindo");
  const [numero, setNumero] = useState("");
  const [livre, setLivre] = useState("");

  const adicionar = useCallback((de: Mensagem["de"], texto: string) => {
    setMensagens((atual) => [...atual, { id: proximoId.current++, de, texto }]);
  }, []);

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

  // A conversa rola até a última mensagem; com movimento reduzido, sem animação.
  useEffect(() => {
    const el = log.current;
    if (!el) return;
    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: suave ? "smooth" : "auto" });
  }, [mensagens, final, erro]);

  // O foco acompanha a conversa: primeira opção da pergunta nova, ou a recomendação no fim.
  useEffect(() => {
    if (enviando) return;
    if (final) botaoRecomendacao.current?.focus();
    else if (pergunta !== null) focoNaPergunta.current?.focus();
  }, [pergunta, final, enviando]);

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
    // A boca se mexe pelo tempo de ler a fala (cerca de 45 ms por caractere, entre 1,5 e 7 s) e volta a ouvir.
    window.clearTimeout(timerFala.current);
    setAvatar("falando");
    timerFala.current = window.setTimeout(() => setAvatar("ouvindo"), Math.min(7000, Math.max(1500, texto.length * 45)));
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

  const responderOpcao = (id: string, rotulo: string) =>
    enviar({ opcao: id, numero: null, livre: livre.trim() || null }, rotulo);

  const responderCampo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const n = numero.trim() === "" ? null : Number(numero);
    const texto = livre.trim() || null;
    if (n === null && texto === null) return;
    void enviar({ opcao: null, numero: n, livre: texto }, n !== null ? rotuloNumero(n) : (texto ?? undefined));
  };

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="papo-titulo"
      onClose={aoFechar}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-preto-2 p-0 text-texto backdrop:bg-black/60 lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[min(520px,100vw)] lg:border-l lg:border-chumbo"
    >
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-chumbo p-4">
          {formato === "1x1" && (
            <Avatar
              estado={avatar}
              formato="1x1"
              pasta={videos}
              alt={papoReto.altVideo}
              somentePoster={somentePoster}
              aoFimCetico={() => fimCetico.current?.()}
              className="size-20 shrink-0 rounded-base"
            />
          )}
          <h2 id="papo-titulo" className="flex-1 font-titulo text-sub font-medium text-balance">
            {papoReto.titulo}
          </h2>
          <button
            type="button"
            onClick={() => dialogo.current?.close()}
            className="inline-flex min-h-12 shrink-0 items-center px-2 text-apoio font-medium underline decoration-ouro decoration-1 underline-offset-4 hover:decoration-ouro-claro"
          >
            {papoReto.encerrar}
          </button>
        </header>

        {formato === "16x9" && (
          <Avatar
            estado={avatar}
            formato="16x9"
            pasta={videos}
            alt={papoReto.altVideo}
            somentePoster={somentePoster}
            aoFimCetico={() => fimCetico.current?.()}
            className="h-[clamp(120px,22vh,292px)] w-full shrink-0 border-b border-chumbo"
          />
        )}

        {/* Fica montado a conversa toda: o token chega alguns segundos depois e o widget só aparece se a Cloudflare pedir uma ação. */}
        <div ref={alvoTurnstile} className="shrink-0 px-4 empty:hidden" />

        <div ref={log} role="log" aria-live="polite" aria-relevant="additions" aria-label={papoReto.titulo} tabIndex={0} className="min-h-0 flex-1 overflow-y-auto p-4">
          {fase === "aviso" ? (
            <div className="grid gap-4">
              <p className="text-apoio text-texto-2">{papoReto.avisos.roteiro}</p>
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
                  className={
                    m.de === "voce"
                      ? "max-w-[85%] justify-self-end border-r border-ouro pr-4 text-right"
                      : m.de === "pergunta"
                        ? "pl-4 font-medium"
                        : "border-l border-ouro pl-4 text-balance"
                  }
                >
                  {m.texto}
                </li>
              ))}
              {enviando && <li className="pl-4 text-apoio text-texto-2">{papoReto.enviando}</li>}
              {erro && <li className="pl-4 text-erro">{papoReto.erros[erro]}</li>}
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

        {fase === "conversa" && atual && !final && !encerrada && (
          <form onSubmit={responderCampo} className="max-h-[55%] shrink-0 overflow-y-auto border-t border-chumbo bg-preto-2 p-4">
            <div className="grid gap-2">
              {atual.opcoes.map((o, i) => (
                <button
                  key={`${atual.numero}-${o.id}`}
                  ref={i === 0 ? (el) => void (focoNaPergunta.current = el) : undefined}
                  type="button"
                  disabled={enviando}
                  onClick={() => void responderOpcao(o.id, o.rotulo)}
                  className={botaoOpcao}
                >
                  {o.rotulo}
                </button>
              ))}

              {atual.campoNumero && (
                <div className="grid gap-2">
                  <label htmlFor="papo-numero" className="font-medium">
                    {atual.campoNumero.rotulo}
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      id="papo-numero"
                      ref={atual.opcoes.length === 0 ? (el) => void (focoNaPergunta.current = el) : undefined}
                      type="number"
                      inputMode="numeric"
                      min={atual.campoNumero.min}
                      max={atual.campoNumero.max}
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      disabled={enviando}
                      className={`${campoBase} h-14 max-w-40`}
                    />
                    {atual.campoNumero.sufixo && <span className="text-texto-2">{atual.campoNumero.sufixo}</span>}
                    <button type="submit" disabled={enviando} aria-disabled={enviando || undefined} className={`${estilosBotao.principal} max-sm:w-full sm:ml-auto`}>
                      {enviando ? papoReto.enviando : papoReto.responder}
                    </button>
                  </div>
                </div>
              )}

              {/* "Quer explicar melhor?" recolhido */}
              <details className="group mt-1">
                <summary className="flex min-h-12 cursor-pointer list-none items-center text-apoio font-medium text-ouro-claro">
                  {papoReto.livre.rotulo}
                </summary>
                <div className="grid gap-2 pb-2">
                  {papoReto.livre.ajuda && <p className="text-apoio text-texto-2">{papoReto.livre.ajuda}</p>}
                  <textarea
                    aria-label={papoReto.livre.rotulo}
                    rows={3}
                    maxLength={LIMITE_LIVRE}
                    value={livre}
                    onChange={(e) => setLivre(e.target.value)}
                    disabled={enviando}
                    className={`${campoBase} py-3`}
                  />
                </div>
              </details>

              {!atual.campoNumero && livre.trim() !== "" && (
                <button type="submit" disabled={enviando} aria-disabled={enviando || undefined} className={`${estilosBotao.principal} sm:w-full`}>
                  {enviando ? papoReto.enviando : papoReto.responder}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
