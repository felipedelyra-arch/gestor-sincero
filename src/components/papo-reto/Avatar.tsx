"use client";

import { useEffect, useRef, useState } from "react";

export type EstadoAvatar = "ouvindo" | "falando" | "cetico";
export type FormatoAvatar = "16x9" | "1x1";

type Props = {
  estado: EstadoAvatar;
  formato: FormatoAvatar;
  /** Pasta dos vídeos (`site.papoReto.videos`). */
  pasta: string;
  alt: string;
  /** Com movimento reduzido ou conexão lenta: só o poster, sem baixar vídeo. */
  somentePoster: boolean;
  /** O clipe cético toca uma vez; avisa quando termina. */
  aoFimCetico: () => void;
  className?: string;
};

const FADE = "transition-opacity duration-150 motion-reduce:transition-none";

/** O webm só existe no formato quadrado. */
function Fontes({ pasta, estado, formato }: { pasta: string; estado: EstadoAvatar; formato: FormatoAvatar }) {
  const base = `${pasta}/ferrer-${estado}-${formato}`;
  return (
    <>
      {formato === "1x1" && <source src={`${base}.webm`} type="video/webm" />}
      <source src={`${base}.mp4`} type="video/mp4" />
    </>
  );
}

/**
 * Avatar em dois vídeos sobrepostos, sem som. O de baixo é o "ouvindo", em loop o tempo todo; o de cima troca entre
 * "falando" (loop) e "cetico" (uma vez) e entra e sai por opacidade em 150 ms. Se o vídeo não carregar, fica o poster.
 * O vídeo de cima é conduzido direto no elemento (sem estado), para a troca não renderizar a conversa de novo.
 */
export function Avatar({ estado, formato, pasta, alt, somentePoster, aoFimCetico, className = "" }: Props) {
  const poster = `${pasta}/ferrer-poster-${formato}.jpg`;
  const [falhou, setFalhou] = useState(false);
  const [posterFalhou, setPosterFalhou] = useState(false);
  const cima = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = cima.current;
    if (!v || somentePoster || falhou) return;
    v.style.opacity = "0";
    if (estado === "ouvindo") return;
    let cancelado = false;
    // Some (150 ms), troca o clipe, e só reaparece quando há imagem para mostrar.
    const t = window.setTimeout(() => {
      if (cancelado) return;
      v.loop = estado === "falando";
      v.src = `${pasta}/ferrer-${estado}-${formato}.${formato === "1x1" && v.canPlayType("video/webm") ? "webm" : "mp4"}`;
      v.addEventListener("canplay", () => !cancelado && (v.style.opacity = "1"), { once: true });
      v.load();
      v.play().catch(() => {}); // autoplay bloqueado: o de baixo continua à vista
    }, 150);
    // O navegador pode pausar o clipe (aba em segundo plano, economia de energia): enquanto fala, ele volta a tocar.
    const retomar = () => {
      if (!cancelado && estado === "falando" && !v.ended) v.play().catch(() => {});
    };
    v.addEventListener("pause", retomar);
    return () => {
      cancelado = true;
      window.clearTimeout(t);
      v.removeEventListener("pause", retomar);
    };
  }, [estado, formato, pasta, somentePoster, falhou]);

  if (somentePoster || falhou) {
    return posterFalhou ? null : (
      // eslint-disable-next-line @next/next/no-img-element -- poster estático do próprio domínio
      <img src={poster} alt={alt} onError={() => setPosterFalhou(true)} className={`block h-full w-full object-cover object-center ${className}`} />
    );
  }

  return (
    <div role="img" aria-label={alt} className={`relative overflow-hidden bg-preto ${className}`}>
      <video
        key={`${formato}-base`}
        className="absolute inset-0 size-full object-cover object-center"
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onError={() => setFalhou(true)}
      >
        <Fontes pasta={pasta} estado="ouvindo" formato={formato} />
      </video>
      <video
        ref={cima}
        className={`absolute inset-0 size-full object-cover object-center opacity-0 ${FADE}`}
        muted
        playsInline
        preload="none"
        onEnded={() => estado === "cetico" && aoFimCetico()}
        onError={() => estado === "cetico" && aoFimCetico()} // sem o clipe, a conversa não trava
      />
    </div>
  );
}
