import { z } from "zod";
import type { RepositorioCadastros } from "../../dominio/portas";
import { falha, type SupabaseClient } from "./cliente";

const resultadoSchema = z.object({ id: z.uuid(), novo: z.boolean() });

/** Grava só por rpc e insert parametrizados; as funções SQL estão em supabase/migrations/0002. */
export function criarRepositorioSupabase(db: SupabaseClient): RepositorioCadastros {
  async function gravar(funcao: "registrar_cadastro" | "registrar_pedido", args: Record<string, unknown>) {
    const { data, error } = await db.rpc(funcao, args);
    if (error) throw falha(funcao, error);
    return resultadoSchema.parse(data);
  }
  return {
    registrarCadastro: (d) =>
      gravar("registrar_cadastro", { p_cadastro: d.cadastro, p_consentimentos: d.consentimentos, p_auditoria: d.auditoria }),
    registrarPedidoRessonancia: (d) =>
      gravar("registrar_pedido", { p_pedido: d.pedido, p_consentimentos: d.consentimentos, p_auditoria: d.auditoria }),
    async registrarAuditoria(evento) {
      const { error } = await db.from("eventos_auditoria").insert({
        criado_em: evento.data,
        tipo: evento.tipo,
        registro_id: evento.referenciaId,
        formulario: evento.formulario,
        ip_hash: evento.ipHash,
        usuario_id: evento.usuarioId ?? null,
      });
      if (error) throw falha("auditoria", error);
    },
  };
}
