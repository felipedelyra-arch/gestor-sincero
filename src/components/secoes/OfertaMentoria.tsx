import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";
import { Secao } from "../ui/Secao";

const subtitulo = "font-titulo text-h3 font-medium";
const linhas = "mt-4 divide-y divide-chumbo border-y border-chumbo *:py-3";
const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 11. O que a mentoria inclui, bônus, plano de sucesso, garantia, preço (config) e o botão de compra. */
export function OfertaMentoria() {
  const o = pagina.oferta;
  const { precoCentavos, parcelas } = site.mentoria;
  return (
    <Secao id="mentoria" titulo={o.titulo} estreito fundo="preto-2">
      <p>{o.introducao}</p>
      <ul className={`${linhas} mt-8`}>
        {o.inclui.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>

      <h3 className={`${subtitulo} mt-16`}>{o.tituloBonus}</h3>
      <ul className={`${linhas} text-texto-2`}>
        {o.bonus.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>

      <h3 className={`${subtitulo} mt-16`}>{o.tituloPlano}</h3>
      <ul className={`${linhas} text-texto-2`}>
        {o.planoDeSucesso.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>

      <div className="mt-16 border-l border-ouro pl-8">
        <h3 className={subtitulo}>{o.garantia.nome}</h3>
        <p className="mt-2 text-texto-2">{o.garantia.descricao}</p>
      </div>

      <div className="mt-16">
        <p className="text-apoio text-texto-2">{o.rotuloPreco}</p>
        {precoCentavos ? (
          <p className="mt-1 font-titulo text-h2 font-medium tabular-nums">
            {reais.format(precoCentavos / 100)}
            {parcelas && (
              <span className="mt-1 block font-corpo text-corpo font-normal text-texto-2">
                {parcelas.vezes} × {reais.format(parcelas.valorCentavos / 100)}
              </span>
            )}
          </p>
        ) : (
          <p className="mt-1 font-titulo text-h3 font-medium">{o.precoPendente}</p>
        )}
        {/* Com checkout configurado, o Botao usa LinkRastreado (UTM e afiliado); sem ele, cai na captação. */}
        <Botao chamada={o.chamada} className="mt-6" />
        {o.ofertaPosterior && <p className="mt-6 text-apoio text-texto-2">{o.ofertaPosterior}</p>}
      </div>
    </Secao>
  );
}
