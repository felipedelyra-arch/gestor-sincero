"use client";

import { lazy, Suspense, useRef, useState } from "react";
import { estilosBotao, type VarianteBotao } from "../ui/estilos";
import type { PropsPainel } from "./PapoReto";

// O painel (e o texto da conversa) só são baixados no clique: nada de pré-carregar ao passar o ponteiro ou focar.
const carregarPainel = () => import("./PapoReto");
const Painel = lazy(carregarPainel);

type Props = Omit<PropsPainel, "aoFechar"> & {
  rotulo: string;
  /** Texto do botão enquanto o código do painel chega (vem do conteúdo). */
  rotuloCarregando: string;
  variante?: VarianteBotao;
  className?: string;
};

export function BotaoPapoReto({ rotulo, rotuloCarregando, variante = "contorno", className = "", ...painel }: Props) {
  const botao = useRef<HTMLButtonElement>(null);
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const abrir = async () => {
    if (carregando) return;
    setCarregando(true);
    try {
      await carregarPainel(); // o módulo fica em cache: o `lazy` abaixo resolve na hora
      setAberto(true);
    } catch {
      // sem rede o clique não abre nada; o botão volta ao normal para tentar de novo
    } finally {
      setCarregando(false);
    }
  };

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
        aria-busy={carregando || undefined}
        aria-disabled={carregando || undefined}
        onClick={() => void abrir()}
        className={`${estilosBotao[variante]} ${className}`}
      >
        {carregando ? rotuloCarregando : rotulo}
      </button>
      {/* Leitor de tela: avisa que o painel está chegando (a troca de texto do botão sozinha não é anunciada). */}
      <span role="status" className="sr-only">
        {carregando ? rotuloCarregando : ""}
      </span>
      {aberto && (
        <Suspense fallback={null}>
          <Painel {...painel} aoFechar={fechar} />
        </Suspense>
      )}
    </>
  );
}
