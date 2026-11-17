import Link from "next/link";
import { pagina } from "@content";
import { site } from "@config/site";
import { estilosBotao } from "../ui/estilos";
import { Imagem } from "../ui/Imagem";

/**
 * S10. Resumo da Ressonância: a arte bem maior, sangrando até a borda direita da janela, e o texto com o botão ao
 * lado, sobre o lado escuro. No celular a arte ocupa a largura toda, abaixo do texto.
 */
export function Ressonancia() {
  const r = pagina.ressonancia;
  const [abertura, ...demais] = r.resumo.linhas;
  return (
    <section id="ressonancia" aria-labelledby="ressonancia-titulo" className="relative isolate overflow-hidden py-(--sec-curta) lg:min-h-[560px]">
      <div className="conteiner-v2 relative z-1 lg:flex lg:min-h-[432px] lg:items-center">
        <div data-revela suppressHydrationWarning className="lg:w-[40%]">
          <h2 id="ressonancia-titulo" className="font-titulo text-secao font-medium text-balance">
            {r.titulo}
          </h2>
          <p className="mt-6 text-lead">{abertura}</p>
          {demais.map((linha) => (
            <p key={linha} className="mt-4">
              {linha}
            </p>
          ))}
          <Link href={site.links.ressonancia} className={`${estilosBotao.principal} mt-8`}>
            {r.resumo.rotuloBotao}
          </Link>
        </div>
      </div>
      <div className="relative mt-10 lg:absolute lg:inset-y-0 lg:right-0 lg:z-0 lg:mt-0 lg:w-[58%]">
        <Imagem
          nome="capa-ressonancia"
          alt={r.altCapa}
          tamanhos="(min-width: 1024px) 58vw, 100vw"
          largura={1600}
          altura={1131}
          className="aspect-1600/1131 w-full object-cover lg:aspect-auto lg:size-full"
        />
        {/* a base escura da arte funde com o fundo da página: preto transparente até preto, só no lado do texto */}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-1/4 bg-linear-to-r from-preto to-transparent lg:block" />
      </div>
    </section>
  );
}
