import { pagina } from "@content";
import { site } from "@config/site";
import { camposJornada } from "../formulario/campos";
import { FormularioTardio } from "../formulario/FormularioTardio";
import { Secao } from "../ui/Secao";

// As datas de config são dias de calendário (sem hora): formatar em UTC evita cair no dia anterior.
const formato = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/** 08. As três reuniões, o manual e o formulário de captação (a chamada principal da página). */
export function Jornada() {
  const j = pagina.jornada;
  const { horario, datas } = site.jornada;
  return (
    <Secao id="jornada" titulo={j.titulo} fundo="marinho">
      <p>{j.introducao}</p>
      <ol className="mt-8 divide-y divide-chumbo border-y border-chumbo">
        {j.pautas.map((pauta, i) => {
          const data = datas[i];
          return (
            <li key={pauta.titulo} className="py-6">
              <p className="text-apoio text-ouro-claro">
                {data ? <time dateTime={data}>{formato.format(new Date(data))}</time> : j.datasPendentes}
              </p>
              <h3 className="mt-2 font-titulo text-h3 font-medium text-balance">{pauta.titulo}</h3>
              <p className="mt-2 text-texto-2">{pauta.descricao}</p>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-texto-2">
        {j.rotuloHorario} {horario}
      </p>

      <div className="mt-16">
        <p className="font-titulo text-h3 font-medium">{j.manual.nome}</p>
        <p className="mt-2 text-texto-2">{j.manual.descricao}</p>
      </div>

      <div className="mt-16">
        <FormularioTardio
          formulario={j.formulario}
          campos={camposJornada}
          rota="cadastroJornada"
          turnstileSiteKey={site.turnstileSiteKey}
        />
      </div>
    </Secao>
  );
}
