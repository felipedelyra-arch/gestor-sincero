import { pagina } from "@content";

/** S4. Introdução à esquerda; à direita as frases empilhadas, grandes, cada uma riscada por um traço dourado fino. */
export function Inimigo() {
  const { titulo, introducao, frases, fechamento } = pagina.inimigo;
  return (
    <section id="inimigo" aria-labelledby="inimigo-titulo" className="py-(--sec-media)">
      <div className="conteiner-v2 grid gap-12 lg:grid-cols-12 lg:gap-x-8">
        <header data-revela suppressHydrationWarning className="lg:col-span-5">
          <h2 id="inimigo-titulo" className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          {/* o fechamento é parágrafo de corpo, continuação da introdução (não é frase de efeito) */}
          <p className="mt-6 max-w-[34em] text-lead">{introducao}</p>
          <p className="mt-4 max-w-[34em]">{fechamento}</p>
        </header>
        <div className="lg:col-span-7">
          <ul className="border-b border-filete-ouro">
            {frases.map((frase) => (
              <li key={frase} className="border-t border-filete-ouro py-5 font-titulo text-[1.333rem] leading-[1.25] font-medium lg:py-6 lg:text-[1.778rem]">
                {/* o risco é só decoração (text-decoration): o texto continua inteiro para o leitor de tela */}
                <span className="line-through decoration-ouro decoration-1">{frase}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
