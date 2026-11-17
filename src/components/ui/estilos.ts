// Classes compartilhadas. Botões: links (Botao) e o botão de envio do formulário.
export const estilosBotao = {
  principal:
    "inline-flex min-h-14 w-full items-center justify-center rounded-base bg-ouro px-6 py-3 text-center font-medium text-preto hover:bg-ouro-claro aria-disabled:opacity-60 sm:w-auto",
  // cabeçalho: mesma cor, 48px de altura
  compacto:
    "inline-flex min-h-12 items-center justify-center rounded-base bg-ouro px-4 text-center text-apoio font-medium text-preto hover:bg-ouro-claro",
  // contorno dourado: ações de apoio que abrem algo (ex.: o painel do Papo reto)
  contorno:
    "inline-flex min-h-12 items-center justify-center rounded-base border border-ouro-escuro px-5 py-2 text-center font-medium text-texto transition-colors duration-200 hover:border-ouro-claro",
  secundario:
    "inline-flex min-h-12 items-center py-2 font-medium text-texto underline decoration-ouro decoration-1 underline-offset-8 hover:decoration-ouro-claro",
} as const;

export type VarianteBotao = keyof typeof estilosBotao;

/** Fileira que rola na horizontal com encaixe (sem biblioteca). Quem usa põe `tabIndex={0}` para o teclado. */
export const trilho = "flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2";
/** Item da fileira: deixa um pedaço do próximo à vista para indicar que há mais. */
export const trilhoItem = "w-[85%] shrink-0 snap-start";
