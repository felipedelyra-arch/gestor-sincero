import type { Pagina } from "@content";
import { Cartao } from "../ui/Cartao";

type Par = Pagina["virada"]["comparativo"]["pares"][number];
type Props = Pagina["virada"]["comparativo"] & { rotulos: Pick<Pagina["rotulos"], "verTodos" | "verMenos"> };

// Quantos pares aparecem antes de "ver todos".
const VISIVEIS = 6;

// Alternância sem JavaScript: dois rádios nativos (teclado e leitor de tela de graça) e `:has()` no CSS.
const alternador =
  "relative flex min-h-12 flex-1 cursor-pointer items-center justify-center border-b-2 border-chumbo text-apoio font-medium text-texto-2 outline-offset-3 outline-texto transition-colors duration-200 has-[:checked]:border-ouro has-[:checked]:text-texto has-[:focus-visible]:outline-2";
const celula = "px-4 py-2.5 lg:px-6";
// tema estreito, as duas versões largas: cada linha cabe em até duas linhas de texto no desktop
const colunas = "lg:grid-cols-[1fr_1.6fr_1.6fr]";

/**
 * Tabela dos pares em um cartão. Desktop: as duas colunas lado a lado. Celular: alterna a coluna visível.
 * Mostra os 6 primeiros; o resto abre em `details` nativo. As listas `dl` continuam completas para leitor
 * de tela. Componente de servidor: não hidrata.
 */
export function Comparativo({ titulo, rotuloAnalogica, rotuloDigital, pares, rotulos }: Props) {
  const nomes = { analogica: rotuloAnalogica, digital: rotuloDigital };

  const linhas = (itens: Par[]) => (
    <dl>
      {itens.map((par) => (
        <div key={par.tema} className={`grid grid-cols-[2fr_3fr] border-t border-chumbo text-apoio ${colunas}`}>
          <dt className={`${celula} text-texto-2`}>{par.tema}</dt>
          <dd className={`${celula} max-lg:group-has-[input[value=digital]:checked]:sr-only`}>
            <span className="sr-only">{rotuloAnalogica}: </span>
            {par.analogica}
          </dd>
          <dd className={`${celula} font-medium text-texto max-lg:group-has-[input[value=analogica]:checked]:sr-only`}>
            <span className="sr-only">{rotuloDigital}: </span>
            {par.digital}
          </dd>
        </div>
      ))}
    </dl>
  );

  return (
    <Cartao respiro="p-0" className="group overflow-hidden">
      <h3 id="comparativo-titulo" className="px-4 pt-5 font-titulo text-h3 font-medium lg:px-6">
        {titulo}
      </h3>

      <fieldset aria-labelledby="comparativo-titulo" className="mt-2 flex gap-4 px-4 lg:hidden">
        {(["analogica", "digital"] as const).map((lado) => (
          <label key={lado} className={alternador}>
            <input
              type="radio"
              name="comparativo-lado"
              value={lado}
              defaultChecked={lado === "analogica"}
              className="sr-only"
            />
            {nomes[lado]}
          </label>
        ))}
      </fieldset>

      <div aria-hidden="true" className={`mt-3 hidden text-apoio font-medium lg:grid ${colunas}`}>
        <span />
        <span className="px-6 pb-2 text-texto-2">{rotuloAnalogica}</span>
        <span className="px-6 pb-2 text-ouro-claro">{rotuloDigital}</span>
      </div>

      <div className="max-lg:mt-3">{linhas(pares.slice(0, VISIVEIS))}</div>
      {pares.length > VISIVEIS && (
        <details className="group/mais border-t border-chumbo">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center text-apoio font-medium text-ouro-claro">
            <span className="group-open/mais:hidden">{rotulos.verTodos}</span>
            <span className="hidden group-open/mais:inline">{rotulos.verMenos}</span>
          </summary>
          {linhas(pares.slice(VISIVEIS))}
        </details>
      )}
    </Cartao>
  );
}
