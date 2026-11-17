"use client";

import { useCallback, useRef, useState } from "react";

const acharVoz = () =>
  window.speechSynthesis.getVoices().find((v) => v.lang.replace("_", "-").toLowerCase() === "pt-br") ?? null;

// O Chrome carrega a lista de vozes depois do primeiro uso: espera o evento por até 1,5 s.
function esperarVoz(): Promise<SpeechSynthesisVoice | null> {
  const s = window.speechSynthesis;
  if (s.getVoices().length > 0) return Promise.resolve(acharVoz());
  return new Promise((resolver) => {
    const fim = () => {
      window.clearTimeout(t);
      s.removeEventListener("voiceschanged", fim);
      resolver(acharVoz());
    };
    const t = window.setTimeout(fim, 1500);
    s.addEventListener("voiceschanged", fim);
  });
}

/** Voz de saída do personagem pelo navegador (pt-BR). Desligada por padrão; sem voz pt-BR, não liga. */
export function useVoz() {
  const suportada = typeof window !== "undefined" && "speechSynthesis" in window;
  const [ligada, setLigada] = useState(false);
  const voz = useRef<SpeechSynthesisVoice | null>(null);
  const atual = useRef<SpeechSynthesisUtterance | null>(null);

  const calar = useCallback(() => {
    atual.current = null; // o cancelamento dispara `end`/`error` da fala antiga: o teste abaixo ignora
    if (suportada) window.speechSynthesis.cancel();
  }, [suportada]);

  const alternar = useCallback(async () => {
    if (!suportada) return;
    if (ligada) {
      calar();
      voz.current = null;
      setLigada(false);
      return;
    }
    voz.current = await esperarVoz();
    setLigada(voz.current !== null);
  }, [suportada, ligada, calar]);

  /** Lê o texto; `aoFim` roda quando a voz termina. Devolve false se não há voz ligada (quem chama usa o tempo estimado). */
  const falar = useCallback(
    (texto: string, aoFim: () => void): boolean => {
      if (!suportada || !voz.current) return false;
      calar();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = "pt-BR";
      u.voice = voz.current;
      const fim = () => {
        if (atual.current === u) aoFim();
      };
      u.onend = fim;
      u.onerror = fim;
      atual.current = u;
      window.speechSynthesis.speak(u);
      return true;
    },
    [suportada, calar],
  );

  return { suportada, ligada, alternar, falar, calar };
}
