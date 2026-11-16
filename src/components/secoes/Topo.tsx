import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";
import { Imagem } from "../ui/Imagem";
import { TopoTitulo } from "./TopoTitulo";

/** 01. Texto à esquerda e retrato à direita, tudo na primeira tela. O retrato cede o lugar ao vídeo quando houver um. */
export function Topo() {
  const { topo } = pagina;
  return (
    <section className="relative overflow-hidden">
      <div className="conteiner grid items-end lg:grid-cols-12 lg:gap-x-8">
        <div className="relative z-1 py-8 lg:col-span-7 lg:py-20">
          <TopoTitulo variacoes={topo.variacoes} />
          <div className="entra mt-6 flex flex-col items-start gap-x-6 gap-y-1 sm:flex-row sm:items-center lg:mt-8">
            <Botao chamada={topo.chamadaPrincipal} />
            <Botao chamada={topo.chamadaSecundaria} variante="secundario" />
          </div>
        </div>

        {/* Celular: retrato por trás do texto, à direita, esmaecido (só a fileira de cima da página, sem tomar altura). */}
        {/* Desktop: coluna à direita, apoiado na base do bloco de texto. */}
        <div className="entra retrato-celular pointer-events-none absolute top-8 right-0 w-[58%] max-w-[280px] lg:pointer-events-auto lg:relative lg:top-auto lg:col-span-5 lg:w-auto lg:max-w-none">
          {site.video.url ? (
            // shortcut: iframe direto serve para link de incorporação; quando o vídeo existir, trocar por
            // fachada (foto + botão de tocar) se o player pesar na carga.
            <iframe
              src={site.video.url}
              title={topo.tituloVideo}
              loading="lazy"
              allow="fullscreen; picture-in-picture"
              className="mb-8 aspect-video w-full rounded-cartao lg:mb-20"
            />
          ) : (
            <>
              <Imagem
                nome="ferrer-retrato"
                alt={topo.altFoto}
                tamanhos="(min-width: 1024px) 40vw, 58vw"
                largura={1080}
                altura={1080}
                prioridade
                className="h-[340px] w-full object-cover object-[58%_top] lg:h-auto lg:object-fill"
              />
              {/* O único esmaecimento da página: a base da foto some no preto. */}
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-1/4 bg-linear-to-t from-preto to-transparent lg:block" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
