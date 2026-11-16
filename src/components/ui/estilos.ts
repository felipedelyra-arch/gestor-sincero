// Classes dos botões, compartilhadas entre links (Botao) e o botão de envio do formulário.
export const estilosBotao = {
  principal:
    "inline-flex min-h-14 w-full items-center justify-center rounded-base bg-ouro px-6 py-3 text-center font-medium text-preto hover:bg-ouro-claro aria-disabled:opacity-60 sm:w-auto",
  // cabeçalho: mesma cor, 48px de altura
  compacto:
    "inline-flex min-h-12 items-center justify-center rounded-base bg-ouro px-4 text-center text-apoio font-medium text-preto hover:bg-ouro-claro",
  secundario:
    "inline-flex min-h-12 items-center py-2 font-medium text-texto underline decoration-ouro decoration-1 underline-offset-8 hover:decoration-ouro-claro",
} as const;

export type VarianteBotao = keyof typeof estilosBotao;
