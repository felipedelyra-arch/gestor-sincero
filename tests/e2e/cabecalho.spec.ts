import { expect, test, type Page } from "@playwright/test";
import { pagina } from "../../content";

const { itens, rotuloMenu } = pagina.navegacao;

/** Topo da seção em relação à base do cabeçalho, depois de a rolagem parar. */
async function folga(page: Page, ancora: string): Promise<number> {
  let antes = -1;
  await expect
    .poll(async () => {
      const y = await page.evaluate(() => window.scrollY);
      const parou = y === antes;
      antes = y;
      return parou;
    }, { intervals: [250] })
    .toBe(true);
  return page.evaluate((id) => {
    const secao = document.querySelector(id)!.getBoundingClientRect().top;
    return secao - document.querySelector("header")!.getBoundingClientRect().bottom;
  }, ancora);
}

/** A seção começa logo abaixo do cabeçalho: nem escondida atrás dele, nem longe do topo. */
async function conferirSecao(page: Page, ancora: string) {
  const f = await folga(page, ancora);
  expect(f, `${ancora}: topo da seção atrás do cabeçalho`).toBeGreaterThanOrEqual(0);
  expect(f, `${ancora}: seção longe do topo`).toBeLessThanOrEqual(40);
  await expect(page.locator(`${ancora} h2`).first()).toBeInViewport();
}

test.describe("cabeçalho em 1280px", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("cada âncora leva à seção sem escondê-la atrás do cabeçalho", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /recusar/i }).click();
    const nav = page.getByRole("banner").locator("nav").first();
    await expect(page.getByRole("banner").locator("summary")).toBeHidden();
    for (const item of itens) {
      await nav.getByRole("link", { name: item.rotulo, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${item.ancora}$`));
      await conferirSecao(page, item.ancora);
    }
    await expect(page.getByRole("banner")).toBeInViewport(); // continua fixo no fim da página
  });
});

test.describe("cabeçalho em 390px", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("menu abre por toque, leva à seção e fecha ao escolher", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /recusar/i }).click();
    const menu = page.getByRole("banner").locator("details");
    const resumo = menu.locator("summary");
    await expect(resumo).toHaveAccessibleName(rotuloMenu);
    for (const item of itens) {
      await resumo.tap();
      await expect(menu).toHaveAttribute("open", "");
      const link = menu.getByRole("link", { name: item.rotulo, exact: true });
      await expect(link).toBeVisible();
      await link.tap();
      await expect(menu).not.toHaveAttribute("open", "");
      await conferirSecao(page, item.ancora);
    }
  });

  test("menu abre e fecha pelo teclado", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /recusar/i }).click();
    const menu = page.getByRole("banner").locator("details");
    await menu.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(menu).toHaveAttribute("open", "");
    await page.keyboard.press("Tab");
    await expect(menu.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(menu).not.toHaveAttribute("open", "");
    await conferirSecao(page, itens[0].ancora);
  });

  test("sem JavaScript o menu ainda abre e as âncoras funcionam", async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await contexto.newPage();
    await page.goto("/");
    const menu = page.getByRole("banner").locator("details");
    await menu.locator("summary").click();
    await menu.getByRole("link", { name: itens[0].rotulo, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${itens[0].ancora}$`));
    await contexto.close();
  });
});
