import { pagina } from "@content";
import { Cartao } from "../ui/Cartao";
import { trilho, trilhoItem } from "../ui/estilos";
import { Secao } from "../ui/Secao";

/** 09. Amostra do dicionário: seis cartões em grade 3x2 (fileira que rola no celular) e o aviso de validação. */
export function Dicionario() {
  const d = pagina.dicionario;
  return (
    <Secao id="dicionario" titulo={d.titulo} apoio={d.introducao}>
      <p className="mb-4 text-center text-apoio text-ouro-claro">{d.avisoValidacao}</p>
      <dl tabIndex={0} aria-labelledby="dicionario-titulo" className={`${trilho} lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:pb-0`}>
        {d.termos.map((termo) => (
          <Cartao key={termo.termo} className={`${trilhoItem} lg:w-auto`}>
            <dt className="font-titulo text-h3 font-medium">{termo.termo}</dt>
            <dd className="mt-2 text-apoio text-texto-2">{termo.traducao}</dd>
          </Cartao>
        ))}
      </dl>
      {d.prova && <p className="mx-auto mt-6 max-w-texto text-center text-apoio text-texto-2">{d.prova}</p>}
    </Secao>
  );
}
