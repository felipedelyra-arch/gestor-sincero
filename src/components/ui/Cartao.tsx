import type { ReactNode } from "react";

const fundos = { "preto-2": "bg-preto-2", preto: "bg-preto", marinho: "bg-marinho" } as const;

type Props = {
  children: ReactNode;
  /** `preto-2` sobre seção preta; `preto` sobre seção marinho. */
  fundo?: keyof typeof fundos;
  /** Respiro interno; o padrão é 24px. */
  respiro?: string;
  className?: string;
};

/** Cartão da v2: borda de 1px em chumbo, raio de 12px, sem sombra. */
export function Cartao({ children, fundo = "preto-2", respiro = "p-6", className = "" }: Props) {
  return <div className={`rounded-cartao border border-chumbo ${fundos[fundo]} ${respiro} ${className}`}>{children}</div>;
}
