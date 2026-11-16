"use client";

import type { MouseEvent, ReactNode } from "react";
import { montarLinkCheckout } from "../global/origem";
import { dispararEvento } from "../global/Rastreamento";

type Props = {
  href: string;
  evento: "clique_checkout" | "clique_whatsapp";
  className?: string;
  children: ReactNode;
};

/** Link externo que avisa o rastreamento e, no checkout, leva UTM e afiliado. */
export function LinkRastreado({ href, evento, className, children }: Props) {
  const aoClicar = (e: MouseEvent<HTMLAnchorElement>) => {
    // O href é completado no clique, antes de o navegador seguir o link.
    if (evento === "clique_checkout") e.currentTarget.href = montarLinkCheckout(href);
    dispararEvento(evento);
  };
  const externo = evento === "clique_whatsapp";
  return (
    <a
      href={href}
      className={className}
      onClick={aoClicar}
      onAuxClick={aoClicar}
      {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}
