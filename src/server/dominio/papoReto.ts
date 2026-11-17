import type { ExtracaoLivre, Recomendacao } from "@/shared/papoReto";

// Porta de persistência do Papo reto (ADR 0003). As regras e o diálogo vivem em src/server/papo-reto/.

export interface RepositorioPapoReto {
  /** Só chamado com consentimento. Respostas e regras já chegam cifradas; o texto livre nunca é guardado. */
  gravar(dados: { sessao: string; respostasCifradas: string; regrasCifradas: string; recomendacao: Recomendacao }): Promise<void>;
}

/** O que o classificador precisa saber da pergunta atual (só conteúdo público de `content/`). */
export type PerguntaParaClassificar = {
  texto: string;
  opcoes: readonly { id: string; rotulo: string }[];
  campoNumero: { rotulo: string; min: number; max: number } | null;
};

/** Camada opcional de texto livre (ADR 0003, decisão 4): classifica o texto nas opções da pergunta. */
export interface ClassificadorLivre {
  /** Nunca lança. null = não deu (falha, timeout, saída inválida): o chamador segue sem o texto. O texto não é guardado nem logado. */
  classificar(texto: string, pergunta: PerguntaParaClassificar): Promise<ExtracaoLivre | null>;
}
