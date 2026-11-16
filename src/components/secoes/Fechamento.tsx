import { pagina } from "@content";
import { ConversaPapoReto } from "../papo-reto/ConversaPapoReto";
import { Botao } from "../ui/Botao";

/** 15. Faixa marinho: a frase final (36px), a frase de apoio e a última chamada. */
export function Fechamento() {
  const { frases, texto, chamada } = pagina.fechamento;
  const [primeira, ...demais] = frases;
  return (
    <section id="fechamento" aria-labelledby="fechamento-titulo" className="bg-marinho py-(--espaco-secao)">
      <div data-revela suppressHydrationWarning className="conteiner flex flex-col items-center text-center">
        <h2 id="fechamento-titulo" className="max-w-[40ch] font-titulo text-manifesto font-medium text-balance">
          {primeira}
        </h2>
        {demais.map((frase) => (
          <p key={frase} className="mt-3 font-titulo text-h3 text-texto-2">
            {frase}
          </p>
        ))}
        {texto && <p className="mt-4 max-w-texto text-pretty">{texto}</p>}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Botao chamada={chamada} />
          <ConversaPapoReto className="max-sm:w-full" />
        </div>
      </div>
    </section>
  );
}
