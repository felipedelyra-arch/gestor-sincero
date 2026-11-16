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
        <div className="lg:col-span-7">
          <TopoTitulo variacoes={topo.variacoes} />
          <div className="entra mt-8 flex flex-col items-start gap-x-8 gap-y-2 [--ordem:2] sm:flex-row sm:items-center">
            <Botao chamada={topo.chamadaPrincipal} />
            <Botao chamada={topo.chamadaSecundaria} variante="secundario" />
          </div>
        </div>
      </div>

      {/* Celular: abaixo das chamadas. Desktop: sangra até a borda direita, colunas 8 a 12. */}
      <div className="entra relative mt-12 [--ordem:4] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[42vw]">
        {site.video.url ? (
          // shortcut: iframe direto serve para link de incorporação; quando o vídeo existir, trocar por
          // fachada (foto + botão de tocar) se o player pesar na carga.
          <iframe
            src={site.video.url}
            title={topo.tituloVideo}
            loading="lazy"
            allow="fullscreen; picture-in-picture"
            className="aspect-video w-full rounded-base lg:absolute lg:top-(--respiro-topo)"
          />
        ) : (
          <>
            <div data-parallax>
              <Imagem
                nome="ferrer-retrato"
                alt={topo.altFoto}
                tamanhos="(min-width: 1024px) 42vw, 100vw"
                largura={1080}
                altura={1080}
                prioridade
                className="w-full object-cover object-top lg:h-full"
              />
            </div>
            {/* O único esmaecimento da página: a base da foto some no preto. */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-preto to-transparent" />
          </>
        )}
      </div>
    </section>
  );
}
