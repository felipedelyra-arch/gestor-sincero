"use client";

import { useEffect, useId, useRef, useState, type SubmitEvent } from "react";
import { z } from "zod";
import type { Formulario as BlocoFormulario } from "@content";
import { cadastroJornadaSchema, pedidoRessonanciaSchema, rotas, type RespostaFormulario } from "@/shared/contratos";
import { useConsentimento } from "../global/consentimento";
import { capturarOrigem } from "../global/origem";
import { dispararEvento as emitir } from "../global/Rastreamento";
import { Campo, IconeErro } from "../ui/Campo";
import { CaixaDeMarcar } from "../ui/CaixaDeMarcar";
import { estilosBotao } from "../ui/estilos";
import type { DefinicaoCampo } from "./campos";
import { carregarTurnstile } from "./turnstile";

const schemas = { cadastroJornada: cadastroJornadaSchema, ressonancia: pedidoRessonanciaSchema } as const;

// A resposta da rota também é fronteira: só segue se tiver o formato do contrato.
const respostaSchema: z.ZodType<RespostaFormulario> = z.union([
  z.object({ ok: z.literal(true), manualUrl: z.string().optional(), idEvento: z.string().optional() }),
  z.object({ ok: z.literal(false), erro: z.literal("validacao"), campos: z.record(z.string(), z.string()) }),
  z.object({ ok: z.literal(false), erro: z.enum(["limite", "antirrobo", "indisponivel"]) }),
]);

const PRIVACIDADE = "cienciaPrivacidade";
const texto = (valor: FormDataEntryValue | null) => (typeof valor === "string" ? valor : "");
// Link do manual: só caminho do próprio site ou https (nunca `javascript:` vindo de uma resposta adulterada).
const linkSeguro = (url: string | undefined) => (url && /^(\/(?!\/)|https:\/\/)/.test(url) ? url : undefined);

type Props = {
  /** Bloco `formulario` do conteúdo (textos, rótulos, erros). */
  formulario: BlocoFormulario;
  campos: DefinicaoCampo[];
  rota: keyof typeof rotas;
  /** `site.turnstileSiteKey`, passado pela seção (componente de servidor). */
  turnstileSiteKey: string;
};

type Estado = "ocioso" | "enviando" | "sucesso";

