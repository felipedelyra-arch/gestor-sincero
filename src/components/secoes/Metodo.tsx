import { pagina } from "@content";
import { Secao } from "../ui/Secao";

/** 07. O fio vira linha do tempo: uma linha só, dois pilares, dez marcas. */
export function Metodo() {
  const { titulo, introducao, pilares } = pagina.metodo;
  return (
    <Secao id="metodo" titulo={titulo}>
      <p className="text-texto-2">{introducao}</p>
      <div className="mt-12 grid gap-12 border-l border-ouro pl-8">
        {pilares.map((pilar) => (
          <section key={pilar.nome} aria-label={pilar.nome}>
            <h3 className="font-titulo text-h3 font-medium">{pilar.nome}</h3>
            <p className="mt-1 text-texto-2">{pilar.descricao}</p>
            <ol start={pilar.etapas[0].numero} className="mt-8 grid gap-8">
              {pilar.etapas.map((etapa) => (
                <li key={etapa.numero} className="relative">
                  {/* marca no fio: centrada na linha de 1px, à esquerda do recuo de 32px */}
                  <span aria-hidden="true" className="absolute top-[0.55em] -left-[calc(32px+5px)] size-[9px] rounded-base bg-ouro" />
                  <h4 className="flex gap-3 font-medium">
                    <span className="w-[2ch] shrink-0 font-titulo text-ouro tabular-nums">{etapa.numero}</span>
                    {etapa.nome}
                  </h4>
                  <p className="mt-1 pl-[calc(2ch+12px)] text-texto-2">{etapa.descricao}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </Secao>
  );
}
