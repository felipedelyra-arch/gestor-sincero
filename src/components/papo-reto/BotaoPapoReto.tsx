"use client";

import { lazy, Suspense, useRef, useState } from "react";
import { estilosBotao, type VarianteBotao } from "../ui/estilos";
import type { PropsPainel } from "./PapoReto";

// O painel (e o texto da conversa) só são baixados quando alguém clica ou aproxima o ponteiro do botão.
const carregarPainel = () => import("./PapoReto");
const Painel = lazy(carregarPainel);

type Props = Omit<PropsPainel, "aoFechar"> & { rotulo: string; variante?: VarianteBotao; className?: string };

export function BotaoPapoReto({ rotulo, variante = "contorno", className = "", ...painel }: Props) {
  const botao = useRef<HTMLButtonElement>(null);
  const [aberto, setAberto] = useState(false);

  const fechar = () => {
    setAberto(false);
    botao.current?.focus(); // o foco volta ao botão que abriu
  };

  return (
    <>
      <button
        ref={botao}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setAberto(true)}
        onPointerEnter={() => void carregarPainel()}
        onFocus={() => void carregarPainel()}
        className={`${estilosBotao[variante]} ${className}`}
      >
        {rotulo}
      </button>
      {aberto && (
        <Suspense fallback={null}>
          <Painel {...painel} aoFechar={fechar} />
        </Suspense>
      )}
    </>
  );
}
