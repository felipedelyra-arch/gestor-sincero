"use client";

import { useState } from "react";
import type { Pagina } from "@content";

type Props = Pagina["virada"]["comparativo"];
type Lado = "analogica" | "digital";

const alternador =
  "min-h-12 flex-1 border-b-2 border-chumbo font-medium text-texto-2 transition-colors duration-200 aria-pressed:border-ouro aria-pressed:text-texto";
// Cada coluna carrega um fio: o motor que já existe (escuro) e o segundo motor (ouro).
const coluna = "border-l py-3 pl-4";

/**
 * Desktop: as duas colunas lado a lado. Celular: alterna a coluna visível.
 * A lista `dl` continua completa para leitor de tela nos dois casos.
 */
export function Comparativo({ titulo, rotuloAnalogica, rotuloDigital, pares }: Props) {
  const [lado, setLado] = useState<Lado>("analogica");
  const rotulos = { analogica: rotuloAnalogica, digital: rotuloDigital };

  return (
    <div className="mt-12">
      <h3 id="comparativo-titulo" className="font-titulo text-h3 font-medium">
        {titulo}
      </h3>

      <div role="group" aria-labelledby="comparativo-titulo" className="mt-6 flex gap-4 lg:hidden">
        {(["analogica", "digital"] as const).map((l) => (
          <button key={l} type="button" aria-pressed={lado === l} onClick={() => setLado(l)} className={alternador}>
            {rotulos[l]}
          </button>
        ))}
      </div>

      <div aria-hidden="true" className="mt-8 hidden grid-cols-3 text-apoio text-texto-2 lg:grid">
        <span />
        <span className="pl-4">{rotuloAnalogica}</span>
        <span className="pl-4 text-ouro-claro">{rotuloDigital}</span>
      </div>

      <dl data-lado={lado} className="group mt-4 border-t border-chumbo lg:mt-2">
        {pares.map((par) => (
          <div key={par.tema} className="grid grid-cols-[2fr_3fr] border-b border-chumbo lg:grid-cols-3">
            <dt className="py-3 pr-4 text-texto-2">{par.tema}</dt>
            <dd className={`${coluna} border-ouro-escuro max-lg:group-data-[lado=digital]:sr-only`}>
              <span className="sr-only">{rotuloAnalogica}: </span>
              {par.analogica}
            </dd>
            <dd className={`${coluna} border-ouro font-medium max-lg:group-data-[lado=analogica]:sr-only`}>
              <span className="sr-only">{rotuloDigital}: </span>
              {par.digital}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
