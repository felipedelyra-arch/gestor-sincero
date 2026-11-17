import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { papoReto } from "@content";
import { MAX_MENSAGENS, turnoSchema, type Recomendacao, type Resposta, type RespostaPapoReto } from "@/shared/papoReto";
import type { ClassificadorLivre, RepositorioPapoReto } from "../dominio/papoReto";
import type { Cifra, LimitadorDeTaxa, VerificadorAntirrobo } from "../dominio/portas";
import { disparadas, recomendar, type RespostaDada } from "../papo-reto/regras";

// Caso de uso do Papo reto (ADR 0003): modo base por opções, sem IA. O servidor não guarda a conversa:
// o navegador reenvia o `estado` assinado (HMAC) a cada turno.
// Texto livre (`livre`): só com o classificador ligado ele é lido, e apenas para virar uma opção ou número da pergunta atual.
// Nunca é guardado, logado nem entra no estado; sem classificador, ou se ele falhar, é ignorado.

export type PortasPapoReto = {
  cifra: Cifra;
  limitador: LimitadorDeTaxa;
  antirrobo: VerificadorAntirrobo;
  repositorio: RepositorioPapoReto;
  /** Camada opcional de texto livre; null = desligada (sem GROQ_API_KEY). */
  classificador: ClassificadorLivre | null;
  /** Chave do HMAC do estado. */
  segredo: string;
};

export type ContextoPapoReto = {
  ip: string | null;
  /** Executa depois da resposta (`after` do Next); falha aqui nunca chega ao visitante. */
  agendar: (tarefa: () => Promise<void>) => void;
};

const CONVERSAS_POR_DIA = 3;
// Teto de turnos por IP além do de conversas (estado reenviado não pode render turnos sem fim). 3 conversas de 8 perguntas cabem.
const TURNOS_POR_DIA = 60;
const DIA_SEGUNDOS = 24 * 60 * 60;
const VALIDADE_ESTADO_MS = 2 * 60 * 60 * 1000;
const PONTOS = 3;

const slug = z.string().regex(/^[a-z0-9-]{1,40}$/);
const estadoSchema = z.object({
  v: z.literal(1),
  sid: z.uuid(),
  q: z.number().int().min(1).max(8), // número da pergunta atual
  n: z.number().int().min(0).max(MAX_MENSAGENS), // turnos já processados (inclui "não entendi")
  cons: z.boolean(), // consentimento dado no turno 0; não muda depois
  t: z.number().int(), // emissão, em ms
  fim: z.boolean(),
  r: z.array(z.object({ tema: slug, o: slug.nullable(), v: z.number().finite().nullable() })).max(8), // respostas dadas
  c: z.array(slug).max(16), // ids das regras já mostradas
});
export type EstadoConversa = z.infer<typeof estadoSchema>;

// ---------------------------------------------------------------------------
// Estado assinado: base64url(JSON) + "." + HMAC-SHA256
// ---------------------------------------------------------------------------

const mac = (carga: string, segredo: string) => createHmac("sha256", segredo).update(carga).digest("base64url");

export function assinarEstado(estado: EstadoConversa, segredo: string): string {
  const carga = Buffer.from(JSON.stringify(estado)).toString("base64url");
  return `${carga}.${mac(carga, segredo)}`;
}

