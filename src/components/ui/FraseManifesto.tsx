type Props = { children: string; className?: string };

/** Frase-manifesto em destaque editorial. Não é título: quem estrutura a página são h1 e h2. */
export function FraseManifesto({ children, className = "" }: Props) {
  return <p className={`font-titulo text-manifesto font-medium text-balance ${className}`}>{children}</p>;
}
