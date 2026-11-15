import fs from "node:fs";
import path from "node:path";
import { preload } from "react-dom";
import { z } from "zod";

// Formato esperado de public/img/manifest.json (gerado pelo terminal de Assets):
// { "ferrer-retrato": { "larguras": [480, 768, 1080], "formatos": ["avif", "webp"], "largura": 1080, "altura": 1350 } }
// Arquivos: /img/<nome>-<largura>.<formato>. `largura` e `altura` são as dimensões do maior arquivo.
const manifestSchema = z.record(
  z.string(),
  z.object({
    larguras: z.array(z.number().int().positive()).min(1),
    formatos: z.array(z.enum(["avif", "webp", "jpg", "png"])).min(1),
    largura: z.number().int().positive(),
    altura: z.number().int().positive(),
    pasta: z.string().regex(/^[\w/-]+$/).optional(), // subpasta de /img, ex.: "ressonancia"
  }),
);

function lerManifest(): z.infer<typeof manifestSchema> {
  try {
    const bruto: unknown = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/img/manifest.json"), "utf8"));
    const r = manifestSchema.safeParse(bruto);
    return r.success ? r.data : {};
  } catch {
    return {}; // manifest ainda não gerado
  }
}

const manifest = lerManifest();

type Props = {
  /** Chave no manifest, ex.: "ferrer-retrato". */
  nome: string;
  alt: string;
  /** Atributo `sizes` do srcset. */
  tamanhos: string;
  /** Dimensões provisórias, usadas só enquanto a imagem não estiver no manifest. */
  largura: number;
  altura: number;
  /** Imagem do topo: carrega já, com prioridade alta. As demais carregam quando se aproximam da tela. */
  prioridade?: boolean;
  className?: string;
};

/** `<picture>` com avif/webp responsivos a partir do manifest. Componente de servidor. */
export function Imagem({ nome, alt, tamanhos, largura, altura, prioridade = false, className }: Props) {
  const entrada = manifest[nome];

  if (!entrada) {
    // Reserva o espaço com a proporção provisória para o layout não saltar quando a imagem chegar.
    return (
      <div role="img" aria-label={alt} style={{ aspectRatio: `${largura} / ${altura}` }} className={`bg-preto-2 ${className ?? ""}`} />
    );
  }

  const base = `/img/${entrada.pasta ? `${entrada.pasta}/` : ""}${nome}`;
  const srcset = (formato: string) => entrada.larguras.map((l) => `${base}-${l}.${formato} ${l}w`).join(", ");
  const [primeiro] = entrada.formatos;
  const reserva = entrada.formatos[entrada.formatos.length - 1];
  const maior = Math.max(...entrada.larguras);

  if (prioridade) {
    preload(`${base}-${maior}.${primeiro}`, {
      as: "image",
      imageSrcSet: srcset(primeiro),
      imageSizes: tamanhos,
      type: `image/${primeiro}`,
      fetchPriority: "high",
    });
  }

  return (
    <picture>
      {entrada.formatos.slice(0, -1).map((formato) => (
        <source key={formato} type={`image/${formato}`} srcSet={srcset(formato)} sizes={tamanhos} />
      ))}
      {/* eslint-disable-next-line @next/next/no-img-element -- srcset próprio a partir do manifest, sem otimizador em tempo de execução */}
      <img
        src={`${base}-${maior}.${reserva}`}
        srcSet={srcset(reserva)}
        sizes={tamanhos}
        width={entrada.largura}
        height={entrada.altura}
        alt={alt}
        loading={prioridade ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={prioridade ? "high" : undefined}
        className={className}
      />
    </picture>
  );
}
