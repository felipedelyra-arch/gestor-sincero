import { pagina } from "@content";
import { Secao } from "../ui/Secao";
import { SinalAbrir } from "../ui/SinalAbrir";

/** 14. Acordeão centralizado em `details/summary` nativo: teclado e leitor de tela funcionam sem script. */
export function PerguntasFrequentes() {
  const { titulo, itens } = pagina.perguntas;
  return (
    <Secao id="perguntas" titulo={titulo} estreito>
      <div className="border-t border-chumbo">
        {itens.map((item) => (
          <details key={item.pergunta} className="group border-b border-chumbo">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3">
              <h3 className="font-medium">{item.pergunta}</h3>
              <SinalAbrir />
            </summary>
            <p className="pr-8 pb-5 text-pretty text-texto-2">{item.resposta}</p>
          </details>
        ))}
      </div>
    </Secao>
  );
}
