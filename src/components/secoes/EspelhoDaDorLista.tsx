"use client";

import { useState } from "react";
import type { Pagina } from "@content";
import { CaixaDeMarcar } from "../ui/CaixaDeMarcar";

type Props = Pick<Pagina["espelho"], "introducao" | "itens" | "contador" | "respostas">;

// A partir de quantos itens marcados a leitura passa de "poucos" para "muitos".
const MUITOS = 4;

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
        <legend className="mb-4 text-texto-2">{introducao}</legend>
        <ul className="divide-y divide-chumbo border-y border-chumbo">
          {itens.map((item, i) => (
            <li key={item}>
              <CaixaDeMarcar rotulo={item} checked={marcados.has(i)} onChange={() => alternar(i)} />
            </li>
          ))}
        </ul>
      </fieldset>
      <div role="status" aria-live="polite" aria-atomic="true" className="mt-8">
        <p className="text-apoio text-ouro-claro tabular-nums">
          {contador.replace("{n}", String(n)).replace("{total}", String(itens.length))}
        </p>
        <p className="mt-2 font-titulo text-h3">{resposta}</p>
      </div>
    </>
  );
}
