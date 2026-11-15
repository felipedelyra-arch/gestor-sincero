import { pagina } from "@content";
import { site } from "@config/site";
import { DocumentoLegal } from "@/components/global/DocumentoLegal";
import { metadataLegal } from "../metadados";

const documento = pagina.legal.termos;

export const metadata = metadataLegal(documento.titulo, site.links.termos);

export default function Page() {
  return <DocumentoLegal documento={documento} />;
}
