import Link from "next/link";
import { pagina, type Pagina } from "@content";

type Documento = Pagina["legal"]["privacidade"];

// Página estática de texto corrido: /privacidade e /termos.
export function DocumentoLegal({ documento }: { documento: Documento }) {
  return (
    <main id="conteudo" className="min-h-screen bg-preto px-5 py-24 text-texto md:px-12 lg:py-36">
      <article className="mx-auto max-w-[1200px]">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center underline decoration-ouro decoration-1 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-texto"
        >
          {pagina.rodape.voltarAoInicio}
        </Link>
        <h1 className="mt-12 max-w-[20ch] text-[2rem] leading-[1.1] font-medium tracking-[-0.02em] lg:text-[3rem]">
          {documento.titulo}
        </h1>
        <p className="mt-4 text-texto-2">{documento.atualizadoEm}</p>
        {documento.secoes.map((secao) => (
          <section key={secao.titulo} className="mt-16 max-w-[62ch] border-t border-chumbo pt-8">
            <h2 className="text-[1.375rem] leading-[1.15] font-medium lg:text-[1.75rem]">{secao.titulo}</h2>
            {secao.paragrafos.map((paragrafo, i) => (
              // lista estática: índice é chave estável, e parágrafos pendentes se repetem
              <p key={i} className="mt-4 leading-[1.6]">
                {paragrafo}
              </p>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}
