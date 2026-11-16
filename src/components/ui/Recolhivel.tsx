import type { ReactNode } from "react";
import { SinalAbrir } from "./SinalAbrir";

type Props = { titulo: string; children: ReactNode; className?: string };

/**
 * Lista que no celular fica recolhida em `details` (fechado) e no desktop aparece inteira sob o título.
 * O conteúdo é renderizado nas duas versões; a que não vale para a largura fica `display: none`.
 */
export function Recolhivel({ titulo, children, className = "" }: Props) {
  return (
    <div className={className}>
      <details className="group border-y border-chumbo lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4">
          <h3 className="font-titulo text-h3 font-medium">{titulo}</h3>
          <SinalAbrir />
        </summary>
        <div className="pb-4">{children}</div>
      </details>
      <div className="max-lg:hidden">
        <h3 className="font-titulo text-h3 font-medium">{titulo}</h3>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
