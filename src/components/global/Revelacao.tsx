"use client";

import { useEffect } from "react";

/**
 * Revelação da v2: cada `[data-revela]` que está fora da tela na carga surge uma vez, só por opacidade (300ms, CSS).
 * O que já está visível nunca é escondido; sem script ou com movimento reduzido, nada é escondido.
 */
export function Revelacao() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.removeAttribute("data-oculto");
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    for (const el of document.querySelectorAll("[data-revela]")) {
      if (el.getBoundingClientRect().top < window.innerHeight) continue;
      el.setAttribute("data-oculto", "");
      observador.observe(el);
    }
    return () => {
      observador.disconnect();
      for (const el of document.querySelectorAll("[data-oculto]")) el.removeAttribute("data-oculto");
    };
  }, []);

  return null;
}
