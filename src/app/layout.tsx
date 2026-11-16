import { Inter, Outfit } from "next/font/google";
import { RolagemSuave } from "@/components/RolagemSuave";
import "./globals.css";

export { metadata } from "./metadados";

// Só a fonte dos títulos é pré-carregada; a do corpo entra por troca (swap).
const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-inter" });

// shortcut: texto do link de pular fixo aqui porque o schema de conteúdo ainda não tem a chave;
// mover para content/ quando o orquestrador criar o campo.
const PULAR = "Pular para o conteúdo";

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
        <RolagemSuave />
      </body>
    </html>
  );
}
