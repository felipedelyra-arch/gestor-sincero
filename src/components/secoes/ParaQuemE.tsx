import { pagina } from "@content";
import { Secao } from "../ui/Secao";

const subtitulo = "font-titulo text-h3 font-medium";
const linhas = "mt-4 divide-y divide-chumbo border-y border-chumbo *:py-3";

/** 12. Para quem é, para quem não é e os requisitos. */
export function ParaQuemE() {
  const p = pagina.paraQuem;
  return (
    <Secao id="para-quem" titulo={p.titulo} estreito>
      <div className="grid gap-12 sm:grid-cols-2 sm:gap-8">
        <div>
          <h3 className={subtitulo}>{p.tituloEh}</h3>
          <ul className={linhas}>
            {p.eh.map((i, n) => (
              <li key={n}>{i}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={subtitulo}>{p.tituloNaoEh}</h3>
          <ul className={`${linhas} text-texto-2`}>
            {p.naoEh.map((i, n) => (
              <li key={n}>{i}</li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className={`${subtitulo} mt-16`}>{p.tituloRequisitos}</h3>
      <ul className={`${linhas} text-texto-2`}>
        {p.requisitos.map((i, n) => (
          <li key={n}>{i}</li>
        ))}
      </ul>
      <p className="mt-8 border-l border-ouro pl-8 font-titulo text-h3 text-balance">{p.fraseRequisito}</p>
    </Secao>
  );
}
