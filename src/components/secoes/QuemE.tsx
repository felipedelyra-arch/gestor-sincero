import { pagina } from "@content";
import { Cartao } from "../ui/Cartao";
import { Imagem } from "../ui/Imagem";
import { Secao } from "../ui/Secao";

const subtitulo = "font-titulo text-h3 font-medium";
const etiqueta = "rounded-base border border-chumbo px-3 py-1 text-apoio text-texto-2";
// Quantas credenciais aparecem antes de "ver todos".
const VISIVEIS = 5;

/** 06. Foto do prêmio e biografia; "é / não é" em dois cartões; credenciais e empresas em etiquetas. */
export function QuemE() {
  const q = pagina.quemE;
  const { verTodos, verMenos } = pagina.rotulos;
  return (
    <Secao id="quem-e" titulo={q.titulo} fundo="marinho">
      <div className="grid gap-8 lg:grid-cols-12">
        <figure className="mx-auto w-full max-w-[320px] lg:col-span-4 lg:max-w-none">
          <Imagem
            nome="ferrer-premio"
            alt={q.altFoto}
            tamanhos="(min-width: 1024px) 380px, 320px"
            largura={1080}
            altura={1440}
            className="aspect-4/5 w-full rounded-cartao object-cover object-top"
          />
          <figcaption className="mt-3 text-apoio text-texto-2">
            <span className="block font-medium text-texto">{q.premio.nome}</span>
            {q.premio.descricao}
          </figcaption>
        </figure>

        <div className="lg:col-span-8">
          <div className="grid gap-4">
            {q.paragrafos.map((p) => (
              <p key={p} className="text-pretty">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Cartao fundo="preto">
              <h3 className={subtitulo}>{q.tituloEh}</h3>
              <ul className="mt-3 grid gap-1.5">
                {q.eh.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </Cartao>
            <Cartao fundo="preto">
              <h3 className={subtitulo}>{q.tituloNaoEh}</h3>
              <ul className="mt-3 grid gap-1.5 text-texto-2">
                {q.naoEh.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </Cartao>
          </div>
        </div>
      </div>

      {/* Credenciais: as primeiras à vista, o resto abre com "ver todos". */}
      <details className="group mt-8">
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2">
          {q.credenciais.slice(0, VISIVEIS).map((c) => (
            <span key={c} className={etiqueta}>
              {c}
            </span>
          ))}
          <span className="inline-flex min-h-12 items-center px-2 text-apoio font-medium text-ouro-claro">
            <span className="group-open:hidden">{verTodos}</span>
            <span className="hidden group-open:inline">{verMenos}</span>
          </span>
        </summary>
        <ul className="mt-2 flex flex-wrap gap-2">
          {q.credenciais.slice(VISIVEIS).map((c) => (
            <li key={c} className={etiqueta}>
              {c}
            </li>
          ))}
        </ul>
      </details>

      <h3 className={`${subtitulo} mt-6`}>{q.tituloEmpresas}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {q.empresas.map((e) => (
          <li key={e} className={etiqueta}>
            {e}
          </li>
        ))}
      </ul>
    </Secao>
  );
}
