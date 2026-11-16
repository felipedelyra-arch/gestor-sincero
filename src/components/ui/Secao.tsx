import type { ReactNode } from "react";

const fundos = { preto: "", "preto-2": "bg-preto-2", marinho: "bg-marinho" } as const;

type Props = {
  id: string;
  titulo: string;
  /** Rótulo pequeno em dourado acima do título (opcional). */
  rotulo?: string;
  /** Linha de apoio abaixo do título. */
  apoio?: string;
  fundo?: keyof typeof fundos;
  /** Corpo em coluna de leitura (800px) em vez das 12 colunas. */
  estreito?: boolean;
  children?: ReactNode;
};

/** Cabeça centralizada (rótulo opcional, h2, linha de apoio) e corpo na largura do contêiner de 1200px. */
// `suppressHydrationWarning`: `Revelacao` escreve data-oculto e pode chegar antes da hidratação da seção.
export function Secao({ id, titulo, rotulo, apoio, fundo = "preto", estreito = false, children }: Props) {
  const idTitulo = `${id}-titulo`;
  return (
    <section id={id} aria-labelledby={idTitulo} className={`py-(--espaco-secao) ${fundos[fundo]}`}>
      <div data-revela suppressHydrationWarning className="conteiner">
        <header className="mx-auto max-w-[800px] text-center">
          {rotulo && <p className="mb-2 text-apoio font-medium text-ouro-claro">{rotulo}</p>}
          <h2 id={idTitulo} className="font-titulo text-h2 font-medium text-balance">
            {titulo}
          </h2>
          {apoio && <p className="mx-auto mt-3 max-w-texto text-pretty text-texto-2">{apoio}</p>}
        </header>
        {children && <div className={`mt-8 lg:mt-12 ${estreito ? "mx-auto max-w-[800px]" : ""}`}>{children}</div>}
      </div>
    </section>
  );
}
