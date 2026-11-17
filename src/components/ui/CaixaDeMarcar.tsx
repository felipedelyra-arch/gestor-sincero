import type { ComponentProps, ReactNode } from "react";

type Props = { rotulo: ReactNode; className?: string } & Omit<ComponentProps<"input">, "type" | "className">;

/** Caixa nativa (teclado e leitor de tela de graça) com desenho próprio. A linha inteira é clicável. */
export function CaixaDeMarcar({ rotulo, className = "py-2.5", ...entrada }: Props) {
  return (
    <label className={`relative flex min-h-12 cursor-pointer items-start gap-4 ${className}`}>
      <input type="checkbox" className="peer sr-only" {...entrada} />
      <span
        aria-hidden="true"
        className="grid size-7 shrink-0 place-items-center rounded-base border border-ouro-escuro outline-offset-2 outline-ouro peer-checked:border-ouro peer-focus-visible:outline-2 peer-aria-invalid:border-erro *:opacity-0 peer-checked:*:opacity-100"
      >
        <svg viewBox="0 0 16 16" className="size-4 text-ouro transition-opacity duration-200">
          <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
      <span>{rotulo}</span>
    </label>
  );
}
