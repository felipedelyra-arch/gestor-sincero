import { pagina } from "@content";
import { site } from "@config/site";
import { camposJornada } from "../formulario/campos";
import { FormularioTardio } from "../formulario/FormularioTardio";
import { Cartao } from "../ui/Cartao";
import { trilho, trilhoItem } from "../ui/estilos";
import { Secao } from "../ui/Secao";

// As datas de config são dias de calendário (sem hora): formatar em UTC evita cair no dia anterior.
const formato = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/** 08. Esquerda: as três pautas, o horário e o manual. Direita: o formulário de captação em um cartão. */
export function Jornada() {
  const j = pagina.jornada;
  const { horario, datas } = site.jornada;
  const semDatas = datas.every((d) => d === null);
  return (
    <Secao id="jornada" titulo={j.titulo} apoio={j.introducao} fundo="marinho">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* min-w-0: a fileira que rola não pode alargar a coluna */}
        <div className="flex min-w-0 flex-col">
          {/* Celular: as três pautas lado a lado, rolando na horizontal. Desktop: empilhadas. */}
          <ol tabIndex={0} aria-labelledby="jornada-titulo" className={`${trilho} lg:flex lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0`}>
            {j.pautas.map((pauta, i) => {
              const data = datas[i];
              return (
                <li key={pauta.titulo} className={`${trilhoItem} lg:w-auto lg:flex-1`}>
                  <Cartao fundo="preto" respiro="p-5" className="flex h-full flex-col justify-center">
                    {!semDatas && (
                      <p className="text-apoio text-ouro-claro">
                        {data ? <time dateTime={data}>{formato.format(new Date(data))}</time> : j.datasPendentes}
                      </p>
                    )}
                    <h3 className="font-titulo text-h3 font-medium lg:text-balance">{pauta.titulo}</h3>
                    <p className="mt-1 text-apoio text-texto-2">{pauta.descricao}</p>
                  </Cartao>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-texto-2">
            {j.rotuloHorario} {horario}
          </p>
          {/* enquanto as três datas estão pendentes, o aviso vale para todas e aparece uma vez */}
          {semDatas && <p className="mt-1 text-apoio text-ouro-claro">{j.datasPendentes}</p>}
          <div className="mt-6 border-l border-ouro pl-5">
            <p className="font-titulo text-h3 font-medium">{j.manual.nome}</p>
            <p className="mt-1 text-apoio text-texto-2">{j.manual.descricao}</p>
          </div>
        </div>

        <Cartao fundo="preto">
          <FormularioTardio
            formulario={j.formulario}
            campos={camposJornada}
            rota="cadastroJornada"
            turnstileSiteKey={site.turnstileSiteKey}
          />
        </Cartao>
      </div>
    </Secao>
  );
}
