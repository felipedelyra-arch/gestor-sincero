import { z } from "zod";
import type { LimitadorDeTaxa } from "../../dominio/portas";
import { falha, type SupabaseClient } from "./cliente";

/** Contagem atômica no Postgres (função consumir_limite da migração 0001). Erro = exceção, nunca "liberado". */
export function criarLimitadorSupabase(db: SupabaseClient): LimitadorDeTaxa {
  return {
    async consumir(chave, max, janelaSegundos) {
      const { data, error } = await db.rpc("consumir_limite", {
        p_chave: chave,
        p_max: max,
        p_janela_segundos: janelaSegundos,
      });
      if (error) throw falha("consumir_limite", error);
      return z.boolean().parse(data);
    },
  };
}
