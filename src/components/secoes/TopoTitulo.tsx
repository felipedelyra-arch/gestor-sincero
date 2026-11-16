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
      <h1 className="entra col-start-1 row-start-1 font-titulo text-h1 font-medium text-balance">{titulo}</h1>
      <p className="entra col-span-2 mt-4 max-w-[52ch] text-pretty text-texto-2 lg:mt-5">{subtitulo}</p>
    </>
  );
}
