import { useSyncExternalStore } from "react";

export type Consentimento = "aceito" | "recusado" | null;

export const CHAVE_CONSENTIMENTO = "gs_cookies";
export const EVENTO_CONSENTIMENTO = "gs:consentimento";

export function lerConsentimento(): Consentimento {
  try {
    const v = window.localStorage.getItem(CHAVE_CONSENTIMENTO);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    return null; // armazenamento bloqueado: trata como sem resposta (nada é rastreado)
  }
}

export function gravarConsentimento(valor: Exclude<Consentimento, null>): void {
  try {
    window.localStorage.setItem(CHAVE_CONSENTIMENTO, valor);
  } catch {
    // sem armazenamento a escolha vale só até recarregar a página
  }
  window.dispatchEvent(new CustomEvent<Consentimento>(EVENTO_CONSENTIMENTO, { detail: valor }));
}

// Escolha feita sem armazenamento disponível: mantida em memória até recarregar.
let emMemoria: Consentimento = null;

function assinar(aoMudar: () => void): () => void {
  const ouvir = (e: Event) => {
    emMemoria = (e as CustomEvent<Consentimento>).detail;
    aoMudar();
  };
  window.addEventListener(EVENTO_CONSENTIMENTO, ouvir);
  window.addEventListener("storage", aoMudar); // outra aba
  return () => {
    window.removeEventListener(EVENTO_CONSENTIMENTO, ouvir);
    window.removeEventListener("storage", aoMudar);
  };
}

/** `undefined` no servidor e antes da hidratação (ainda não se sabe a resposta). */
export function useConsentimento(): Consentimento | undefined {
  return useSyncExternalStore<Consentimento | undefined>(
    assinar,
    () => lerConsentimento() ?? emMemoria,
    () => undefined,
  );
}