export function Formulario({ formulario, campos, rota, turnstileSiteKey }: Props) {
  const id = useId();
  const consentimento = useConsentimento();
  const [estado, setEstado] = useState<Estado>("ocioso");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [aviso, setAviso] = useState<string>();
  const [manualUrl, setManualUrl] = useState<string>();

  const form = useRef<HTMLFormElement>(null);
  const tituloSucesso = useRef<HTMLHeadingElement>(null);
  const alvoTurnstile = useRef<HTMLDivElement>(null);
  const widget = useRef<string>(undefined);
  const token = useRef("");
  const iniciou = useRef(false);

  // O script do Turnstile só é pedido quando o formulário se aproxima da tela.
  useEffect(() => {
    const el = form.current;
    if (!el) return;
    let ativo = true;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        carregarTurnstile()
          .then(() => {
            if (!ativo || !alvoTurnstile.current || !window.turnstile) return;
            widget.current = window.turnstile.render(alvoTurnstile.current, {
              sitekey: turnstileSiteKey,
              theme: "dark",
              language: "pt-br",
              callback: (t) => (token.current = t),
              "expired-callback": () => (token.current = ""),
              "error-callback": () => (token.current = ""),
            });
          })
          .catch(() => {}); // sem o widget o envio para na validação e mostra o aviso de antirrobô
      },
      { rootMargin: "200px" },
    );
    observador.observe(el);
    return () => {
      ativo = false;
      observador.disconnect();
      if (widget.current) window.turnstile?.remove(widget.current);
    };
  }, [turnstileSiteKey]);

  useEffect(() => {
    if (estado === "sucesso") tituloSucesso.current?.focus();
  }, [estado]);

  const focar = (nome: string) => {
    const el = form.current?.elements.namedItem(nome);
    if (el instanceof HTMLElement) el.focus();
  };

  // O token do Turnstile vale para um envio só: depois de uma falha, pede outro.
  const renovarToken = () => {
    token.current = "";
    if (widget.current) window.turnstile?.reset(widget.current);
  };

  const mostrarErros = (porCampo: Record<string, string>, geral?: string) => {
    setErros(porCampo);
    setAviso(geral);
    const ordem = [...campos.map((c) => c.nome), PRIVACIDADE];
    const primeiro = ordem.find((nome) => nome in porCampo);
    if (primeiro) focar(primeiro);
  };

  const enviar = async (evento: SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (estado === "enviando") return;

    const dados = new FormData(evento.currentTarget);
    const origem = capturarOrigem(window.location.search); // a gravada na primeira visita; sem ela, a da URL
    const resultado = schemas[rota].safeParse({
      ...Object.fromEntries(campos.map((c) => [c.nome, texto(dados.get(c.nome))])),
      consentimentoWhatsapp: dados.has("consentimentoWhatsapp"),
      consentimentoEmail: dados.has("consentimentoEmail"),
      [PRIVACIDADE]: dados.has(PRIVACIDADE),
      utm: origem.utm,
      afiliado: origem.afiliado,
      variacao: origem.variacao,
      turnstileToken: token.current,
      website: texto(dados.get("website")),
    });

    if (!resultado.success) {
      const porCampo: Record<string, string> = {};
      let geral: string | undefined;
      for (const { path } of resultado.error.issues) {
        const nome = String(path[0]);
        if (nome in formulario.campos) porCampo[nome] = formulario.campos[nome].erro;
        else if (nome === PRIVACIDADE) porCampo[nome] = formulario.consentimentos.privacidade;
        else if (nome === "turnstileToken") geral ??= formulario.erros.antirrobo;
        else geral ??= formulario.erros.indisponivel;
      }
      mostrarErros(porCampo, geral);
      return;
    }

    setEstado("enviando");
    setErros({});
    setAviso(undefined);

    let resposta: RespostaFormulario;
    try {
      const r = await fetch(rotas[rota], {
        method: "POST",
        // O servidor só repassa a conversão à Meta se o visitante aceitou os cookies.
        headers: { "Content-Type": "application/json", "x-gs-consentimento": consentimento ?? "recusado" },
        body: JSON.stringify(resultado.data),
      });
      resposta = respostaSchema.parse(await r.json());
    } catch {
      resposta = { ok: false, erro: "indisponivel" };
    }

    if (resposta.ok) {
      emitir("cadastro", { formulario: rota, idEvento: resposta.idEvento });
      setManualUrl(linkSeguro(resposta.manualUrl));
      setEstado("sucesso");
      return;
    }

    setEstado("ocioso");
    renovarToken();
    if (resposta.erro === "validacao") {
      // Texto do conteúdo quando existe; a mensagem do servidor só cobre campo sem texto próprio.
      const porCampo = Object.fromEntries(
        Object.entries(resposta.campos).map(([nome, msg]) => [nome, formulario.campos[nome]?.erro ?? msg]),
      );
      mostrarErros(porCampo);
    } else {
      mostrarErros({}, formulario.erros[resposta.erro]);
    }
  };

  const aoFocar = () => {
    if (iniciou.current) return;
    iniciou.current = true;
    emitir("inicio_formulario", { formulario: rota });
  };

  const limparErro = (nome: string) => {
    if (nome in erros) setErros(({ [nome]: _, ...resto }) => resto);
  };

  const enviando = estado === "enviando";
  const idTitulo = `${id}-titulo`;

  return (
    <div>
      {estado !== "sucesso" && (
        <form
          ref={form}
          noValidate
          aria-labelledby={idTitulo}
          onSubmit={enviar}
          onFocus={aoFocar}
          onChange={(e) => e.target instanceof HTMLElement && limparErro(e.target.getAttribute("name") ?? "")}
          className="grid gap-6"
        >
          <h3 id={idTitulo} className="font-titulo text-h3 font-medium">
            {formulario.titulo}
          </h3>
          {formulario.introducao && <p className="text-texto-2">{formulario.introducao}</p>}

          {campos.map((campo) => {
            const textos = formulario.campos[campo.nome];
            if (!textos) return null; // campo sem texto no conteúdo não é exibido
            return (
              <Campo
                key={campo.nome}
                id={`${id}-${campo.nome}`}
                nome={campo.nome}
                rotulo={textos.rotulo}
                ajuda={textos.ajuda}
                erro={erros[campo.nome]}
                tipo={campo.tipo}
                opcoes={formulario.opcoes?.[campo.nome]}
                obrigatorio={campo.obrigatorio}
                autoComplete={campo.autoComplete}
              />
            );
          })}

          {/* Campo armadilha: fora da tela e fora da navegação. Quem preenche é robô. */}
          <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <CaixaDeMarcar name="consentimentoWhatsapp" rotulo={formulario.consentimentos.whatsapp} />
            <CaixaDeMarcar name="consentimentoEmail" rotulo={formulario.consentimentos.email} />
            <CaixaDeMarcar
              name={PRIVACIDADE}
              rotulo={formulario.consentimentos.privacidade}
              aria-required
              aria-invalid={PRIVACIDADE in erros || undefined}
              aria-describedby={PRIVACIDADE in erros ? `${id}-privacidade-erro` : undefined}
            />
            {PRIVACIDADE in erros && (
              <p id={`${id}-privacidade-erro`} className="mt-1 flex gap-2 text-apoio text-erro">
                <IconeErro />
                {erros[PRIVACIDADE]}
              </p>
            )}
          </div>

          {/* Altura reservada para o widget não empurrar o botão quando carregar. */}
          <div ref={alvoTurnstile} className="min-h-[65px]" />

          <button type="submit" aria-disabled={enviando || undefined} className={estilosBotao.principal}>
            {enviando ? formulario.enviando : formulario.enviar}
          </button>
        </form>
      )}

      {/* Região sempre presente: o leitor de tela anuncia o que entra aqui. */}
      <div aria-live="polite" role="status">
        {aviso && estado !== "sucesso" && (
          <p className="mt-4 flex gap-2 text-erro">
            <IconeErro />
            {aviso}
          </p>
        )}
        {estado === "sucesso" && (
          <div className="grid justify-items-start gap-4">
            <h3 ref={tituloSucesso} tabIndex={-1} className="font-titulo text-h3 font-medium">
              {formulario.sucesso.titulo}
            </h3>
            <p>{formulario.sucesso.texto}</p>
            {manualUrl && formulario.sucesso.baixarManual && (
              <a href={manualUrl} className={estilosBotao.principal}>
                {formulario.sucesso.baixarManual}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
