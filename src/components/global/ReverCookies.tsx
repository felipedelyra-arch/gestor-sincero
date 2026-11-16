"use client";

import { limparConsentimento } from "./consentimento";

export function ReverCookies({ rotulo, className }: { rotulo: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={limparConsentimento}>
      {rotulo}
    </button>
  );
}
