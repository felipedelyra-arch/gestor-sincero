import { pagina } from "@content";
import { FraseManifesto } from "../ui/FraseManifesto";
import { Secao } from "../ui/Secao";

/** 04. As frases que adiam a decisão, ditas como são ditas. */
export function Inimigo() {
  const { titulo, introducao, frases, fechamento } = pagina.inimigo;
  return (
    <Secao id="inimigo" titulo={titulo} fundo="preto-2">
      <p className="text-texto-2">{introducao}</p>
      <ul className="mt-8 divide-y divide-chumbo border-y border-chumbo">
        {frases.map((frase) => (
          <li key={frase} className="py-5 font-titulo text-h3">
            <q>{frase}</q>
          </li>
        ))}
      </ul>
      <FraseManifesto className="mt-16">{fechamento}</FraseManifesto>
    </Secao>
  );
}
