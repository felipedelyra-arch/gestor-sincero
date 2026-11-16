import { pagina } from "@content";

/** 00. Fica presa no topo durante a rolagem. Região nomeada pelo próprio texto (axe `region`). */
export function Tarja() {
  return (
    <section aria-labelledby="tarja-texto" className="sticky top-0 z-40 border-b border-chumbo bg-preto">
      <p id="tarja-texto" className="conteiner flex min-h-9 items-center py-1 text-apoio text-texto-2">
        {pagina.tarja.texto}
      </p>
    </section>
  );
}
