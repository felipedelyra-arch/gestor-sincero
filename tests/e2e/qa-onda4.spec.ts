import { readFileSync, readdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

const ROTAS = ["/", "/ressonancia", "/privacidade", "/termos"];
const SEM_E_SEM = /\bsem\b[^.!?\n]{1,80}?,? e sem\b/i;
const EMOJI = /(?![©®™])\p{Extended_Pictographic}/u;
const PENDENTE = /PENDENTE|(?<!\p{L})a validar(?!\p{L})|(?<!\p{L})TODO(?!\p{L})|lorem ipsum|\[[^\]]*(definir|confirmar|preencher)[^\]]*\]/u;
// Palavras inglesas comuns que não existem em português. A biografia (#quem-e) e os verbetes (#dicionario) podem ter inglês.
const INGLES = /(?<!\p{L})(the|and|with|your|you|our|this|that|from|free|download|learn|click|here|about|get|more|home|contact|team|business|growth|hacker|leadership)(?!\p{L})/iu;

test.describe("varredura de texto", () => {
  test("content/: sem 'Sem … e sem …', emoji nem marcador pendente fora do que o filtro esconde", () => {
    const arquivos = readdirSync("content").filter((f) => /^(pagina|papoReto|legal)\.ts$/.test(f));
    const achados: string[] = [];
    for (const f of arquivos)
      readFileSync(`content/${f}`, "utf8").split("\n").forEach((l, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(l)) return;
        if (SEM_E_SEM.test(l)) achados.push(`content/${f}:${i + 1} sem-e-sem: ${l.trim().slice(0, 100)}`);
        if (EMOJI.test(l)) achados.push(`content/${f}:${i + 1} emoji: ${l.trim().slice(0, 100)}`);
      });
    expect(achados).toEqual([]);
  });

  for (const rota of ROTAS)
    test(`HTML servido de ${rota}: texto visível sem sem-e-sem, emoji, pendente, inglês`, async ({ page }) => {
      await page.goto(rota);
      await page.getByRole("button", { name: /recusar/i }).click();
      await page.evaluate(() => document.querySelectorAll("details").forEach((d) => ((d.open = true), d.removeAttribute("name"))));
      const blocos = await page.evaluate(() =>
        [...document.querySelectorAll("main p, main li, main h1, main h2, main h3, main dd, main dt, main td, main th, main blockquote, main summary, main label, main figcaption, header a, footer p, footer a, footer button")]
          .filter((e) => !e.querySelector("p, li, h2, h3, td"))
          .map((e) => ({ t: (e.textContent ?? "").replace(/\s+/g, " ").trim(), s: e.closest("section[id]")?.id ?? (e.closest("footer") ? "rodape" : e.closest("header") ? "cabecalho" : "topo"), lang: e.closest("[lang]")?.getAttribute("lang") ?? "" }))
          .filter((x) => x.t),
      );
      const html = await page.content();
      const rel = (re: RegExp, ignorar: (s: string) => boolean = () => false) => blocos.filter((b) => re.test(b.t) && !ignorar(b.s)).map((b) => `#${b.s}: ${b.t.slice(0, 90)}`);
      console.log(`MEDIDA varredura ${rota}: ${blocos.length} blocos de texto`);
      const ing = rel(INGLES, (s) => s === "dicionario" || s === "quem-e");
      console.log(`MEDIDA varredura ${rota} inglês: ${JSON.stringify(ing)}`);
      expect.soft(rel(SEM_E_SEM), "Sem … e sem …").toEqual([]);
      expect.soft(rel(EMOJI), "emoji").toEqual([]);
      expect.soft(rel(PENDENTE), "marcador pendente visível").toEqual([]);
      expect.soft(ing, "inglês fora do Dicionário").toEqual([]);
      // O HTML bruto também não pode carregar o marcador, nem escondido em atributo ou JSON de hidratação.
      expect.soft(html.match(/PENDENTE[^<"]{0,40}/g) ?? [], "marcador no HTML servido").toEqual([]);
    });
});

for (const [largura, altura] of [[390, 844], [1440, 900]] as const)
  test.describe(`QA Onda 4 em ${largura}px`, () => {
    test.use({ viewport: { width: largura, height: altura } });

    test("formulário da Jornada: campos de 52px, rótulos de 16px, caixas de 24px", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /recusar/i }).click();
      const m = await page.locator("#jornada form").evaluate((form) => {
        const v = (e: Element) => e.getBoundingClientRect().height > 1;
        const campos = [...form.querySelectorAll("input:not([type=checkbox]):not([type=hidden]), select, textarea")].filter((e) => v(e) && !e.closest("[aria-hidden=true]") && e.getAttribute("tabindex") !== "-1").map((e) => ({ n: e.getAttribute("name"), a: Math.round(e.getBoundingClientRect().height), l: Math.round(e.getBoundingClientRect().width) }));
        const rotulos = [...form.querySelectorAll("label")].filter(v).map((e) => ({ t: (e.textContent ?? "").trim().slice(0, 30), px: parseFloat(getComputedStyle(e).fontSize), temCaixa: !!e.querySelector("input[type=checkbox]") }));
        const caixas = [...form.querySelectorAll("input[type=checkbox]")].map((e) => {
          const alvo = e.nextElementSibling ?? e.parentElement!;
          const b = alvo.getBoundingClientRect();
          const i = e.getBoundingClientRect();
          return { visual: `${Math.round(b.width)}x${Math.round(b.height)}`, input: `${Math.round(i.width)}x${Math.round(i.height)}`, rotuloAltura: Math.round(e.closest("label")?.getBoundingClientRect().height ?? 0) };
        });
        const botao = [...form.querySelectorAll("button[type=submit]")].map((e) => Math.round(e.getBoundingClientRect().height));
        return { campos, rotulos, caixas, botao };
      });
      console.log(`MEDIDA jornada ${largura}: ${JSON.stringify(m)}`);
      expect.soft(m.campos.filter((c) => c.a < 52), "campos abaixo de 52px").toEqual([]);
      expect.soft(m.rotulos.filter((r) => r.px < 16), "rótulos abaixo de 16px").toEqual([]);
      expect.soft(m.caixas.filter((c) => c.visual !== "24x24"), "caixas diferentes de 24x24").toEqual([]);
      expect.soft(m.botao.filter((a) => a < 48), "botão abaixo de 48px").toEqual([]);
    });

    test("Dicionário em papel: contraste do texto e foco visível", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /recusar/i }).click();
      await page.locator("#dicionario").scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      const r = await page.locator("#dicionario").evaluate((sec) => {
        const lum = (c: string) => {
          const [r, g, b] = (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number).map((x) => { const s = x / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const razao = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
        const fundo = (e: Element) => { for (let a: Element | null = e; a; a = a.parentElement) { const c = getComputedStyle(a).backgroundColor; if (c !== "rgba(0, 0, 0, 0)") return c; } return "rgb(0, 0, 0)"; };
        const textos = [...sec.querySelectorAll("h2, h3, p, dt, dd, li, a, span, summary, button")].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim()) && e.getBoundingClientRect().height > 1);
        const pior = textos.map((e) => ({ el: `${e.tagName.toLowerCase()} "${(e.textContent ?? "").trim().slice(0, 25)}"`, r: Math.round(razao(getComputedStyle(e).color, fundo(e)) * 100) / 100, px: parseFloat(getComputedStyle(e).fontSize), op: getComputedStyle(e).opacity })).sort((a, b) => a.r - b.r);
        return { fundo: fundo(sec), n: textos.length, pior: pior.slice(0, 4), focaveis: sec.querySelectorAll("a, button, summary, input, [tabindex]").length };
      });
      console.log(`MEDIDA dicionario ${largura}: ${JSON.stringify(r)}`);
      expect.soft(r.pior[0].r, `pior contraste: ${r.pior[0].el}`).toBeGreaterThanOrEqual(4.5);
      // Foco: se houver foco possível dentro da seção, o contorno precisa contrastar com o papel.
      if (r.focaveis > 0) {
        const alvo = page.locator("#dicionario").locator("a, button, summary, input, [tabindex]").first();
        await alvo.focus();
        await page.keyboard.press("Shift+Tab");
        await page.keyboard.press("Tab");
        const f = await alvo.evaluate((e) => { const cs = getComputedStyle(e); return { cor: cs.outlineColor, larg: cs.outlineWidth, estilo: cs.outlineStyle, deslocamento: cs.outlineOffset }; });
        console.log(`MEDIDA dicionario foco ${largura}: ${JSON.stringify(f)}`);
        expect.soft(f.estilo, "foco visível").not.toBe("none");
      }
    });
  });
