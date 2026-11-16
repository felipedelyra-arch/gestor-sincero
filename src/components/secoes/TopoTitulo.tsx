"use client";

import { useSyncExternalStore } from "react";
import type { Pagina } from "@content";
import { extrairOrigem } from "../global/origem";

// Só `?v=b` troca; qualquer outro valor é A.
const lerVariacaoUrl = () => extrairOrigem(window.location.search).variacao;

const semAssinatura = () => () => {};

type Props = { variacoes: Pagina["topo"]["variacoes"] };

/** Título e subtítulo do topo. O HTML estático sai com a variação A; `?v=b` troca no cliente. */
export function TopoTitulo({ variacoes }: Props) {
  const variacao = useSyncExternalStore(semAssinatura, lerVariacaoUrl, () => "a" as const);
  const { titulo, subtitulo } = variacoes[variacao];
  return (
    <>
      <h1 className="entra font-titulo text-manifesto font-medium text-balance">{titulo}</h1>
      <p className="entra mt-6 max-w-texto font-titulo text-h3 text-texto-2 [--ordem:1]">{subtitulo}</p>
    </>
  );
}
