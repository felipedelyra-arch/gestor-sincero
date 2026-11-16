import { papoReto } from "@content";
import { site } from "@config/site";
import type { VarianteBotao } from "../ui/estilos";
import { BotaoPapoReto } from "./BotaoPapoReto";

/** Botão que abre a conversa. Fica fora da página quando o Papo reto está desligado (`site.papoReto.ativo`). */
export function ConversaPapoReto({ variante, className }: { variante?: VarianteBotao; className?: string }) {
  if (!site.papoReto.ativo) return null;
  return (
    <BotaoPapoReto
      rotulo={papoReto.rotuloBotao}
      variante={variante}
      className={className}
      videos={site.papoReto.videos}
      linkRessonancia={site.links.ressonancia}
      turnstileSiteKey={site.turnstileSiteKey}
    />
  );
}
