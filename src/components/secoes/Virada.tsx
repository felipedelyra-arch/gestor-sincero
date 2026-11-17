import { pagina } from "@content";

// Quantos pares ficam em destaque; os demais ficam atrás do controle "Ver todos" (details nativo, sem JavaScript).
const EM_DESTAQUE = 6;

const versalete = "text-cabtab font-medium tracking-[0.06em] [font-variant-caps:all-small-caps]";
// No celular a tabela vira blocos: cada par fica em linhas empilhadas, sem rolagem lateral.
const bloco = "max-md:block";

type Par = { tema: string; analogica: string; digital: string };
type Rotulos = { analogica: string; digital: string };

/** Colunas fixas: a tabela em destaque e a que abre no details têm exatamente as mesmas larguras. */
function Colunas() {
  return (
    <colgroup className="max-md:hidden">
      <col className="w-[20%]" />
      <col className="w-[38%]" />
      <col className="w-[42%]" />
    </colgroup>
  );
}

function Linhas({ pares, rotulos }: { pares: Par[]; rotulos: Rotulos }) {
  return (
    <tbody role="rowgroup" className={bloco}>
      {pares.map((par) => (
        <tr key={par.tema} role="row" className={`border-t border-filete-ouro ${bloco} max-md:py-7`}>
          <th role="rowheader" scope="row" className={`py-8 pr-6 text-left align-top text-legenda font-medium text-texto-2 ${bloco} max-md:pt-0 max-md:pb-3`}>
            {par.tema}
          </th>
          <td
            role="cell"
            data-rotulo={rotulos.analogica}
            className={`py-8 pr-10 align-top text-sub text-texto-2 ${bloco} max-md:py-1 max-md:pr-0 max-md:text-corpo max-md:before:block max-md:before:content-[attr(data-rotulo)] max-md:before:text-cabtab max-md:before:font-medium max-md:before:tracking-[0.06em] max-md:before:[font-variant-caps:all-small-caps]`}
          >
            {par.analogica}
          </td>
          <td
            role="cell"
            data-rotulo={rotulos.digital}
            className={`border-l border-ouro-escuro py-8 pl-10 align-top font-titulo text-sub font-medium text-texto ${bloco} max-md:mt-3 max-md:py-1 max-md:pl-4 max-md:text-[1.222rem] max-md:before:mb-1 max-md:before:block max-md:before:content-[attr(data-rotulo)] max-md:before:font-corpo max-md:before:text-cabtab max-md:before:font-medium max-md:before:tracking-[0.06em] max-md:before:text-ouro-claro max-md:before:[font-variant-caps:all-small-caps]`}
          >
            {par.digital}
          </td>
        </tr>
      ))}
    </tbody>
  );
}

/**
 * S5. Texto em coluna de leitura e, abaixo, seis pares em destaque (antes e depois lado a lado: "Analógica" apagada e
 * menor em peso, "Digital" em título, com filete dourado) e os demais atrás de um `<details>` nativo.
 * `<table>` com papéis explícitos para continuar como tabela quando vira bloco no celular.
 */
export function Virada() {
  const { titulo, paragrafos, comparativo: c } = pagina.virada;
  const { verTodos, verMenos } = pagina.rotulos;
  const rotulos = { analogica: c.rotuloAnalogica, digital: c.rotuloDigital };
  const destaque = c.pares.slice(0, EM_DESTAQUE);
  const demais = c.pares.slice(EM_DESTAQUE);
  return (
    <section id="virada" aria-labelledby="virada-titulo" className="py-(--sec-ampla)">
      <div className="conteiner-v2">
        <div data-revela data-desloca suppressHydrationWarning className="max-w-[680px]">
          <h2 id="virada-titulo" className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          <div className="mt-8 grid gap-6 text-lead">
            {paragrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <h3 className="mt-16 mb-8 max-w-[680px] font-titulo text-sub font-medium text-balance lg:mt-24">{c.titulo}</h3>

        <table role="table" className={`w-full table-fixed border-collapse border-b border-filete-ouro text-left ${bloco}`}>
          <Colunas />
          <thead role="rowgroup" className="max-md:sr-only">
            <tr role="row">
              <td role="cell" className="pb-4" />
              <th role="columnheader" scope="col" className={`pr-10 pb-4 text-texto-2 ${versalete}`}>
                {c.rotuloAnalogica}
              </th>
              <th role="columnheader" scope="col" className={`pb-4 pl-10 text-ouro-claro ${versalete}`}>
                {c.rotuloDigital}
              </th>
            </tr>
          </thead>
          <Linhas pares={destaque} rotulos={rotulos} />
        </table>

        {demais.length > 0 && (
          <details className="group">
            <summary className="flex min-h-12 w-fit cursor-pointer list-none items-center py-3 font-medium text-ouro-claro underline decoration-ouro-escuro underline-offset-8 hover:decoration-ouro">
              <span className="group-open:hidden">{verTodos}</span>
              <span className="hidden group-open:inline">{verMenos}</span>
            </summary>
            <table role="table" className={`w-full table-fixed border-collapse border-y border-filete-ouro text-left ${bloco}`}>
              <Colunas />
              <Linhas pares={demais} rotulos={rotulos} />
            </table>
          </details>
        )}
      </div>
    </section>
  );
}
