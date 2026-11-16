import { pagina } from "@content";
import { Cartao } from "../ui/Cartao";
import { FraseManifesto } from "../ui/FraseManifesto";
import { Secao } from "../ui/Secao";

/** 03. Quatro cartões de número em linha, a fonte e a frase que fecha o argumento. */
export function BlocoDados() {
  const { titulo, itens, fonte, fechamento } = pagina.dados;
  return (
    <Secao id="dados" titulo={titulo}>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {itens.map((item) => (
          <Cartao key={item.descricao} respiro="p-5 lg:p-6" className="flex flex-col">
            <dt className="order-2 mt-2 text-apoio text-texto-2">{item.descricao}</dt>
            <dd className="order-1 font-titulo text-numero font-medium text-ouro tabular-nums">{item.valor}</dd>
          </Cartao>
        ))}
      </dl>
      {/* Em produção a fonte pendente chega vazia: o bloco inteiro some, sem linha em branco. */}
      {fonte && <p className="mt-4 text-center text-apoio text-texto-2">{fonte}</p>}
      <FraseManifesto className="mx-auto mt-10 max-w-[34ch] text-center">{fechamento}</FraseManifesto>
    </Secao>
  );
}
