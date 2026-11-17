import { pagina } from "@content";
import { site } from "@config/site";
import { camposJornada } from "../formulario/campos";
import { FormularioTardio } from "../formulario/FormularioTardio";

// As datas de config são dias de calendário (sem hora): formatar em UTC evita cair no dia anterior.
const formato = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/**
 * S8. Convite de conselho executivo, em marinho: a agenda numerada das três reuniões (com filetes, sem cartões), o
 * formulário de captação num bloco só e, ao lado, o mockup do manual feito em CSS (fica fixo enquanto a agenda rola).
 */
export function Jornada() {
  const j = pagina.jornada;
  const { horario, datas } = site.jornada;
  const semDatas = datas.every((d) => d === null);
  return (
    <section id="jornada" aria-labelledby="jornada-titulo" className="bg-marinho py-(--sec-ampla)">
      <div className="conteiner-v2 grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <div data-revela suppressHydrationWarning>
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

          {/* o único bloco com borda e fundo da seção: o formulário */}
          <div className="mt-14 border border-chumbo bg-preto p-6 lg:p-8">
            <FormularioTardio
              formulario={j.formulario}
              campos={camposJornada}
              rota="cadastroJornada"
              turnstileSiteKey={site.turnstileSiteKey}
            />
          </div>
        </div>

        {/* Mockup do manual em CSS: livro preto sóbrio, título em dourado, lombada e sombra de livro. */}
        <figure className="max-w-[320px] lg:sticky lg:top-[calc(var(--altura-cabecalho)+24px)] lg:col-span-5 lg:max-w-[380px] lg:self-start lg:justify-self-end">
          <div className="relative aspect-3/4 w-full border border-filete-ouro border-l-[14px] border-l-preto bg-preto p-7 shadow-[0_24px_48px_rgb(0_0_0/0.6)] lg:p-9">
            <div className="flex h-full flex-col justify-between border border-ouro-escuro p-5">
              <span aria-hidden="true" className="h-px w-10 bg-ouro" />
              <p className="manifesto text-[length:clamp(1.667rem,2.4vw,2.222rem)] text-ouro">{j.manual.nome}</p>
              <span aria-hidden="true" className="h-px w-full bg-filete-ouro" />
            </div>
          </div>
          <figcaption className="mt-5 text-legenda text-texto-2">{j.manual.descricao}</figcaption>
        </figure>
      </div>
    </section>
  );
}
