import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";
import { ConversaPapoReto } from "../papo-reto/ConversaPapoReto";
import { Imagem } from "../ui/Imagem";
import { TopoTitulo } from "./TopoTitulo";

/**
 * S1. Topo editorial: título em manifesto na grade, à esquerda; retrato à direita, apoiado na base da seção.
 * O arquivo do retrato tem 1080px: ele nunca passa de 620px na tela (sempre reduzido, nunca ampliado), em qualquer janela.
 * Desktop: o retrato ancora no canto direito da grade, com luz atrás, luz de contorno e máscara que funde base e lado
 * esquerdo no preto. Celular: o retrato flutua à direita, rosto e ombros, e o título corre ao lado dele.
 */
export function Topo() {
  const { topo } = pagina;
  return (
    <section className="relative isolate overflow-hidden">
      {/* conteiner relativo: o retrato do desktop ancora na borda direita da grade, no pé da seção */}
      <div className="conteiner-v2 relative flex flex-col justify-center py-4 lg:min-h-[min(88vh,800px)] lg:py-24">
        {/* luz de fundo atrás do retrato: ouro apagado, só no desktop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-(--margem-v2) bottom-0 hidden h-[620px] w-[min(620px,50%)] bg-[radial-gradient(closest-side_at_60%_45%,rgb(146_112_39/0.2),transparent)] lg:block"
        />
        {/* O retrato vem antes no HTML por causa do float do celular; no desktop é absoluto e fica atrás do texto. */}
        <div className="retrato-topo float-right -mr-5 mb-2 ml-3 h-[175px] w-[150px] md:-mr-8 lg:pointer-events-none lg:absolute lg:right-(--margem-v2) lg:bottom-0 lg:float-none lg:m-0 lg:aspect-square lg:h-auto lg:w-[min(620px,50%)]">
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
                tamanhos="(min-width: 1024px) 620px, 270px"
                largura={1080}
                altura={1080}
                prioridade
                className="luz-contorno absolute -top-2 left-[-62px] h-auto w-[270px] max-w-none lg:static lg:size-full lg:object-contain lg:object-bottom"
              />
            </div>
          )}
        </div>

        <div>
          <TopoTitulo variacoes={topo.variacoes} />
          <div className="lg:w-[82%]">
          {/* Celular: a captação ocupa a linha toda e, embaixo, o link da mentoria e o Papo reto dividem a linha. */}
          {/* Desktop: captação, mentoria e Papo reto numa linha só (os dois últimos são links de texto). */}
          <div className="relative z-1 clear-both mt-3 grid grid-cols-2 items-center gap-x-3 gap-y-1 sm:flex sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3 lg:mt-10 lg:flex-nowrap lg:gap-x-7">
            <Botao chamada={topo.chamadaPrincipal} className="max-sm:col-span-2 max-sm:py-2" />
            <Botao chamada={topo.chamadaSecundaria} variante="secundario" className="max-sm:py-1 max-sm:text-apoio" />
            <ConversaPapoReto variante="secundario" className="max-sm:justify-center max-sm:rounded-base max-sm:border max-sm:border-ouro-escuro max-sm:px-3 max-sm:py-1.5 max-sm:text-center max-sm:text-apoio max-sm:no-underline" />
          </div>
          {/* Linha de prova: filete dourado apagado acima e fatos lado a lado, sem etiquetas nem cartões. */}
          <ul className="relative z-1 mt-6 flex flex-wrap lg:w-[68%] gap-x-7 gap-y-1 border-t border-filete-ouro pt-4 text-legenda text-texto-2 lg:mt-14 lg:pt-5">
            {topo.prova.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
