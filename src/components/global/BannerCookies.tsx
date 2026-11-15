"use client";

import Link from "next/link";
import { pagina } from "@content";
import { site } from "@config/site";
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

const botao =
  "min-h-12 flex-1 rounded-[2px] border border-ouro-escuro px-6 font-medium text-texto transition-colors duration-200 hover:border-ouro-claro focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-texto sm:flex-none";

export function BannerCookies() {
  const consentimento = useConsentimento();
  if (consentimento !== null) return null; // já respondeu, ou ainda não hidratou

  const { texto, aceitar, recusar, rotuloPolitica } = pagina.cookies;
  return (
    <section
      ref={publicarAltura}
      aria-labelledby="gs-cookies-texto"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-chumbo bg-preto-2 px-5 py-4 text-texto md:px-12"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p id="gs-cookies-texto" className="max-w-[62ch]">
          {texto}{" "}
          <Link
            href={site.links.privacidade}
            className="underline decoration-ouro decoration-1 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-texto"
          >
            {rotuloPolitica}
          </Link>
        </p>
        <div className="flex gap-3">
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
