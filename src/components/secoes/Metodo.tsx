import { pagina } from "@content";

/** S7. Duas colunas grandes, uma por pilar, com as etapas numeradas de 1 a 10 em ouro; nome e descrição sempre à vista. */
export function Metodo() {
  const { titulo, introducao, pilares } = pagina.metodo;
  return (
    <section id="metodo" aria-labelledby="metodo-titulo" className="py-(--sec-media)">
      <div className="conteiner-v2">
        <header data-revela suppressHydrationWarning className="max-w-[680px]">
          <h2 id="metodo-titulo" className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          <p className="mt-5 text-lead">{introducao}</p>
        </header>

        <div className="mt-14 grid gap-16 lg:mt-20 lg:grid-cols-2 lg:gap-x-20">
          {pilares.map((pilar) => (
            <div key={pilar.nome}>
              <h3 className="font-titulo text-sub font-medium">{pilar.nome}</h3>
              <p className="mt-2 max-w-[44ch]">{pilar.descricao}</p>
              <ol start={pilar.etapas[0].numero} className="mt-8 border-b border-filete-ouro">
                {pilar.etapas.map((etapa) => (
                  <li key={etapa.numero} className="grid grid-cols-[3.25rem_1fr] gap-x-4 border-t border-filete-ouro py-5 lg:grid-cols-[4.5rem_1fr] lg:gap-x-5">
                    <span aria-hidden="true" className="font-titulo text-numeracao font-normal text-ouro tabular-nums">
                      {etapa.numero}
                    </span>
                    <div>
                      <h4 className="font-titulo text-sub font-medium">{etapa.nome}</h4>
                      <p className="mt-1">{etapa.descricao}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
