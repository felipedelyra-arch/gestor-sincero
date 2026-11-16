import Link from "next/link";
import { pagina } from "@content";
import { site } from "@config/site";
import { estilosBotao } from "../ui/estilos";
import { Imagem } from "../ui/Imagem";
import { Secao } from "../ui/Secao";

/** 10. Na landing, só o resumo: o texto, a capa e o botão para a página própria (/ressonancia). */
export function Ressonancia() {
  const r = pagina.ressonancia;
  const [abertura, ...demais] = r.resumo.linhas;
  return (
    <Secao id="ressonancia" titulo={r.titulo} fundo="marinho">
      <div className="mx-auto grid max-w-[960px] items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="font-titulo text-h3 text-balance">{abertura}</p>
          {demais.map((linha) => (
            <p key={linha} className="mt-3 text-texto-2">
              {linha}
            </p>
          ))}
          <Link href={site.links.ressonancia} className={`${estilosBotao.principal} mt-6`}>
            {r.resumo.rotuloBotao}
          </Link>
        </div>
        <Imagem
          nome="capa-ressonancia"
          alt={r.altCapa}
          tamanhos="(min-width: 1024px) 460px, 100vw"
          largura={1600}
          altura={1131}
          className="mx-auto w-full max-w-[460px] rounded-cartao"
        />
      </div>
    </Secao>
  );
}
