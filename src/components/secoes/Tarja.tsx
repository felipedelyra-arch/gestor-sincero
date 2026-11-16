import { pagina } from "@content";

/** 00. Faixa fina acima do cabeçalho; rola com a página. Região nomeada pelo próprio texto (axe `region`). */
export function Tarja() {
  return (
    <section aria-labelledby="tarja-texto" className="border-b border-chumbo bg-preto-2">
      <p id="tarja-texto" className="conteiner flex min-h-8 items-center justify-center py-1 text-center text-apoio text-texto-2">
        {pagina.tarja.texto}
      </p>
    </section>
  );
}
