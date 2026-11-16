import { pagina } from "@content";
import { Cartao } from "../ui/Cartao";
import { FraseManifesto } from "../ui/FraseManifesto";
import { Secao } from "../ui/Secao";

/** 04. As frases que adiam a decisão, cada uma em um cartão de citação, e a frase-manifesto. */
export function Inimigo() {
  const { titulo, introducao, frases, fechamento } = pagina.inimigo;
  return (
    <Secao id="inimigo" titulo={titulo} apoio={introducao} fundo="marinho">
      <ul className="flex flex-wrap justify-center gap-3 lg:gap-4">
        {frases.map((frase) => (
          <li key={frase} className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(20%-13px)]">
            {/* filete dourado de 1px: marca a citação */}
            <Cartao fundo="preto" respiro="p-5" className="h-full border-l-ouro font-titulo text-h3">
              <q>{frase}</q>
            </Cartao>
          </li>
        ))}
      </ul>
      <FraseManifesto className="mt-10 text-center">{fechamento}</FraseManifesto>
    </Secao>
  );
}
