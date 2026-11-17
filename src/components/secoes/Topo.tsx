import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";
import { ConversaPapoReto } from "../papo-reto/ConversaPapoReto";
import { Imagem } from "../ui/Imagem";
import { TopoTitulo } from "./TopoTitulo";

/** 01. Texto à esquerda e retrato à direita, tudo na primeira tela. O retrato cede o lugar ao vídeo quando houver um. */
export function Topo() {
  const { topo } = pagina;
  return (
    <section className="overflow-hidden">
      {/*
        Celular: o retrato (rosto e ombros, nítido) flutua à direita e o título corre ao lado dele; o que vem depois
        (subtítulo e ações) ocupa a largura toda. Assim o título longo da variação B não empurra as ações para trás
        do banner de cookies. O retrato vem antes no HTML por causa do float; no desktop a grade o devolve à direita.
        Desktop: texto em 7 colunas e retrato em 5.
      */}
      <div className="conteiner py-5 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-8 lg:py-0">
        <div className="entra float-right mb-2 ml-4 w-[124px] lg:float-none lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:m-0 lg:w-auto">
          {site.video.url ? (
            // shortcut: iframe direto serve para link de incorporação; quando o vídeo existir, trocar por
            // fachada (foto + botão de tocar) se o player pesar na carga.
            <iframe
              src={site.video.url}
              title={topo.tituloVideo}
              loading="lazy"
              allow="fullscreen; picture-in-picture"
              className="aspect-video w-full rounded-cartao lg:mb-20"
            />
          ) : (
            <div className="relative h-[150px] w-[124px] overflow-hidden rounded-cartao border border-chumbo bg-preto-2 lg:h-auto lg:w-full lg:rounded-none lg:border-0 lg:bg-transparent">
              {/* Celular: recorte de rosto e ombros dentro do quadro. Desktop: a foto inteira. */}
              <Imagem
                nome="ferrer-retrato"
                alt={topo.altFoto}
                tamanhos="(min-width: 1024px) 40vw, 240px"
                largura={1080}
                altura={1080}
                prioridade
                className="absolute -top-1.5 left-[-58px] h-auto w-[240px] max-w-none lg:static lg:w-full"
              />
              {/* O único esmaecimento da página: a base da foto some no preto (só no desktop). */}
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-1/4 bg-linear-to-t from-preto to-transparent lg:block" />
            </div>
          )}
        </div>

        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:py-20">
          <TopoTitulo variacoes={topo.variacoes} />
          {/* Celular: a captação ocupa a linha toda e, embaixo, o link da mentoria e o Papo reto dividem a linha (texto de apoio de 15px, em duas linhas). */}
          <div className="entra clear-both mt-3 grid grid-cols-2 items-center gap-x-3 gap-y-1 sm:flex sm:flex-row sm:gap-x-6 lg:mt-8">
            <Botao chamada={topo.chamadaPrincipal} className="max-sm:col-span-2 max-sm:py-2" />
            <Botao chamada={topo.chamadaSecundaria} variante="secundario" className="max-sm:py-1 max-sm:text-apoio" />
            <ConversaPapoReto className="max-sm:px-3 max-sm:py-1.5 max-sm:text-apoio" />
          </div>
        </div>
      </div>
    </section>
  );
}
