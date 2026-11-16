import { pagina } from "@content";
import { FraseManifesto } from "../ui/FraseManifesto";
import { Secao } from "../ui/Secao";

/** 03. Números com fonte e a frase que fecha o argumento. */
export function BlocoDados() {
  const { titulo, itens, fonte, fechamento } = pagina.dados;
  return (
    <Secao id="dados" titulo={titulo}>
      <dl className="divide-y divide-chumbo border-y border-chumbo">
        {itens.map((item) => (
          <div key={item.descricao} className="flex items-baseline gap-6 py-6">
            <dt className="order-2 text-texto-2">{item.descricao}</dt>
            <dd className="order-1 w-[5ch] shrink-0 font-titulo text-h2 font-medium text-ouro tabular-nums">{item.valor}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-apoio text-texto-2">{fonte}</p>
      <FraseManifesto className="mt-16">{fechamento}</FraseManifesto>
    </Secao>
  );
}
