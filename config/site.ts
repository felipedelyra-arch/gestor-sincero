import { z } from "zod";

// Sem compilação por eval: a CSP não permite e a sondagem do Zod gera uma violação a cada carga.
z.config({ jitless: true });

// Regra: `null` significa PENDENTE (aguardando o Ferrér, ver docs/PERGUNTAS_FERRER.md).
// Componentes escondem o bloco ou mostram texto neutro quando o valor é null; nunca inventam.

const pendente = <T extends z.ZodType>(tipo: T) => tipo.nullable();
const centavos = z.number().int().positive();
const dataIso = z.iso.date(); // "2026-12-01"

const siteSchema = z.object({
  nome: z.string().min(1),
  url: z.url(),
  indexar: z.boolean(), // false na prévia: robots noindex
  video: z.object({ url: pendente(z.url()) }),
  jornada: z.object({
    horario: z.string().min(1),
    datas: z.tuple([pendente(dataIso), pendente(dataIso), pendente(dataIso)]),
  }),
  manual: z.object({
    precoFisicoCentavos: centavos,
    ofertaCentavos: centavos,
    ofertaParcelas: z.object({ vezes: z.number().int().positive(), valorCentavos: centavos }),
  }),
  mentoria: z.object({
    duracaoMeses: z.number().int().positive(),
    garantiaDias: z.number().int().positive(),
    precoCentavos: pendente(centavos),
    parcelas: pendente(z.object({ vezes: z.number().int().positive(), valorCentavos: centavos })),
    checkoutUrl: pendente(z.url()),
  }),
  revista: z.object({ precoAnualCentavos: centavos }),
  contatos: z.object({
    whatsapp: pendente(z.string().regex(/^55\d{10,11}$/)), // só dígitos, com DDI
    email: pendente(z.email()),
    instagram: pendente(z.url()),
  }),
  // PENDENTE: o certificado diz "Prêmio Tupaenses Excelentes"; o briefing também traz "Prêmio Excelência Tupaense".
  // A página exibe `nomeConfirmado` quando houver; até lá, o nome do certificado.
  premio: z.object({
    nomeConfirmado: pendente(z.string().min(1)),
    nomeNoCertificado: z.string().min(1),
    nomeAlternativo: z.string().min(1),
    ano: z.number().int(),
  }),
  empresa: z.object({
    razaoSocial: pendente(z.string().min(1)),
    cnpj: pendente(z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)),
  }),
  links: z.object({ privacidade: z.string().min(1), termos: z.string().min(1), ressonancia: z.string().min(1) }),
  rastreamento: z.object({
    metaPixelId: pendente(z.string().regex(/^\d+$/)),
    ga4Id: pendente(z.string().regex(/^G-[A-Z0-9]+$/)),
  }),
  turnstileSiteKey: z.string().min(1),
  // Design v2 (docs/DESIGN-v2.md): propostas aguardando o Felipe.
  tipografiaManifesto: z.enum(["outfit", "serifa"]),
  secaoPapel: z.boolean(),
  // Seção 03: sem estudo e ano confirmados, a seção inteira não aparece.
  dados: z.object({ fonte: pendente(z.string().min(1)) }),
  // PENDENTE: o briefing diz 40 anos de carreira; o certificado do prêmio diz 35.
  ferrer: z.object({ anosCarreira: z.number().int(), livros: z.number().int() }),
  // Papo reto (ADR 0003): desligado em produção até haver chaves e a autorização de imagem do Ferrér.
  papoReto: z.object({ ativo: z.boolean(), videos: z.string().min(1) }),
});

export type Site = z.infer<typeof siteSchema>;

export const site: Site = siteSchema.parse({
  nome: "Gestor Sincero",
  // PENDENTE: domínio. Sem a variável, a prévia da Vercel usa o endereço do próprio deploy.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  indexar: false,
  video: { url: null },
  jornada: { horario: "20h30", datas: [null, null, null] },
  manual: {
    precoFisicoCentavos: 8990,
    ofertaCentavos: 6990,
    ofertaParcelas: { vezes: 3, valorCentavos: 2330 },
  },
  mentoria: {
    duracaoMeses: 6,
    garantiaDias: 7,
    precoCentavos: null, // briefing cita R$ 4.500; aguardando confirmação
    parcelas: null, // briefing diverge entre 10x e 12x
    checkoutUrl: null,
  },
  revista: { precoAnualCentavos: 19900 },
  contatos: { whatsapp: null, email: null, instagram: null },
  premio: {
    nomeConfirmado: null,
    nomeNoCertificado: "Prêmio Tupaenses Excelentes",
    nomeAlternativo: "Prêmio Excelência Tupaense",
    ano: 2025,
  },
  empresa: { razaoSocial: null, cnpj: null },
  links: { privacidade: "/privacidade", termos: "/termos", ressonancia: "/ressonancia" },
  rastreamento: {
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? null,
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? null,
  },
  // Chave de teste pública da Cloudflare (sempre aprova); trocar pela real via env.
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA",
  tipografiaManifesto: "outfit",
  secaoPapel: true,
  dados: { fonte: null },
  ferrer: { anosCarreira: 40, livros: 3 },
  papoReto: {
    ativo: process.env.NEXT_PUBLIC_PAPO_RETO === "1" || process.env.NODE_ENV !== "production",
    videos: "/ferrer-avatar", // ferrer-{ouvindo,falando,cetico}-{16x9,1x1}.{mp4,webm} e ferrer-poster-*.jpg
  },
});
