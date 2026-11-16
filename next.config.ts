import type { NextConfig } from "next";

const dev = process.env.NODE_ENV === "development";

// Domínio do checkout da mentoria: entra em form-action quando o link existir (PENDENTE FERRÉR).
// Ex.: CHECKOUT_ORIGEM=https://pay.exemplo.com.br
const checkoutOrigem = process.env.CHECKOUT_ORIGEM ? ` ${new URL(process.env.CHECKOUT_ORIGEM).origin}` : "";

// script-src leva 'unsafe-inline' porque a página estática do Next hidrata por scripts inline e
// nonce exigiria renderização dinâmica. Limite e plano de saída em docs/adr/0002-csp.md.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://connect.facebook.net https://www.googletagmanager.com${dev ? " 'unsafe-eval'" : ""}`,
  // <style> inline bloqueado; só o atributo style (next/image, animações) é liberado.
  `style-src 'self'${dev ? " 'unsafe-inline'" : ""}`,
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.facebook.com https://*.google-analytics.com https://*.analytics.google.com",
  "font-src 'self'",
  `connect-src 'self' https://www.facebook.com https://*.google-analytics.com https://*.analytics.google.com${dev ? " ws:" : ""}`,
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  `form-action 'self'${checkoutOrigem}`,
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const headersDeSeguranca = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), hid=(), midi=(), accelerometer=(), gyroscope=(), magnetometer=(), display-capture=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    // Hash de integridade (SRI) nos scripts do build: arquivo adulterado no caminho não executa.
    sri: { algorithm: "sha256" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: headersDeSeguranca },
      // A imagem de compartilhamento precisa abrir em outros sites (prévias de link que exibem a imagem direto).
      { source: "/og.jpg", headers: [{ key: "Cross-Origin-Resource-Policy", value: "cross-origin" }] },
    ];
  },
};

export default nextConfig;
