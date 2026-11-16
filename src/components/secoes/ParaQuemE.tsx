import { pagina } from "@content";
import { Cartao } from "../ui/Cartao";
import { etiqueta } from "../ui/estilos";
import { ListaConferencia } from "../ui/ListaConferencia";
import { Secao } from "../ui/Secao";

const subtitulo = "font-titulo text-h3 font-medium";

/** 12. Dois cartões (é / não é), os requisitos em linha e a frase que resume a seção. */
export function ParaQuemE() {
  const p = pagina.paraQuem;
  return (
    <Secao id="para-quem" titulo={p.titulo} fundo="marinho">
      <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
        <Cartao fundo="preto">
          <h3 className={subtitulo}>{p.tituloEh}</h3>
          <ListaConferencia itens={p.eh} className="mt-3" />
        </Cartao>
        <Cartao fundo="preto">
          <h3 className={subtitulo}>{p.tituloNaoEh}</h3>
          <ListaConferencia itens={p.naoEh} marca="nao" className="mt-3 text-texto-2" />
        </Cartao>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <h3 className={`${subtitulo} mr-2 max-sm:w-full max-sm:text-center`}>{p.tituloRequisitos}</h3>
        <ul className="contents">
          {p.requisitos.map((i, n) => (
            <li key={n} className={etiqueta}>
              {i}
            </li>
          ))}
        </ul>
      </div>
      <p className="mx-auto mt-6 max-w-texto text-center font-titulo text-h3 text-balance">{p.fraseRequisito}</p>
    </Secao>
  );
}
