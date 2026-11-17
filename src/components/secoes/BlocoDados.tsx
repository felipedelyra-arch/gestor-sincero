import { pagina } from "@content";
import { site } from "@config/site";

/**
 * S3. Só existe com a fonte dos números (`site.dados.fonte`); sem ela a seção inteira, título incluído, não é renderizada.
 * O primeiro número em manifesto, os outros em texto corrido ao lado e a fonte em nota de rodapé. Sem caixas.
 */
export function BlocoDados() {
  const fonte = site.dados.fonte;
  if (!fonte) return null;
  const { titulo, itens, fechamento } = pagina.dados;
  const [primeiro, ...demais] = itens;
  return (
    <section id="dados" aria-labelledby="dados-titulo" className="py-(--sec-curta)">
      <div className="conteiner-v2 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
        <div data-revela suppressHydrationWarning className="lg:col-span-5">
          <h2 id="dados-titulo" className="font-titulo text-secao font-medium text-balance">
            {titulo}
          </h2>
          <p className="manifesto mt-8 text-ouro tabular-nums">{primeiro.valor}</p>
          <p className="mt-3 max-w-[34ch]">{primeiro.descricao}</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <ul className="border-b border-filete-ouro">
            {demais.map((item) => (
              <li key={item.descricao} className="border-t border-filete-ouro py-4 text-lead">
                <span className="font-medium">{item.valor}</span> {item.descricao}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-titulo text-sub font-medium text-balance">{fechamento}</p>
          <p className="mt-6 text-legenda text-texto-2">{fonte}</p>
        </div>
      </div>
    </section>
  );
}