function lerEstado(token: string, segredo: string): EstadoConversa | null {
  const [carga, assinatura, sobra] = token.split(".");
  if (!carga || !assinatura || sobra !== undefined) return null;
  const esperado = Buffer.from(mac(carga, segredo));
  const recebido = Buffer.from(assinatura);
  if (esperado.length !== recebido.length || !timingSafeEqual(esperado, recebido)) return null;
  try {
    const lido = estadoSchema.safeParse(JSON.parse(Buffer.from(carga, "base64url").toString("utf8")));
    return lido.success ? lido.data : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------

type Pergunta = (typeof papoReto.perguntas)[number];

const erro = (e: Exclude<RespostaPapoReto, { ok: true }>["erro"]): RespostaPapoReto => ({ ok: false, erro: e });
const formatar = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

/** Resposta válida para a pergunta; "livre" = só texto livre (não lido); null = inválida. */
function lerResposta(p: Pergunta, r: Resposta): RespostaDada | "livre" | null {
  if (r.opcao !== null && r.numero !== null) return null;
  if (r.opcao !== null) return p.opcoes.some((o) => o.id === r.opcao) ? { opcao: r.opcao, numero: null } : null;
  if (r.numero !== null) {
    const campo = p.campoNumero;
    if (!campo || r.numero < campo.min || r.numero > campo.max) return null;
    return { opcao: null, numero: Math.round(r.numero * 100) / 100 };
  }
  return "livre";
}

/** Rótulo da resposta nos confrontos: o da opção; número em reais vai como "R$ 1.200", senão só o número. */
function rotulo(p: Pergunta, r: RespostaDada): string {
  if (r.opcao !== null) return p.opcoes.find((o) => o.id === r.opcao)?.rotulo ?? r.opcao;
  const n = formatar(r.numero ?? 0);
  return p.campoNumero?.sufixo === "reais" ? `R$ ${n}` : n;
}

const ponto = (p: Pergunta | undefined, r: RespostaDada | undefined) =>
  r?.opcao != null ? p?.opcoes.find((o) => o.id === r.opcao)?.ponto : undefined;

export async function responderPapoReto(entrada: unknown, ctx: ContextoPapoReto, p: PortasPapoReto): Promise<RespostaPapoReto> {
  const turno = turnoSchema.safeParse(entrada);
  if (!turno.success) return erro("validacao");
  const { estado: token, resposta, turnstileToken, consentimento } = turno.data;

  const perguntas = [...papoReto.perguntas].sort((a, b) => a.numero - b.numero);
  const porTema = new Map(perguntas.map((q) => [q.tema, q]));
  const ipHash = ctx.ip ? p.cifra.hashBusca(ctx.ip) : null;
  // Sem IP, todos dividem a mesma cota (mais restritivo, nunca mais frouxo).
  const chaveIp = ipHash ?? "sem-ip";

  // ---- Primeiro turno --------------------------------------------------------
  if (token === null) {
    if (resposta !== null) return erro("validacao");
    if (turnstileToken === null) return erro("antirrobo");
    if (!(await p.limitador.consumir(`papo-reto:${chaveIp}`, CONVERSAS_POR_DIA, DIA_SEGUNDOS))) return erro("limite");
    if (!(await p.antirrobo.verificar(turnstileToken, ctx.ip))) return erro("antirrobo");

    const novo: EstadoConversa = { v: 1, sid: randomUUID(), q: perguntas[0].numero, n: 0, cons: consentimento, t: Date.now(), fim: false, r: [], c: [] };
    return {
      ok: true,
      fala: papoReto.abertura,
      avatar: "falando",
      regra: null,
      pergunta: novo.q,
      final: null,
      encerrada: false,
      estado: assinarEstado(novo, p.segredo),
    };
  }

  // ---- Turnos seguintes ------------------------------------------------------
  // Assinatura primeiro: estado forjado não gasta cota. Todo estado inválido tem a mesma resposta.
  const estado = lerEstado(token, p.segredo);
  if (!estado || resposta === null || estado.fim || Date.now() - estado.t > VALIDADE_ESTADO_MS) return erro("validacao");
  if (estado.n >= MAX_MENSAGENS) return erro("limite");
  const atual = perguntas.find((q) => q.numero === estado.q);
  if (!atual) return erro("validacao");
  let dada = lerResposta(atual, resposta);
  if (dada === null) return erro("validacao");
  if (!(await p.limitador.consumir(`papo-reto-turno:${chaveIp}`, TURNOS_POR_DIA, DIA_SEGUNDOS))) return erro("limite");

  const mensagens = estado.n + 1;
  if (dada === "livre" && p.classificador && resposta.livre !== null) {
    const extraido = await p.classificador.classificar(resposta.livre, {
      texto: atual.texto,
      opcoes: atual.opcoes.map((o) => ({ id: o.id, rotulo: o.rotulo })),
      campoNumero: atual.campoNumero ? { rotulo: atual.campoNumero.rotulo, min: atual.campoNumero.min, max: atual.campoNumero.max } : null,
    });
    // Confere contra o conteúdo real, como se a pessoa tivesse clicado: opção inexistente, número fora do limite ou os dois nulos ficam "livre".
    if (extraido) {
      const lida = lerResposta(atual, { ...extraido, livre: null });
      if (lida !== null) dada = lida;
    }
  }
  if (dada === "livre") {
    // Sem a camada de texto livre (ou sem classificação válida), o texto não é lido: pede para escolher uma opção e repete a pergunta.
    return {
      ok: true,
      fala: papoReto.naoEntendi,
      avatar: "falando",
      regra: null,
      pergunta: atual.numero,
      final: null,
      encerrada: false,
      estado: assinarEstado({ ...estado, n: mensagens }, p.segredo),
    };
  }

  const respostas = [...estado.r, { tema: atual.tema, o: dada.opcao, v: dada.numero }];
  const doTema: Record<string, RespostaDada> = Object.fromEntries(respostas.map((x) => [x.tema, { opcao: x.o, numero: x.v }]));
  const todas = disparadas(doTema);

  // Uma contradição por vez: a primeira ainda não mostrada; as outras só entram no papo reto final.
  const nova = todas.find((d) => !estado.c.includes(d.id));
  const confronto = nova ? papoReto.confrontos[nova.id] : undefined;
  const reacao =
    dada.opcao !== null
      ? (atual.opcoes.find((o) => o.id === dada.opcao)?.fala ?? "")
      : (atual.campoNumero?.fala.replaceAll("{valor}", formatar(dada.numero ?? 0)) ?? "");
  const rotuloDe = (tema: string) => {
    const q = porTema.get(tema);
    const r = doTema[tema];
    return q && r ? rotulo(q, r) : "";
  };
  const fala =
    nova && confronto ? confronto.replaceAll("{antes}", rotuloDe(nova.antes)).replaceAll("{agora}", rotuloDe(nova.agora)) : reacao;

  const seguinte = perguntas[perguntas.indexOf(atual) + 1];
  const encerrada = !seguinte || mensagens >= MAX_MENSAGENS;

  let final: { pontos: string[]; recomendacao: Recomendacao } | null = null;
  if (encerrada) {
    const recomendacao = recomendar(doTema);
    final = { pontos: montarPontos(todas, doTema, perguntas, porTema), recomendacao };
    if (estado.cons) {
      const gravacao = {
        sessao: estado.sid,
        respostasCifradas: p.cifra.cifrar(JSON.stringify(respostas)),
        regrasCifradas: p.cifra.cifrar(JSON.stringify(todas.map((d) => d.id))),
        recomendacao,
      };
      // Só com consentimento. O log leva o tipo do erro, nunca a conversa.
      ctx.agendar(async () => {
        try {
          await p.repositorio.gravar(gravacao);
        } catch (e) {
          console.error(`[papo-reto] gravação falhou: ${e instanceof Error ? e.name : "desconhecida"}`);
        }
      });
    }
  }

  const novoEstado: EstadoConversa = {
    ...estado,
    q: encerrada ? atual.numero : seguinte.numero,
    n: mensagens,
    fim: encerrada,
    r: respostas,
    c: nova ? [...estado.c, nova.id] : estado.c,
  };
  return {
    ok: true,
    fala,
    avatar: nova ? "cetico" : "falando",
    regra: nova?.id ?? null,
    pergunta: encerrada ? null : seguinte.numero,
    final,
    encerrada,
    estado: assinarEstado(novoEstado, p.segredo),
  };
}

/**
 * Os 3 pontos do papo reto, em ordem de prioridade: contradições (o `ponto` da resposta mais recente das duas, ou o da outra),
 * depois o `ponto` das opções escolhidas da pergunta 8 para trás e, se faltar, `fechamento.pontoPadrao` (uma vez só).
 */
function montarPontos(
  regras: ReturnType<typeof disparadas>,
  respostas: Record<string, RespostaDada>,
  perguntas: readonly Pergunta[],
  porTema: ReadonlyMap<string, Pergunta>,
): string[] {
  const pontos: string[] = [];
  const juntar = (texto: string | undefined) => {
    if (texto && !pontos.includes(texto) && pontos.length < PONTOS) pontos.push(texto);
  };
  for (const d of regras) {
    juntar(ponto(porTema.get(d.agora), respostas[d.agora]) ?? ponto(porTema.get(d.antes), respostas[d.antes]));
  }
  for (const q of [...perguntas].reverse()) juntar(ponto(q, respostas[q.tema]));
  if (pontos.length < PONTOS) juntar(papoReto.fechamento.pontoPadrao);
  return pontos;
}
