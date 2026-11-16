import { mkdirSync, writeFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const REGRAS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
const SAIDA = "test-results/axe"; // fora do git; os números vão para docs/QA.md

async function auditar(page: Page, nome: string) {
  // As seções entram por opacidade ao rolar: sem passar por todas, o contraste seria medido no meio da transição.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  const { violations, incomplete, passes } = await new AxeBuilder({ page }).withTags(REGRAS).analyze();
  const resumo = violations.map((v) => ({
    regra: v.id,
    impacto: v.impact,
    ajuda: v.help,
    nos: v.nodes.map((n) => ({ alvo: n.target.join(" "), html: n.html.slice(0, 200), resumo: n.failureSummary })),
  }));
  mkdirSync(SAIDA, { recursive: true });
  writeFileSync(
    `${SAIDA}/${nome}.json`,
    JSON.stringify({ aprovadas: passes.length, violacoes: resumo, incompletas: incomplete.map((i) => `${i.id} (${i.nodes.length})`) }, null, 2),
  );
  return resumo;
}

const graves = (r: Awaited<ReturnType<typeof auditar>>) => r.filter((v) => v.impacto === "critical" || v.impacto === "serious");

for (const [largura, altura] of [[390, 844], [1280, 800]] as const) {
  test.describe(`axe em ${largura}px`, () => {
    test.use({ viewport: { width: largura, height: altura } });

    for (const rota of ["/", "/ressonancia", "/privacidade", "/termos"]) {
      test(`${rota} sem violações graves`, async ({ page }) => {
        await page.goto(rota);
        const nome = `${rota === "/" ? "inicio" : rota.slice(1)}-${largura}`;
        expect(graves(await auditar(page, nome))).toEqual([]);
      });
    }

    test("/ com erros de formulário e sem o banner de cookies", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /recusar/i }).click();
      for (const id of ["#jornada"]) {
        const form = page.locator(`${id} form`);
        await form.scrollIntoViewIfNeeded();
        await form.locator('button[type="submit"]').click();
        await expect(form.locator('[name="nome"]')).toHaveAttribute("aria-invalid", "true");
      }
      expect(graves(await auditar(page, `inicio-erros-${largura}`))).toEqual([]);
    });

    test("/ressonancia com erros de formulário e sem o banner de cookies", async ({ page }) => {
      await page.goto("/ressonancia");
      await page.getByRole("button", { name: /recusar/i }).click();
      const form = page.locator("#pedido form");
      await form.scrollIntoViewIfNeeded();
      await form.locator('button[type="submit"]').click();
      await expect(form.locator('[name="empresa"]')).toHaveAttribute("aria-invalid", "true");
      expect(graves(await auditar(page, `ressonancia-erros-${largura}`))).toEqual([]);
    });

    // Details: a inicial e a Ressonância. As páginas legais não têm nenhum.
    for (const rota of ["/", "/ressonancia"]) {
      test(`${rota} com os details abertos`, async ({ page }) => {
        await page.goto(rota);
        await page.getByRole("button", { name: /recusar/i }).click();
        // Abre tudo menos o menu (auditado à parte). Sem o `name`, que só deixa um aberto por grupo.
        const abertos = await page.evaluate(() => {
          const todos = [...document.querySelectorAll<HTMLDetailsElement>("details")].filter((d) => !d.closest("body > header"));
          todos.forEach((d) => {
            d.removeAttribute("name");
            d.open = true;
          });
          return todos.length;
        });
        if (rota === "/") expect(abertos).toBeGreaterThan(10);
        const nome = `${rota === "/" ? "inicio" : rota.slice(1)}-abertos-${largura}`;
        expect(graves(await auditar(page, nome))).toEqual([]);
      });
    }

    if (largura < 1024)
      for (const rota of ["/"]) {
        test(`${rota} com o menu do celular aberto`, async ({ page }) => {
          await page.goto(rota);
          await page.getByRole("button", { name: /recusar/i }).click();
          const menu = page.getByRole("banner").locator("details");
          await menu.locator("summary").click();
          await expect(menu.getByRole("link").first()).toBeVisible();
          const nome = `${rota === "/" ? "inicio" : rota.slice(1)}-menu-${largura}`;
          expect(graves(await auditar(page, nome))).toEqual([]);
          await expect(menu).toHaveAttribute("open", "");
        });
      }
  });
}
