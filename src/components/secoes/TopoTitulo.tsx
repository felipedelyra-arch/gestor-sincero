"use client";

import { useSyncExternalStore } from "react";
import type { Pagina } from "@content";
import { extrairOrigem } from "../global/origem";

// Só `?v=b` troca; qualquer outro valor é A.
const lerVariacaoUrl = () => extrairOrigem(window.location.search).variacao;

const semAssinatura = () => () => {};

type Props = { variacoes: Pagina["topo"]["variacoes"] };

/** Título (em manifesto) e subtítulo do topo. O HTML estático sai com a variação A; `?v=b` troca no cliente. */
export function TopoTitulo({ variacoes }: Props) {
  const variacao = useSyncExternalStore(semAssinatura, lerVariacaoUrl, () => "a" as const);
  const { titulo, subtitulo } = variacoes[variacao];
  return (
    <>
      {/* a única entrada animada do topo: o título, por opacidade */}
      <h1 className="entra manifesto relative z-1 text-balance">{titulo}</h1>
      <p className="relative z-1 mt-4 max-w-[52ch] text-pretty max-sm:text-corpo sm:text-lead lg:mt-8">{subtitulo}</p>
    </>
  );
}
