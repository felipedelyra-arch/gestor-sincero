import { randomBytes, randomUUID } from "node:crypto";
import { vi } from "vitest";

// Supabase, Turnstile, webhook e Meta simulados no fetch global: nenhum teste sai para a rede.

export const SUPABASE = "https://projeto.supabase.co";
export const WEBHOOK = "https://automacao.exemplo.com.br/gs";

export const env = {
  SUPABASE_URL: SUPABASE,
  SUPABASE_SERVICE_ROLE_KEY: "chave-de-servico-de-teste-0123456789",
  TURNSTILE_SECRET_KEY: "segredo-turnstile-de-teste",
  CRIPTO_CHAVES: `k1:${randomBytes(32).toString("base64")}`,
  CRIPTO_CHAVE_ATUAL: "k1",
  HASH_PIMENTA: "pimenta-de-teste-com-mais-de-32-caracteres",
  MANUAL_STORAGE_CAMINHO: "manual.pdf",
  WEBHOOK_AUTOMACAO_URL: WEBHOOK,
  WEBHOOK_AUTOMACAO_SEGREDO: "segredo-do-webhook-com-mais-de-32-caracteres",
  META_CAPI_TOKEN: "token-capi-de-teste",
};

export type Chamada = { url: URL; metodo: string; corpo: string; headers: Headers };
type Registro = { id: string; emailHash: string; whatsappHash: string; empresa?: string };

export function simularServicos() {
  for (const [nome, valor] of Object.entries(env)) vi.stubEnv(nome, valor);

  const estado = {
    chamadas: [] as Chamada[],
    turnstile: true,
    fora: new Set<"supabase" | "turnstile" | "webhook" | "meta">(),
    usuario: null as null | { id?: string; app_metadata: Record<string, unknown> },
    registros: { registrar_cadastro: [] as Registro[], registrar_pedido: [] as Registro[] },
    limites: new Map<string, number>(),
    tabelas: {} as Record<string, unknown[]>,
    para: (trecho: string) => estado.chamadas.filter((c) => c.url.href.includes(trecho)),
  };

  const json = (corpo: unknown, status = 200) => Response.json(corpo, { status });

  function supabase(c: Chamada): Response {
    const caminho = c.url.pathname;
    if (estado.fora.has("supabase")) {
      return json({ code: "XX000", message: "duplicate key value violates cadastros_contato_unico (detalhe interno)" }, 500);
    }
    if (caminho === "/rest/v1/rpc/consumir_limite") {
      const { p_chave, p_max } = JSON.parse(c.corpo) as { p_chave: string; p_max: number };
      const usos = (estado.limites.get(p_chave) ?? 0) + 1;
      estado.limites.set(p_chave, usos);
      return json(usos <= p_max);
    }
    if (caminho === "/rest/v1/rpc/registrar_cadastro" || caminho === "/rest/v1/rpc/registrar_pedido") {
      const funcao = caminho.endsWith("cadastro") ? "registrar_cadastro" : "registrar_pedido";
      const args = JSON.parse(c.corpo) as Record<string, Omit<Registro, "id">>;
      const { emailHash, whatsappHash } = args.p_cadastro ?? args.p_pedido;
      // Mesma regra da migração 0002: e-mail E telefone (no pedido, também a empresa normalizada).
      const empresa = args.p_pedido?.empresa?.trim().toLowerCase();
      const lista = estado.registros[funcao];
      const existente = lista.find((r) => r.emailHash === emailHash && r.whatsappHash === whatsappHash && r.empresa === empresa);
      const registro = existente ?? { id: randomUUID(), emailHash, whatsappHash, empresa };
      if (!existente) lista.push(registro);
      return json({ id: registro.id, novo: !existente });
    }
    if (caminho === "/rest/v1/eventos_auditoria" && c.metodo === "POST") return new Response(null, { status: 201 });
    if (caminho.startsWith("/rest/v1/") && c.metodo === "GET") {
      const linhas = estado.tabelas[caminho.slice("/rest/v1/".length)] ?? [];
      const inicio = Number(c.url.searchParams.get("offset") ?? 0);
      return json(linhas.slice(inicio, inicio + Number(c.url.searchParams.get("limit") ?? linhas.length)));
    }
    if (caminho.startsWith("/storage/v1/object/sign/")) {
      return json({ signedURL: `${caminho.replace("/storage/v1", "")}?token=assinatura-de-teste` });
    }
    if (caminho === "/auth/v1/user") {
      return estado.usuario
        ? json({ id: randomUUID(), aud: "authenticated", user_metadata: {}, created_at: "2026-11-15T00:00:00Z", ...estado.usuario })
        : json({ code: 403, error_code: "bad_jwt", msg: "invalid JWT" }, 403);
    }
    return json({ message: "rota não simulada" }, 404);
  }

  vi.stubGlobal(
    "fetch",
    vi.fn(async (entrada: RequestInfo | URL, init?: RequestInit) => {
      const req = new Request(entrada, init);
      const c: Chamada = { url: new URL(req.url), metodo: req.method, corpo: await req.text(), headers: req.headers };
      estado.chamadas.push(c);
      if (c.url.origin === SUPABASE) return supabase(c);
      if (c.url.hostname === "challenges.cloudflare.com") {
        return estado.fora.has("turnstile") ? json({}, 500) : json({ success: estado.turnstile });
      }
      if (c.url.href === WEBHOOK) return json({}, estado.fora.has("webhook") ? 500 : 200);
      if (c.url.hostname === "graph.facebook.com") return json({ events_received: 1 }, estado.fora.has("meta") ? 500 : 200);
      throw new Error(`fetch para destino não simulado: ${c.url.origin}`);
    }),
  );
  return estado;
}
