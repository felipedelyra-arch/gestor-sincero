import { expect, test } from "@playwright/test";
import { pagina } from "../../content";

const { a, b } = pagina.topo.variacoes;

test.describe("Variações do topo", () => {
  for (const [busca, esperado] of [
    ["", a],
    ["?v=a", a],
    ["?v=b", b],
    ["?v=x", a], // valor desconhecido cai na A
    ["?v=B", a], // só "b" minúsculo troca
  ] as const) {
    test(`"/${busca}" mostra a variação ${esperado === a ? "A" : "B"}`, async ({ page }) => {
      await page.goto(`/${busca}`);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText(esperado.titulo);
      await expect(page.getByText(esperado.subtitulo)).toBeVisible();
    });
  }

  test("o HTML estático sai com a variação A (sem JavaScript)", async ({ request }) => {
    const html = await (await request.get("/?v=b")).text();
    // O título B também viaja no HTML (dados do componente cliente); o que vale é o <h1> renderizado.
    const h1 = /<h1[^>]*>([^<]*)<\/h1>/.exec(html)?.[1] ?? "";
    expect(h1).toBe(a.titulo);
  });
});
