import { z } from "zod";
import { site } from "@config/site";
import type { AutenticadorAdmin, Cifra, LeitorExportacao, LimitadorDeTaxa, RepositorioCadastros } from "../dominio/portas";
import { criarCifra } from "../infra/cripto/cifra";
import { memoria } from "../infra/memoria";
import { criarConversoesMeta } from "../infra/meta";
import { criarAdminSupabase } from "../infra/supabase/admin";
import { criarArmazenamentoSupabase } from "../infra/supabase/armazenamento";
import { criarClienteSupabase } from "../infra/supabase/cliente";
import { criarLimitadorSupabase } from "../infra/supabase/limitador";
import { criarRepositorioSupabase } from "../infra/supabase/repositorio";
import { criarTurnstile } from "../infra/turnstile";
import { criarWebhook } from "../infra/webhook";
import type { Portas } from "./registrar";

export type PortasAdmin = {
  cifra: Cifra;
  limitador: LimitadorDeTaxa;
  repositorio: RepositorioCadastros;
  autenticador: AutenticadorAdmin;
  leitor: LeitorExportacao;
};

const https = z.url({ protocol: /^https$/ });

// Obrigatórias com Supabase ligado; as opcionais desligam só o próprio recurso.
const envSchema = z
  .object({
    SUPABASE_URL: https,
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
    TURNSTILE_SECRET_KEY: z.string().min(1),
    MANUAL_STORAGE_CAMINHO: z.string().max(300).optional(),
    WEBHOOK_AUTOMACAO_URL: https.optional(),
    WEBHOOK_AUTOMACAO_SEGREDO: z.string().min(32).optional(),
    META_CAPI_TOKEN: z.string().min(1).optional(),
  })
  .refine((e) => !e.WEBHOOK_AUTOMACAO_URL === !e.WEBHOOK_AUTOMACAO_SEGREDO, { path: ["WEBHOOK_AUTOMACAO_SEGREDO"] });

const semEfeito = async () => {};

function reais(): (Portas & PortasAdmin) | null {
  try {
    // Variável vazia ("X=") conta como ausente.
    const bruto = Object.fromEntries(Object.entries(process.env).filter(([, valor]) => valor));
    const lido = envSchema.safeParse(bruto);
    if (!lido.success) {
      throw new Error([...new Set(lido.error.issues.map((i) => String(i.path[0])))].join(", "));
    }
    const env = lido.data;
    const db = criarClienteSupabase(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const admin = criarAdminSupabase(db);
    const pixel = site.rastreamento.metaPixelId;
    return {
      cifra: criarCifra({
        CRIPTO_CHAVES: process.env.CRIPTO_CHAVES,
        CRIPTO_CHAVE_ATUAL: process.env.CRIPTO_CHAVE_ATUAL,
        HASH_PIMENTA: process.env.HASH_PIMENTA,
      }),
      repositorio: criarRepositorioSupabase(db),
      limitador: criarLimitadorSupabase(db),
      antirrobo: criarTurnstile(env.TURNSTILE_SECRET_KEY),
      armazenamento: criarArmazenamentoSupabase(db, env.MANUAL_STORAGE_CAMINHO),
      notificador: env.WEBHOOK_AUTOMACAO_URL && env.WEBHOOK_AUTOMACAO_SEGREDO
        ? criarWebhook(env.WEBHOOK_AUTOMACAO_URL, env.WEBHOOK_AUTOMACAO_SEGREDO)
        : { cadastroCriado: semEfeito, pedidoRessonanciaCriado: semEfeito },
      meta: pixel && env.META_CAPI_TOKEN ? criarConversoesMeta(pixel, env.META_CAPI_TOKEN, site.url) : { enviarLead: semEfeito },
      autenticador: admin,
      leitor: admin,
    };
  } catch (erro) {
    // As mensagens daqui e de criarCifra citam só nomes de variável, nunca valores.
    console.error(`[composicao] configuração ausente ou inválida: ${erro instanceof Error ? erro.message : "desconhecida"}`);
    return null;
  }
}

/**
 * Ponto único de escolha dos adaptadores.
 * null = serviço indisponível (a rota responde 503 e nada é gravado).
 */
export function compor(): Portas | null {
  if (process.env.SUPABASE_URL) return reais();
  // Memória só fora de produção: em produção sem variáveis, nunca gravar em memória.
  if (process.env.NODE_ENV === "production") return null;
  return memoria;
}

/** Exportação só existe com Supabase (é ele quem autentica o admin): sem ele, 503. */
export function comporAdmin(): PortasAdmin | null {
  return process.env.SUPABASE_URL ? reais() : null;
}
