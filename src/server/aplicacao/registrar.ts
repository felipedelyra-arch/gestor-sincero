import { createHash } from "node:crypto";
import type { z } from "zod";
import {
  cadastroJornadaSchema,
  pedidoRessonanciaSchema,
  type CadastroJornada,
  type RespostaFormulario,
} from "@/shared/contratos";
import type { Consentimento, ContatoProtegido, EventoAuditoria, Formulario } from "../dominio/entidades";
import type {
  ArmazenamentoManual,
  Cifra,
  ConversoesMeta,
  LimitadorDeTaxa,
  Notificador,
  RepositorioCadastros,
  ResultadoGravacao,
  VerificadorAntirrobo,
} from "../dominio/portas";

export type Portas = {
  cifra: Cifra;
  repositorio: RepositorioCadastros;
  limitador: LimitadorDeTaxa;
  antirrobo: VerificadorAntirrobo;
  armazenamento: ArmazenamentoManual;
  notificador: Notificador;
  meta: ConversoesMeta;
};

export type Contexto = {
  ip: string | null;
  /** Visitante aceitou cookies de rastreamento (header x-gs-consentimento: aceito). */
  consentiuCookies: boolean;
  /** Texto de cada consentimento como foi exibido no formulário. */
  textosConsentimento: Record<Consentimento["canal"], string>;
  /** Executa depois da resposta (`after` do Next); falha aqui nunca chega ao visitante. */
  agendar: (tarefa: () => Promise<void>) => void;
};

const LIMITE_ENVIOS = 5;
const LIMITE_JANELA_SEGUNDOS = 10 * 60;
const VALIDADE_MANUAL_SEGUNDOS = 24 * 60 * 60;

const sha256 = (texto: string) => createHash("sha256").update(texto).digest("hex");

type Comum = Pick<
  CadastroJornada,
  "email" | "whatsapp" | "consentimentoWhatsapp" | "consentimentoEmail" | "turnstileToken" | "website"
>;

async function registrar<T extends Comum>(
  formulario: Formulario,
  schema: z.ZodType<T>,
  entrada: unknown,
  ctx: Contexto,
  p: Portas,
  gravar: (dados: T, contato: ContatoProtegido) => Promise<ResultadoGravacao>,
  notificar: (dados: T, gravacao: ResultadoGravacao) => Promise<void>,
): Promise<RespostaFormulario> {
  const validado = schema.safeParse(entrada);
  if (!validado.success) {
    const campos: Record<string, string> = {};
    for (const problema of validado.error.issues) campos[String(problema.path[0] ?? "formulario")] ??= "invalido";
    return { ok: false, erro: "validacao", campos };
  }
  const dados = validado.data;

  // Armadilha: sucesso falso, nada é gravado.
  if (dados.website) return { ok: true };

  const ipHash = ctx.ip ? p.cifra.hashBusca(ctx.ip) : null;
  // Sem IP, todos dividem a mesma cota (mais restritivo, nunca mais frouxo).
  if (!(await p.limitador.consumir(`${formulario}:${ipHash ?? "sem-ip"}`, LIMITE_ENVIOS, LIMITE_JANELA_SEGUNDOS))) {
    return { ok: false, erro: "limite" };
  }

  const data = new Date().toISOString();
  const auditar = (tipo: EventoAuditoria["tipo"], referenciaId: string | null) =>
    p.repositorio.registrarAuditoria({ tipo, formulario, referenciaId, ipHash, data });
  // Auditoria de falha é melhor esforço: não pode derrubar o que já deu certo.
  const auditarFalha = (tipo: EventoAuditoria["tipo"], referenciaId: string) =>
    auditar(tipo, referenciaId).catch(() => {});

  if (!(await p.antirrobo.verificar(dados.turnstileToken, ctx.ip))) {
    await auditar("antirrobo_reprovado", null);
    return { ok: false, erro: "antirrobo" };
  }

  const gravacao = await gravar(dados, {
    emailCifrado: p.cifra.cifrar(dados.email),
    emailHash: p.cifra.hashBusca(dados.email),
    whatsappCifrado: p.cifra.cifrar(dados.whatsapp),
    whatsappHash: p.cifra.hashBusca(dados.whatsapp),
  });
  const { id } = gravacao;

  const aceites = { whatsapp: dados.consentimentoWhatsapp, email: dados.consentimentoEmail, privacidade: true };
  await p.repositorio.registrarConsentimentos(
    (["whatsapp", "email", "privacidade"] as const).map((canal) => ({
      formulario,
      referenciaId: id,
      canal,
      aceito: aceites[canal],
      texto: ctx.textosConsentimento[canal],
      versaoTexto: sha256(ctx.textosConsentimento[canal]).slice(0, 12),
      data,
      ipHash,
    })),
  );
  await auditar(gravacao.novo ? "registro_criado" : "registro_atualizado", id);

  let manualUrl: string | null = null;
  if (formulario === "cadastro-jornada") {
    manualUrl = await p.armazenamento.linkAssinado(VALIDADE_MANUAL_SEGUNDOS).catch(async () => {
      await auditarFalha("falha_manual", id);
      return null;
    });
  }

  ctx.agendar(async () => {
    await notificar(dados, gravacao).catch(() => auditarFalha("falha_notificador", id));
    if (!ctx.consentiuCookies) return;
    await p.meta
      .enviarLead({
        formulario,
        idEvento: id,
        emailSha256: sha256(dados.email),
        telefoneSha256: sha256(dados.whatsapp),
        momento: Math.floor(Date.now() / 1000),
      })
      .catch(() => auditarFalha("falha_meta", id));
  });

  return manualUrl ? { ok: true, manualUrl } : { ok: true };
}

