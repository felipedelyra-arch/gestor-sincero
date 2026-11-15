import { dadosEstruturados } from "@/app/metadados";

export function DadosEstruturados() {
  return (
    <script
      type="application/ld+json"
      // Único uso permitido: JSON gerado por nós, com "<" escapado para não fechar a tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados).replace(/</g, "\\u003c") }}
    />
  );
}
