import { pagina } from "@content";
import { Cartao } from "../ui/Cartao";
import { etiqueta } from "../ui/estilos";
import { Imagem } from "../ui/Imagem";
import { Secao } from "../ui/Secao";
import { SinalAbrir } from "../ui/SinalAbrir";

const subtitulo = "font-titulo text-h3 font-medium";
// Quantas credenciais aparecem antes de "ver todos".
const VISIVEIS = 4;

/** 06. Foto do prêmio e biografia; "é / não é" em dois cartões; credenciais e empresas em etiquetas. */
export function QuemE() {
  const q = pagina.quemE;
  const { verTodos, verMenos } = pagina.rotulos;
  return (
    <Secao id="quem-e" titulo={q.titulo} fundo="marinho">
      <div className="grid gap-8 lg:grid-cols-12">
        <figure className="mx-auto w-full max-w-[220px] lg:col-span-4 lg:max-w-none">
          <Imagem
            nome="ferrer-premio"
            alt={q.altFoto}
            tamanhos="(min-width: 1024px) 380px, 220px"
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
      <details className="group mt-6">
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-2">
          {q.credenciais.slice(0, VISIVEIS).map((c) => (
            <span key={c} className={etiqueta}>
              {c}
            </span>
          ))}
          {/* mesma etiqueta das outras, com a área de toque de 48px em volta */}
          <span className="inline-flex min-h-12 items-center">
            <span className={`${etiqueta} border-ouro-escuro font-medium text-ouro-claro`}>
              <span className="group-open:hidden">{verTodos}</span>
              <span className="hidden group-open:inline">{verMenos}</span>
            </span>
          </span>
        </summary>
        <ul className="flex flex-wrap gap-2">
          {q.credenciais.slice(VISIVEIS).map((c) => (
            <li key={c} className={etiqueta}>
              {c}
            </li>
          ))}
        </ul>
      </details>

      {/* Empresas: recolhidas; o título abre a lista. */}
      <details className="group mt-2 border-t border-chumbo">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4">
          <h3 className={subtitulo}>{q.tituloEmpresas}</h3>
          <SinalAbrir />
        </summary>
        <ul className="flex flex-wrap gap-2 pb-2">
          {q.empresas.map((e) => (
            <li key={e} className={etiqueta}>
              {e}
            </li>
          ))}
        </ul>
      </details>
    </Secao>
  );
}
