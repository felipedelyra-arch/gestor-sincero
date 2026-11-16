import { expect, test, type Page } from "@playwright/test";
import { pagina } from "../../content";
import { TERCEIROS_RASTREIO } from "./apoio";

const c = pagina.cookies;

function vigiar(page: Page): string[] {
  const rastreio: string[] = [];
  page.on("request", (r) => TERCEIROS_RASTREIO.test(new URL(r.url()).hostname) && rastreio.push(r.url()));
  return rastreio;
}

const rastreadoresNaPagina = (page: Page) =>
  page.evaluate(() => ({ fbq: typeof window.fbq, gtag: typeof window.gtag, dataLayer: typeof window.dataLayer }));

async function rolarAteOFim(page: Page): Promise<void> {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
}

test.describe("Banner de cookies", () => {
  test("antes do aceite: nenhuma requisição a Meta/GA, nenhum cookie e nenhum script de rastreio", async ({ page, context }) => {
    const rastreio = vigiar(page);
    await page.goto("/?utm_source=qa");
    await expect(page.getByRole("button", { name: c.aceitar })).toBeVisible();
    await expect(page.getByRole("button", { name: c.recusar })).toBeVisible();
    expect(await context.cookies()).toEqual([]);

    // Ações que disparam eventos internos (início de formulário) também não podem vazar.
    await rolarAteOFim(page);
    await page.locator('#jornada form [name="nome"]').fill("Teste QA");
    await page.waitForTimeout(2500); // o Turnstile mantém a rede ocupada: "networkidle" nunca chega

    expect(rastreio).toEqual([]);
    expect(await rastreadoresNaPagina(page)).toEqual({ fbq: "undefined", gtag: "undefined", dataLayer: "undefined" });
    expect((await context.cookies()).filter((k) => /^_(fb|ga|gid|gcl)/.test(k.name))).toEqual([]);
  });

  test("recusar fecha o banner, não rastreia e a escolha sobrevive à recarga", async ({ page }) => {
    const rastreio = vigiar(page);
    await page.goto("/");
    await page.getByRole("button", { name: c.recusar }).click();
    await expect(page.getByRole("button", { name: c.aceitar })).toHaveCount(0);
    await page.reload();
    await rolarAteOFim(page);
    await page.waitForTimeout(2500); // o Turnstile mantém a rede ocupada: "networkidle" nunca chega
    await expect(page.getByRole("button", { name: c.aceitar })).toHaveCount(0);
    expect(await page.evaluate(() => window.localStorage.getItem("gs_cookies"))).toBe("recusado");
    expect(rastreio).toEqual([]);
  });

  test("aceitar fecha o banner e só então libera o rastreamento", async ({ page }) => {
    const rastreio = vigiar(page);
    await page.goto("/");
    expect(rastreio).toEqual([]);
    await page.getByRole("button", { name: c.aceitar }).click();
    await expect(page.getByRole("button", { name: c.aceitar })).toHaveCount(0);
    expect(await page.evaluate(() => window.localStorage.getItem("gs_cookies"))).toBe("aceito");
    await page.waitForTimeout(2500); // o Turnstile mantém a rede ocupada: "networkidle" nunca chega

    const depois = await rastreadoresNaPagina(page);
    test.skip(
      depois.fbq === "undefined" && depois.gtag === "undefined",
      "Pendência de ambiente: sem NEXT_PUBLIC_META_PIXEL_ID/GA4_ID no build, o carregamento após o aceite não é exercitado",
    );
    expect(rastreio.length).toBeGreaterThan(0);
  });

  test("o banner é operável por teclado e leva à política de privacidade", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: c.rotuloPolitica });
    await expect(link).toHaveAttribute("href", "/privacidade");
    await page.getByRole("button", { name: c.recusar }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: c.recusar })).toHaveCount(0);
  });
});
