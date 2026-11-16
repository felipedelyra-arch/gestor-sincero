import { pagina } from "@content";
import { site } from "@config/site";
import { camposRessonancia } from "../formulario/campos";
import { FormularioTardio } from "../formulario/FormularioTardio";
import { Carrossel } from "../ui/Carrossel";
import { Cartao } from "../ui/Cartao";
import { estilosBotao, trilhoItem } from "../ui/estilos";
import { Imagem } from "../ui/Imagem";
import { Secao } from "../ui/Secao";
import { SinalAbrir } from "../ui/SinalAbrir";

const ID_PEDIDO = "pedido";

/** Conteúdo da página /ressonancia: o diagnóstico inteiro, do que é ao pedido, em seções de leitura. */
export function RessonanciaPagina() {
  const r = pagina.ressonancia;
  const { anterior, proximo } = pagina.rotulos;
  return (
    <>
      {/* Abertura: título, analogia, texto e a chamada; a capa ao lado. */}
      <section aria-labelledby="ressonancia-h1" className="py-(--espaco-secao)">
        <div className="conteiner grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h1 id="ressonancia-h1" className="font-titulo text-h1 font-medium text-balance">
              {r.titulo}
            </h1>
            <p className="mt-4 font-titulo text-h3 text-balance">{r.analogia}</p>
            <div className="mt-4 grid gap-3 text-texto-2">
              {r.paragrafos.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <a href={`#${ID_PEDIDO}`} className={`${estilosBotao.principal} mt-6`}>
              {r.chamada.rotulo}
            </a>
          </div>
          <Imagem
            nome="capa-ressonancia"
            alt={r.altCapa}
            tamanhos="(min-width: 1024px) 560px, 100vw"
            largura={1600}
            altura={1131}
            prioridade
            className="w-full rounded-cartao"
          />
        </div>
      </section>

      <Secao id="fases" titulo={r.tituloFases} fundo="marinho">
        {/* Celular: letra e nome, a descrição abre no toque. Desktop: grade 3x3 de cartões. */}
        <ol className="grid gap-x-8 sm:grid-cols-2 lg:hidden">
          {r.fases.map((fase) => (
            <li key={fase.letra} className="border-t border-chumbo first:border-t-0 sm:[&:nth-child(2)]:border-t-0">
              <details className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3">
                  <span aria-hidden="true" className="w-[1.5ch] shrink-0 font-titulo font-medium text-ouro">
                    {fase.letra}
                  </span>
                  <h3 className="flex-1 font-medium">{fase.nome}</h3>
                  <SinalAbrir />
                </summary>
                <p className="pb-3 pl-[calc(1.5ch+12px)] text-apoio text-texto-2">{fase.descricao}</p>
              </details>
            </li>
          ))}
        </ol>
        <ol className="hidden gap-4 lg:grid lg:grid-cols-3">
          {r.fases.map((fase) => (
            <li key={fase.letra}>
              <Cartao fundo="preto" className="h-full">
                <span aria-hidden="true" className="font-titulo text-numero font-medium text-ouro">
                  {fase.letra}
                </span>
                <h3 className="mt-1 font-titulo text-h3 font-medium">{fase.nome}</h3>
                <p className="mt-2 text-apoio text-texto-2">{fase.descricao}</p>
              </Cartao>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao id="entregas" titulo={r.tituloEntregas}>
        {/* 5 cartões: 3 em cima e 2 embaixo, centralizados */}
        <ul className="flex flex-wrap justify-center gap-3 lg:gap-4">
          {r.entregas.map((entrega) => (
            <li key={entrega.nome} className="w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-11px)]">
              <Cartao className="h-full">
                <h3 className="font-titulo text-h3 font-medium">{entrega.nome}</h3>
                <p className="mt-2 text-apoio text-texto-2">{entrega.descricao}</p>
              </Cartao>
            </li>
          ))}
        </ul>
      </Secao>

      <Secao id="etapas" titulo={r.tituloEtapas} fundo="marinho">
        {/* sequência real: a numeração das 4 etapas faz sentido aqui */}
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {r.etapas.map((etapa, i) => (
            <li key={etapa.nome}>
              <Cartao fundo="preto" className="h-full border-t-ouro">
                <span aria-hidden="true" className="font-titulo text-numero font-medium text-ouro tabular-nums">
                  {i + 1}
                </span>
                <h3 className="mt-1 font-titulo text-h3 font-medium">{etapa.nome}</h3>
                <p className="mt-2 text-apoio text-texto-2">{etapa.descricao}</p>
              </Cartao>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-center font-titulo text-h3 text-ouro-claro">{r.prazo}</p>
      </Secao>

      <Secao id="previa" titulo={r.previa.titulo} apoio={r.previa.selo}>
        <Carrossel idRotulo="previa-titulo" anterior={anterior} proximo={proximo}>
          {r.previa.slides.map((slide) => (
            <li key={slide.arquivo} className={`${trilhoItem} lg:w-[calc(50%-6px)]`}>
              <figure>
                {/* o selo de simulação já está desenhado dentro da imagem e escrito acima */}
                <Imagem
                  nome={slide.arquivo}
                  alt="" // a legenda logo abaixo já descreve o slide (alt repetido é redundante)
                  tamanhos="(min-width: 1024px) 580px, 85vw"
                  largura={1280}
                  altura={720}
                  className="w-full rounded-cartao"
                />
                <figcaption className="mt-3 text-apoio text-texto-2">{slide.legenda}</figcaption>
              </figure>
            </li>
          ))}
        </Carrossel>
      </Secao>

      <section id={ID_PEDIDO} className="bg-marinho py-(--espaco-secao)">
        <div className="conteiner">
          <div className="mx-auto max-w-[800px]">
            <Cartao fundo="preto">
              <FormularioTardio
                formulario={r.formulario}
                campos={camposRessonancia}
                rota="ressonancia"
                turnstileSiteKey={site.turnstileSiteKey}
              />
            </Cartao>
          </div>
        </div>
      </section>
    </>
  );
}
