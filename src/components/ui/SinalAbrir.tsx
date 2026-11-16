const traco = "absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ouro";

/** Sinal de mais que vira menos quando o `details` pai (com a classe `group`) abre. */
export function SinalAbrir({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative size-4 shrink-0 ${className}`}>
      <span className={traco} />
      <span className={`${traco} rotate-90 transition-transform duration-200 group-open:rotate-0 motion-reduce:transition-none`} />
    </span>
  );
}
