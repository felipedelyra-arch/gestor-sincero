import { z } from "zod";
import { site } from "@config/site";
import type { RepositorioPapoReto } from "../dominio/papoReto";
import type { AutenticadorAdmin, Cifra, LeitorExportacao, LimitadorDeTaxa, RepositorioCadastros } from "../dominio/portas";
import { criarCifra } from "../infra/cripto/cifra";
import { criarGroq, MODELO_PADRAO } from "../infra/groq";
import { criarGroqAudio, MODELO_AUDIO_PADRAO } from "../infra/groqAudio";
import { memoria } from "../infra/memoria";
import { criarConversoesMeta } from "../infra/meta";
import { criarAdminSupabase } from "../infra/supabase/admin";
import { criarArmazenamentoSupabase } from "../infra/supabase/armazenamento";
import { criarClienteSupabase } from "../infra/supabase/cliente";
import { criarLimitadorSupabase } from "../infra/supabase/limitador";
import { criarRepositorioPapoRetoSupabase } from "../infra/supabase/papoReto";
import { criarRepositorioSupabase } from "../infra/supabase/repositorio";
import { criarTurnstile } from "../infra/turnstile";
import { criarWebhook } from "../infra/webhook";
import type { PortasPapoReto } from "./papoReto";
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

// Chaves de teste públicas da Cloudflare (1x000..., 2x000..., 3x000...): o segredo 1x aprova qualquer token.
const CHAVE_DE_TESTE = /^[123]x0{10}/;
const VARIAVEIS = [...Object.keys(envSchema.shape), "CRIPTO_CHAVES", "CRIPTO_CHAVE_ATUAL", "HASH_PIMENTA", "NODE_ENV"];

type Reais = (Portas & PortasAdmin & { repositorioPapoReto: RepositorioPapoReto }) | null;
let memo: { ambiente: string; portas: Reais } | undefined;

/** Montado uma vez por processo (um cliente Supabase, um aviso de erro); refaz só se o ambiente mudar (testes). */
function reais(): Reais {
  const ambiente = JSON.stringify([site.turnstileSiteKey, ...VARIAVEIS.map((nome) => process.env[nome])]);
  if (memo?.ambiente !== ambiente) memo = { ambiente, portas: montar() };
  return memo.portas;
}

function montar(): Reais {
  try {
    // Variável vazia ("X=") conta como ausente.
    const bruto = Object.fromEntries(Object.entries(process.env).filter(([, valor]) => valor));
    const lido = envSchema.safeParse(bruto);
    if (!lido.success) {
      throw new Error([...new Set(lido.error.issues.map((i) => String(i.path[0])))].join(", "));
    }
    const env = lido.data;
    // Falha fechada: em produção, chave de teste deixaria o antirrobô aprovar tudo.
    if (process.env.NODE_ENV === "production") {
      const deTeste = [
        ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", site.turnstileSiteKey],
        ["TURNSTILE_SECRET_KEY", env.TURNSTILE_SECRET_KEY],
      ].filter(([, valor]) => CHAVE_DE_TESTE.test(valor));
      if (deTeste.length) throw new Error(`${deTeste.map(([nome]) => nome).join(", ")} (chave de teste da Cloudflare em produção)`);
    }
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
      repositorioPapoReto: criarRepositorioPapoRetoSupabase(db),
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

/** A camada de texto livre existe quando há chave do Groq (vazia conta como ausente). */
export const comIA = (): boolean => Boolean(process.env.GROQ_API_KEY);

// Segredo só para desenvolvimento e teste: em produção PAPO_RETO_SEGREDO é obrigatório.
const SEGREDO_DE_DESENVOLVIMENTO = "segredo-de-desenvolvimento-do-papo-reto-nao-usar-em-producao";

/**
 * Portas do Papo reto (modo base, sem IA). null = indisponível (a rota responde 503):
 * produção sem Supabase ou sem PAPO_RETO_SEGREDO (mín. 32 caracteres). Fora de produção usa a memória.
 */
export function comporPapoReto(): PortasPapoReto | null {
  const producao = process.env.NODE_ENV === "production";
  const segredo = process.env.PAPO_RETO_SEGREDO || (producao ? undefined : SEGREDO_DE_DESENVOLVIMENTO);
  if (!segredo || segredo.length < 32) {
    console.error("[composicao] papo reto indisponível: PAPO_RETO_SEGREDO");
    return null;
  }
  const base = process.env.SUPABASE_URL ? reais() : producao ? null : memoria;
  if (!base) return null;
  const chaveGroq = process.env.GROQ_API_KEY;
  const classificador = chaveGroq ? criarGroq(chaveGroq, process.env.AI_MODEL_LIVRE || MODELO_PADRAO) : null;
  const transcritor = chaveGroq ? criarGroqAudio(chaveGroq, process.env.AI_MODEL_AUDIO || MODELO_AUDIO_PADRAO) : null;
  return { cifra: base.cifra, limitador: base.limitador, antirrobo: base.antirrobo, repositorio: base.repositorioPapoReto, classificador, transcritor, segredo };
}
