import { memoria } from "../infra/memoria";
import type { Portas } from "./registrar";

/**
 * Ponto único de escolha dos adaptadores.
 * null = serviço indisponível (a rota responde 503 e nada é gravado).
 */
export function compor(): Portas | null {
  if (process.env.SUPABASE_URL) {
    // RODADA 2 (Quin): devolver aqui os adaptadores reais (Supabase, cripto, Turnstile, webhook, Meta).
    return null;
  }
  // Memória só fora de produção: em produção sem variáveis, nunca gravar em memória.
  if (process.env.NODE_ENV === "production") return null;
  return memoria;
}
