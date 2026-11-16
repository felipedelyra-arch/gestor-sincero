import { expect, test } from "@playwright/test";
import { pagina } from "../../content";

const c = pagina.virada.comparativo;
const largura = async (l: import("@playwright/test").Locator) => (await l.boundingBox())?.width ?? 0;

test.describe("Comparativo dos pares no celular, sem JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test("troca de lado só com rádio e CSS e mantém todos os pares", async ({ page }) => {
    await page.goto("/");
    const bloco = page.locator("#virada");
    await expect(bloco.locator("dl > div")).toHaveCount(c.pares.length);

    const linha = bloco.locator("dl > div").first();
    const analogica = linha.locator("dd").nth(0);
    const digital = linha.locator("dd").nth(1);

    // Lado escondido fica só para leitor de tela (1 px), não some do documento.
    expect(await largura(analogica)).toBeGreaterThan(50);
    expect(await largura(digital)).toBeLessThanOrEqual(1);

    await bloco.locator("label", { hasText: c.rotuloDigital }).click();
    await expect(bloco.locator('input[value="digital"]')).toBeChecked();
    expect(await largura(digital)).toBeGreaterThan(50);
    expect(await largura(analogica)).toBeLessThanOrEqual(1);
    await expect(digital).toContainText(c.pares[0].digital);

    await bloco.locator('input[value="digital"]').press("ArrowLeft"); // teclado
    await expect(bloco.locator('input[value="analogica"]')).toBeChecked();
    expect(await largura(analogica)).toBeGreaterThan(50);
  });
});

test("em 1280px as duas colunas aparecem juntas", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const linha = page.locator("#virada dl > div").first();
  expect(await largura(linha.locator("dd").nth(0))).toBeGreaterThan(50);
  expect(await largura(linha.locator("dd").nth(1))).toBeGreaterThan(50);
});
