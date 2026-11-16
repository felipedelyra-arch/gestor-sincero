import type { ReactNode } from "react";
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

const ID_PEDIDO = "ressonancia-pedido";

/**
 * Bloco que abre e fecha (details nativo). No celular nasce fechado. A partir de 1024px, com `desktopAberto`, o
 * conteúdo fica sempre à vista (`aberto-no-desktop`, em globals.css) e o resumo deixa de ser botão.
 */
function Bloco({ titulo, children, desktopAberto = true }: { titulo: string; children: ReactNode; desktopAberto?: boolean }) {
  return (
    <details className={`group ${desktopAberto ? "aberto-no-desktop" : ""} rounded-cartao border border-chumbo bg-preto`}>
      <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-cartao px-5 lg:px-6 ${desktopAberto ? "lg:cursor-default" : ""}`}>
        <h3 className="font-titulo text-h3 font-medium">{titulo}</h3>
        <SinalAbrir className={desktopAberto ? "lg:hidden" : ""} />
      </summary>
      <div className="px-5 pb-5 lg:px-6 lg:pb-6">{children}</div>
    </details>
  );
}

/** 10. O diagnóstico: texto e capa; fases em cima; prévia, entregas e etapas à esquerda do pedido, que fica à direita. */
export function Ressonancia() {
  const r = pagina.ressonancia;
  const { anterior, proximo } = pagina.rotulos;
  return (
    <Secao id="ressonancia" titulo={r.titulo} fundo="marinho">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="font-titulo text-manifesto font-medium text-balance">{r.analogia}</p>
          <div className="mt-5 grid gap-4">
            {r.paragrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {/* A chamada leva direto ao pedido, no fim da seção. */}
          <a href={`#${ID_PEDIDO}`} className={`${estilosBotao.principal} mt-6`}>
            {r.chamada.rotulo}
          </a>
        </div>
        <Imagem
          nome="capa-ressonancia"
          alt={r.altCapa}
          tamanhos="(min-width: 1024px) 580px, 100vw"
          largura={1600}
          altura={1131}
          className="w-full rounded-cartao"
        />
      </div>

      <div className="mt-6">
        <Bloco titulo={r.tituloFases}>
          {/* Celular e tablet: letra e nome; a descrição abre no toque. */}
          <ol className="grid gap-x-8 sm:grid-cols-2 lg:hidden">
            {r.fases.map((fase) => (
              <li key={fase.letra} className="border-t border-chumbo first:border-t-0 sm:[&:nth-child(2)]:border-t-0">
                <details className="group">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3">
                    <span aria-hidden="true" className="w-[1.5ch] shrink-0 font-titulo font-medium text-ouro">
                      {fase.letra}
                    </span>
                    <h4 className="flex-1 font-medium">{fase.nome}</h4>
                    <SinalAbrir />
                  </summary>
                  <p className="pb-3 pl-[calc(1.5ch+12px)] text-apoio text-texto-2">{fase.descricao}</p>
                </details>
              </li>
            ))}
          </ol>
          {/* Desktop: grade 3x3 com tudo à vista. */}
          <ol className="hidden gap-x-8 gap-y-4 lg:grid lg:grid-cols-3">
            {r.fases.map((fase) => (
              <li key={fase.letra} className="flex gap-3">
                <span aria-hidden="true" className="w-[1.5ch] shrink-0 font-titulo font-medium text-ouro">
                  {fase.letra}
                </span>
                <div>
                  <h4 className="font-medium">{fase.nome}</h4>
                  <p className="text-apoio text-texto-2">{fase.descricao}</p>
                </div>
              </li>
            ))}
          </ol>
        </Bloco>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-12 lg:gap-12">
        {/* minmax(0,1fr): a fileira que rola não pode alargar a coluna */}
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 lg:col-span-5">
          <div className="mb-2">
            <h3 id="ressonancia-previa" className="font-titulo text-h3 font-medium">
              {r.previa.titulo}
            </h3>
            <p className="mt-1 text-apoio text-ouro-claro">{r.previa.selo}</p>
            <Carrossel idRotulo="ressonancia-previa" anterior={anterior} proximo={proximo} className="mt-4">
              {r.previa.slides.map((slide) => (
                <li key={slide.arquivo} className={`${trilhoItem} lg:w-full`}>
                  <figure>
                    {/* o selo de simulação já está desenhado dentro da imagem e escrito acima */}
                    <Imagem
                      nome={slide.arquivo}
                      alt={slide.legenda}
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
          </div>

          <Bloco titulo={r.tituloEntregas} desktopAberto={false}>
            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {r.entregas.map((entrega) => (
                <div key={entrega.nome} className="rounded-cartao border border-chumbo p-4">
                  <dt className="font-medium">{entrega.nome}</dt>
                  <dd className="mt-1 text-apoio text-texto-2">{entrega.descricao}</dd>
                </div>
              ))}
            </dl>
          </Bloco>

          <Bloco titulo={r.tituloEtapas}>
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {r.etapas.map((etapa, i) => (
                <li key={etapa.nome} className="border-t border-ouro pt-3">
                  <h4 className="flex gap-2 font-medium">
                    <span aria-hidden="true" className="font-titulo text-ouro tabular-nums">
                      {i + 1}
                    </span>
                    {etapa.nome}
                  </h4>
                  <p className="mt-1 text-apoio text-texto-2">{etapa.descricao}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-ouro-claro">{r.prazo}</p>
          </Bloco>
        </div>

        <div id={ID_PEDIDO} className="min-w-0 lg:col-span-7">
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
    </Secao>
  );
}
