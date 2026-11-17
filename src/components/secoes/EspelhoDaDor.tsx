import { pagina } from "@content";
import { EspelhoDaDorLista } from "./EspelhoDaDorLista";

/** S2. Questionário de formulário impresso: uma instrução, oito linhas com filete em duas colunas e a resposta embaixo. */
export function EspelhoDaDor() {
  const { titulo, introducao, itens, respostas } = pagina.espelho;
  return (
    <section id="espelho" aria-labelledby="espelho-titulo" className="py-(--sec-media)">
      <div className="conteiner-v2">
        {/* o único elemento revelado da seção: o título com a instrução, por opacidade */}
        <header data-revela suppressHydrationWarning className="max-w-[680px]">
          <h2 id="espelho-titulo" className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          <p className="mt-5 text-lead">{introducao}</p>
        </header>
        <EspelhoDaDorLista titulo={titulo} itens={itens} respostas={respostas} />
      </div>
    </section>
  );
}
