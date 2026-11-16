import { pagina } from "@content";
import { Cartao } from "../ui/Cartao";
import { Secao } from "../ui/Secao";

/** 13. Não renderiza nada enquanto não houver depoimento real autorizado. */
export function Depoimentos() {
  const { titulo, itens } = pagina.depoimentos;
  if (itens.length === 0) return null;
  return (
    <Secao id="depoimentos" titulo={titulo}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {itens.map((d, n) => (
          <li key={n}>
            <Cartao className="h-full">
              <figure>
                <blockquote className="text-pretty">{d.texto}</blockquote>
                <figcaption className="mt-4 text-apoio text-texto-2">
                  <span className="block font-medium text-texto">{d.nome}</span>
                  <span className="block">{d.cargo}</span>
                  <span className="block">{d.empresa}</span>
                </figcaption>
              </figure>
            </Cartao>
          </li>
        ))}
      </ul>
    </Secao>
  );
}
