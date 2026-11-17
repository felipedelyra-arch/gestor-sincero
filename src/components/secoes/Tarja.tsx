import { pagina } from "@content";

/**
 * S0. Tarja acima do cabeçalho, em 13px e com respiro, alinhada à grade; rola com a página.
 * Região nomeada pelo próprio texto (axe `region`).
 */
export function Tarja() {
  return (
    <section aria-labelledby="tarja-texto" className="border-b border-chumbo bg-preto-2">
      <p id="tarja-texto" className="conteiner-v2 py-2.5 text-[13px] leading-[1.4] text-texto-2 lg:py-3">
        {pagina.tarja.texto}
      </p>
    </section>
  );
}
