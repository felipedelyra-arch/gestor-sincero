import { extrairOrigem, lerOrigem as lerGravada, type Origem } from "./global/origem";
import type { NomeEvento } from "./global/Rastreamento";

export { montarLinkCheckout } from "./global/origem";
export type { Origem };

/** Origem gravada na primeira visita (chave "gs_origem"); sem gravação, lê a URL atual. Só no navegador. */
export function lerOrigem(): Origem {
  return lerGravada() ?? extrairOrigem(window.location.search);
}

/** Variação do topo: só `?v=b` troca; qualquer outro valor é A. */
export function lerVariacaoUrl(): Origem["variacao"] {
  return new URLSearchParams(window.location.search).get("v") === "b" ? "b" : "a";
}

export function emitir(nome: NomeEvento, dados?: Record<string, unknown>): void {
  window.dispatchEvent(new CustomEvent("gs:evento", { detail: { nome, dados } }));
}
