import { Newsreader } from "next/font/google";

// Só é importada pelo layout quando `site.tipografiaManifesto === "serifa"`; com "outfit" esta fonte nem é pedida.
export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "600"], // 600: o termo em negrito dos verbetes do Dicionário
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});
