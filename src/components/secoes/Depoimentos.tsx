import { pagina } from "@content";

/** 13. Não renderiza nada enquanto não houver depoimento real autorizado. */
export function Depoimentos() {
  const { titulo, itens } = pagina.depoimentos;
  if (itens.length === 0) return null;
  return (
    <section id="depoimentos" aria-labelledby="depoimentos-titulo" className="py-(--sec-media)">
      <div className="conteiner-v2">
        <h2 id="depoimentos-titulo" className="max-w-[680px] font-titulo text-secao font-medium text-balance">
          {titulo}
        </h2>
        <ul className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-2">
          {itens.map((d, n) => (
            <li key={n} className="border-t border-filete-ouro pt-6">
              <figure>
                <blockquote className="text-lead">{d.texto}</blockquote>
                <figcaption className="mt-4 text-legenda text-texto-2">
                  <span className="block font-medium text-texto">{d.nome}</span>
                  {d.cargo}, {d.empresa}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
