import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";
import { Imagem } from "../ui/Imagem";
import { TopoTitulo } from "./TopoTitulo";

/** 01. Texto à esquerda e retrato à direita, tudo na primeira tela. O retrato cede o lugar ao vídeo quando houver um. */
export function Topo() {
  const { topo } = pagina;
  return (
    <section className="overflow-hidden">
      <div className="conteiner grid items-end lg:grid-cols-12 lg:gap-x-8">
        <div className="py-8 lg:col-span-7 lg:py-20">
          <TopoTitulo variacoes={topo.variacoes} />
          <div className="entra mt-6 flex flex-col items-start gap-x-6 gap-y-1 sm:flex-row sm:items-center lg:mt-8">
            <Botao chamada={topo.chamadaPrincipal} />
            <Botao chamada={topo.chamadaSecundaria} variante="secundario" />
          </div>
        </div>

        <div className="entra relative lg:col-span-5">
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
                tamanhos="(min-width: 1024px) 40vw, 100vw"
                largura={1080}
                altura={1080}
                prioridade
                className="w-full"
              />
              {/* O único esmaecimento da página: a base da foto some no preto. */}
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-preto to-transparent" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
