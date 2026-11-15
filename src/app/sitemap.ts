import type { MetadataRoute } from "next";
import { site } from "@config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.indexar) return [];
  return ["/", site.links.privacidade, site.links.termos].map((caminho) => ({
    url: new URL(caminho, site.url).toString(),
  }));
}
