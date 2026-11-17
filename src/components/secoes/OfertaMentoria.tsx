import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";

const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const sub = "font-titulo text-sub font-medium";

/**
 * S11. Esquerda: o que é (texto corrido), o que inclui (lista numerada com filetes), bônus (com travessão) e plano de
 * sucesso (5 linhas numeradas). Direita: um bloco discreto com investimento, botão e garantia. Sem checks.
 */
export function OfertaMentoria() {
  const o = pagina.oferta;
  const { precoCentavos, parcelas } = site.mentoria;
  return (
    <section id="mentoria" aria-labelledby="mentoria-titulo" className="py-(--sec-media)">
      <div className="conteiner-v2 grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <div data-revela data-desloca suppressHydrationWarning>
            <h2 id="mentoria-titulo" className="font-titulo text-secao font-medium text-balance">
              {o.titulo}
            </h2>
            <p className="mt-6 max-w-[62ch] text-lead">{o.introducao}</p>
          </div>

          <ol className="mt-10 border-b border-filete-ouro">
            {o.inclui.map((item, i) => (
              <li key={item} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-t border-filete-ouro py-4">
                <span aria-hidden="true" className="font-titulo text-ouro tabular-nums">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>

          <h3 className={`${sub} mt-14`}>{o.tituloBonus}</h3>
          <ul className="mt-4 grid gap-3">
            {o.bonus.map((item) => (
              <li key={item} className="grid grid-cols-[1.75rem_1fr]">
                <span aria-hidden="true" className="text-ouro">
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>

          <h3 className={`${sub} mt-14`}>{o.tituloPlano}</h3>
          <ol className="mt-4 border-b border-filete-ouro">
            {o.planoDeSucesso.map((item, i) => (
              <li key={item} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-t border-filete-ouro py-3">
                <span aria-hidden="true" className="font-titulo text-ouro tabular-nums">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>

        {/* o bloco de investimento: um dos poucos com borda e fundo da página */}
        <aside className="self-start border border-chumbo bg-marinho p-7 lg:sticky lg:top-[calc(var(--altura-cabecalho)+24px)] lg:col-span-4 lg:col-start-9 lg:p-8">
          <p className="text-legenda text-texto-2">{o.rotuloPreco}</p>
          {precoCentavos ? (
            <p className="mt-2 font-titulo text-numeracao font-normal tabular-nums">
              {reais.format(precoCentavos / 100)}
              {parcelas && (
                <span className="mt-1 block font-corpo text-corpo font-normal">
                  {parcelas.vezes} × {reais.format(parcelas.valorCentavos / 100)}
                </span>
              )}
            </p>
          ) : (
            <p className={`${sub} mt-2`}>{o.precoPendente}</p>
          )}
          {/* Com checkout configurado, o Botao usa LinkRastreado (UTM e afiliado); sem ele, cai na captação. */}
          <Botao chamada={o.chamada} className="mt-6 sm:w-full" />
          <div className="mt-8 border-t border-filete-ouro pt-6">
            <h3 className="font-medium">{o.garantia.nome}</h3>
            <p className="mt-2">{o.garantia.descricao}</p>
          </div>
          {o.ofertaPosterior && <p className="mt-5 text-legenda text-texto-2">{o.ofertaPosterior}</p>}
        </aside>
      </div>
    </section>
  );
}
