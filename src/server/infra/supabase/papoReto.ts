import type { RepositorioPapoReto } from "../../dominio/papoReto";
import { falha, type SupabaseClient } from "./cliente";

/** Grava pela função registrar_papo_reto (migração 0003), que também apaga o que passou de 30 dias. */
export function criarRepositorioPapoRetoSupabase(db: SupabaseClient): RepositorioPapoReto {
  return {
    async gravar(d) {
      const { error } = await db.rpc("registrar_papo_reto", {
        p_sessao: d.sessao,
        p_respostas: d.respostasCifradas,
        p_regras: d.regrasCifradas,
        p_recomendacao: d.recomendacao,
      });
      if (error) throw falha("registrar_papo_reto", error);
    },
  };
}
