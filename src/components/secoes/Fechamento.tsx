import { pagina } from "@content";
import { Botao } from "../ui/Botao";
import { FraseManifesto } from "../ui/FraseManifesto";

/** 15. As frases finais e a última chamada; o fio dourado termina aqui. */
export function Fechamento() {
  const { frases, texto, chamada } = pagina.fechamento;
  const [primeira, ...demais] = frases;
  return (
    <section id="fechamento" aria-labelledby="fechamento-titulo" className="py-(--espaco-secao)">
      <div data-revela suppressHydrationWarning className="conteiner">
        <h2 id="fechamento-titulo" className="max-w-[20ch] font-titulo text-manifesto font-medium text-balance">
          {primeira}
        </h2>
        {demais.map((frase) => (
          <FraseManifesto key={frase} className="mt-8 max-w-[20ch] text-texto-2">
            {frase}
          </FraseManifesto>
        ))}
        {texto && <p className="mt-8 max-w-texto">{texto}</p>}
        <Botao chamada={chamada} className="mt-12" />
      </div>
    </section>
  );
}
