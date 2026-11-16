"use client";

import { lazy, Suspense, useCallback, useEffect, useRef, type ComponentProps } from "react";
import type { Formulario as FormularioCompleto } from "./Formulario";

// O código do formulário (com Zod e contratos) só é baixado e hidratado quando um deles se aproxima da tela.
// No servidor a promessa já nasce resolvida: o HTML estático sai com o formulário inteiro, então a altura
// não muda (CLS 0) e as âncoras funcionam. No navegador o React mantém esse HTML até a promessa resolver.
let liberar = () => {};
const perto = typeof window === "undefined" ? Promise.resolve() : new Promise<void>((resolver) => (liberar = resolver));

const Formulario = lazy(() => perto.then(() => import("./Formulario")).then((m) => ({ default: m.Formulario })));

/** Fica dentro do mesmo Suspense do formulário: o efeito só roda quando ele terminou de hidratar. */
function Hidratado({ aoMontar }: { aoMontar: () => void }) {
  useEffect(aoMontar, [aoMontar]);
  return null;
}

export function FormularioTardio(props: ComponentProps<typeof FormularioCompleto>) {
  const caixa = useRef<HTMLDivElement>(null);
  const pronto = useRef(false);
  const envioPendente = useRef(false);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const observador = new IntersectionObserver(([entrada]) => entrada.isIntersecting && liberar(), {
      rootMargin: "800px",
    });
    observador.observe(el);
    // Envio antes da hidratação seria um GET nativo com os dados na URL: nunca deixa o navegador enviar sozinho.
    // O clique não se perde: fica guardado e é repetido assim que o formulário hidrata.
    const segurar = (e: Event) => {
      e.preventDefault();
      if (pronto.current) return;
      envioPendente.current = true;
      liberar();
    };
    el.addEventListener("submit", segurar);
    el.addEventListener("focusin", liberar);
    return () => {
      observador.disconnect();
      el.removeEventListener("submit", segurar);
      el.removeEventListener("focusin", liberar);
    };
  }, []);

  const aoHidratar = useCallback(() => {
    pronto.current = true;
    if (!envioPendente.current) return;
    envioPendente.current = false;
    caixa.current?.querySelector("form")?.requestSubmit();
  }, []);

  return (
    <div ref={caixa}>
      <Suspense fallback={null}>
        <Formulario {...props} />
        <Hidratado aoMontar={aoHidratar} />
      </Suspense>
    </div>
  );
}
