import { pagina } from "@content";

/** 00. Fica presa no topo durante a rolagem. */
export function Tarja() {
  return (
    <div className="sticky top-0 z-40 border-b border-chumbo bg-preto">
      <p className="conteiner flex min-h-9 items-center py-1 text-apoio text-texto-2">{pagina.tarja.texto}</p>
    </div>
  );
}
