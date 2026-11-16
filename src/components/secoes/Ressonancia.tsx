import { pagina } from "@content";
import { site } from "@config/site";
import { camposRessonancia } from "../formulario/campos";
import { FormularioTardio } from "../formulario/FormularioTardio";
import { estilosBotao } from "../ui/estilos";
import { Imagem } from "../ui/Imagem";
import { Secao } from "../ui/Secao";

const ID_PEDIDO = "ressonancia-pedido";
const linhas = "divide-y divide-chumbo border-y border-chumbo";
const subtitulo = "mt-16 font-titulo text-h3 font-medium";

/** 10. O diagnóstico: o que é, as 9 fases, as entregas, as etapas, a prévia dos slides e o pedido. */
export function Ressonancia() {
  const r = pagina.ressonancia;
  return (
    <Secao id="ressonancia" titulo={r.titulo} estreito fundo="marinho">
      {/* Parallax leve do equipamento. */}
      <div>
        <Imagem
          nome="capa-ressonancia"
          alt={r.altCapa}
          tamanhos="(min-width: 1024px) 660px, 100vw"
          largura={1600}
          altura={1131}
          className="w-full rounded-base"
        />
      </div>

      <p className="mt-12 font-titulo text-h3 text-balance">{r.analogia}</p>
      <div className="mt-6 grid gap-4">
        {r.paragrafos.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {/* A chamada salta o conteúdo longo e leva direto ao pedido, no fim da seção. */}
      <a href={`#${ID_PEDIDO}`} className={`${estilosBotao.principal} mt-8`}>
        {r.chamada.rotulo}
      </a>

      <h3 className={subtitulo}>{r.tituloFases}</h3>
      <ol className={`${linhas} mt-6`}>
        {r.fases.map((fase) => (
          <li key={fase.letra} className="flex gap-4 py-4">
            <span aria-hidden="true" className="w-[1.5ch] shrink-0 font-titulo font-medium text-ouro">
              {fase.letra}
            </span>
            <div>
              <h4 className="font-medium">{fase.nome}</h4>
              <p className="mt-1 text-texto-2">{fase.descricao}</p>
            </div>
          </li>
        ))}
      </ol>

      <h3 className={subtitulo}>{r.tituloEntregas}</h3>
      <dl className="mt-6 grid gap-8 sm:grid-cols-2">
        {r.entregas.map((entrega) => (
          <div key={entrega.nome}>
            <dt className="font-medium">{entrega.nome}</dt>
            <dd className="mt-1 text-texto-2">{entrega.descricao}</dd>
          </div>
        ))}
      </dl>

      <h3 className={subtitulo}>{r.tituloEtapas}</h3>
      <ol className="mt-6 grid gap-8 border-l border-ouro pl-8">
        {r.etapas.map((etapa) => (
          <li key={etapa.nome}>
            <h4 className="font-medium">{etapa.nome}</h4>
            <p className="mt-1 text-texto-2">{etapa.descricao}</p>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-ouro-claro">{r.prazo}</p>

      <h3 id="ressonancia-previa" className={subtitulo}>
        {r.previa.titulo}
      </h3>
      <p className="mt-2 text-apoio text-ouro-claro">{r.previa.selo}</p>
      <div className="relative mt-6">
        {/* Rolagem horizontal com encaixe; o foco de teclado permite rolar com as setas. */}
        <ul
          tabIndex={0}
          aria-labelledby="ressonancia-previa"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4"
        >
          {r.previa.slides.map((slide) => (
            <li key={slide.arquivo} className="w-[85%] shrink-0 snap-start">
              <figure>
                <Imagem
                  nome={slide.arquivo}
                  alt={slide.legenda}
                  tamanhos="(min-width: 1024px) 560px, 85vw"
                  largura={1280}
                  altura={720}
                  className="w-full rounded-base"
                />
                <figcaption className="mt-3 text-apoio text-texto-2">
                  {slide.legenda}
                  <span className="block text-ouro-claro">{r.previa.selo}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div id={ID_PEDIDO} className="mt-16">
        <FormularioTardio
          formulario={r.formulario}
          campos={camposRessonancia}
          rota="ressonancia"
          turnstileSiteKey={site.turnstileSiteKey}
        />
      </div>
    </Secao>
  );
}
