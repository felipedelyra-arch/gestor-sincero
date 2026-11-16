import { z } from "zod";

z.config({ jitless: true });

// Contrato do "Papo reto com o Gestor Sincero" (ADR 0003). Dono: orquestrador.
// O servidor não guarda a conversa: devolve um `estado` assinado (HMAC) e o navegador o reenvia a cada turno.

export const LIMITE_MENSAGEM = 600;
export const LIMITE_FALA = 400;
export const MAX_MENSAGENS = 20;

export const recomendacoes = ["jornada", "ressonancia", "mentoria"] as const;
export type Recomendacao = (typeof recomendacoes)[number];

/** Corpo do POST /api/papo-reto. Primeiro turno: `estado` nulo, `mensagem` nula e token do Turnstile. */
export const turnoSchema = z.object({
  mensagem: z.string().trim().min(1).max(LIMITE_MENSAGEM).nullable(),
  estado: z.string().max(8000).nullable(),
  turnstileToken: z.string().min(1).max(2048).nullable(),
  // true = a conversa pode ser guardada (cifrada, 30 dias); false = nada é salvo
  consentimento: z.boolean(),
});
export type Turno = z.infer<typeof turnoSchema>;

/** Saída do modelo (ou do roteiro local), validada no servidor antes de qualquer uso. */
export const saidaDialogoSchema = z.object({
  fala: z.string().trim().min(1).max(LIMITE_FALA),
  estado: z.enum(["falando", "cetico"]),
  afirmacoes_novas: z.array(z.object({ tema: z.string().min(1).max(40), valor: z.string().min(1).max(200) })).max(6),
  contradicao: z.object({ antes: z.string().min(1).max(200), agora: z.string().min(1).max(200) }).nullable(),
  proxima_pergunta: z.number().int().min(1).max(8).nullable(),
  recomendacao: z.enum(recomendacoes).nullable(),
});
export type SaidaDialogo = z.infer<typeof saidaDialogoSchema>;

export type RespostaPapoReto =
  | {
      ok: true;
      fala: string;
      avatar: "falando" | "cetico";
      contradicao: { antes: string; agora: string } | null;
      recomendacao: Recomendacao | null;
      encerrada: boolean;
      estado: string;
    }
  | { ok: false; erro: "validacao" | "limite" | "antirrobo" | "indisponivel" };

export const rotaPapoReto = "/api/papo-reto";
