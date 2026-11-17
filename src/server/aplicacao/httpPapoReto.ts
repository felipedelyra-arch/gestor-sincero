import { site } from "@config/site";
import { AUDIO_MAX_BYTES, type RespostaPapoReto, type RespostaTranscricao } from "@/shared/papoReto";
import { comIA, comporPapoReto } from "./composicao";
import { ipDe, lerBytes, lerCorpo, mesmaOrigem } from "./http";
import { responderPapoReto, type ContextoPapoReto } from "./papoReto";
import { transcreverResposta } from "./papoRetoAudio";

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

// Áudio + estado assinado (até 8000 caracteres) + bordas do multipart.
const AUDIO_CORPO_MAXIMO_BYTES = AUDIO_MAX_BYTES + 16 * 1024;
const TIPOS_DE_AUDIO = new Set(["audio/webm", "audio/ogg", "audio/mp4", "audio/mpeg", "audio/wav"]);
const STATUS_AUDIO = { ...STATUS, "nao-entendido": 422 } as const;

function responderAudio(corpo: RespostaTranscricao, status: number): Response {
  return Response.json(corpo, { status, headers: { "Cache-Control": "no-store" } });
}

/** POST /api/papo-reto/audio: multipart com `audio` e `estado`. O áudio só existe na memória desta requisição. */
export async function responderRotaPapoRetoAudio(req: Request): Promise<Response> {
  if (!site.papoReto.ativo) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  try {
    if (!mesmaOrigem(req)) return responderAudio({ ok: false, erro: "antirrobo" }, 403);
    const tipoCorpo = req.headers.get("content-type") ?? "";
    if (tipoCorpo.split(";")[0].trim().toLowerCase() !== "multipart/form-data") return responderAudio({ ok: false, erro: "validacao" }, 400);
    const bytes = await lerBytes(req, AUDIO_CORPO_MAXIMO_BYTES);
    if (bytes === null) return responderAudio({ ok: false, erro: "validacao" }, 413);

    let form: FormData;
    try {
      form = await new Response(new Uint8Array(bytes), { headers: { "content-type": tipoCorpo } }).formData();
    } catch {
      return responderAudio({ ok: false, erro: "validacao" }, 400);
    }
    const audio = form.get("audio");
    const estado = form.get("estado");
    if (!(audio instanceof Blob) || typeof estado !== "string" || audio.size === 0 || audio.size > AUDIO_MAX_BYTES) {
      return responderAudio({ ok: false, erro: "validacao" }, audio instanceof Blob && audio.size > AUDIO_MAX_BYTES ? 413 : 400);
    }
    if (!TIPOS_DE_AUDIO.has(audio.type.split(";")[0].trim().toLowerCase())) return responderAudio({ ok: false, erro: "validacao" }, 415);

    const portas = comporPapoReto();
    if (!portas) return responderAudio({ ok: false, erro: "indisponivel" }, 503);
    const resposta = await transcreverResposta(audio, estado, { ip: ipDe(req) }, portas);
    return responderAudio(resposta, resposta.ok ? 200 : STATUS_AUDIO[resposta.erro]);
  } catch (e) {
    console.error(`[papo-reto] falha interna no áudio: ${e instanceof Error ? e.name : "desconhecida"}`);
    return responderAudio({ ok: false, erro: "indisponivel" }, 503);
  }
}

/** GET /api/papo-reto: diz ao navegador se a conversa está ligada, se há IA no texto livre (para escolher o aviso) e se há resposta por voz. */
export function responderConfigPapoReto(): Response {
  if (!site.papoReto.ativo) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  return Response.json({ ativo: true, comIA: comIA(), audio: comIA() }, { headers: { "Cache-Control": "no-store" } });
}
