import { pagina } from "@content";

// Só os 6 primeiros pares aparecem; os demais seguem no conteúdo, sem uso na página.
const EM_DESTAQUE = 6;

const versalete = "text-cabtab font-medium tracking-[0.06em] [font-variant-caps:all-small-caps]";
// No celular a tabela vira blocos: cada par fica em linhas empilhadas, sem rolagem lateral.
const bloco = "max-md:block";

/**
 * S5. Título e um parágrafo na coluna esquerda; à direita seis pares lado a lado ("Analógica" apagada, "Digital" em
 * título, com filete dourado). `<table>` com papéis explícitos para continuar como tabela quando vira bloco no celular.
 */
export function Virada() {
  const { titulo, paragrafos, comparativo: c } = pagina.virada;
  const pares = c.pares.slice(0, EM_DESTAQUE);
  return (
    <section id="virada" aria-labelledby="virada-titulo" className="py-12 lg:py-16">
      <div className="conteiner-v2 grid gap-12 lg:grid-cols-12 lg:gap-x-12">
        <div data-revela data-desloca suppressHydrationWarning className="lg:col-span-4">
          <h2 id="virada-titulo" className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          <div className="mt-6 grid gap-5 text-lead">
            {paragrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          {c.titulo && <h3 className="mb-6 font-titulo text-sub font-medium text-balance">{c.titulo}</h3>}
          <table role="table" className={`w-full table-fixed border-collapse border-b border-filete-ouro text-left ${bloco}`}>
            <colgroup className="max-md:hidden">
              <col className="w-[18%]" />
              <col className="w-[36%]" />
              <col className="w-[46%]" />
            </colgroup>
            <thead role="rowgroup" className="max-md:sr-only">
              <tr role="row">
                <td role="cell" className="pb-3" />
                <th role="columnheader" scope="col" className={`pr-8 pb-3 text-texto-2 ${versalete}`}>
                  {c.rotuloAnalogica}
                </th>
                <th role="columnheader" scope="col" className={`pb-3 pl-8 text-ouro-claro ${versalete}`}>
                  {c.rotuloDigital}
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup" className={bloco}>
              {pares.map((par) => (
                <tr key={par.tema} role="row" className={`border-t border-filete-ouro ${bloco} max-md:py-6`}>
                  <th role="rowheader" scope="row" className={`py-4 pr-4 text-left align-top text-legenda font-medium text-texto-2 ${bloco} max-md:pt-0 max-md:pb-3`}>
                    {par.tema}
                  </th>
                  <td
                    role="cell"
                    data-rotulo={c.rotuloAnalogica}
                    className={`py-4 pr-8 align-top text-[1.222rem] leading-[1.3] text-texto-2 ${bloco} max-md:py-1 max-md:pr-0 max-md:text-corpo max-md:before:block max-md:before:content-[attr(data-rotulo)] max-md:before:text-cabtab max-md:before:font-medium max-md:before:tracking-[0.06em] max-md:before:[font-variant-caps:all-small-caps]`}
                  >
                    {par.analogica}
                  </td>
                  <td
                    role="cell"
                    data-rotulo={c.rotuloDigital}
                    className={`border-l border-ouro-escuro py-4 pl-8 align-top font-titulo text-[1.222rem] leading-[1.3] font-medium text-texto ${bloco} max-md:mt-3 max-md:py-1 max-md:pl-4 max-md:before:mb-1 max-md:before:block max-md:before:content-[attr(data-rotulo)] max-md:before:font-corpo max-md:before:text-cabtab max-md:before:font-medium max-md:before:tracking-[0.06em] max-md:before:text-ouro-claro max-md:before:[font-variant-caps:all-small-caps]`}
                  >
                    {par.digital}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
