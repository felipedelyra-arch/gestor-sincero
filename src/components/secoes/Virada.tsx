import { pagina } from "@content";

// Cabeçalho de coluna e rótulo do par no celular: versalete pequeno.
const versalete = "text-cabtab font-medium tracking-[0.06em] [font-variant-caps:all-small-caps]";
// No celular a tabela vira blocos: cada par fica em duas linhas empilhadas, sem rolagem lateral.
const bloco = "max-md:block";

/**
 * S5. Texto em coluna de leitura e, abaixo, a tabela editorial em largura total com os 17 pares sempre visíveis.
 * `<table>` semântica (com papéis explícitos para continuar como tabela quando vira bloco no celular), sem JavaScript.
 */
export function Virada() {
  const { titulo, paragrafos, comparativo: c } = pagina.virada;
  return (
    <section id="virada" aria-labelledby="virada-titulo" className="py-(--sec-ampla)">
      <div className="conteiner-v2">
        <div data-revela suppressHydrationWarning className="max-w-[680px]">
          <h2 id="virada-titulo" className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          <div className="mt-8 grid gap-6 text-lead">
            {paragrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <table role="table" className={`mt-16 w-full border-collapse border-b border-filete-ouro text-left lg:mt-24 ${bloco}`}>
          <caption className="mb-6 text-left font-titulo text-sub font-medium max-md:block max-md:w-full">{c.titulo}</caption>
          <thead role="rowgroup" className="max-md:sr-only">
            <tr role="row">
              {/* canto vazio: a primeira coluna só traz o tema de cada linha */}
              <td role="cell" className="w-[26%] pb-3" />
              <th role="columnheader" scope="col" className={`w-[37%] pr-8 pb-3 text-texto-2 ${versalete}`}>
                {c.rotuloAnalogica}
              </th>
              <th role="columnheader" scope="col" className={`w-[37%] pb-3 text-texto ${versalete}`}>
                {c.rotuloDigital}
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup" className={bloco}>
            {c.pares.map((par) => (
              <tr key={par.tema} role="row" className={`border-t border-filete-ouro ${bloco} max-md:py-5`}>
                <th role="rowheader" scope="row" className={`py-5 pr-8 align-top font-medium text-texto ${bloco} max-md:pt-0 max-md:pb-2`}>
                  {par.tema}
                </th>
                <td
                  role="cell"
                  data-rotulo={c.rotuloAnalogica}
                  className={`py-5 pr-8 align-top text-texto-2 ${bloco} max-md:py-1 max-md:before:block max-md:before:content-[attr(data-rotulo)] max-md:before:font-medium max-md:before:tracking-[0.06em] max-md:before:[font-variant-caps:all-small-caps]`}
                >
                  {par.analogica}
                </td>
                <td
                  role="cell"
                  data-rotulo={c.rotuloDigital}
                  className={`py-5 align-top text-texto ${bloco} max-md:py-1 max-md:before:block max-md:before:content-[attr(data-rotulo)] max-md:before:text-cabtab max-md:before:font-medium max-md:before:tracking-[0.06em] max-md:before:[font-variant-caps:all-small-caps]`}
                >
                  {par.digital}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