export function registrarCadastroJornada(entrada: unknown, ctx: Contexto, p: Portas): Promise<RespostaFormulario> {
  return registrar(
    "cadastro-jornada",
    cadastroJornadaSchema,
    entrada,
    ctx,
    p,
    (d, contato) =>
      p.repositorio.salvarCadastro({
        ...contato,
        nome: d.nome,
        empresa: d.empresa,
        cargo: d.cargo,
        variacao: d.variacao,
        utm: d.utm,
        afiliado: d.afiliado,
      }),
    (d, gravacao) =>
      p.notificador.cadastroCriado({
        ...gravacao,
        nome: d.nome,
        whatsapp: d.whatsapp,
        email: d.email,
        empresa: d.empresa,
        cargo: d.cargo,
        variacao: d.variacao,
        consentimentoWhatsapp: d.consentimentoWhatsapp,
        consentimentoEmail: d.consentimentoEmail,
        utm: d.utm,
        afiliado: d.afiliado,
      }),
  );
}

export function registrarPedidoRessonancia(entrada: unknown, ctx: Contexto, p: Portas): Promise<RespostaFormulario> {
  return registrar(
    "ressonancia",
    pedidoRessonanciaSchema,
    entrada,
    ctx,
    p,
    (d, contato) =>
      p.repositorio.salvarPedidoRessonancia({
        ...contato,
        nome: d.nome,
        empresa: d.empresa,
        segmento: d.segmento,
        faixaFaturamento: d.faixaFaturamento,
        numeroFuncionarios: d.numeroFuncionarios,
        principalDesafio: d.principalDesafio,
        utm: d.utm,
        afiliado: d.afiliado,
      }),
    (d, gravacao) =>
      p.notificador.pedidoRessonanciaCriado({
        ...gravacao,
        nome: d.nome,
        whatsapp: d.whatsapp,
        email: d.email,
        empresa: d.empresa,
        segmento: d.segmento,
        faixaFaturamento: d.faixaFaturamento,
        numeroFuncionarios: d.numeroFuncionarios,
        principalDesafio: d.principalDesafio,
        consentimentoWhatsapp: d.consentimentoWhatsapp,
        consentimentoEmail: d.consentimentoEmail,
        utm: d.utm,
        afiliado: d.afiliado,
      }),
  );
}
