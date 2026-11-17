import { pagina } from "@content";

/**
 * S4. Introdução à esquerda (fixa enquanto as falas rolam); à direita as frases como falas de mesa de reunião: aspas
 * tipográficas grandes em ouro, fala em manifesto e recuo alternado, como numa conversa. Sem risco, sem cartões.
 */
export function Inimigo() {
  const { titulo, introducao, frases, fechamento } = pagina.inimigo;
  return (
    <section id="inimigo" aria-labelledby="inimigo-titulo" className="py-(--sec-media)">
      <div className="conteiner-v2 grid gap-12 lg:grid-cols-12 lg:gap-x-8">
        <header data-revela data-desloca suppressHydrationWarning className="lg:sticky lg:top-[calc(var(--altura-cabecalho)+32px)] lg:col-span-5 lg:self-start">
          <h2 id="inimigo-titulo" className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          <p className="mt-6 max-w-[34em] text-lead">{introducao}</p>
          {/* o fechamento é parágrafo de corpo, continuação da introdução */}
          <p className="mt-4 max-w-[34em]">{fechamento}</p>
        </header>
        <ul className="lg:col-span-7">
          {frases.map((frase) => (
            <li key={frase} className="border-t border-filete-ouro py-7 first:border-t-0 first:pt-0 lg:py-9 lg:first:pt-0 lg:even:pl-16">
              <blockquote className="grid grid-cols-[auto_1fr] gap-x-4 lg:gap-x-6">
                {/* aspas só de ornamento tipográfico: o leitor de tela lê a fala */}
                <span aria-hidden="true" className="font-manifesto text-[4.5rem] leading-[0.8] text-ouro lg:text-[6.5rem]">
                  “
                </span>
                <p className="manifesto text-[length:clamp(1.667rem,3.4vw,2.889rem)] text-balance">{frase}</p>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
