import { pagina } from "@content";

/**
 * S4. Compacta (até 520px no desktop). Introdução à esquerda; à direita as cinco frases em serifa, todas na mesma
 * margem, separadas por filete fino. Sem risco, sem aspas decorativas e sem cartões.
 */
export function Inimigo() {
  const { titulo, introducao, frases } = pagina.inimigo;
  return (
    <section id="inimigo" aria-labelledby="inimigo-titulo" className="py-12 lg:py-16">
      <div className="conteiner-v2 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-8">
        <header data-revela data-desloca suppressHydrationWarning className="lg:col-span-5">
          <h2 id="inimigo-titulo" className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          <p className="mt-5 max-w-[34em] text-lead">{introducao}</p>
        </header>
        <ul className="border-b border-filete-ouro lg:col-span-6 lg:col-start-7">
          {frases.map((frase) => (
            <li key={frase} className="border-t border-filete-ouro py-3.5 font-manifesto text-[1.556rem] leading-[1.2] lg:text-[1.778rem]">
              {frase}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
