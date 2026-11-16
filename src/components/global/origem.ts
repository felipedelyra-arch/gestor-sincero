// Sem Zod de propósito: este módulo entra no layout de todas as rotas e a validação aqui é pequena.

export const CHAVE_ORIGEM = "gs_origem";

const campos = ["source", "medium", "campaign", "term", "content"] as const;
type CampoUtm = (typeof campos)[number];

// Formato consumido pelos formulários (src/shared/contratos.ts). Não mudar sem avisar.
export type Origem = {
  utm: Partial<Record<CampoUtm, string>>;
  afiliado?: string;
  variacao: "a" | "b";
};

type Armazenamento = Pick<Storage, "getItem" | "setItem">;

const PADRAO = /^[\w .-]+$/;
const MAX_UTM = 120;
const MAX_AFILIADO = 80; // 80 e não 120: é o limite do contrato dos formulários

const confere = (v: unknown, max: number): v is string => typeof v === "string" && v.length <= max && PADRAO.test(v);
const objeto = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

const valido = (bruto: string | null, max = MAX_UTM): string | undefined => {
  const v = bruto?.trim();
  return confere(v, max) ? v : undefined; // valor fora do padrão é descartado, não corrigido
};

/** Lê a origem da query string. Função pura. */
export function extrairOrigem(busca: string): Origem {
  const q = new URLSearchParams(busca);
  const utm: Origem["utm"] = {};
  for (const c of campos) {
    const v = valido(q.get(`utm_${c}`));
    if (v) utm[c] = v;
  }
  const afiliado = ["afiliado", "ref", "aff"].map((p) => valido(q.get(p), MAX_AFILIADO)).find(Boolean);
  return { utm, ...(afiliado ? { afiliado } : {}), variacao: q.get("v") === "b" ? "b" : "a" };
}

/** O que vem do armazenamento é entrada não confiável: qualquer campo fora do formato invalida tudo. */
function validarOrigem(bruto: unknown): Origem | null {
  if (!objeto(bruto) || !objeto(bruto.utm)) return null;
  if (bruto.variacao !== "a" && bruto.variacao !== "b") return null;
  const utm: Origem["utm"] = {};
  for (const c of campos) {
    const v = bruto.utm[c];
    if (v === undefined) continue;
    if (!confere(v, MAX_UTM)) return null;
    utm[c] = v;
  }
  const { afiliado } = bruto;
  if (afiliado !== undefined && !confere(afiliado, MAX_AFILIADO)) return null;
  return { utm, ...(afiliado ? { afiliado } : {}), variacao: bruto.variacao };
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
    return validarOrigem(JSON.parse(onde?.getItem(CHAVE_ORIGEM) ?? "null"));
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
