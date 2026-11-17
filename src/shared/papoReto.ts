import { z } from "zod";

z.config({ jitless: true });

// Contrato do "Papo reto com o Gestor Sincero" (ADR 0003). Dono: orquestrador.
// Modo base: respostas por opção ou número, falas pré-escritas em content/papo-reto.ts, regras em código. Sem IA.
// O servidor não guarda a conversa: devolve um `estado` assinado (HMAC) e o navegador o reenvia a cada turno.

export const LIMITE_LIVRE = 600;
export const MAX_MENSAGENS = 20;

export const recomendacoes = ["jornada", "ressonancia", "mentoria"] as const;
export type Recomendacao = (typeof recomendacoes)[number];

const slug = z.string().regex(/^[a-z0-9-]{1,40}$/);

/** Resposta a uma pergunta: opção escolhida e/ou número; `livre` é o "quer explicar melhor?" (opcional). */
export const respostaSchema = z
  .object({
    opcao: slug.nullable(),
    numero: z.number().finite().nullable(),
    livre: z.string().trim().min(1).max(LIMITE_LIVRE).nullable(),
  })
  .refine((r) => r.opcao !== null || r.numero !== null || r.livre !== null, "resposta vazia");
export type Resposta = z.infer<typeof respostaSchema>;

/** Corpo do POST /api/papo-reto. Primeiro turno: `estado` e `resposta` nulos, com token do Turnstile. */
export const turnoSchema = z.object({
  estado: z.string().max(8000).nullable(),
  turnstileToken: z.string().min(1).max(2048).nullable(),
  // true = a conversa pode ser guardada (cifrada, 30 dias); false = nada é salvo
  consentimento: z.boolean(),
  resposta: respostaSchema.nullable(),
});
export type Turno = z.infer<typeof turnoSchema>;

/** Saída da camada opcional de texto livre (Groq): só classifica o texto nas opções da pergunta. */
export const extracaoLivreSchema = z.object({ opcao: slug.nullable(), numero: z.number().finite().nullable() });
export type ExtracaoLivre = z.infer<typeof extracaoLivreSchema>;

export type RespostaPapoReto =
  | {
      ok: true;
      fala: string; // fala do personagem para este turno (abertura, reação à resposta ou confronto)
      avatar: "falando" | "cetico";
      regra: string | null; // id da regra de contradição que disparou, se houve
      pergunta: number | null; // número da próxima pergunta; null quando acabou
      final: { pontos: string[]; recomendacao: Recomendacao } | null; // "papo reto" de 3 pontos
      encerrada: boolean;
      estado: string;
    }
  | { ok: false; erro: "validacao" | "limite" | "antirrobo" | "indisponivel" };

export const rotaPapoReto = "/api/papo-reto";

// Resposta por voz (17/11): o navegador grava, o servidor transcreve (Groq Whisper) e devolve o texto,
// que segue pelo mesmo caminho do texto livre. O áudio nunca é guardado.
export const rotaPapoRetoAudio = "/api/papo-reto/audio";
export const AUDIO_MAX_SEGUNDOS = 30;
export const AUDIO_MAX_BYTES = 1_000_000;
/** Corpo: multipart/form-data com `audio` (arquivo) e `estado` (o estado assinado da conversa em curso). */
export type RespostaTranscricao =
  | { ok: true; texto: string }
  | { ok: false; erro: "validacao" | "limite" | "antirrobo" | "indisponivel" | "nao-entendido" };
