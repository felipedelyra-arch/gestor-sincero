import { MAX_MENSAGENS, type RespostaTranscricao } from "@/shared/papoReto";
import type { ContextoPapoReto, PortasPapoReto } from "./papoReto";
import { DIA_SEGUNDOS, lerEstado, TURNOS_POR_DIA, VALIDADE_ESTADO_MS } from "./papoReto";

// Resposta por voz (ADR 0003, revisão de 17/11): transcreve e devolve o texto, que o navegador reenvia pelo fluxo do texto livre.
// O áudio e o texto transcrito não são guardados nem logados aqui; a conversa em curso é a do `estado` assinado.

const erro = (e: Exclude<RespostaTranscricao, { ok: true }>["erro"]): RespostaTranscricao => ({ ok: false, erro: e });

export async function transcreverResposta(audio: Blob, token: string, ctx: Pick<ContextoPapoReto, "ip">, p: PortasPapoReto): Promise<RespostaTranscricao> {
  if (!p.transcritor) return erro("indisponivel");
  // Assinatura antes da cota: estado forjado, vencido ou encerrado não gasta nada.
  const estado = lerEstado(token, p.segredo);
  if (!estado || estado.fim || Date.now() - estado.t > VALIDADE_ESTADO_MS) return erro("validacao");
  if (estado.n >= MAX_MENSAGENS) return erro("limite");
  // Mesma cota diária de turnos do texto e dos botões.
  const chaveIp = ctx.ip ? p.cifra.hashBusca(ctx.ip) : "sem-ip";
  if (!(await p.limitador.consumir(`papo-reto-turno:${chaveIp}`, TURNOS_POR_DIA, DIA_SEGUNDOS))) return erro("limite");

  const texto = await p.transcritor.transcrever(audio);
  return texto ? { ok: true, texto } : erro("nao-entendido");
}
