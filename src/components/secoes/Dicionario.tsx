import { pagina } from "@content";
import { Secao } from "../ui/Secao";

/** 09. Amostra do dicionário: seis termos traduzidos, com o aviso de validação à vista. */
export function Dicionario() {
  const d = pagina.dicionario;
  return (
    <Secao id="dicionario" titulo={d.titulo}>
      <p>{d.introducao}</p>
      <p className="mt-6 inline-block rounded-base border border-ouro-escuro px-3 py-1 text-apoio text-ouro-claro">
        {d.avisoValidacao}
      </p>
      <dl className="mt-8 border-t border-chumbo">
        {d.termos.map((termo) => (
          <div key={termo.termo} className="border-b border-chumbo py-6">
            <dt className="font-titulo text-h3 font-medium">{termo.termo}</dt>
            <dd className="mt-2 text-texto-2">{termo.traducao}</dd>
          </div>
        ))}
      </dl>
    </Secao>
  );
}
