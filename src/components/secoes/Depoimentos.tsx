import { pagina } from "@content";
import { Secao } from "../ui/Secao";

/** 13. Não renderiza nada enquanto não houver depoimento real autorizado. */
export function Depoimentos() {
  const { titulo, itens } = pagina.depoimentos;
  if (itens.length === 0) return null;
  return (
    <Secao id="depoimentos" titulo={titulo} estreito fundo="preto-2">
      <ul className="grid gap-12">
        {itens.map((d, n) => (
          <li key={n}>
            <figure className="border-l border-ouro pl-8">
              <blockquote className="font-titulo text-h3 text-balance">{d.texto}</blockquote>
              <figcaption className="mt-4 text-texto-2">
                <span className="block font-medium text-texto">{d.nome}</span>
                <span className="block">{d.cargo}</span>
                <span className="block">{d.empresa}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Secao>
  );
}
