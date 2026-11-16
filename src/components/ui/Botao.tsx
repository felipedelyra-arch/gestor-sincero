import { pagina, type Chamada } from "@content";
import { site } from "@config/site";
import { estilosBotao, type VarianteBotao } from "./estilos";
import { LinkRastreado } from "./LinkRastreado";

type Destino = { href: string; evento?: "clique_checkout" | "clique_whatsapp" };

// Valor pendente (null) em config: o checkout cai para a captação; o WhatsApp não aparece.
function resolver(destino: Chamada["destino"]): Destino | null {
  switch (destino) {
    case "captacao":
      return { href: "#jornada" };
    case "mentoria":
      return { href: "#mentoria" };
    case "ressonancia":
      return { href: "#ressonancia" };
    case "checkout":
      return site.mentoria.checkoutUrl
        ? { href: site.mentoria.checkoutUrl, evento: "clique_checkout" }
        : { href: "#jornada" };
    case "whatsapp":
      return site.contatos.whatsapp
        ? {
            href: `https://wa.me/${site.contatos.whatsapp}?text=${encodeURIComponent(pagina.whatsapp.mensagem)}`,
            evento: "clique_whatsapp",
          }
        : null;
  }
}

type Props = {
  chamada: Chamada;
  variante?: VarianteBotao;
  className?: string;
  /** Prefixo das âncoras internas, para uso fora da página inicial (ex.: "/" nas páginas legais). */
  base?: string;
};

export function Botao({ chamada, variante = "principal", className = "", base = "" }: Props) {
  const resolvido = resolver(chamada.destino);
  if (!resolvido) return null;
  const destino = resolvido.href.startsWith("#") ? { ...resolvido, href: base + resolvido.href } : resolvido;
  const classes = `${estilosBotao[variante]} ${className}`;

  if (destino.evento) {
    return (
      <LinkRastreado href={destino.href} evento={destino.evento} className={classes}>
        {chamada.rotulo}
      </LinkRastreado>
    );
  }
  return (
    <a href={destino.href} className={classes}>
      {chamada.rotulo}
    </a>
  );
}
