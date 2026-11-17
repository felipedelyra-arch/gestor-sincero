"use client";

import Link from "next/link";
import { gravarConsentimento, useConsentimento } from "./consentimento";

// O BotaoWhatsApp lê esta variável para subir acima do banner.
const ALTURA = "--gs-banner-altura";

function publicarAltura(el: HTMLElement | null) {
  if (!el) return;
  const raiz = document.documentElement;
  const medir = () => raiz.style.setProperty(ALTURA, `${el.offsetHeight}px`);
  medir();
  const observador = new ResizeObserver(medir);
  observador.observe(el);
  return () => {
    observador.disconnect();
    raiz.style.removeProperty(ALTURA);
  };
}

// No celular o rótulo cabe em uma linha: recuo menor e os dois botões dividem a largura.
const botao =
  "min-h-12 flex-1 rounded-[2px] border border-ouro-escuro px-3 font-medium text-texto transition-colors duration-200 hover:border-ouro-claro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ouro sm:flex-none sm:px-6";

// Textos e link chegam do layout (servidor): este componente não leva conteúdo nem config para o navegador.
type Props = { texto: string; aceitar: string; recusar: string; rotuloPolitica: string; linkPolitica: string };

export function BannerCookies({ texto, aceitar, recusar, rotuloPolitica, linkPolitica }: Props) {
  const consentimento = useConsentimento();
  if (consentimento !== null) return null; // já respondeu, ou ainda não hidratou

  return (
    <section
      ref={publicarAltura}
      aria-labelledby="gs-cookies-texto"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-chumbo bg-preto-2 px-5 py-2 text-texto md:px-12 md:py-4"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
        {/* Compacto no celular (texto de apoio) para não cobrir a chamada principal do topo. */}
        <p id="gs-cookies-texto" className="max-w-[62ch] text-apoio md:text-corpo">
          {texto}{" "}
          <Link
            href={linkPolitica}
            className="underline decoration-ouro decoration-1 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ouro"
          >
            {rotuloPolitica}
          </Link>
        </p>
        {/* md:shrink-0: sem isto o grupo encolhia em 1024px e o segundo botão saía da tela. */}
        <div className="flex gap-3 md:shrink-0">
          <button type="button" className={botao} onClick={() => gravarConsentimento("recusado")}>
            {recusar}
          </button>
          <button type="button" className={botao} onClick={() => gravarConsentimento("aceito")}>
            {aceitar}
          </button>
        </div>
      </div>
    </section>
  );
}
