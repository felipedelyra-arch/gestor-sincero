import Link from "next/link";
import { pagina, type Pagina } from "@content";
import { Cabecalho } from "./Cabecalho";

type Documento = Pagina["legal"]["privacidade"];

// Página estática de texto corrido: /privacidade e /termos. Cabeçalho da home e coluna de leitura centralizada.
export function DocumentoLegal({ documento }: { documento: Documento }) {
  return (
    <>
      <Cabecalho base="/" />
      <main id="conteudo" tabIndex={-1} className="min-h-screen bg-preto py-(--espaco-secao) text-texto outline-none">
        <article className="conteiner">
          <div className="mx-auto max-w-[72ch]">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center underline decoration-ouro decoration-1 underline-offset-4"
            >
              {pagina.rodape.voltarAoInicio}
            </Link>
            <h1 className="mt-4 font-titulo text-h2 font-medium text-balance">{documento.titulo}</h1>
            <p className="mt-2 text-apoio text-texto-2">{documento.atualizadoEm}</p>
            {documento.secoes.map((secao) => (
              <section key={secao.titulo} className="mt-10 border-t border-chumbo pt-6">
                <h2 className="font-titulo text-h3 font-medium">{secao.titulo}</h2>
                {secao.paragrafos.map((paragrafo, i) => (
                  // lista estática: índice é chave estável, e parágrafos pendentes se repetem
                  <p key={i} className="mt-3 text-pretty">
                    {paragrafo}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}
