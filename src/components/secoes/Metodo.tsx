import type { CSSProperties } from "react";
import { pagina } from "@content";

// Etapas por linha: até 4 numa linha só; acima disso, duas linhas iguais (6 etapas = 3 + 3).
const colunasDe = (n: number) => (n <= 4 ? n : Math.ceil(n / 2));

/**
 * S7. Cada pilar em largura cheia: nome e descrição na cabeça, etapas numeradas (1 a 10, em ouro) numa grade regular
 * abaixo. Pilar de 4 etapas = 4 em linha; pilar de 6 = 3 + 3. Os dois pilares usam as mesmas bordas da grade.
 */
export function Metodo() {
  const { titulo, introducao, pilares } = pagina.metodo;
  return (
    <section id="metodo" aria-labelledby="metodo-titulo" className="py-(--sec-media)">
      <div className="conteiner-v2">
        <header data-revela data-desloca suppressHydrationWarning className="max-w-[680px]">
          <h2 id="metodo-titulo" className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          <p className="mt-5 text-lead">{introducao}</p>
        </header>

        <div className="mt-14 grid gap-16 lg:mt-20 lg:gap-24">
          {pilares.map((pilar) => (
            <div key={pilar.nome}>
              <div className="grid gap-3 border-t border-ouro-escuro pt-6 lg:grid-cols-12 lg:gap-x-8">
                <h3 className="font-titulo text-sub font-medium lg:col-span-4">{pilar.nome}</h3>
                <p className="max-w-[52ch] lg:col-span-8">{pilar.descricao}</p>
              </div>
              <ol
                start={pilar.etapas[0].numero}
                style={{ "--colunas": colunasDe(pilar.etapas.length) } as CSSProperties}
                className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-12 lg:gap-y-12 lg:[grid-template-columns:repeat(var(--colunas),minmax(0,1fr))]"
              >
                {pilar.etapas.map((etapa) => (
                  <li key={etapa.numero} className="border-t border-filete-ouro pt-5">
                    <span aria-hidden="true" className="font-titulo text-numeracao font-normal text-ouro tabular-nums">
                      {etapa.numero}
                    </span>
                    <h4 className="mt-3 font-titulo text-sub font-medium text-balance">{etapa.nome}</h4>
                    <p className="mt-2">{etapa.descricao}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
