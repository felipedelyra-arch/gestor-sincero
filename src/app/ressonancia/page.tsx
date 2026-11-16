import { Cabecalho } from "@/components/global/Cabecalho";
import { RessonanciaPagina } from "@/components/secoes/RessonanciaPagina";
import { Rodape } from "@/components/secoes/Rodape";
import { site } from "@config/site";
import { pagina } from "@content";
import { metadataPagina } from "../metadados";

export const metadata = metadataPagina(pagina.ressonancia.seo, site.links.ressonancia);

// Página estática: o conteúdo vem de content/ em tempo de build.
export default function Page() {
  return (
    <>
      <Cabecalho base="/" />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <RessonanciaPagina />
      </main>
      <Rodape />
    </>
  );
}
