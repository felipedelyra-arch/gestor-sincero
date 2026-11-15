import { z } from "zod";

export const CHAVE_ORIGEM = "gs_origem";

const valor = (max: number) => z.string().max(max).regex(/^[\w .-]+$/);
const campos = ["source", "medium", "campaign", "term", "content"] as const;

// Formato consumido pelos formulários (src/shared/contratos.ts). Não mudar sem avisar.
export const origemSchema = z.object({
  utm: z.object({
    source: valor(120).optional(),
    medium: valor(120).optional(),
    campaign: valor(120).optional(),
    term: valor(120).optional(),
    content: valor(120).optional(),
  }),
  afiliado: valor(80).optional(), // 80 e não 120: é o limite do contrato dos formulários
  variacao: z.enum(["a", "b"]),
});
export type Origem = z.infer<typeof origemSchema>;

type Armazenamento = Pick<Storage, "getItem" | "setItem">;

const valido = (bruto: string | null, max = 120): string | undefined => {
  const r = valor(max).safeParse(bruto?.trim());
  return r.success ? r.data : undefined; // valor fora do padrão é descartado, não corrigido
};

/** Lê a origem da query string. Função pura. */
export function extrairOrigem(busca: string): Origem {
  const q = new URLSearchParams(busca);
  const utm: Origem["utm"] = {};
  for (const c of campos) {
    const v = valido(q.get(`utm_${c}`));
    if (v) utm[c] = v;
  }
  const afiliado = ["afiliado", "ref", "aff"].map((p) => valido(q.get(p), 80)).find(Boolean);
  return { utm, ...(afiliado ? { afiliado } : {}), variacao: q.get("v") === "b" ? "b" : "a" };
}

function armazenamento(): Armazenamento | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function lerOrigem(onde: Armazenamento | null = armazenamento()): Origem | null {
  try {
    const r = origemSchema.safeParse(JSON.parse(onde?.getItem(CHAVE_ORIGEM) ?? "null"));
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}

/** Primeira visita vence: se já existe origem gravada, devolve a gravada. */
export function capturarOrigem(busca: string, onde: Armazenamento | null = armazenamento()): Origem {
  const existente = lerOrigem(onde);
  if (existente) return existente;
  const origem = extrairOrigem(busca);
  try {
    onde?.setItem(CHAVE_ORIGEM, JSON.stringify(origem));
  } catch {
    // armazenamento cheio ou bloqueado: segue sem gravar
  }
  return origem;
}

/** Acrescenta UTM e afiliado ao link do checkout. `set` substitui: nunca duplica parâmetro. */
export function montarLinkCheckout(base: string, origem: Origem | null = lerOrigem()): string {
  if (!origem) return base;
  const url = new URL(base);
  for (const c of campos) {
    const v = origem.utm[c];
    if (v) url.searchParams.set(`utm_${c}`, v);
  }
  if (origem.afiliado) url.searchParams.set("afiliado", origem.afiliado);
  return url.toString();
}
