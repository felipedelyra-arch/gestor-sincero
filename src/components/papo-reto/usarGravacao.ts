"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AUDIO_MAX_SEGUNDOS } from "@/shared/papoReto";

const TIPOS = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];

export const gravacaoSuportada = () =>
  typeof MediaRecorder !== "undefined" && typeof navigator.mediaDevices?.getUserMedia === "function";

/**
 * Grava um áudio só quando a pessoa toca (nunca sozinho): `alternar` começa e, no segundo toque, para e entrega o arquivo.
 * Para sozinho em AUDIO_MAX_SEGUNDOS. As trilhas do microfone são fechadas ao terminar e ao desmontar (sem enviar).
 */
export function useGravacao(aoFinalizar: (audio: File) => void, aoNegar: () => void) {
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const gravador = useRef<MediaRecorder | null>(null);
  const fluxo = useRef<MediaStream | null>(null);
  const timer = useRef<number>(undefined);
  const descartar = useRef(false);
  const cbs = useRef({ aoFinalizar, aoNegar });
  useEffect(() => {
    cbs.current = { aoFinalizar, aoNegar };
  });

  const encerrar = useCallback(() => {
    window.clearInterval(timer.current);
    fluxo.current?.getTracks().forEach((t) => t.stop());
    fluxo.current = null;
    setGravando(false);
  }, []);

  const parar = useCallback(() => {
    if (gravador.current?.state === "recording") gravador.current.stop();
  }, []);

  useEffect(() => {
    descartar.current = false; // o modo estrito do dev roda o efeito duas vezes
    return () => {
      descartar.current = true;
      parar();
      encerrar();
    };
  }, [parar, encerrar]);

  const iniciar = useCallback(async () => {
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      cbs.current.aoNegar();
      return;
    }
    if (descartar.current) {
      stream.getTracks().forEach((t) => t.stop()); // o painel fechou enquanto a permissão era pedida
      return;
    }
    fluxo.current = stream;
    const tipo = TIPOS.find((t) => MediaRecorder.isTypeSupported(t));
    const rec = new MediaRecorder(stream, { ...(tipo ? { mimeType: tipo } : {}), audioBitsPerSecond: 32_000 });
    const pedacos: Blob[] = [];
    rec.ondataavailable = (e) => e.data.size > 0 && pedacos.push(e.data);
    rec.onstop = () => {
      encerrar();
      if (descartar.current) return;
      const mime = (rec.mimeType || tipo || "audio/webm").split(";")[0];
      const ext = mime.includes("mp4") ? "m4a" : mime.includes("ogg") ? "ogg" : "webm";
      cbs.current.aoFinalizar(new File(pedacos, `audio.${ext}`, { type: mime }));
    };
    rec.onerror = () => {
      encerrar();
      cbs.current.aoNegar();
    };
    gravador.current = rec;
    rec.start();
    setSegundos(0);
    setGravando(true);
    let n = 0;
    timer.current = window.setInterval(() => {
      n += 1;
      setSegundos(n);
      if (n >= AUDIO_MAX_SEGUNDOS) parar();
    }, 1000);
  }, [encerrar, parar]);

  const alternar = useCallback(() => (gravando ? parar() : void iniciar()), [gravando, parar, iniciar]);

  return { gravando, segundos, alternar };
}
