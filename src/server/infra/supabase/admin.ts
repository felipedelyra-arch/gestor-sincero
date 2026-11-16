import { z } from "zod";
import type { AutenticadorAdmin, LeitorExportacao, RegistroExportado, TipoExportacao } from "../../dominio/portas";
import { falha, type SupabaseClient } from "./cliente";

// O PostgREST devolve no máximo 1000 linhas por consulta: lemos em páginas.
// shortcut: a exportação inteira fica em memória; passar a streaming se a base passar de dezenas de milhares de linhas.
const PAGINA = 1000;

const fontes = {
  cadastros: { tabela: "cadastros", origem: "cadastro", colunas: ["nome", "empresa", "cargo", "variacao", "afiliado"] },
  ressonancia: {
    tabela: "pedidos_ressonancia",
    origem: "ressonancia",
    colunas: ["nome", "empresa", "segmento", "faixa_faturamento", "numero_funcionarios", "principal_desafio", "afiliado"],
  },
} as const satisfies Record<TipoExportacao, { tabela: string; origem: string; colunas: readonly string[] }>;

const UTM = ["source", "medium", "campaign", "term", "content"] as const;

const linhaSchema = z.looseObject({
  id: z.string(),
  criado_em: z.string(),
  email_cifrado: z.string(),
  whatsapp_cifrado: z.string(),
  email_hash: z.string(),
  utm: z.record(z.string(), z.unknown()).nullable(),
});

const consentimentoSchema = z.object({
  registro_id: z.string(),
  titular_hash: z.string(),
  canal: z.enum(["whatsapp", "email"]),
  concedido: z.boolean(),
});

type Pagina = PromiseLike<{ data: unknown; error: { code?: string } | null }>;

async function todas<T>(operacao: string, schema: z.ZodType<T>, consulta: (de: number, ate: number) => Pagina): Promise<T[]> {
  const linhas: T[] = [];
  for (let de = 0; ; de += PAGINA) {
    const { data, error } = await consulta(de, de + PAGINA - 1);
    if (error) throw falha(operacao, error);
    const pagina = z.array(schema).parse(data);
    linhas.push(...pagina);
    if (pagina.length < PAGINA) return linhas;
  }
}

const texto = (valor: unknown) => (valor === null || valor === undefined ? "" : String(valor));

export function criarAdminSupabase(db: SupabaseClient): AutenticadorAdmin & LeitorExportacao {
  return {
    /** O Supabase Auth confere assinatura, validade e revogação; app_metadata só é gravável pelo servidor. */
    async ehAdmin(token) {
      const { data, error } = await db.auth.getUser(token);
      return !error && data.user?.app_metadata?.papel === "admin" ? data.user.id : null;
    },

    async listar(tipo) {
      const { tabela, origem, colunas } = fontes[tipo];
      const linhas = await todas("exportar registros", linhaSchema, (de, ate) =>
        db.from(tabela).select("*").order("criado_em").order("id").range(de, ate),
      );
      // Em ordem cronológica: o consentimento mais recente de cada canal fica por último e vence.
      const aceites = await todas("exportar consentimentos", consentimentoSchema, (de, ate) =>
        db
          .from("consentimentos")
          .select("registro_id, titular_hash, canal, concedido")
          .eq("origem", origem)
          .in("canal", ["whatsapp", "email"])
          .order("criado_em")
          .order("id")
          .range(de, ate),
      );
      const titular = new Map(linhas.map((l) => [l.id, l.email_hash]));
      const porRegistro = new Map<string, RegistroExportado["consentimentos"]>();
      for (const a of aceites) {
        // Só vale o aceite do próprio titular do registro: aceite de outra pessoa nunca libera contato.
        if (titular.get(a.registro_id) !== a.titular_hash) continue;
        const atual = porRegistro.get(a.registro_id) ?? { whatsapp: null, email: null };
        atual[a.canal] = a.concedido;
        porRegistro.set(a.registro_id, atual);
      }
      return {
        colunas: [...colunas, ...UTM.map((u) => `utm_${u}`)],
        registros: linhas.map((l) => ({
          id: l.id,
          criadoEm: l.criado_em,
          emailCifrado: l.email_cifrado,
          whatsappCifrado: l.whatsapp_cifrado,
          consentimentos: porRegistro.get(l.id) ?? { whatsapp: null, email: null },
          campos: Object.fromEntries([
            ...colunas.map((c) => [c, texto(l[c])]),
            ...UTM.map((u) => [`utm_${u}`, texto(l.utm?.[u])]),
          ]),
        })),
      };
    },
  };
}
