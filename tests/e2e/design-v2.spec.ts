import { expect, test } from "@playwright/test";

// Critérios medidos de docs/DESIGN-v2.md. Altura total não tem meta no documento: os tetos abaixo são só guarda contra regressão (medido em 17/11: 24.446 px em 390, 16.593 em 1440).
const TELAS = [
  { largura: 390, altura: 844, alturaMaxima: 26_000 },
  { largura: 1440, altura: 900, alturaMaxima: 18_000 },
  { largura: 1920, altura: 943, alturaMaxima: 18_000 },
] as const;

// Fonte, rolagem e alvos valem nas duas páginas; altura e seções só na inicial (têm alvo próprio).
const ROTAS_V2 = ["/", "/ressonancia"] as const;

// Altura-alvo por seção em 1440px (tabela do DESIGN v2; anotação, não critério).
const ALVOS_1440: Record<string, number> = {
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
      // Título e as duas chamadas acima do banner de cookies (o banner começa em `topoBanner`).
      expect.soft(m.titulo, "título acima do banner").toBeLessThanOrEqual(m.topoBanner);
      for (const c of m.chamadas) expect.soft(c, "chamada acima do banner").toBeLessThanOrEqual(m.topoBanner);
      expect.soft(m.titulo, "título dentro da primeira tela").toBeLessThanOrEqual(altura);
    });

    // Metas de docs/DESIGN-v2.md contadas no DOM renderizado (só a inicial; banner de cookies recusado antes).
    test("/: contagem do estilo editorial (bordas+fundo, pílulas, checks, centralização, fonte < 16px)", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /recusar/i }).click();
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);
      const r = await page.evaluate(() => {
        const visivel = (e: Element) => {
          const b = e.getBoundingClientRect();
          return b.width > 1 && b.height > 1 && (e as HTMLElement).checkVisibility({ visibilityProperty: true, opacityProperty: false });
        };
        const sel = (e: Element) => {
          const secao = e.closest("main > section, footer, header")?.id || e.closest("footer") ? (e.closest("footer") ? "footer" : "#" + e.closest("section[id]")?.id) : "topo";
          const cls = (e.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
          return `${secao} ${e.tagName.toLowerCase()}${cls ? "." + cls : ""} "${(e.textContent ?? "").trim().slice(0, 30)}"`;
        };
        const todos = [...document.querySelectorAll("body *")].filter((e) => !["SCRIPT", "STYLE", "PATH", "SVG", "USE"].includes(e.tagName.toUpperCase()) && visivel(e));
        const campo = (e: Element) => ["INPUT", "SELECT", "TEXTAREA", "BUTTON", "OPTION"].includes(e.tagName);
        // Botão de verdade: <button> ou link com aparência de botão (flex/inline-flex com altura de alvo).
        const botao = (e: Element) => campo(e) || (e.tagName === "A" && /flex/.test(getComputedStyle(e).display) && e.getBoundingClientRect().height >= 44 && !!e.closest("main, footer") && e.querySelectorAll("*").length < 3);
        const temBorda = (cs: CSSStyleDeclaration) => ["Top", "Right", "Bottom", "Left"].every((l) => parseFloat(cs.getPropertyValue(`border-${l.toLowerCase()}-width`)) > 0 && cs.getPropertyValue(`border-${l.toLowerCase()}-style`) !== "none");
        const temFundo = (cs: CSSStyleDeclaration) => (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") || cs.backgroundImage !== "none";
        const caixas = todos.filter((e) => !botao(e) && !["IMG", "PICTURE", "HTML", "BODY", "MAIN"].includes(e.tagName) && e.closest("main, footer") && temBorda(getComputedStyle(e)) && temFundo(getComputedStyle(e))).map(sel);
        const pilulas = todos.filter((e) => {
          if (botao(e) || ["IMG", "PICTURE", "SECTION", "DIV"].includes(e.tagName) && !(e.textContent ?? "").trim()) return false;
          if (!e.closest("main, footer, header")) return false;
          const cs = getComputedStyle(e);
          const b = e.getBoundingClientRect();
          const raio = Math.max(parseFloat(cs.borderTopLeftRadius) || 0, 0);
          const arredondado = raio >= Math.min(b.width, b.height) / 2 - 1 && raio > 6;
          return arredondado && (temFundo(cs) || ["Top", "Bottom"].some((l) => parseFloat(cs.getPropertyValue(`border-${l.toLowerCase()}-width`)) > 0)) && b.height < 64 && !!(e.textContent ?? "").trim();
        }).map(sel);
        const checks = [...document.querySelectorAll("main li, footer li")].filter((li) => {
          if (!visivel(li)) return false;
          const pseudo = getComputedStyle(li, "::before").content;
          const marcador = getComputedStyle(li).listStyleImage !== "none";
          const antes = pseudo !== "none" && pseudo !== "normal" && /[✓✔☑✅]/.test(pseudo);
          return antes || marcador || [...li.querySelectorAll("svg, img")].some((x) => visivel(x) && !x.closest("label:has(input[type=checkbox])")) || /[✓✔☑✅]/.test(li.textContent ?? "");
        }).map(sel);
        const bloco = "p, h1, h2, h3, h4, li, blockquote, dd, dt, summary";
        const centralizadas = [...document.querySelectorAll("main > section, footer")].filter(visivel).map((s) => {
          const t = [...s.querySelectorAll(bloco)].filter((e) => visivel(e) && (e.textContent ?? "").trim().length > 3);
          const c = t.filter((e) => {
            const b = e.getBoundingClientRect();
            return getComputedStyle(e).textAlign === "center" && b.width > 1;
          });
          return { id: s.id || s.tagName.toLowerCase(), total: t.length, centradas: c.length };
        }).filter((x) => x.total >= 2 && x.centradas / x.total >= 0.8);
        const excecao = (e: Element) => !!e.closest("figcaption, small, footer, caption, [class*='legenda'], [class*='nota'], [data-nota]");
        const pequenos = todos.filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim()) && parseFloat(getComputedStyle(e).fontSize) < 16)
          .map((e) => ({ px: parseFloat(getComputedStyle(e).fontSize), el: sel(e), excecao: excecao(e) }));
        return { caixas, pilulas, checks, centralizadas, pequenos, sobra: document.documentElement.scrollWidth - window.innerWidth };
      });
      console.log(`MEDIDA contagem ${largura}: ${JSON.stringify({ caixas: r.caixas.length, pilulas: r.pilulas.length, checks: r.checks.length, centralizadas: r.centralizadas.length, pequenosForaDaExcecao: r.pequenos.filter((p) => !p.excecao).length, pequenosExcecao: r.pequenos.filter((p) => p.excecao).length, sobra: r.sobra })}`);
      console.log(`MEDIDA contagem ${largura} detalhe: ${JSON.stringify(r)}`);
      expect.soft(r.caixas.length, `elementos com borda e fundo próprios: ${r.caixas.join(" | ")}`).toBeLessThanOrEqual(8);
      expect.soft(r.pilulas, "pílulas ou etiquetas").toEqual([]);
      expect.soft(r.checks, "ícones de check em lista").toEqual([]);
      expect.soft(r.centralizadas.length, `seções com tudo centralizado: ${JSON.stringify(r.centralizadas)}`).toBeLessThanOrEqual(2);
      expect.soft(r.pequenos.filter((p) => !p.excecao), "texto visível abaixo de 16px fora de legenda, nota e rodapé").toEqual([]);
      expect.soft(r.sobra, "rolagem horizontal").toBeLessThanOrEqual(0);
    });

    for (const rota of ROTAS_V2) test(`${rota}: fonte, largura, altura e alvos de toque`, async ({ page }) => {
      await page.goto(rota);
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
        // Elementos que passam da largura da tela: fora de fileiras que rolam de propósito e de recortes
        // (um ancestral com overflow oculto que cabe na tela, como o retrato do topo que sangra 3% e é cortado pela seção).
        const recortado = (e: Element) => {
          for (let a = e.parentElement; a && a !== document.body; a = a.parentElement)
            if (/hidden|clip/.test(getComputedStyle(a).overflowX) && a.getBoundingClientRect().right <= window.innerWidth + 1) return true;
          return false;
        };
        const vazam = [...document.querySelectorAll("body *")]
          .filter((e) => visivel(e) && !e.closest(".overflow-x-auto") && !recortado(e) && e.getBoundingClientRect().right > window.innerWidth + 1)
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

      expect.soft(m.maiorFonte[0].px, `maior fonte: ${m.maiorFonte[0].el}`).toBeLessThanOrEqual(largura < 1024 ? 44.5 : 88.5);
      expect.soft(m.sobra, "rolagem horizontal").toBeLessThanOrEqual(0);
      expect.soft(m.vazam, "elementos fora da largura").toEqual([]);
      if (rota === "/") expect.soft(m.alturaTotal, "altura total da página").toBeLessThanOrEqual(alturaMaxima);
      expect.soft(m.alvos.filter((x) => x.a < 48 || x.l < 48), "alvos de toque menores que 48px").toEqual([]);
      expect.soft(abertos.alvos.filter((x) => x.a < 48 || x.l < 48), "alvos menores que 48px com os details abertos").toEqual([]);
      expect.soft(abertos.maiorFonte[0].px, "maior fonte com os details abertos").toBeLessThanOrEqual(largura < 1024 ? 44.5 : 88.5);
      expect.soft(abertos.sobra, "rolagem horizontal com os details abertos").toBeLessThanOrEqual(0);
      expect.soft(abertos.vazam, "elementos fora da largura com os details abertos").toEqual([]);
      // Altura por seção não é critério (decisão do orquestrador): só anota para leitura.
      if (largura === 1440 && rota === "/")
        for (const s of m.secoes)
          if (ALVOS_1440[s.id]) test.info().annotations.push({ type: "altura-secao", description: `${s.id}: ${s.a}px (alvo ${ALVOS_1440[s.id]}px)` });
    });
  });
}
