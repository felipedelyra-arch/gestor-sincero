import type { ArmazenamentoManual } from "../../dominio/portas";
import { falha, type SupabaseClient } from "./cliente";

const BUCKET = "manual"; // privado (migração 0001): o PDF só sai por link assinado

/** `caminho` vem de MANUAL_STORAGE_CAMINHO (configuração, nunca do visitante). */
export function criarArmazenamentoSupabase(db: SupabaseClient, caminho: string | undefined): ArmazenamentoManual {
  return {
    async linkAssinado(validadeSegundos) {
      if (!caminho) return null;
      const { data, error } = await db.storage.from(BUCKET).createSignedUrl(caminho, validadeSegundos);
      if (error || !data) throw falha("link do manual", {});
      return data.signedUrl;
    },
  };
}
