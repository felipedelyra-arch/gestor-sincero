import { pagina } from "@content";
import { site } from "@config/site";
import { camposRessonancia } from "../formulario/campos";
import { FormularioTardio } from "../formulario/FormularioTardio";
import { Carrossel } from "../ui/Carrossel";
import { estilosBotao, trilhoItem } from "../ui/estilos";
import { Imagem } from "../ui/Imagem";

const ID_PEDIDO = "pedido";
const h2 = "font-titulo text-secao font-medium text-balance";
const sub = "font-titulo text-sub font-medium";

/** Conteúdo da página /ressonancia no vocabulário editorial: filetes no lugar de cartões, fundo preto, títulos à esquerda. */
export function RessonanciaPagina() {
  const r = pagina.ressonancia;
  const { anterior, proximo } = pagina.rotulos;
  return (
    <>
      {/* Abertura: título, analogia, texto e a chamada; a capa ao lado. */}
      <section aria-labelledby="ressonancia-h1" className="py-(--sec-media)">
        <div className="conteiner-v2 grid items-center gap-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6">
            <h1 id="ressonancia-h1" data-revela suppressHydrationWarning className="manifesto text-balance">
              {r.titulo}
            </h1>
            <p className="mt-8 font-titulo text-sub font-medium text-balance">{r.analogia}</p>
            <div className="mt-5 grid max-w-[60ch] gap-4 text-lead">
              {r.paragrafos.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <a href={`#${ID_PEDIDO}`} className={`${estilosBotao.principal} mt-8`}>
              {r.chamada.rotulo}
            </a>
          </div>
          <div className="lg:col-span-6">
            <Imagem
              nome="capa-ressonancia"
              alt={r.altCapa}
              tamanhos="(min-width: 1024px) 600px, 240px"
              largura={1600}
              altura={1131}
              prioridade
              className="mx-auto w-full max-w-[240px] lg:max-w-none"
            />
          </div>
        </div>
      </section>

      {/* As 9 fases: letra grande e filete, em três colunas. */}
      <section id="fases" aria-labelledby="fases-titulo" className="py-(--sec-media)">
        <div className="conteiner-v2">
          <h2 id="fases-titulo" className={`${h2} max-w-[680px]`}>
            {r.tituloFases}
          </h2>
          <ol className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {r.fases.map((fase) => (
              <li key={fase.letra} className="grid grid-cols-[3.25rem_1fr] gap-x-3 border-t border-filete-ouro py-6">
                <span aria-hidden="true" className="font-titulo text-numeracao font-normal text-ouro">
                  {fase.letra}
                </span>
                <div>
                  <h3 className={sub}>{fase.nome}</h3>
                  <p className="mt-2">{fase.descricao}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="entregas" aria-labelledby="entregas-titulo" className="py-(--sec-media)">
        <div className="conteiner-v2 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
          <h2 id="entregas-titulo" className={`${h2} lg:col-span-4`}>
            {r.tituloEntregas}
          </h2>
          <ul className="border-b border-filete-ouro lg:col-span-8">
            {r.entregas.map((e) => (
              <li key={e.nome} className="border-t border-filete-ouro py-5">
                <h3 className={sub}>{e.nome}</h3>
                <p className="mt-1 max-w-[62ch]">{e.descricao}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sequência real: a numeração das 4 etapas faz sentido aqui. */}
      <section id="etapas" aria-labelledby="etapas-titulo" className="py-(--sec-media)">
        <div className="conteiner-v2">
          <h2 id="etapas-titulo" className={`${h2} max-w-[680px]`}>
            {r.tituloEtapas}
          </h2>
          <ol className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {r.etapas.map((etapa, i) => (
              <li key={etapa.nome} className="border-t border-filete-ouro py-6">
                <span aria-hidden="true" className="font-titulo text-numeracao font-normal text-ouro tabular-nums">
                  {i + 1}
                </span>
                <h3 className={`${sub} mt-2`}>{etapa.nome}</h3>
                <p className="mt-2">{etapa.descricao}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 font-titulo text-sub font-medium text-ouro">{r.prazo}</p>
        </div>
      </section>

      <section id="previa" aria-labelledby="previa-titulo" className="py-(--sec-media)">
        <div className="conteiner-v2">
          <h2 id="previa-titulo" className={`${h2} max-w-[680px]`}>
            {r.previa.titulo}
          </h2>
          <p className="mt-3 text-legenda text-texto-2">{r.previa.selo}</p>
          <Carrossel idRotulo="previa-titulo" anterior={anterior} proximo={proximo} className="mt-10">
            {r.previa.slides.map((slide) => (
              <li key={slide.arquivo} className={`${trilhoItem} lg:w-[calc(50%-6px)]`}>
                <figure>
                  {/* o selo de simulação já está desenhado dentro da imagem e escrito acima */}
                  <Imagem
                    nome={slide.arquivo}
                    alt=""
                    tamanhos="(min-width: 1024px) 580px, 85vw"
                    largura={1280}
                    altura={720}
                    className="w-full"
                  />
                  <figcaption className="mt-3 text-legenda text-texto-2">{slide.legenda}</figcaption>
                </figure>
              </li>
            ))}
          </Carrossel>
        </div>
      </section>

      <section id={ID_PEDIDO} className="bg-marinho py-(--sec-ampla)">
        <div className="conteiner-v2">
          <div className="mx-auto max-w-[800px] border border-chumbo bg-preto p-6 lg:p-8">
            <FormularioTardio
              formulario={r.formulario}
              campos={camposRessonancia}
              rota="ressonancia"
              turnstileSiteKey={site.turnstileSiteKey}
            />
          </div>
        </div>
      </section>
    </>
  );
}
