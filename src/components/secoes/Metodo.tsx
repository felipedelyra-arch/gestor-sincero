import { pagina } from "@content";
import { Cartao } from "../ui/Cartao";
import { Secao } from "../ui/Secao";
import { SinalAbrir } from "../ui/SinalAbrir";

/** 07. Um cartão por pilar, com as etapas numeradas (sequência real); a descrição de cada etapa abre no toque. */
export function Metodo() {
  const { titulo, introducao, pilares } = pagina.metodo;
  return (
    <Secao id="metodo" titulo={titulo} apoio={introducao}>
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {pilares.map((pilar) => (
          <Cartao key={pilar.nome}>
            <h3 className="font-titulo text-h3 font-medium">{pilar.nome}</h3>
            <p className="mt-1 text-apoio text-texto-2">{pilar.descricao}</p>
            <ol start={pilar.etapas[0].numero} className="mt-4 grid items-start gap-x-6 sm:grid-cols-2">
              {pilar.etapas.map((etapa) => (
                <li key={etapa.numero} className="border-t border-chumbo">
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 py-2">
                      <span aria-hidden="true" className="w-[2ch] shrink-0 font-titulo font-medium text-ouro tabular-nums">
                        {etapa.numero}
                      </span>
                      <span className="flex-1 font-medium">{etapa.nome}</span>
                      <SinalAbrir />
                    </summary>
                    <p className="pb-3 pl-[calc(2ch+12px)] text-apoio text-texto-2">{etapa.descricao}</p>
                  </details>
                </li>
              ))}
            </ol>
          </Cartao>
        ))}
      </div>
    </Secao>
  );
}
