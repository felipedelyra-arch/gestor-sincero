import { site } from "@config/site";
import { pagina } from "@content";
import type { RespostaFormulario } from "@/shared/contratos";
import type { Formulario } from "../dominio/entidades";
import { compor } from "./composicao";
import { registrarCadastroJornada, registrarPedidoRessonancia, type Contexto } from "./registrar";

// Fronteira HTTP comum às duas rotas de formulário. Usa só Request/Response padrão (sem Next).

const CORPO_MAXIMO_BYTES = 10 * 1024;
const USER_AGENT_MAXIMO = 512;

const formularios = {
  "cadastro-jornada": { caso: registrarCadastroJornada, textos: () => pagina.jornada.formulario.consentimentos },
  ressonancia: { caso: registrarPedidoRessonancia, textos: () => pagina.ressonancia.formulario.consentimentos },
} as const;

function responder(corpo: RespostaFormulario, status: number): Response {
  return Response.json(corpo, { status, headers: { "Cache-Control": "no-store" } });
}

const invalido = (status: number) => responder({ ok: false, erro: "validacao", campos: {} }, status);

function statusDe(r: RespostaFormulario): number {
  if (r.ok) return 200;
  return { validacao: 400, antirrobo: 400, limite: 429, indisponivel: 503 }[r.erro];
}

/** Fora da Vercel estes cabeçalhos são forjáveis pelo cliente (só a plataforma os sobrescreve). */
export function ipDe(req: Request): string | null {
  return (
    ["x-vercel-forwarded-for", "x-real-ip", "x-forwarded-for"]
      .map((nome) => req.headers.get(nome)?.split(",")[0].trim())
      .find(Boolean) ?? null
  );
}

/** Lê no máximo `maximo` bytes; null = grande demais. Não confia só no Content-Length. */
export async function lerBytes(req: Request, maximo: number): Promise<Buffer | null> {
  if (Number(req.headers.get("content-length")) > maximo) return null;
  if (!req.body) return Buffer.alloc(0);
  const leitor = req.body.getReader();
  const partes: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await leitor.read();
    if (done) break;
    total += value.byteLength;
    if (total > maximo) {
      await leitor.cancel();
      return null;
    }
    partes.push(value);
  }
  return Buffer.concat(partes);
}

export async function lerCorpo(req: Request, maximo = CORPO_MAXIMO_BYTES): Promise<string | null> {
  return (await lerBytes(req, maximo))?.toString("utf8") ?? null;
}

/**
 * Mesma origem: navegadores sempre mandam Origin em POST; ausente, malformado ou de outro host é recusado.
 * Aceita site.url ou o host da própria requisição (prévias da Vercel mudam de endereço a cada deploy).
 * Página de outro site não consegue forjar Host nem x-forwarded-host sem preflight, que aqui não é atendido.
 */
export function mesmaOrigem(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  if (origin === new URL(site.url).origin) return true;
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host"))?.split(",")[0].trim().toLowerCase();
  if (!host) return false;
  try {
    const url = new URL(origin);
    return /^https?:$/.test(url.protocol) && url.origin === origin && url.host === host;
  } catch {
    return false;
  }
}

export async function responderFormulario(
  req: Request,
  formulario: Formulario,
  agendar: Contexto["agendar"],
): Promise<Response> {
  try {
    if (!mesmaOrigem(req)) return responder({ ok: false, erro: "antirrobo" }, 403);
    const tipo = req.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (tipo !== "application/json") return invalido(400);

    const texto = await lerCorpo(req);
    if (texto === null) return invalido(413);
    let entrada: unknown;
    try {
      entrada = JSON.parse(texto);
    } catch {
      return invalido(400);
    }

    const portas = compor();
    if (!portas) return responder({ ok: false, erro: "indisponivel" }, 503);

    const { caso, textos } = formularios[formulario];
    const resposta = await caso(
      entrada,
      {
        ip: ipDe(req),
        consentiuCookies: req.headers.get("x-gs-consentimento") === "aceito",
        textosConsentimento: textos(),
        userAgent: req.headers.get("user-agent")?.slice(0, USER_AGENT_MAXIMO) || null,
        agendar,
      },
      portas,
    );
    return responder(resposta, statusDe(resposta));
  } catch (erro) {
    // Só o tipo do erro: a mensagem pode carregar dado pessoal ou detalhe do banco.
    console.error(`[${formulario}] falha interna: ${erro instanceof Error ? erro.name : "desconhecida"}`);
    return responder({ ok: false, erro: "indisponivel" }, 503);
  }
}
