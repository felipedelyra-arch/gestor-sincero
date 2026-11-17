import { Newsreader } from "next/font/google";

// Só é importada pelo layout quando `site.tipografiaManifesto === "serifa"`; com "outfit" esta fonte nem é pedida.
export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});
