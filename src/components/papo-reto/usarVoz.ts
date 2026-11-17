"use client";

import { useCallback, useRef, useState } from "react";

// Prefere pt-BR, depois qualquer português e, no teste, a primeira voz que o navegador tiver.
const acharVoz = () => {
  const vozes = window.speechSynthesis.getVoices();
  const idioma = (v: SpeechSynthesisVoice) => v.lang.replace("_", "-").toLowerCase();
  return vozes.find((v) => idioma(v) === "pt-br") ?? vozes.find((v) => idioma(v).startsWith("pt")) ?? vozes[0] ?? null;
};

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

/** Voz de saída do personagem pelo navegador. Desligada por padrão. `alternar` devolve false quando não há voz instalada. */
export function useVoz() {
  const suportada = typeof window !== "undefined" && "speechSynthesis" in window;
  const [ligada, setLigada] = useState(false);
  const voz = useRef<SpeechSynthesisVoice | null>(null);
  const atual = useRef<SpeechSynthesisUtterance | null>(null);

  const calar = useCallback(() => {
    atual.current = null; // o cancelamento dispara `end`/`error` da fala antiga: o teste abaixo ignora
    if (suportada) window.speechSynthesis.cancel();
  }, [suportada]);

  const alternar = useCallback(async (): Promise<boolean> => {
    if (!suportada) return false;
    if (ligada) {
      calar();
      voz.current = null;
      setLigada(false);
      return true;
    }
    voz.current = await esperarVoz();
    setLigada(voz.current !== null);
    return voz.current !== null;
  }, [suportada, ligada, calar]);

  /** Lê o texto; `aoIniciar` roda quando a voz de fato começa e `aoFim` quando termina (ou falha). Devolve false se não há voz ligada (quem chama usa o tempo estimado). */
  const falar = useCallback(
    (texto: string, aoFim: () => void, aoIniciar?: () => void): boolean => {
      if (!suportada || !voz.current) return false;
      calar();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = "pt-BR";
      u.voice = voz.current;
      const fim = () => {
        if (atual.current === u) aoFim();
      };
      u.onstart = () => {
        if (atual.current === u) aoIniciar?.();
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
