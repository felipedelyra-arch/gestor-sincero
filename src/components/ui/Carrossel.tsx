"use client";

import { useRef, type ReactNode } from "react";
import { trilho } from "./estilos";

type Props = {
  /** Id do título que nomeia a fileira. */
  idRotulo: string;
  /** Rótulos dos botões (pagina.rotulos). */
  anterior: string;
  proximo: string;
  /** Os `<li>` da fileira, renderizados no servidor. */
  children: ReactNode;
  className?: string;
};

const botao =
  "flex size-12 items-center justify-center rounded-base border border-chumbo text-texto transition-colors duration-200 hover:border-ouro-escuro";

/** Carrossel com scroll-snap nativo. O único script são os dois botões, que rolam um item por vez. */
export function Carrossel({ idRotulo, anterior, proximo, children, className = "" }: Props) {
  const fileira = useRef<HTMLUListElement>(null);

  const rolar = (sentido: 1 | -1) => {
    const el = fileira.current;
    if (!el) return;
    const passo = el.firstElementChild?.getBoundingClientRect().width ?? el.clientWidth;
    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: sentido * (passo + 12), behavior: suave ? "smooth" : "auto" });
  };

  return (
    <div className={className}>
      <ul ref={fileira} tabIndex={0} aria-labelledby={idRotulo} className={trilho}>
        {children}
      </ul>
      <div className="mt-2 flex gap-2">
        {([-1, 1] as const).map((sentido) => (
          <button key={sentido} type="button" aria-label={sentido < 0 ? anterior : proximo} onClick={() => rolar(sentido)} className={botao}>
            <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-4 ${sentido < 0 ? "rotate-180" : ""}`}>
              <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
