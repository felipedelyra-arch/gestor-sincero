import { pagina } from "@content";
import { site } from "@config/site";
import { camposJornada } from "../formulario/campos";
import { FormularioTardio } from "../formulario/FormularioTardio";

// As datas de config são dias de calendário (sem hora): formatar em UTC evita cair no dia anterior.
const formato = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/**
 * S8. Convite de conselho executivo, em marinho que se funde ao preto acima e abaixo: à esquerda a agenda numerada das
 * três reuniões (com filetes, sem cartões); à direita o texto do manual e o formulário de captação num bloco só.
 * Não há capa nem imagem do manual (ela ainda não existe).
 */
export function Jornada() {
  const j = pagina.jornada;
  const { horario, datas } = site.jornada;
  const semDatas = datas.every((d) => d === null);
  return (
    <section id="jornada" aria-labelledby="jornada-titulo" className="fundo-jornada py-(--sec-ampla)">
      <div className="conteiner-v2 grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-7">
          <div data-revela data-desloca suppressHydrationWarning>
            <h2 id="jornada-titulo" className="font-titulo text-secao font-medium text-balance">
              {j.titulo}
            </h2>
            <p className="mt-6 max-w-[62ch] text-lead">{j.introducao}</p>
          </div>

          <ol className="mt-12 border-b border-filete-ouro">
            {j.pautas.map((pauta, i) => {
              const data = datas[i];
              return (
                <li key={pauta.titulo} className="grid grid-cols-[3.25rem_1fr] gap-x-4 border-t border-filete-ouro py-6 lg:grid-cols-[4.5rem_1fr] lg:gap-x-5">
                  <span aria-hidden="true" className="font-titulo text-numeracao font-normal text-ouro tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-legenda text-texto-2">
                      {j.rotuloReuniao} {i + 1}
                      {" · "}
                      {j.rotuloHorario} {horario}
                      {!semDatas && (
                        <>
                          {" · "}
                          {data ? <time dateTime={data}>{formato.format(new Date(data))}</time> : j.datasPendentes}
                        </>
                      )}
                    </p>
                    <h3 className="mt-1 font-titulo text-sub font-medium text-balance">{pauta.titulo}</h3>
                    <p className="mt-1">{pauta.descricao}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          {/* enquanto as três datas estão pendentes, o aviso vale para todas e aparece uma vez */}
          {semDatas && <p className="mt-4 text-legenda text-texto-2">{j.datasPendentes}</p>}
        </div>

        <div className="lg:col-span-5">
          {/* o manual, só em texto: filete dourado, nome e descrição */}
          <div className="border-t border-ouro pt-5">
            <h3 className="font-titulo text-sub font-medium text-balance">{j.manual.nome}</h3>
            <p className="mt-2">{j.manual.descricao}</p>
          </div>

          {/* o único bloco com borda e fundo da seção: o formulário */}
          <div className="mt-10 border border-chumbo bg-preto p-6 lg:p-8">
            <FormularioTardio
              formulario={j.formulario}
              campos={camposJornada}
              rota="cadastroJornada"
              turnstileSiteKey={site.turnstileSiteKey}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
