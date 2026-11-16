import { createHmac } from "node:crypto";
import type { Notificador } from "../dominio/portas";

/**
 * Webhook da automação (S4), servidor a servidor.
 * Assinatura: X-GS-Assinatura = "sha256=" + HMAC-SHA256(segredo, `${X-GS-Timestamp}.${corpo}`) em hex.
 * Quem recebe refaz a conta com o corpo bruto e recusa timestamp com mais de 5 minutos (replay).
 */
export function criarWebhook(url: string, segredo: string): Notificador {
  async function enviar(evento: string, dados: unknown): Promise<void> {
    const corpo = JSON.stringify({ evento, dados });
    const momento = String(Math.floor(Date.now() / 1000));
    const assinatura = createHmac("sha256", segredo).update(`${momento}.${corpo}`).digest("hex");
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-gs-timestamp": momento, "x-gs-assinatura": `sha256=${assinatura}` },
      body: corpo,
      redirect: "error", // o corpo tem dado pessoal: não seguir redirecionamento para outro destino
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`webhook: status ${res.status}`);
  }
  return {
    cadastroCriado: (dados) => enviar("cadastro.criado", dados),
    pedidoRessonanciaCriado: (dados) => enviar("ressonancia.criada", dados),
  };
}
