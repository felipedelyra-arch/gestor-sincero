import { Inter, Outfit } from "next/font/google";
import { pagina } from "@content";
import { site } from "@config/site";
import { BannerCookies } from "@/components/global/BannerCookies";
import { BotaoWhatsApp } from "@/components/global/BotaoWhatsApp";
import { CapturaOrigem } from "@/components/global/CapturaOrigem";
import { DadosEstruturados } from "@/components/global/DadosEstruturados";
import { Rastreamento } from "@/components/global/Rastreamento";
import { Revelacao } from "@/components/global/Revelacao";
import "./globals.css";

export { metadata } from "./metadados";

// Só a fonte dos títulos é pré-carregada; a do corpo entra por troca (swap).
const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-inter" });

const PULAR = pagina.pularParaConteudo;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable} antialiased`}>
      <body className="bg-preto">
        <a
          href="#conteudo"
          className="sr-only rounded-base bg-ouro px-4 py-3 font-medium text-preto focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
        >
          {PULAR}
        </a>
        {children}
        {/* Os globais são de cliente e recebem só o que usam: conteúdo, config e Zod ficam no servidor. */}
        {site.contatos.whatsapp && (
          <BotaoWhatsApp
            numero={site.contatos.whatsapp}
            rotuloBotao={pagina.whatsapp.rotuloBotao}
            mensagem={pagina.whatsapp.mensagem}
          />
        )}
        <BannerCookies
          texto={pagina.cookies.texto}
          aceitar={pagina.cookies.aceitar}
          recusar={pagina.cookies.recusar}
          rotuloPolitica={pagina.cookies.rotuloPolitica}
          linkPolitica={site.links.privacidade}
        />
        <CapturaOrigem />
        <Rastreamento metaPixelId={site.rastreamento.metaPixelId} ga4Id={site.rastreamento.ga4Id} />
        <DadosEstruturados />
        <Revelacao />
      </body>
    </html>
  );
}
