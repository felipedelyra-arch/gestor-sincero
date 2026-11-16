// Gera todas as imagens de public/ a partir de docs/fonte/. Uso: scripts/pesado.sh node scripts/assets/gerar-imagens.mjs  (precisa de uvx, soffice e pdftoppm; intermediários lentos ficam em node_modules/.cache/gerar-imagens, apague a pasta para refazer do zero)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const fonte = path.join(raiz, "docs/fonte");
const pub = path.join(raiz, "public");
const img = path.join(pub, "img");
const cache = path.join(raiz, "node_modules/.cache/gerar-imagens");
const outfit = path.join(raiz, "scripts/assets/fonts/Outfit.ttf");
const PRETO = "#070809";
const TEXTO = "#F2F0EA";
const OURO = "#CEA33D";
const CHUMBO = "#2A2C30";
const LIMITE = 250 * 1024;

for (const d of [cache, img, path.join(img, "ressonancia")]) mkdirSync(d, { recursive: true });

const manifest = {};

/** Grava base-{largura}.{formato} para cada largura e registra no manifest. `origem` devolve um sharp novo. */
async function variantes(nome, origem, larguras, formatos, q = {}) {
  let maior;
  for (const l of larguras) {
    for (const f of formatos) {
      const p = origem().resize({ width: l, withoutEnlargement: true });
      if (f === "avif") p.avif({ quality: q.avif ?? 55, effort: 5 });
      if (f === "webp") p.webp({ quality: q.webp ?? 78, alphaQuality: 90, effort: 6 });
      if (f === "png") p.png({ compressionLevel: 9 });
      const info = await p.toFile(path.join(img, `${nome}-${l}.${f}`));
      if (info.width !== l) throw new Error(`${nome}-${l}.${f}: largura real ${info.width}`);
      maior = [info.width, info.height];
    }
  }
  // contrato lido por src/components/ui/Imagem.tsx: largura e altura são do maior arquivo
  manifest[nome] = { larguras, formatos, largura: maior[0], altura: maior[1] };
}

/** Texto em Outfit 500 como PNG transparente. */
function texto(conteudo, px, { cor = TEXTO, largura, entrelinha = 0 } = {}) {
  return sharp({
    text: {
      text: `<span foreground="${cor}" letter_spacing="${Math.round(-0.02 * px * 1024)}">${conteudo}</span>`,
      font: `Outfit Medium ${px}`,
      fontfile: outfit,
      rgba: true,
      dpi: 72,
      spacing: entrelinha,
      ...(largura ? { width: largura } : {}),
    },
  }).png().toBuffer();
}

