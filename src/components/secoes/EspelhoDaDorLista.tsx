"use client";

import { useState } from "react";
import type { Pagina } from "@content";
import { CaixaDeMarcar } from "../ui/CaixaDeMarcar";

type Props = Pick<Pagina["espelho"], "introducao" | "itens" | "contador" | "respostas">;

// A partir de quantos itens marcados a leitura passa de "poucos" para "muitos".
const MUITOS = 4;

// Cada item é um cartão marcável: a borda vira ouro quando marcado.
const cartao =
  "h-full rounded-cartao border border-chumbo bg-preto p-4 text-apoio transition-colors duration-200 has-[:checked]:border-ouro";

export function EspelhoDaDorLista({ introducao, itens, contador, respostas }: Props) {
  const [marcados, setMarcados] = useState<ReadonlySet<number>>(new Set());
  const n = marcados.size;
  const resposta = n === 0 ? respostas.nenhum : n < MUITOS ? respostas.poucos : respostas.muitos;

  const alternar = (i: number) =>
    setMarcados((atual) => {
      const novo = new Set(atual);
      if (!novo.delete(i)) novo.add(i);
      return novo;
    });

  return (
    <>
      <fieldset>
        {/* a introdução visível é a linha de apoio da seção; aqui ela nomeia o grupo */}
        <legend className="sr-only">{introducao}</legend>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {itens.map((item, i) => (
            <li key={item}>
              <CaixaDeMarcar rotulo={item} checked={marcados.has(i)} onChange={() => alternar(i)} className={cartao} />
            </li>
          ))}
        </ul>
      </fieldset>
      <div role="status" aria-live="polite" aria-atomic="true" className="mx-auto mt-8 max-w-texto text-center">
        <p className="text-apoio text-ouro-claro tabular-nums">
          {contador.replace("{n}", String(n)).replace("{total}", String(itens.length))}
        </p>
        <p className="mt-2 text-pretty">{resposta}</p>
      </div>
    </>
  );
}
