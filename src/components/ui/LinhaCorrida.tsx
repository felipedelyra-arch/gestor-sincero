import { Fragment } from "react";

/** Nomes em linha corrida, separados por ponto médio. */
export function LinhaCorrida({ itens, className = "" }: { itens: string[]; className?: string }) {
  return (
    <p className={className}>
      {itens.map((item, i) => (
        // o separador acompanha o item anterior (nunca começa uma linha), os nomes curtos ficam inteiros (os longos podem quebrar), e o espaço
        // depois do separador é onde a linha pode quebrar
        <Fragment key={item}>
          <span className={item.length > 30 ? "" : "whitespace-nowrap"}>
            {item}
            {i < itens.length - 1 && (
              <span aria-hidden="true" className="pl-2 text-ouro">
                ·
              </span>
            )}
          </span>{" "}
        </Fragment>
      ))}
    </p>
  );
}
