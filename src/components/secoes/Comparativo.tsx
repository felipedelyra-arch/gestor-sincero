import type { Pagina } from "@content";

type Props = Pagina["virada"]["comparativo"];

// Alternância sem JavaScript: dois rádios nativos (teclado e leitor de tela de graça) e `:has()` no CSS.
const alternador =
  "relative flex min-h-12 flex-1 cursor-pointer items-center justify-center border-b-2 border-chumbo font-medium text-texto-2 outline-offset-3 outline-texto transition-colors duration-200 has-[:checked]:border-ouro has-[:checked]:text-texto has-[:focus-visible]:outline-2";
// Cada coluna carrega um fio: o motor que já existe (escuro) e o segundo motor (ouro).
const coluna = "border-l py-3 pl-4";

/**
 * Desktop: as duas colunas lado a lado. Celular: alterna a coluna visível.
 * A lista `dl` continua completa para leitor de tela nos dois casos. Componente de servidor: não hidrata.
 */
export function Comparativo({ titulo, rotuloAnalogica, rotuloDigital, pares }: Props) {
  const rotulos = { analogica: rotuloAnalogica, digital: rotuloDigital };

  return (
    <div className="group mt-12">
      <h3 id="comparativo-titulo" className="font-titulo text-h3 font-medium">
        {titulo}
      </h3>

      <fieldset aria-labelledby="comparativo-titulo" className="mt-6 flex gap-4 lg:hidden">
        {(["analogica", "digital"] as const).map((lado) => (
          <label key={lado} className={alternador}>
            <input
              type="radio"
              name="comparativo-lado"
              value={lado}
              defaultChecked={lado === "analogica"}
              className="sr-only"
            />
            {rotulos[lado]}
          </label>
        ))}
      </fieldset>

      <div aria-hidden="true" className="mt-8 hidden grid-cols-3 text-apoio text-texto-2 lg:grid">
        <span />
        <span className="pl-4">{rotuloAnalogica}</span>
        <span className="pl-4 text-ouro-claro">{rotuloDigital}</span>
      </div>

      <dl className="mt-4 border-t border-chumbo lg:mt-2">
        {pares.map((par) => (
          <div key={par.tema} className="grid grid-cols-[2fr_3fr] border-b border-chumbo lg:grid-cols-3">
            <dt className="py-3 pr-4 text-texto-2">{par.tema}</dt>
            <dd className={`${coluna} border-ouro-escuro max-lg:group-has-[input[value=digital]:checked]:sr-only`}>
              <span className="sr-only">{rotuloAnalogica}: </span>
              {par.analogica}
            </dd>
            <dd className={`${coluna} border-ouro font-medium max-lg:group-has-[input[value=analogica]:checked]:sr-only`}>
              <span className="sr-only">{rotuloDigital}: </span>
              {par.digital}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
