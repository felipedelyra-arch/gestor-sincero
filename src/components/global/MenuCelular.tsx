"use client";

import type { MouseEvent } from "react";

type Props = { rotulo: string; itens: { rotulo: string; ancora: string }[] };

/** Menu recolhido do celular em `details` nativo. O único script é fechar o menu ao escolher uma âncora. */
export function MenuCelular({ rotulo, itens }: Props) {
  const fechar = (e: MouseEvent<HTMLAnchorElement>) => e.currentTarget.closest("details")?.removeAttribute("open");
  return (
    <details className="group lg:hidden">
      <summary
        aria-label={rotulo}
        className="flex size-12 cursor-pointer list-none items-center justify-center rounded-base"
      >
        {/* três traços; o do meio some quando o menu abre */}
        <span aria-hidden="true" className="relative block h-3.5 w-6 border-y border-texto">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-texto group-open:opacity-0" />
        </span>
      </summary>
      <nav aria-label={rotulo} className="absolute inset-x-0 top-full h-[calc(100dvh-var(--altura-cabecalho))] overflow-y-auto border-b border-chumbo bg-preto">
        <ul className="conteiner-v2 py-4">
          {itens.map((item) => (
            <li key={item.ancora}>
              <a href={item.ancora} onClick={fechar} className="flex min-h-14 items-center border-b border-filete-ouro text-sub font-medium">
                {item.rotulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
