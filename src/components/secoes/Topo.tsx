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
        Celular: grade de duas colunas. O título fica à esquerda e o retrato (rosto e ombros, nítido) à direita; o
        subtítulo e as chamadas ocupam a largura toda. O bloco de texto usa `contents` para seus filhos entrarem
        nessa grade. Desktop: texto em 7 colunas e retrato em 5.
      */}
      <div className="conteiner grid grid-cols-[minmax(0,1fr)_124px] items-start gap-x-4 py-6 lg:grid-cols-12 lg:items-end lg:gap-x-8 lg:py-0">
        <div className="contents lg:col-span-7 lg:block lg:py-20">
          <TopoTitulo variacoes={topo.variacoes} />
          <div className="entra col-span-2 mt-4 flex flex-col items-start gap-x-6 gap-y-0 sm:flex-row sm:items-center lg:mt-8">
            <Botao chamada={topo.chamadaPrincipal} />
            <Botao chamada={topo.chamadaSecundaria} variante="secundario" />
            <ConversaPapoReto className="max-sm:w-full" />
          </div>
        </div>

        {/* Desktop: coluna à direita, apoiado na base do bloco de texto. */}
        <div className="entra col-start-2 row-start-1 lg:col-span-5 lg:col-start-auto lg:row-start-auto">
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
      </div>
    </section>
  );
}
