"use client";

import { useEffect } from "react";

/**
 * Rolagem amortecida (Lenis) + fio que cresce e parallax leve (GSAP ScrollTrigger).
 * As bibliotecas só são baixadas depois da primeira pintura; com movimento reduzido, nada carrega.
 * Revelação: elementos com `data-revela` surgem uma vez (só opacidade) ao entrar na tela.
 * Parallax: qualquer elemento com `data-parallax` sobe no máximo 4% da própria altura.
 */
export function RolagemSuave() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelado = false;
    let desligar = () => {};

    const iniciar = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelado) return;

      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.1, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const quadro = (tempo: number) => lenis.raf(tempo * 1000);
      gsap.ticker.add(quadro);
      gsap.ticker.lagSmoothing(0);

      const contexto = gsap.context(() => {
        gsap.to("[data-fio]", { scaleY: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.to(el, {
            yPercent: -4,
            ease: "none",
            scrollTrigger: { trigger: el, start: "clamp(top bottom)", end: "bottom top", scrub: true },
          });
        });
        // Revelação única por seção: só opacidade, lenta, como corte de cinema.
        gsap.utils.toArray<HTMLElement>("[data-revela]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            duration: 1.2,
            ease: "power1.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
        // Varredura do exame: o fio atravessa a prévia da Ressonância uma única vez.
        gsap.utils.toArray<HTMLElement>("[data-varredura]").forEach((el) => {
          const area = el.parentElement;
          if (!area) return;
          gsap.fromTo(
            el,
            { y: 0, opacity: 0.9 },
            {
              y: () => area.offsetHeight,
              duration: 1.8,
              ease: "none",
              immediateRender: false,
              scrollTrigger: { trigger: area, start: "top 70%", once: true },
              onComplete: () => gsap.set(el, { opacity: 0 }),
            },
          );
        });
      });

      // Pergunta aberta ou formulário enviado mudam a altura da página: o fio e o parallax recalculam.
      let altura = document.body.offsetHeight;
      const observador = new ResizeObserver(() => {
        if (document.body.offsetHeight === altura) return;
        altura = document.body.offsetHeight;
        ScrollTrigger.refresh();
      });
      observador.observe(document.body);

      desligar = () => {
        observador.disconnect();
        contexto.revert();
        gsap.ticker.remove(quadro);
        lenis.destroy();
      };
    };

    // Dois passos (quadro + tarefa) garantem que a primeira pintura já aconteceu.
    const quadroInicial = requestAnimationFrame(() => setTimeout(iniciar, 0));

    return () => {
      cancelado = true;
      cancelAnimationFrame(quadroInicial);
      desligar();
    };
  }, []);

  return null;
}
