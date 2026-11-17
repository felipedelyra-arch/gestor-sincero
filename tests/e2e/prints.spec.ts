import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

// Gera tests/prints/. Só roda a pedido: PRINTS=1 scripts/pesado.sh npx playwright test tests/e2e/prints.spec.ts
// PRINTS_SAIDA e PRINTS_LARGURAS ("390x844,1440x900") permitem gravar outro conjunto (v1, v2) sem tocar no padrão.
const SAIDA = process.env.PRINTS_SAIDA ?? "tests/prints";
const LARGURAS = (process.env.PRINTS_LARGURAS ?? "390x844,1280x800").split(",").map((p) => p.split("x").map(Number) as [number, number]);

for (const [largura, altura] of LARGURAS) {
  test.describe(`prints em ${largura}px`, () => {
    test.skip(!process.env.PRINTS, "defina PRINTS=1 para regravar os prints");
    test.use({ viewport: { width: largura, height: altura } });

    for (const rota of ["/", "/ressonancia"]) test(`um print por seção de ${rota}`, async ({ page }) => {
      test.setTimeout(180_000);
      await page.goto(rota);
      const tirar = { type: "jpeg", quality: 72, animations: "disabled" } as const;
      const pasta = `${SAIDA}/${largura}${rota === "/" ? "" : rota}`;
      mkdirSync(pasta, { recursive: true });
      if (rota === "/") await page.screenshot({ ...tirar, path: `${pasta}/00-primeira-tela-com-cookies.jpg` });
      await page.getByRole("button", { name: /recusar/i }).click();

      // Passa por tudo antes: as seções entram por opacidade e as imagens são tardias.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1500);

      // Nenhuma largura pode criar rolagem horizontal.
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect.soft(sobra, "rolagem horizontal").toBeLessThanOrEqual(0);

      // A tarja fixa se repetiria no meio dos blocos altos (o print é montado por partes).
      // Pelo atributo style, porque a CSP bloqueia <style> injetado.
      await page.evaluate(() => document.querySelectorAll<HTMLElement>(".sticky").forEach((e) => (e.style.position = "static")));

      const blocos = page.locator("main > section, body > footer, footer");
      const total = await blocos.count();
      expect(total).toBeGreaterThan(rota === "/" ? 10 : 2);
      for (let i = 0; i < total; i++) {
        const bloco = blocos.nth(i);
        const id = (await bloco.getAttribute("id")) ?? (await bloco.evaluate((e) => e.tagName.toLowerCase()));
        await bloco.scrollIntoViewIfNeeded();
        await page.waitForTimeout(700);
        await bloco.screenshot({ ...tirar, path: `${pasta}/${String(i + 1).padStart(2, "0")}-${id === "section" ? "topo" : id}.jpg` });
      }
    });

    for (const rota of ["/privacidade", "/termos"]) {
      test(`página inteira de ${rota}`, async ({ page }) => {
        await page.goto(rota);
        await page.getByRole("button", { name: /recusar/i }).click();
        await page.screenshot({ type: "jpeg", quality: 72, fullPage: true, path: `${SAIDA}/${largura}${rota}.jpg` });
      });
    }
  });
}
