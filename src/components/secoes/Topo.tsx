import { Fragment } from "react";
import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";
import { ConversaPapoReto } from "../papo-reto/ConversaPapoReto";
import { Imagem } from "../ui/Imagem";
import { TopoTitulo } from "./TopoTitulo";

/**
 * S1. Topo editorial: título em manifesto à esquerda, retrato grande sangrando à direita e até a base, linha de prova.
 * Desktop: o retrato ocupa de 45 a 55% da largura (a altura da seção fixa o tamanho, a seção tem no mínimo 88vh).
 * Celular: o retrato flutua à direita (rosto e ombros, sangrando até a borda) e o título corre ao lado dele.
 */
export function Topo() {
  const { topo } = pagina;
  return (
    <section className="relative isolate flex min-h-[max(88vh,50vw)] flex-col overflow-hidden">
      <div className="conteiner-v2 flex flex-1 flex-col justify-center py-4 lg:py-20">
       {/* bloco comum dentro do flex: float só funciona fora de um contêiner flex */}
       <div>
        {/* O retrato vem antes no HTML por causa do float do celular; no desktop é absoluto e fica atrás do texto. */}
        <div className="retrato-topo float-right -mr-5 mb-2 ml-3 h-[175px] w-[150px] md:-mr-8 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:right-[-3%] lg:float-none lg:m-0 lg:h-full lg:w-auto lg:aspect-square">
          {site.video.url ? (
            // shortcut: iframe direto serve para link de incorporação; quando o vídeo existir, trocar por
            // fachada (foto + botão de tocar) se o player pesar na carga.
            <iframe
              src={site.video.url}
              title={topo.tituloVideo}
              loading="lazy"
              allow="fullscreen; picture-in-picture"
              className="aspect-video w-full"
            />
          ) : (
            <div className="relative size-full overflow-hidden lg:overflow-visible">
              <Imagem
                nome="ferrer-retrato"
                alt={topo.altFoto}
                tamanhos="(min-width: 1024px) 55vw, 270px"
                largura={1080}
                altura={1080}
                prioridade
                className="luz-contorno absolute -top-2 left-[-62px] h-auto w-[270px] max-w-none lg:static lg:size-full lg:object-contain lg:object-bottom"
              />
            </div>
          )}
          {/* degradê escuro na base do retrato: some no preto, sem corte seco (no celular é a máscara do .retrato-topo) */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-2/5 bg-linear-to-t from-preto via-preto/70 to-transparent lg:block" />
        </div>

        <div className="lg:w-[58%]">
          <TopoTitulo variacoes={topo.variacoes} />
          {/* Celular: a captação ocupa a linha toda e, embaixo, o link da mentoria e o Papo reto dividem a linha. */}
          <div className="relative z-1 clear-both mt-3 grid grid-cols-2 items-center gap-x-3 gap-y-1 sm:flex sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3 lg:mt-10">
            <Botao chamada={topo.chamadaPrincipal} className="max-sm:col-span-2 max-sm:py-2" />
            <Botao chamada={topo.chamadaSecundaria} variante="secundario" className="max-sm:py-1 max-sm:text-apoio" />
            <ConversaPapoReto className="max-sm:px-3 max-sm:py-1.5 max-sm:text-apoio" />
          </div>
          {/* Linha de prova: texto corrido, sem cartões nem etiquetas. */}
          <p className="relative z-1 mt-6 max-w-[60ch] text-legenda text-texto-2 lg:mt-10">
            {topo.prova.map((item, i) => (
              <Fragment key={item}>
                <span className="whitespace-nowrap">
                  {item}
                  {i < topo.prova.length - 1 && (
                    <span aria-hidden="true" className="pl-2">
                      ·
                    </span>
                  )}
                </span>{" "}
              </Fragment>
            ))}
          </p>
        </div>
       </div>
      </div>
    </section>
  );
}
