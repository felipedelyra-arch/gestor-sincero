import type { MetadataRoute } from "next";
import { site } from "@config/site";

export default function robots(): MetadataRoute.Robots {
  if (!site.indexar) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
