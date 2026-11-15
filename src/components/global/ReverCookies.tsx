"use client";

import { pagina } from "@content";
import { limparConsentimento } from "./consentimento";

export function ReverCookies({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={limparConsentimento}>
      {pagina.cookies.rever}
    </button>
  );
}
