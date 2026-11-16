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

/** Bloco que abre e fecha (details nativo). O `name` igual faz abrir um fechar os outros. */
function Bloco({ titulo, aberto = false, children }: { titulo: string; aberto?: boolean; children: ReactNode }) {
  return (
    <details name="ressonancia-blocos" open={aberto} className="group rounded-cartao border border-chumbo bg-preto">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-cartao px-5 lg:px-6">
        <h3 className="font-titulo text-h3 font-medium">{titulo}</h3>
        <SinalAbrir />
      </summary>
      <div className="px-5 pb-5 lg:px-6 lg:pb-6">{children}</div>
    </details>
  );
}

/** 10. O diagnóstico: texto e capa; fases, entregas e etapas em blocos que abrem; prévia em carrossel e o pedido. */
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
              <p key={p} className="text-pretty">
                {p}
              </p>
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

      <div className="mt-8 grid gap-3">
        <Bloco titulo={r.tituloFases} aberto>
          <ol className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <Bloco titulo={r.tituloEntregas}>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {r.entregas.map((entrega) => (
              <div key={entrega.nome} className="rounded-cartao border border-chumbo p-4">
                <dt className="font-medium">{entrega.nome}</dt>
                <dd className="mt-1 text-apoio text-texto-2">{entrega.descricao}</dd>
              </div>
            ))}
          </dl>
        </Bloco>

        <Bloco titulo={r.tituloEtapas}>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        {/* A prévia acompanha a rolagem enquanto o formulário, mais alto, passa ao lado. */}
        <div className="min-w-0 lg:sticky lg:top-24">
          <h3 id="ressonancia-previa" className="font-titulo text-h3 font-medium">
            {r.previa.titulo}
          </h3>
          <p className="mt-1 text-apoio text-ouro-claro">{r.previa.selo}</p>
          <Carrossel idRotulo="ressonancia-previa" anterior={anterior} proximo={proximo} className="mt-4">
            {r.previa.slides.map((slide) => (
              <li key={slide.arquivo} className={`${trilhoItem} lg:w-full`}>
                <figure>
                  <Imagem
                    nome={slide.arquivo}
                    alt={slide.legenda}
                    tamanhos="(min-width: 1024px) 580px, 85vw"
                    largura={1280}
                    altura={720}
                    className="w-full rounded-cartao"
                  />
                  <figcaption className="mt-3 text-apoio text-texto-2">
                    {slide.legenda}
                    <span className="block text-ouro-claro">{r.previa.selo}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </Carrossel>
        </div>

        <div id={ID_PEDIDO} className="min-w-0">
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
