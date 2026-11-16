type Props = { children: string; className?: string };

/** Frase-manifesto em destaque (36px no desktop). Não é título, e aparece no máximo uma vez por seção. */
export function FraseManifesto({ children, className = "" }: Props) {
  return <p className={`font-titulo text-manifesto font-medium text-balance ${className}`}>{children}</p>;
}
