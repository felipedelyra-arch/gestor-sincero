import { pagina } from "@content";
import { Imagem } from "../ui/Imagem";
import { LinhaCorrida } from "../ui/LinhaCorrida";

const sub = "font-titulo text-sub font-medium";

/**
 * S6. Perfil de revista (5 + 7), até 1.000px no desktop: a foto do prêmio acompanha a altura do texto, à esquerda; à
 * direita o parágrafo, a frase do Ferrér em manifesto, as seis credenciais em duas colunas, a síntese e as empresas
 * em linha corrida. Sem cartões, etiquetas nem listas "é / não é".
 */
export function QuemE() {
  const q = pagina.quemE;
  return (
    <section id="quem-e" aria-labelledby="quem-e-titulo" className="py-12 lg:py-16">
      <div className="conteiner-v2 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 lg:gap-x-8">
        {/* a foto aparece inteira, na proporção original (3:4): esticá-la até a altura do texto cortava o logo do fundo */}
        <figure data-revela suppressHydrationWarning className="flex max-w-[260px] flex-col self-start lg:sticky lg:top-28 lg:col-span-5 lg:max-w-none">
          <div className="relative aspect-3/4 w-full">
            <Imagem
              nome="ferrer-premio"
              alt={q.altFoto}
              tamanhos="(min-width: 1024px) 520px, 260px"
              largura={1080}
              altura={1440}
              className="size-full object-cover"
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

          <div className="mt-6 grid max-w-[66ch] gap-5 text-lead">
            {q.paragrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {/* A frase do Ferrér: o elemento memorável da página, ao lado do retrato dele. */}
          {q.frase && <blockquote className="manifesto my-8 text-balance lg:my-10 lg:text-[length:clamp(2.222rem,4.4vw,4rem)]">{q.frase}</blockquote>}

          {/* Credenciais: lista de duas colunas com filetes no desktop; no celular, texto corrido com ponto médio. */}
          <ul className="max-sm:block sm:grid sm:grid-cols-2 sm:gap-x-10 sm:border-b sm:border-filete-ouro">
            {q.credenciais.map((c) => (
              <li
                key={c}
                className="max-sm:inline max-sm:after:px-0.5 max-sm:after:text-ouro max-sm:after:content-['_·_'] max-sm:last:after:content-none sm:border-t sm:border-filete-ouro sm:py-3"
              >
                {c}
              </li>
            ))}
          </ul>

          {q.sintese && <p className="mt-6 max-w-[66ch]">{q.sintese}</p>}

          <h3 className={`${sub} mt-8`}>{q.tituloEmpresas}</h3>
          <div className="mt-3 max-w-[66ch]">
            <LinhaCorrida itens={q.empresas} />
          </div>
        </div>
      </div>
    </section>
  );
}
