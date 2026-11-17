import { pagina } from "@content";
import { LinhaCorrida } from "../ui/LinhaCorrida";

const sub = "font-titulo text-sub font-medium";

/**
 * S12. Duas colunas de texto separadas por um filete vertical, sem cartões nem checks; os requisitos em uma linha
 * corrida; e o requisito principal em destaque moderado (24 a 28px) com filete dourado.
 */
export function ParaQuemE() {
  const p = pagina.paraQuem;
  return (
    <section id="para-quem" aria-labelledby="para-quem-titulo" className="py-(--sec-curta)">
      <div className="conteiner-v2">
        <h2 id="para-quem-titulo" data-revela data-desloca suppressHydrationWarning className="max-w-[680px] font-titulo text-secao font-medium text-balance">
          {p.titulo}
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-chumbo">
          <div className="md:pr-12">
            <h3 className={sub}>{p.tituloEh}</h3>
            <ul className="mt-5 grid gap-4 text-lead">
              {p.eh.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div className="md:pl-12">
            <h3 className={sub}>{p.tituloNaoEh}</h3>
            <ul className="mt-5 grid gap-4 text-lead">
              {p.naoEh.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className={`${sub} mt-14`}>{p.tituloRequisitos}</h3>
        <LinhaCorrida itens={p.requisitos} className="mt-4 max-w-[66ch] text-lead" />

        <p className="mt-14 max-w-[36ch] border-l-2 border-ouro pl-6 font-manifesto text-[1.333rem] leading-[1.3] text-balance lg:mt-16 lg:text-[1.556rem]">{p.fraseRequisito}</p>
      </div>
    </section>
  );
}
