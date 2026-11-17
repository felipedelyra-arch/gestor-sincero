import type { CSSProperties } from "react";
import { pagina } from "@content";

/**
 * S7. Linha do tempo de 1 a 10. Desktop (a partir de 1280px): linha dourada fina horizontal com 10 marcos, número em
 * serifa sobre cada marco, nome e descrição embaixo; acima, duas faixas dizem a que pilar cada trecho pertence.
 * Telas menores: a mesma linha na vertical, com a faixa do pilar antes da primeira etapa dele.
 */
export function Metodo() {
  const { titulo, introducao, pilares } = pagina.metodo;
  const total = pilares.reduce((n, p) => n + p.etapas.length, 0);
  // coluna inicial de cada pilar na grade de 10 (1 e 5): a soma das etapas dos pilares anteriores + 1
  const faixas = pilares.map((p, i) => ({
    pilar: p,
    inicio: pilares.slice(0, i).reduce((n, q) => n + q.etapas.length, 0) + 1,
    largura: p.etapas.length,
  }));
  const rotuloFaixa = (nome: string, rotulo?: string) => (rotulo ? `${nome} · ${rotulo}` : nome);

  return (
    <section id="metodo" aria-labelledby="metodo-titulo" className="py-12 lg:py-16">
      <div className="conteiner-v2">
        <header data-revela data-desloca suppressHydrationWarning className="max-w-[680px]">
          <h2 id="metodo-titulo" className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          <p className="mt-5 text-lead">{introducao}</p>
        </header>

        {/* faixas dos pilares (desktop): cobrem as etapas 1 a 4 e 5 a 10 da linha abaixo */}
        <div
          style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
          className="mt-14 hidden gap-x-2 xl:grid"
        >
          {faixas.map(({ pilar, inicio, largura }) => (
            <p
              key={pilar.nome}
              style={{ gridColumn: `${inicio} / span ${largura}` }}
              className="border-t-2 border-ouro bg-preto-2 px-4 py-3 font-titulo font-medium"
            >
              {rotuloFaixa(pilar.nome, pilar.rotulo)}
            </p>
          ))}
        </div>

        <ol
          style={{ "--n": total } as CSSProperties}
          className="mt-12 xl:mt-8 xl:grid xl:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
        >
          {faixas.flatMap(({ pilar }) =>
            pilar.etapas.map((etapa, i) => (
              <li key={etapa.numero} className="group">
                {/* faixa do pilar na vertical: abre cada grupo no celular e no tablet */}
                {i === 0 && (
                  <p className="mt-2 mb-6 border-t-2 border-ouro bg-preto-2 px-4 py-3 font-titulo font-medium xl:hidden">
                    {rotuloFaixa(pilar.nome, pilar.rotulo)}
                  </p>
                )}
                {/* linha dourada (vertical no celular, horizontal no desktop) e o marco sobre ela */}
                <div className="relative pb-8 pl-12 before:absolute before:top-5 before:bottom-0 before:left-[5px] before:w-px before:bg-ouro-escuro group-last:before:hidden xl:pb-0 xl:pl-0 xl:before:top-[73px] xl:before:right-0 xl:before:bottom-auto xl:before:left-0 xl:before:h-px xl:before:w-auto xl:group-last:before:block">
                  <span aria-hidden="true" className="absolute top-[14px] left-0 size-[11px] rounded-full bg-ouro xl:top-[68px]" />
                  <span aria-hidden="true" className="block font-manifesto text-[2.222rem] leading-none text-ouro tabular-nums xl:text-[3.111rem]">
                    {etapa.numero}
                  </span>
                  <h3 className="mt-2 pr-3 font-titulo text-[1.056rem] leading-[1.2] font-medium xl:mt-10 xl:pr-1 xl:text-[0.889rem] xl:tracking-[-0.01em] xl:hyphens-auto">{etapa.nome}</h3>
                  <p className="mt-1 pr-3 text-corpo text-pretty xl:mt-2 xl:text-legenda">{etapa.descricao}</p>
                </div>
              </li>
            )),
          )}
        </ol>
      </div>
    </section>
  );
}
