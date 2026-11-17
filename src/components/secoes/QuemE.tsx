import { pagina } from "@content";
import { Imagem } from "../ui/Imagem";
import { LinhaCorrida } from "../ui/LinhaCorrida";

const sub = "font-titulo text-sub font-medium";

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
        {/* Desktop: a foto fica fixa (sticky) enquanto o texto rola e aparece inteira, com o logo do fundo. */}
        <figure data-revela suppressHydrationWarning className="max-w-[260px] lg:sticky lg:top-[calc(var(--altura-cabecalho)+24px)] lg:col-span-5 lg:max-w-none lg:self-start">
          <Imagem
            nome="ferrer-premio"
            alt={q.altFoto}
            tamanhos="(min-width: 1024px) 520px, 260px"
            largura={1080}
            altura={1440}
            className="aspect-3/4 w-full object-cover"
          />
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
          {q.frase && <blockquote className="manifesto my-10 text-balance lg:my-16">{q.frase}</blockquote>}

          {/* Credenciais: lista de duas colunas com filetes no desktop; no celular, texto corrido com ponto médio. */}
          <ul className="max-sm:block sm:grid sm:grid-cols-2 sm:gap-x-10 sm:border-b sm:border-filete-ouro">
            {q.credenciais.map((c) => (
              <li
                key={c}
                className="max-sm:inline max-sm:after:px-0.5 max-sm:after:text-ouro max-sm:after:content-['_·_'] max-sm:last:after:content-none sm:border-t sm:border-filete-ouro sm:py-4"
              >
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-chumbo">
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

          <h3 className={`${sub} mt-10 sm:mt-14`}>{q.tituloEmpresas}</h3>
          <div className="mt-4 max-w-[66ch]">
            <LinhaCorrida itens={q.empresas} />
          </div>
        </div>
      </div>
    </section>
  );
}
