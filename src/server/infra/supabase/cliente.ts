import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type { SupabaseClient };

const TEMPO_LIMITE_MS = 8000;

/** Cliente com a service role: só no servidor (ignora RLS). Nunca importar em componente. */
export function criarClienteSupabase(url: string, chaveServico: string): SupabaseClient {
  return createClient(url, chaveServico, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      // Sem tempo limite, um banco lento prenderia a função até o teto da plataforma.
      fetch: (entrada, init) => fetch(entrada, { ...init, signal: init?.signal ?? AbortSignal.timeout(TEMPO_LIMITE_MS) }),
    },
  });
}

/** Só a operação e o código do erro: a mensagem do banco pode citar valores. */
export function falha(operacao: string, erro: { code?: string }): Error {
  return new Error(`supabase ${operacao}: ${erro.code ?? "sem-codigo"}`);
}
