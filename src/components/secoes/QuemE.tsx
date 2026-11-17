import { Fragment } from "react";
import { pagina } from "@content";
import { Imagem } from "../ui/Imagem";

const sub = "font-titulo text-sub font-medium";

/** Nomes em linha corrida, separados por ponto médio. */
function LinhaCorrida({ itens }: { itens: string[] }) {
  return (
    <p>
      {itens.map((item, i) => (
        // o separador acompanha o nome anterior (nunca começa uma linha), cada nome fica inteiro, e o espaço
        // depois do separador é onde a linha pode quebrar
        <Fragment key={item}>
          <span className="whitespace-nowrap">
            {item}
            {i < itens.length - 1 && (
              <span aria-hidden="true" className="pl-2 text-ouro">
                ·
              </span>
            )}
          </span>{" "}
        </Fragment>
      ))}
    </p>
  );
}

/**
 * S6. Perfil de revista (5 + 7): a foto do prêmio na altura toda da seção, à esquerda; à direita o texto corrido, a
 * frase do Ferrér em manifesto, as credenciais em lista de duas colunas, "é / não é" separados por um filete
 * vertical e as empresas em uma linha corrida. Sem cartões, etiquetas nem "ver todos".
 */
export function QuemE() {
  const q = pagina.quemE;
  return (
    <section id="quem-e" aria-labelledby="quem-e-titulo" className="py-(--sec-ampla)">
      <div className="conteiner-v2 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-12 lg:gap-x-8">
        {/* o único elemento revelado da seção: a foto, por opacidade */}
        <figure data-revela suppressHydrationWarning className="flex flex-col lg:col-span-5">
          <div className="relative aspect-4/5 w-full lg:aspect-auto lg:min-h-[520px] lg:flex-1">
            <Imagem
              nome="ferrer-premio"
              alt={q.altFoto}
              tamanhos="(min-width: 1024px) 520px, 100vw"
              largura={1080}
              altura={1440}
              className="size-full object-cover object-[55%_center] lg:absolute lg:inset-0"
            />
          </div>
          <figcaption className="mt-4 text-legenda text-texto-2">
            <span className="block font-medium text-texto">{q.premio.nome}</span>
            {q.premio.descricao}
          </figcaption>
        </figure>

        <div className="lg:col-span-7 lg:col-start-6">
          <h2 id="quem-e-titulo" className="font-titulo text-secao font-medium text-balance">
            {q.titulo}
          </h2>

          <div className="mt-8 grid max-w-[66ch] gap-6 text-lead">
            {q.paragrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {/* A frase do Ferrér: o elemento memorável da página, ao lado do retrato dele. */}
          {q.frase && <blockquote className="manifesto my-14 text-balance lg:my-16">{q.frase}</blockquote>}

          <ul className="grid gap-x-10 border-b border-filete-ouro sm:grid-cols-2">
            {q.credenciais.map((c) => (
              <li key={c} className="border-t border-filete-ouro py-4">
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-chumbo">
            <div className="sm:pr-10">
              <h3 className={sub}>{q.tituloEh}</h3>
              <ul className="mt-4 grid gap-3">
                {q.eh.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <div className="sm:pl-10">
              <h3 className={sub}>{q.tituloNaoEh}</h3>
              <ul className="mt-4 grid gap-3">
                {q.naoEh.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className={`${sub} mt-14`}>{q.tituloEmpresas}</h3>
          <div className="mt-4 max-w-[66ch]">
            <LinhaCorrida itens={q.empresas} />
          </div>
        </div>
      </div>
    </section>
  );
}
