import { site } from "@config/site";
import type { RespostaPapoReto } from "@/shared/papoReto";
import { comporPapoReto } from "./composicao";
import { ipDe, lerCorpo, mesmaOrigem } from "./http";
import { responderPapoReto, type ContextoPapoReto } from "./papoReto";

// Fronteira HTTP do POST /api/papo-reto. Usa só Request/Response padrão (sem Next).

// Estado (até 8000 caracteres) + mensagem + token, com folga para UTF-8 e escapes do JSON.
const CORPO_MAXIMO_BYTES = 16 * 1024;

function responder(corpo: RespostaPapoReto, status: number): Response {
  return Response.json(corpo, { status, headers: { "Cache-Control": "no-store" } });
}

const STATUS = { validacao: 400, antirrobo: 400, limite: 429, indisponivel: 503 } as const;

export async function responderRotaPapoReto(req: Request, agendar: ContextoPapoReto["agendar"]): Promise<Response> {
  // Desligado: a rota nem existe (nada é lido nem chamado).
  if (!site.papoReto.ativo) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  try {
    if (!mesmaOrigem(req)) return responder({ ok: false, erro: "antirrobo" }, 403);
    if (req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
      return responder({ ok: false, erro: "validacao" }, 400);
    }
    const texto = await lerCorpo(req, CORPO_MAXIMO_BYTES);
    if (texto === null) return responder({ ok: false, erro: "validacao" }, 413);
    let entrada: unknown;
    try {
      entrada = JSON.parse(texto);
    } catch {
      return responder({ ok: false, erro: "validacao" }, 400);
    }

    const portas = comporPapoReto();
    if (!portas) return responder({ ok: false, erro: "indisponivel" }, 503);

    const resposta = await responderPapoReto(entrada, { ip: ipDe(req), agendar }, portas);
    return responder(resposta, resposta.ok ? 200 : STATUS[resposta.erro]);
  } catch (e) {
    // Só o tipo do erro: a mensagem pode carregar trecho da conversa.
    console.error(`[papo-reto] falha interna: ${e instanceof Error ? e.name : "desconhecida"}`);
    return responder({ ok: false, erro: "indisponivel" }, 503);
  }
}
