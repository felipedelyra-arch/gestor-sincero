import { expect, test } from "@playwright/test";
import { pagina } from "../../content";

const ORIGEM = "?utm_source=qa&utm_medium=e2e&utm_campaign=onda3&utm_term=t&utm_content=c&afiliado=parceiro-1";

test("o link de checkout preserva UTM e afiliado", async ({ page }) => {
  await page.goto(`/${ORIGEM}`);
  const botao = page.locator("#mentoria").getByRole("link", { name: pagina.oferta.chamada.rotulo });
  await expect(botao).toBeVisible();
  const href = (await botao.getAttribute("href")) ?? "";

  if (!/^https?:/.test(href)) {
    // Sem checkout em config/site.ts o botão cai na captação.
    expect(href).toBe("#jornada");
    test.skip(true, "Pendência: site.mentoria.checkoutUrl é null; UTM no link só coberto pelo teste unitário de origem.ts");
  }

  // O href é completado no clique; a navegação externa é barrada para não sair do site.
  await page.route((url) => url.origin === new URL(href).origin, (rota) => rota.abort());
  const [pedido] = await Promise.all([page.waitForRequest((r) => r.url().startsWith(new URL(href).origin)), botao.click()]);
  const q = new URL(pedido.url()).searchParams;
  expect(Object.fromEntries(q)).toMatchObject({
    utm_source: "qa",
    utm_medium: "e2e",
    utm_campaign: "onda3",
    utm_term: "t",
    utm_content: "c",
    afiliado: "parceiro-1",
  });
  expect(q.getAll("utm_source")).toHaveLength(1);
});

test("a origem da primeira visita vale para a sessão inteira", async ({ page }) => {
  const gravada = () => page.evaluate(() => JSON.parse(window.sessionStorage.getItem("gs_origem") ?? "null"));
  await page.goto(`/${ORIGEM}`);
  await expect.poll(gravada).not.toBeNull(); // a captura acontece depois da hidratação
  await page.goto("/privacidade");
  await page.goto("/?utm_source=outra&v=b");
  await page.waitForTimeout(1000);
  expect(await gravada()).toMatchObject({ utm: { source: "qa", campaign: "onda3" }, afiliado: "parceiro-1", variacao: "a" });
});
