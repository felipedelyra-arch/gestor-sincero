import type { ReactNode } from "react";

const fundos = { preto: "", "preto-2": "bg-preto-2", marinho: "bg-marinho" } as const;

type Props = {
  id: string;
  titulo: string;
  fundo?: keyof typeof fundos;
  children?: ReactNode;
};

// `suppressHydrationWarning`: o GSAP escreve o estilo da revelação e pode chegar antes da hidratação.
/** Grade assimétrica: título nas colunas 1 a 4, corpo nas colunas 5 a 11. No celular, uma coluna. */
export function Secao({ id, titulo, fundo = "preto", children }: Props) {
  const idTitulo = `${id}-titulo`;
  return (
    <section id={id} aria-labelledby={idTitulo} className={`py-[calc(var(--espaco-secao)/2)] ${fundos[fundo]}`}>
      <div data-revela suppressHydrationWarning className="conteiner grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
        <h2 id={idTitulo} className="font-titulo text-h2 font-medium text-balance lg:col-span-4">
          {titulo}
        </h2>
        {children && <div className="max-w-texto min-w-0 lg:col-span-7 lg:col-start-5">{children}</div>}
      </div>
    </section>
  );
}
