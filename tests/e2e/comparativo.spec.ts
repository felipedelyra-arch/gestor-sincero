import { expect, test, type Page } from "@playwright/test";
import { pagina } from "../../content";

const c = pagina.virada.comparativo;

// A comparação é uma <table> com todos os pares sempre visíveis: sem alternador, sem JavaScript.
async function medir(page: Page) {
  return page.evaluate(() => {
    const t = document.querySelector<HTMLTableElement>("#virada table")!;
    const caixa = (e: Element) => e.getBoundingClientRect();
    const linhas = [...t.querySelectorAll("tbody tr")].map((tr) => {
      const [tema, a, d] = [...tr.children].map(caixa);
      return { visivel: (tr as HTMLElement).checkVisibility({ visibilityProperty: true }) && caixa(tr).height > 1, tema, a, d };
    });
    return {
      linhas,
      colunas: [...t.querySelectorAll("thead th[scope='col']")].map((e) => e.textContent?.trim()),
      temas: [...t.querySelectorAll("tbody th[scope='row']")].map((e) => e.textContent?.trim()),
      radios: document.querySelectorAll("#virada input[type=radio]").length,
      sobra: document.documentElement.scrollWidth - window.innerWidth,
      tabelaDireita: Math.round(caixa(t).right),
      largura: window.innerWidth,
    };
  });
}

for (const javaScriptEnabled of [true, false])
  for (const [largura, altura] of [[390, 844], [1440, 900]] as const) {
    test.describe(`comparativo ${largura}px, JavaScript ${javaScriptEnabled ? "ligado" : "desligado"}`, () => {
      test.use({ javaScriptEnabled, viewport: { width: largura, height: altura } });

      test("17 linhas visíveis, cabeçalho com th scope, sem alternador e sem rolagem lateral", async ({ page }) => {
        await page.goto("/");
        const bloco = page.locator("#virada");
        await expect(bloco.locator("table")).toHaveCount(1);
        await expect(bloco.locator("tbody tr")).toHaveCount(c.pares.length);
        expect(c.pares).toHaveLength(17);
        if (c.titulo) await expect(bloco.locator("caption")).toHaveText(c.titulo); // v2.1: o título da tabela é opcional
        await expect(bloco.locator('thead th[scope="col"]')).toHaveText([c.rotuloAnalogica, c.rotuloDigital]);
        await expect(bloco.locator('tbody th[scope="row"]')).toHaveText(c.pares.map((p) => p.tema));
        await expect(bloco.locator("tbody td").first()).toContainText(c.pares[0].analogica);
        await expect(bloco.locator("tbody td").nth(1)).toContainText(c.pares[0].digital);

        const m = await medir(page);
        expect(m.radios, "sem alternador").toBe(0);
        expect(m.linhas.filter((l) => !l.visivel), "linhas escondidas").toEqual([]);
        expect(m.sobra, "rolagem horizontal").toBeLessThanOrEqual(0);
        expect(m.tabelaDireita, "tabela dentro da tela").toBeLessThanOrEqual(m.largura);
        // Os dois lados de cada par são sempre visíveis (nada de 1 px escondido).
        for (const l of m.linhas) {
          expect(l.a.width).toBeGreaterThan(100);
          expect(l.d.width).toBeGreaterThan(100);
        }
      });

      test(largura < 768 ? "pares empilhados" : "duas colunas lado a lado", async ({ page }) => {
        await page.goto("/");
        const { linhas } = await medir(page);
        for (const l of linhas) {
          if (largura < 768) {
            expect(l.d.top, "digital abaixo da analógica").toBeGreaterThanOrEqual(l.a.bottom - 1);
            expect(Math.abs(l.d.left - l.a.left), "mesmo alinhamento à esquerda").toBeLessThan(2);
          } else {
            expect(Math.abs(l.d.top - l.a.top), "mesma altura de linha").toBeLessThan(2);
            expect(l.d.left).toBeGreaterThan(l.a.right - 1);
          }
        }
      });
    });
  }
