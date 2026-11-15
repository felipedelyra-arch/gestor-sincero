import type { Metadata } from "next";
import { pagina } from "@content";
import { site } from "@config/site";

const { titulo, descricao } = pagina.seo;
const og = { url: "/og.jpg", width: 1200, height: 630, alt: pagina.topo.altFoto };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: titulo,
  description: descricao,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.nome,
    title: titulo,
    description: descricao,
    images: [og],
  },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: [og.url] },
  robots: site.indexar ? { index: true, follow: true } : { index: false, follow: false },
};

/** Metadados das páginas legais: título próprio e canonical próprio. */
export function metadataLegal(tituloPagina: string, caminho: string): Metadata {
  return { title: `${tituloPagina} | ${site.nome}`, alternates: { canonical: caminho } };
}

// --- JSON-LD. Só entra o que existe em content/ e config/; pendente fica de fora. ---

const idOrganizacao = `${site.url}/#organizacao`;
const { contatos, empresa, mentoria, jornada } = site;
const perfis = [contatos.instagram].filter((v): v is string => v !== null);

const organizacao = {
  "@type": "Organization",
  "@id": idOrganizacao,
  name: site.nome,
  url: site.url,
  description: pagina.rodape.descricao,
  ...(empresa.razaoSocial && { legalName: empresa.razaoSocial }),
  ...(contatos.email && { email: contatos.email }),
  ...(perfis.length > 0 && { sameAs: perfis }),
};

// shortcut: o conteúdo não tem um campo só com o nome da pessoa; usa o nome da marca-personagem.
// Trocar quando o schema ganhar esse campo (pedido ao orquestrador).
const pessoa = {
  "@type": "Person",
  "@id": `${site.url}/#pessoa`,
  name: site.nome,
  description: pagina.quemE.paragrafos[0],
  award: pagina.quemE.premio.nome,
  url: site.url,
  worksFor: { "@id": idOrganizacao },
};

const curso = {
  "@type": "Course",
  name: pagina.oferta.titulo,
  description: pagina.oferta.introducao,
  url: site.url,
  inLanguage: "pt-BR",
  provider: { "@id": idOrganizacao },
  ...(mentoria.precoCentavos !== null && {
    offers: {
      "@type": "Offer",
      category: "Paid",
      price: (mentoria.precoCentavos / 100).toFixed(2),
      priceCurrency: "BRL",
      ...(mentoria.checkoutUrl && { url: mentoria.checkoutUrl }),
    },
  }),
};

// Uma reunião por data; só entra quando as três datas estiverem definidas.
const datas = jornada.datas.filter((d): d is string => d !== null);
const eventos =
  datas.length === jornada.datas.length
    ? datas.map((data, i) => ({
        "@type": "Event",
        name: pagina.jornada.pautas[i].titulo,
        description: pagina.jornada.pautas[i].descricao,
        superEvent: { "@type": "EventSeries", name: pagina.jornada.titulo },
        startDate: data,
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "VirtualLocation", url: site.url },
        organizer: { "@id": idOrganizacao },
        isAccessibleForFree: true,
      }))
    : [];

export const dadosEstruturados = {
  "@context": "https://schema.org",
  "@graph": [organizacao, pessoa, curso, ...eventos],
};
