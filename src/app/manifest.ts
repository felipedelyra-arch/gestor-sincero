import type { MetadataRoute } from "next";
import { pagina } from "@content";
import { site } from "@config/site";

// Mesmo preto de --color-preto (tokens.css); o manifesto não lê CSS.
const PRETO = "#070809";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.nome,
    short_name: site.nome,
    description: pagina.seo.descricao,
    lang: "pt-BR",
    start_url: "/",
    display: "browser",
    background_color: PRETO,
    theme_color: PRETO,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
