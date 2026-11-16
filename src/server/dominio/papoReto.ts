import type { Recomendacao } from "@/shared/papoReto";

// Porta de persistência do Papo reto (ADR 0003). As regras e o diálogo vivem em src/server/papo-reto/.

export interface RepositorioPapoReto {
  /** Só chamado com consentimento. Respostas e regras já chegam cifradas; o texto livre nunca é guardado. */
  gravar(dados: { sessao: string; respostasCifradas: string; regrasCifradas: string; recomendacao: Recomendacao }): Promise<void>;
}
