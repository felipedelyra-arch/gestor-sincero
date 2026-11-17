import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";
import { ConversaPapoReto } from "../papo-reto/ConversaPapoReto";
import { Imagem } from "../ui/Imagem";
import { TopoTitulo } from "./TopoTitulo";

/**
 * S1. Topo editorial. Desktop: texto na grade, à esquerda; o retrato ocupa da coluna 7 à 12 (e pode entrar um pouco
 * na área do texto, que fica por cima), com a cabeça na linha do topo do título e a base fundida no preto por máscara.
 * O arquivo maior tem 1080px: a altura e a largura do retrato nunca passam de 800px, em nenhuma janela.
 * Celular: o retrato vem acima do título, do peito para cima, na largura toda, e some no preto na base.
 */
export function Topo() {
  const { topo } = pagina;
  return (
    <section className="relative isolate overflow-hidden">
      {/* o conteiner é relativo: o retrato do desktop ancora na borda direita da grade, no pé da seção */}
      <div className="conteiner-v2 relative flex flex-col justify-center pt-5 pb-6 lg:min-h-[min(88vh,720px)] lg:pt-16 lg:pb-10">
        {/* luz de fundo atrás do retrato: ouro apagado, só no desktop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 bottom-0 hidden aspect-square h-[calc(100%-64px)] max-h-[800px] bg-[radial-gradient(closest-side_at_60%_45%,rgb(146_112_39/0.2),transparent)] lg:block"
        />
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,36%)] items-center gap-x-4 lg:block">
        <div className="retrato-topo max-lg:col-start-2 max-lg:row-start-1 max-lg:aspect-[4/5] max-lg:self-center max-lg:overflow-hidden lg:pointer-events-none lg:absolute lg:top-16 lg:-right-6 lg:bottom-0 lg:m-0 lg:aspect-square lg:h-[calc(100%-64px)] lg:max-h-[800px] lg:overflow-visible">
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
            <Imagem
              nome="ferrer-retrato"
              alt={topo.altFoto}
              tamanhos="(min-width: 1024px) 800px, 100vw"
              largura={1080}
              altura={1080}
              prioridade
              className="luz-contorno size-full object-cover object-[55%_0%] max-lg:origin-[55%_0%] max-lg:scale-[1.32] lg:object-contain lg:object-bottom"
            />
          )}
        </div>

          <TopoTitulo variacoes={topo.variacoes} />
          {/* Celular: a captação ocupa a linha toda e, embaixo, o link da mentoria e o Papo reto dividem a linha. */}
          {/* Desktop: captação, mentoria e Papo reto numa linha só (os dois últimos são links de texto; se não couberem na coluna do texto, o último desce, para não passar sobre o retrato). */}
          <div className="relative z-1 mt-6 grid max-lg:col-span-2 grid-cols-2 items-center gap-x-3 gap-y-1 sm:flex sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3 lg:mt-10 lg:w-[52%] lg:gap-x-7">
            <Botao chamada={topo.chamadaPrincipal} className="max-sm:col-span-2" />
            <Botao chamada={topo.chamadaSecundaria} variante="secundario" className="max-sm:justify-center max-sm:text-apoio" />
            <ConversaPapoReto variante="secundario" className="max-sm:justify-center max-sm:rounded-base max-sm:border max-sm:border-ouro-escuro max-sm:px-3 max-sm:text-center max-sm:text-apoio max-sm:no-underline" />
          </div>
          {/* Linha de prova: filete dourado apagado acima e fatos lado a lado, sem etiquetas nem cartões. */}
          <ul className="relative z-1 mt-6 max-lg:col-span-2 flex flex-wrap gap-x-7 gap-y-1 border-t border-filete-ouro pt-4 text-legenda text-texto-2 lg:mt-12 lg:w-[56%] lg:pt-5">
            {topo.prova.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
