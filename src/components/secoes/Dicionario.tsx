import { pagina } from "@content";
import { site } from "@config/site";

/**
 * S9. Verbetes de dicionário. Padrão: fundo escuro (a flag `site.secaoPapel` vem desligada). Título e introdução na
 * coluna esquerda, fixos; à direita os seis verbetes em duas colunas, com termo em serifa grande, classe em itálico e
 * definição em corpo de livro, separados pelos mesmos filetes dourados do resto da página. Com a flag ligada, o mesmo
 * layout em papel. A prova do prêmio vira nota de rodapé da página.
 */
export function Dicionario() {
  const d = pagina.dicionario;
  const papel = site.secaoPapel;
  // sobre o papel o foco dourado não tem contraste: usa a tinta
  const cor = papel ? "bg-papel text-tinta [&_*:focus-visible]:outline-tinta" : "text-texto";
  const filete = papel ? "border-tinta/25" : "border-filete-ouro";
  const apoio = papel ? "" : "text-texto-2";
  return (
    <section id="dicionario" aria-labelledby="dicionario-titulo" className={`py-(--sec-media) ${cor}`}>
      <div className="conteiner-v2 grid gap-12 lg:grid-cols-12 lg:gap-x-12">
        <header data-revela data-desloca suppressHydrationWarning className="lg:sticky lg:top-[calc(var(--altura-cabecalho)+32px)] lg:col-span-4 lg:self-start">
          <h2 id="dicionario-titulo" className="font-titulo text-secao font-medium text-balance">
            {d.titulo}
          </h2>
          <p className="mt-5 text-lead">{d.introducao}</p>
          {/* em produção o selo pendente chega vazio: nenhum espaço sobra */}
          {d.avisoValidacao && <p className="mt-3 text-legenda italic">{d.avisoValidacao}</p>}
        </header>

        <div className="lg:col-span-8">
          <dl className="md:columns-2 md:gap-x-12">
            {d.termos.map((t) => (
              <div key={t.termo} className={`break-inside-avoid border-t ${filete} pt-5 pb-9`}>
                <dt className="font-manifesto text-[1.667rem] leading-[1.15] font-medium lg:text-[2rem]">
                  {t.termo}
                  {t.classe && <span className={`ml-3 text-[1rem] font-normal italic ${apoio}`}>{t.classe}</span>}
                </dt>
                <dd className="mt-3 max-w-[46ch] font-manifesto text-[1.056rem] leading-[1.6] lg:text-[1.111rem]">{t.traducao}</dd>
              </div>
            ))}
          </dl>

          {d.prova && <p className={`border-t ${filete} pt-4 text-legenda ${apoio}`}>{d.prova}</p>}
        </div>
      </div>
    </section>
  );
}
