"use client";

import { useState } from "react";
import type { Pagina } from "@content";

type Props = { titulo: string } & Pick<Pagina["espelho"], "itens" | "respostas">;

// A partir de quantos itens marcados a leitura passa de "poucos" para "muitos".
const MUITOS = 4;

/**
 * Itens marcáveis, um por linha, com filete e caixa quadrada simples, em duas colunas no desktop (lidas de cima para
 * baixo). A resposta aparece embaixo, em uma frase, só com pelo menos um item marcado, em região `aria-live`.
 */
export function EspelhoDaDorLista({ titulo, itens, respostas }: Props) {
  const [marcados, setMarcados] = useState<ReadonlySet<number>>(new Set());
  const n = marcados.size;
  const resposta = n === 0 ? "" : n < MUITOS ? respostas.poucos : respostas.muitos;

  const alternar = (i: number) =>
    setMarcados((atual) => {
      const novo = new Set(atual);
      if (!novo.delete(i)) novo.add(i);
      return novo;
    });

  return (
    <>
      <fieldset className="mt-12 lg:mt-16">
        <legend className="sr-only">{titulo}</legend>
        <ul
          style={{ "--linhas": Math.ceil(itens.length / 2) } as React.CSSProperties}
          className="border-b border-filete-ouro lg:grid lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[repeat(var(--linhas),auto)] lg:gap-x-16"
        >
          {itens.map((item, i) => (
            <li key={item} className="border-t border-filete-ouro">
              <label className="flex min-h-12 cursor-pointer items-start gap-4 py-4 text-lead">
                <input type="checkbox" checked={marcados.has(i)} onChange={() => alternar(i)} className="peer sr-only" />
                {/* caixa quadrada simples de 24px: vazia, ou preenchida em ouro quando marcada */}
                <span
                  aria-hidden="true"
                  className="mt-[0.2em] grid size-6 shrink-0 place-items-center border border-ouro-escuro outline-offset-2 outline-ouro transition-colors duration-200 peer-checked:border-ouro peer-checked:bg-ouro peer-focus-visible:outline-2 *:opacity-0 peer-checked:*:opacity-100"
                >
                  <svg viewBox="0 0 16 16" className="size-4 text-preto">
                    <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      {/* Sempre montada (para o leitor de tela anunciar); só tem texto com algum item marcado. */}
      <div role="status" aria-live="polite" aria-atomic="true" className="mt-10 max-w-[680px] text-lead empty:hidden">
        {resposta && <p>{resposta}</p>}
      </div>
    </>
  );
}
