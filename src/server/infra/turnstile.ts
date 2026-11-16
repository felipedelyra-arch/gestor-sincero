import { z } from "zod";
import type { VerificadorAntirrobo } from "../dominio/portas";

const URL_VERIFICACAO = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const respostaSchema = z.object({ success: z.boolean() });

/** Verificação no servidor. Cloudflare fora do ar = exceção (a rota responde 503); nunca aprova por omissão. */
export function criarTurnstile(segredo: string): VerificadorAntirrobo {
  return {
    async verificar(token, ip) {
      const corpo = new URLSearchParams({ secret: segredo, response: token });
      if (ip) corpo.set("remoteip", ip);
      const res = await fetch(URL_VERIFICACAO, { method: "POST", body: corpo, signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`turnstile: status ${res.status}`);
      return respostaSchema.parse(await res.json()).success;
    },
  };
}
