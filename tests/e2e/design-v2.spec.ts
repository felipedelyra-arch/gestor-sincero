import { expect, test } from "@playwright/test";

// Critérios medidos da "Direção v2" de docs/DESIGN.md.
const TELAS = [
  { largura: 390, altura: 844, alturaMaxima: 18_000 },
  { largura: 1280, altura: 800, alturaMaxima: 12_000 },
  { largura: 1920, altura: 943, alturaMaxima: 12_000 },
] as const;

// Altura-alvo por seção em 1280px (tabela do DESIGN v2).
const ALVOS_1280: Record<string, number> = {
  topo: 720, espelho: 620, dados: 520, inimigo: 520, virada: 760, "quem-e": 820, metodo: 680, jornada: 900,
  dicionario: 560, ressonancia: 2200, mentoria: 900, "para-quem": 560, perguntas: 620, fechamento: 360, rodape: 360,
};

for (const { largura, altura, alturaMaxima } of TELAS) {
  test.describe(`design v2 em ${largura}x${altura}`, () => {
    test.use({ viewport: { width: largura, height: altura } });

    test("topo na primeira tela, com o banner de cookies", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("#gs-cookies-texto")).toBeVisible();
      const m = await page.evaluate(() => {
        const topo = document.querySelector("main > section:not([id])")!;
        const base = (e: Element | null) => Math.round(e?.getBoundingClientRect().bottom ?? -1);
        const banner = document.querySelector("#gs-cookies-texto")!.closest("[role], aside, section, div")!;
        return {
          secao: base(topo),
          titulo: base(topo.querySelector("h1")),
          chamadas: [...topo.querySelectorAll("a")].map(base),
          retrato: base(topo.querySelector("img")),
          topoBanner: Math.round(banner.getBoundingClientRect().top),
        };
      });
      console.log(`MEDIDA topo ${largura}x${altura}: ${JSON.stringify(m)}`);
      expect.soft(m.titulo, "título dentro da primeira tela").toBeLessThanOrEqual(altura);
      for (const c of m.chamadas) expect.soft(c, "chamada dentro da primeira tela").toBeLessThanOrEqual(altura);
      expect.soft(m.secao, "seção do topo inteira na primeira tela").toBeLessThanOrEqual(altura);
    });

    test("fonte, largura, altura e alvos de toque", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /recusar/i }).click();
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });

      const medir = (abrir: boolean) => page.evaluate((abrir) => {
        // Com `abrir`, mede também o que está recolhido (o `name` fecharia os irmãos do mesmo grupo).
        if (abrir)
          document.querySelectorAll("details").forEach((d) => {
            d.removeAttribute("name");
            d.open = true;
          });
        const visivel = (e: Element) => {
          const r = e.getBoundingClientRect();
          return r.width > 1 && r.height > 1 && (e as HTMLElement).checkVisibility({ visibilityProperty: true });
        };
        const nome = (e: Element) =>
          `${e.tagName.toLowerCase()}${e.closest("section[id], header, footer")?.id ? "#" + e.closest("section[id]")?.id : ""} "${(e.getAttribute("aria-label") ?? e.textContent ?? "").trim().slice(0, 40)}"`;
        const fontes = [...document.querySelectorAll("body *")]
          .filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim()) && visivel(e))
          .map((e) => ({ px: parseFloat(getComputedStyle(e).fontSize), el: nome(e) }))
          .sort((a, b) => b.px - a.px);
        const caixas = (seletor: string) =>
          [...document.querySelectorAll(seletor)].filter(visivel).map((e) => {
            const r = e.getBoundingClientRect();
            return { el: nome(e), l: Math.round(r.width), a: Math.round(r.height) };
          });
        const secoes = [...document.querySelectorAll("main > section, footer")].map((e) => ({
          id: e.id || (e.tagName === "FOOTER" ? "rodape" : "topo"),
          a: Math.round(e.getBoundingClientRect().height),
        }));
        // Elementos que passam da largura da tela (fora de fileiras que rolam de propósito).
        const vazam = [...document.querySelectorAll("body *")]
          .filter((e) => visivel(e) && !e.closest(".overflow-x-auto") && e.getBoundingClientRect().right > window.innerWidth + 1)
          .map(nome)
          .slice(0, 10);
        return {
          maiorFonte: fontes.slice(0, 3),
          menorFonte: fontes.at(-1),
          sobra: document.documentElement.scrollWidth - window.innerWidth,
          vazam,
          alturaTotal: document.documentElement.scrollHeight,
          secoes,
          alvos: caixas("button, summary, header a, a[class*='min-h-'], label:has(input[type=radio]), label:has(input[type=checkbox])"),
          linksSoltos: caixas("footer a, main a:not([class*='min-h-'])"),
        };
      }, abrir);
      const m = await medir(false);
      const abertos = await medir(true);
      console.log(`MEDIDA ${largura}: ${m.alvos.length} alvos fechado, ${abertos.alvos.length} com tudo aberto, altura aberta ${abertos.alturaTotal}`);
      console.log(`MEDIDA ${largura}: fonte ${JSON.stringify(m.maiorFonte)} menor ${JSON.stringify(m.menorFonte)}`);
      console.log(`MEDIDA ${largura}: altura ${m.alturaTotal} sobra ${m.sobra} vazam ${JSON.stringify(m.vazam)}`);
      console.log(`MEDIDA ${largura}: seções ${m.secoes.map((s) => `${s.id}=${s.a}`).join(" ")}`);
      console.log(`MEDIDA ${largura}: links soltos < 48 ${JSON.stringify(m.linksSoltos.filter((x) => x.a < 48))}`);

      expect.soft(m.maiorFonte[0].px, `maior fonte: ${m.maiorFonte[0].el}`).toBeLessThanOrEqual(56);
      expect.soft(m.sobra, "rolagem horizontal").toBeLessThanOrEqual(0);
      expect.soft(m.vazam, "elementos fora da largura").toEqual([]);
      expect.soft(m.alturaTotal, "altura total da página").toBeLessThanOrEqual(alturaMaxima);
      expect.soft(m.alvos.filter((x) => x.a < 48 || x.l < 48), "alvos de toque menores que 48px").toEqual([]);
      expect.soft(abertos.alvos.filter((x) => x.a < 48 || x.l < 48), "alvos menores que 48px com os details abertos").toEqual([]);
      expect.soft(abertos.maiorFonte[0].px, "maior fonte com os details abertos").toBeLessThanOrEqual(56);
      expect.soft(abertos.sobra, "rolagem horizontal com os details abertos").toBeLessThanOrEqual(0);
      expect.soft(abertos.vazam, "elementos fora da largura com os details abertos").toEqual([]);
      if (largura === 1280)
        for (const s of m.secoes)
          if (ALVOS_1280[s.id]) expect.soft(s.a, `altura da seção ${s.id}`).toBeLessThanOrEqual(ALVOS_1280[s.id]);
    });
  });
}