// 1. Retrato: a foto vem em fundo quase branco. O rembg (modelo leve) dá a silhueta, mas folgada: sobra um contorno claro.
// Por isso o fundo final é o branco ligado à borda da imagem, sem passar de 10px para dentro da silhueta do rembg
// (o limite protege a barba branca, que encosta no fundo).
const recorte = path.join(cache, "retrato-recortado.png");
if (!existsSync(recorte)) {
  execFileSync("uvx", ["--from", "rembg[cpu,cli]", "rembg", "i", "-m", "u2net_human_seg", path.join(fonte, "ferrer-retrato.jpg"), recorte], { stdio: "inherit" });
}
const retrato = await (async () => {
  const { data: rgb, info } = await sharp(path.join(fonte, "ferrer-retrato.jpg")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  // toColourspace("b-w"): sem ele o sharp devolve 3 canais e a máscara sai errada
  // atenção: no sharp 0.35, em máscara de 1 canal, dilate() ENCOLHE o branco e erode() aumenta (conferido abaixo)
  const mascara = await sharp(recorte).extractChannel(3).toColourspace("b-w").raw().toBuffer();
  const miolo = await sharp(recorte).extractChannel(3).dilate(10).toColourspace("b-w").raw().toBuffer();
  const brancos = (b) => b.reduce((s, v) => s + (v >= 128 ? 1 : 0), 0);
  if (brancos(miolo) >= brancos(mascara)) throw new Error("dilate() não encolheu a máscara: o sharp mudou de comportamento, troque por erode()");
  if (miolo.length !== width * height) throw new Error("máscara do rembg com tamanho diferente da foto; apague o cache");
  const fundo = new Uint8Array(width * height);
  const fila = [];
  const semear = (i) => {
    if (fundo[i] || miolo[i] >= 128 || Math.min(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]) <= 225) return;
    fundo[i] = 1;
    fila.push(i);
  };
  for (let x = 0; x < width; x++) { semear(x); semear((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { semear(y * width); semear(y * width + width - 1); }
  while (fila.length) {
    const i = fila.pop();
    const x = i % width;
    if (x > 0) semear(i - 1);
    if (x < width - 1) semear(i + 1);
    if (i >= width) semear(i - width);
    if (i < fundo.length - width) semear(i + width);
  }
  const parte = fundo.reduce((s, f) => s + f, 0) / fundo.length;
  if (parte < 0.3 || parte > 0.7) throw new Error(`recorte do retrato suspeito: fundo = ${Math.round(parte * 100)}% da imagem`);
  // a borda recua 2px para tirar a franja clara da compressão e é suavizada
  const cru = Buffer.from(fundo.map((f) => (f ? 0 : 255)));
  const alfa = await sharp(cru, { raw: { width, height, channels: 1 } }).dilate(2).blur(1).toColourspace("b-w").raw().toBuffer();
  return sharp(rgb, { raw: info }).joinChannel(alfa, { raw: { width, height, channels: 1 } }).png().toBuffer();
})();
await variantes("ferrer-retrato", () => sharp(retrato), [480, 768, 1080], ["avif", "webp"]);

// 2. Prêmio e 4. capa: só redimensionar.
await variantes("ferrer-premio", () => sharp(path.join(fonte, "ferrer-premio.jpg")), [480, 768, 1080], ["avif", "webp"]);
await variantes("capa-ressonancia", () => sharp(path.join(fonte, "capa-ressonancia.jpg")), [768, 1280, 1600], ["avif", "webp"]);

// 3. Logo: o dourado tem croma alto, o branco e a sombra cinza não; o croma vira o alfa.
const logo = await (async () => {
  const { data, info } = await sharp(path.join(fonte, "logo-gestor-sincero.jpg")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const alfa = Buffer.alloc(width * height);
  for (let i = 0; i < alfa.length; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const croma = Math.max(r, g, b) - Math.min(r, g, b);
    alfa[i] = Math.max(0, Math.min(255, (croma - 10) * 16)); // sombra cinza: croma até ~8; brilho do dourado: a partir de ~35
  }
  // recua a borda ~1px para não sobrar pixel claro de transição
  const alfaFino = await sharp(alfa, { raw: { width, height, channels: 1 } }).blur(1).linear(2.4, -255 * 1.4).toColourspace("b-w").raw().toBuffer();
  const rgba = await sharp(data, { raw: info }).joinChannel(alfaFino, { raw: { width, height, channels: 1 } }).png().toBuffer();
  return sharp(rgba).trim({ threshold: 1 }).png().toBuffer();
})();
await variantes("logo-gestor-sincero", () => sharp(logo), [320, 640], ["webp", "png"], { webp: 90 });

// 5. Deck: pptx -> pdf -> png, com o selo cobrindo a faixa do rodapé do slide (que já repete "dados fictícios").
const pdf = path.join(cache, "MemoriAU_Ressonancia_Digital.pdf");
if (!existsSync(pdf)) {
  execFileSync("soffice", ["--headless", "--convert-to", "pdf", "--outdir", cache, path.join(fonte, "MemoriAU_Ressonancia_Digital.pptx")], { stdio: "inherit" });
}
for (const n of [4, 6, 17, 20]) {
  const nn = String(n).padStart(2, "0");
  const base = path.join(cache, `slide-${nn}`);
  if (!existsSync(`${base}.png`)) {
    execFileSync("pdftoppm", ["-png", "-singlefile", "-f", String(n), "-l", String(n), "-scale-to-x", "1600", "-scale-to-y", "900", pdf, base]);
  }
  const larguras = [768, 1280];
  const prontos = {};
  for (const l of larguras) {
    const a = Math.round((l * 9) / 16);
    const faixa = Math.round(l * 0.047);
    const selo = await texto("Simulação com dados fictícios", Math.round(l * 0.025));
    const seloAlt = (await sharp(selo).metadata()).height;
    prontos[l] = await sharp(`${base}.png`)
      .resize(l, a)
      .composite([
        { input: { create: { width: l, height: faixa, channels: 3, background: PRETO } }, left: 0, top: a - faixa },
        { input: { create: { width: l, height: 1, channels: 3, background: CHUMBO } }, left: 0, top: a - faixa },
        { input: selo, left: Math.round(l * 0.025), top: a - faixa + Math.round((faixa - seloAlt) / 2) },
      ])
      .png()
      .toBuffer();
  }
  const nome = `slide-${nn}`;
  for (const l of larguras) {
    await sharp(prontos[l]).avif({ quality: 60, effort: 5 }).toFile(path.join(img, "ressonancia", `${nome}-${l}.avif`));
    await sharp(prontos[l]).webp({ quality: 82, effort: 6 }).toFile(path.join(img, "ressonancia", `${nome}-${l}.webp`));
  }
  manifest[nome] = { larguras, formatos: ["avif", "webp"], largura: 1280, altura: 720, pasta: "ressonancia" };
}

// 6. Imagem de compartilhamento: fundo preto, fio dourado de 1px, logo e a frase do topo B.
{
  const L = 1200, A = 630, margem = 120;
  const marca = await sharp(logo).resize({ width: 250 }).toBuffer();
  const frase = await texto("O problema nunca foi a idade.\nFoi a velocidade com que\no mercado mudou.", 66, { entrelinha: -10 });
  const fraseAlt = (await sharp(frase).metadata()).height;
  await sharp({ create: { width: L, height: A, channels: 3, background: PRETO } })
    .composite([
      { input: { create: { width: 1, height: A, channels: 3, background: OURO } }, left: 72, top: 0 },
      { input: marca, left: margem, top: 72 },
      { input: frase, left: margem, top: A - 80 - fraseAlt },
    ])
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(pub, "og.jpg"));
}

// 7. Ícones: o símbolo {x} é tudo que fica à esquerda do primeiro vão vazio largo do logo.
{
  const { data, info } = await sharp(logo).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const cheia = (x) => { for (let y = 0; y < info.height; y++) if (data[y * info.width + x] > 40) return true; return false; };
  let fim = 0, vazias = 0;
  for (let x = 0; x < info.width; x++) {
    if (cheia(x)) { fim = x; vazias = 0; } else if (++vazias > 30 && fim > 0) break;
  }
  if (fim < info.width * 0.2 || fim > info.width * 0.6) throw new Error(`símbolo do logo não localizado (fim=${fim})`);
  const simbolo = await sharp(await sharp(logo).extract({ left: 0, top: 0, width: fim + 1, height: info.height }).png().toBuffer()).trim({ threshold: 1 }).png().toBuffer();
  const icone = async (lado, respiro) => {
    const dentro = Math.round(lado * (1 - 2 * respiro));
    const s = await sharp(simbolo).resize(dentro, dentro, { fit: "inside" }).toBuffer();
    return sharp({ create: { width: lado, height: lado, channels: 3, background: PRETO } }).composite([{ input: s, gravity: "centre" }]).png({ compressionLevel: 9 }).toBuffer();
  };
  writeFileSync(path.join(pub, "icon-192.png"), await icone(192, 0.16));
  writeFileSync(path.join(pub, "icon-512.png"), await icone(512, 0.16));
  writeFileSync(path.join(pub, "apple-touch-icon.png"), await icone(180, 0.16));
  // .ico com PNG embutido (16, 32, 48): cabeçalho de 6 bytes + 16 bytes por entrada
  const lados = [16, 32, 48];
  const pngs = await Promise.all(lados.map((l) => icone(l, 0.06)));
  const cab = Buffer.alloc(6 + 16 * lados.length);
  cab.writeUInt16LE(1, 2);
  cab.writeUInt16LE(lados.length, 4);
  let desloc = cab.length;
  lados.forEach((l, i) => {
    const e = 6 + 16 * i;
    cab.writeUInt8(l, e);
    cab.writeUInt8(l, e + 1);
    cab.writeUInt16LE(1, e + 4);
    cab.writeUInt16LE(32, e + 6);
    cab.writeUInt32LE(pngs[i].length, e + 8);
    cab.writeUInt32LE(desloc, e + 12);
    desloc += pngs[i].length;
  });
  writeFileSync(path.join(pub, "favicon.ico"), Buffer.concat([cab, ...pngs]));
}

// 8. Manifest para o Front-end.
writeFileSync(path.join(img, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

// Conferência: todo arquivo do manifest existe com a largura declarada e ninguém passa de 250 KB (exceto png do logo e ícones).
for (const [nome, { larguras, formatos, largura, altura, pasta = "" }] of Object.entries(manifest)) {
  for (const l of larguras) for (const f of formatos) {
    const arq = path.join(img, pasta, `${nome}-${l}.${f}`);
    const m = await sharp(arq).metadata();
    const altEsperada = (l * altura) / largura;
    if (nome === "ferrer-retrato" && !m.hasAlpha) throw new Error(`${arq}: retrato saiu sem transparência`);
    if (m.width !== l || Math.abs(m.height - altEsperada) > 1) throw new Error(`${arq}: ${m.width}x${m.height} não bate com o manifest`);
    if (f !== "png" && statSync(arq).size > LIMITE) throw new Error(`${arq} passa de 250 KB`);
  }
}
if (statSync(path.join(pub, "og.jpg")).size > LIMITE) throw new Error("og.jpg passa de 250 KB");
const total = readdirSync(img, { recursive: true }).filter((f) => /\.(avif|webp|png)$/.test(f)).length;
console.log(`ok: ${total} imagens em public/img, og.jpg, favicon e ícones gerados`);
