import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";
import { Cartao } from "../ui/Cartao";
import { ListaConferencia } from "../ui/ListaConferencia";
import { Secao } from "../ui/Secao";

const subtitulo = "font-titulo text-h3 font-medium";
const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 11. Esquerda: o que inclui, bônus e plano em listas de conferência. Direita: cartão de preço, garantia e botão. */
export function OfertaMentoria() {
  const o = pagina.oferta;
  const { precoCentavos, parcelas } = site.mentoria;
  return (
    <Secao id="mentoria" titulo={o.titulo} apoio={o.introducao}>
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
          <div className="grid content-start gap-8">
            <ListaConferencia itens={o.inclui} />
            <div>
              <h3 className={subtitulo}>{o.tituloPlano}</h3>
              <ListaConferencia itens={o.planoDeSucesso} className="mt-3 text-texto-2" />
            </div>
          </div>
          <div>
            <h3 className={subtitulo}>{o.tituloBonus}</h3>
            <ListaConferencia itens={o.bonus} className="mt-3 text-texto-2" />
          </div>
        </div>

        {/* filete dourado de 1px no topo: o cartão que decide a seção */}
        <Cartao fundo="marinho" className="border-t-ouro lg:sticky lg:top-24 lg:col-span-5">
          <p className="text-apoio text-texto-2">{o.rotuloPreco}</p>
          {precoCentavos ? (
            <p className="mt-1 font-titulo text-numero font-medium tabular-nums">
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
          <Botao chamada={o.chamada} className="mt-5 sm:w-full" />
          <div className="mt-6 border-t border-chumbo pt-5">
            <h3 className="font-medium">{o.garantia.nome}</h3>
            <p className="mt-1 text-apoio text-texto-2">{o.garantia.descricao}</p>
          </div>
          {o.ofertaPosterior && <p className="mt-4 text-apoio text-texto-2">{o.ofertaPosterior}</p>}
        </Cartao>
      </div>
    </Secao>
  );
}
