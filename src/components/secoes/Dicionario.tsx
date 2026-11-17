import { pagina } from "@content";
import { site } from "@config/site";

/**
 * S9. Página de livro: com `site.secaoPapel` a seção é cor de papel (texto em tinta); sem a flag, o mesmo layout em
 * fundo escuro. Seis verbetes em duas colunas (termo em negrito grande, classe em itálico pequeno, definição em serifa)
 * e a prova do prêmio como nota de rodapé da página. Sem cartões.
 */
export function Dicionario() {
  const d = pagina.dicionario;
  const papel = site.secaoPapel;
  // sobre o papel o foco dourado não tem contraste: usa a tinta
  const cor = papel ? "bg-papel text-tinta [&_*:focus-visible]:outline-tinta" : "bg-preto text-texto";
  const filete = papel ? "border-tinta/25" : "border-filete-ouro";
  return (
    <section id="dicionario" aria-labelledby="dicionario-titulo" className={`py-(--sec-media) ${cor}`}>
      <div className="conteiner-v2">
        <header data-revela suppressHydrationWarning className="max-w-[680px]">
          <h2 id="dicionario-titulo" className="font-manifesto text-secao font-semibold text-balance">
            {d.titulo}
          </h2>
          <p className="mt-5 font-manifesto text-lead">{d.introducao}</p>
          {/* em produção o selo pendente chega vazio: nenhum espaço sobra */}
          {d.avisoValidacao && <p className="mt-3 text-legenda italic">{d.avisoValidacao}</p>}
        </header>

        <dl className="mt-14 lg:columns-2 lg:gap-x-16">
          {d.termos.map((t) => (
            <div key={t.termo} className={`break-inside-avoid border-t ${filete} pt-5 pb-10`}>
              <dt className="font-manifesto text-[1.667rem] leading-[1.15] font-semibold lg:text-[2rem]">
                {t.termo}
                {t.classe && <span className="ml-3 text-[1rem] font-normal italic">{t.classe}</span>}
              </dt>
              <dd className="mt-3 max-w-[46ch] font-manifesto text-[1.056rem] leading-[1.6] lg:text-[1.111rem]">{t.traducao}</dd>
            </div>
          ))}
        </dl>

        {d.prova && <p className={`mt-6 max-w-[680px] border-t ${filete} pt-4 text-legenda`}>{d.prova}</p>}
      </div>
    </section>
  );
}
