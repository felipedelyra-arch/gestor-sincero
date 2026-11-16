import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";
import { Imagem } from "../ui/Imagem";
import { TopoTitulo } from "./TopoTitulo";

/** 01. Título (variação A ou B), chamadas e o retrato, que cede o lugar ao vídeo quando houver um. */
export function Topo() {
  const { topo } = pagina;
  return (
    <section className="relative overflow-x-clip pt-(--respiro-topo)">
      <div className="conteiner grid lg:grid-cols-12 lg:gap-x-8 lg:pb-36">
        <div className="relative z-1 lg:col-span-7">
          <TopoTitulo variacoes={topo.variacoes} />
          {/* No celular os respiros são menores para as duas chamadas caberem acima do banner de cookies (390x844). */}
          <div className="entra mt-6 flex flex-col items-start gap-x-8 gap-y-1 [--ordem:2] sm:mt-8 sm:flex-row sm:items-center">
            <Botao chamada={topo.chamadaPrincipal} />
            <Botao chamada={topo.chamadaSecundaria} variante="secundario" />
          </div>
        </div>
      </div>

      {/* Celular: abaixo das chamadas. Desktop: à direita, da altura do bloco de texto e apoiada na base dele. */}
      <div className="entra relative mt-12 [--ordem:4] lg:absolute lg:top-(--respiro-topo) lg:right-0 lg:bottom-36 lg:mt-0 lg:w-[52vw] lg:[container-type:size]">
        {site.video.url ? (
          // shortcut: iframe direto serve para link de incorporação; quando o vídeo existir, trocar por
          // fachada (foto + botão de tocar) se o player pesar na carga.
          <iframe
            src={site.video.url}
            title={topo.tituloVideo}
            loading="lazy"
            allow="fullscreen; picture-in-picture"
            className="aspect-video w-full rounded-base"
          />
        ) : (
          <>
            <div
              data-parallax
              suppressHydrationWarning
              className="relative lg:absolute lg:top-0 lg:right-0 lg:w-[min(100cqw,100cqh)] xl:top-auto xl:bottom-0"
            >
              <Imagem
                nome="ferrer-retrato"
                alt={topo.altFoto}
                tamanhos="(min-width: 1024px) 52vw, 100vw"
                largura={1080}
                altura={1080}
                prioridade
                className="w-full"
              />
              {/* O único esmaecimento da página: a foto some no preto. Fica preso à caixa da imagem, que no */}
              {/* desktop é o maior quadrado que cabe no contêiner (cqw/cqh): alcança sempre a base e a lateral. */}
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-preto to-transparent" />
              <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-1/4 bg-linear-to-r from-preto to-transparent lg:block" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
