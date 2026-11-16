import { pagina } from "@content";
import { Secao } from "../ui/Secao";

const traco = "absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ouro";

/** 14. Perguntas em `details/summary` nativo: teclado e leitor de tela funcionam sem script. */
export function PerguntasFrequentes() {
  const { titulo, itens } = pagina.perguntas;
  return (
    <Secao id="perguntas" titulo={titulo}>
      <div className="border-t border-chumbo">
        {itens.map((item) => (
          <details key={item.pergunta} className="group border-b border-chumbo">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
              <h3 className="font-medium">{item.pergunta}</h3>
              {/* sinal de mais que vira menos ao abrir */}
              <span aria-hidden="true" className="relative size-4 shrink-0">
                <span className={traco} />
                <span className={`${traco} rotate-90 transition-transform duration-200 group-open:rotate-0 motion-reduce:transition-none`} />
              </span>
            </summary>
            <p className="pr-8 pb-6 text-texto-2">{item.resposta}</p>
          </details>
        ))}
      </div>
    </Secao>
  );
}
