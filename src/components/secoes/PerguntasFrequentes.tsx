import { pagina } from "@content";
import { SinalAbrir } from "../ui/SinalAbrir";

/** S13. Sanfona nativa (details/summary), em coluna de leitura à esquerda, com texto de 18px e espaço folgado. */
export function PerguntasFrequentes() {
  const { titulo, itens } = pagina.perguntas;
  return (
    <section id="perguntas" aria-labelledby="perguntas-titulo" className="py-(--sec-media)">
      <div className="conteiner-v2">
        <div className="max-w-[680px]">
          <h2 id="perguntas-titulo" data-revela suppressHydrationWarning className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          <div className="mt-12 border-b border-filete-ouro">
            {itens.map((item) => (
              <details key={item.pergunta} className="group border-t border-filete-ouro">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5">
                  <h3 className="font-medium">{item.pergunta}</h3>
                  <SinalAbrir />
                </summary>
                <p className="pr-10 pb-6 text-pretty">{item.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
