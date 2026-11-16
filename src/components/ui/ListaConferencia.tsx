type Props = { itens: string[]; marca?: "sim" | "nao"; className?: string };

/** Lista de conferência: marca de visto em ouro ("sim") ou traço em chumbo ("nao") antes de cada item. */
export function ListaConferencia({ itens, marca = "sim", className = "" }: Props) {
  return (
    <ul className={`grid gap-2 ${className}`}>
      {itens.map((item, n) => (
        // lista estática: índice é chave estável, e itens pendentes podem se repetir
        <li key={n} className="flex gap-3">
          <svg aria-hidden="true" viewBox="0 0 16 16" className={`mt-[0.4em] size-4 shrink-0 ${marca === "sim" ? "text-ouro" : "text-texto-2"}`}>
            <path
              d={marca === "sim" ? "M3 8.5l3.2 3L13 4.5" : "M3.5 8h9"}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
