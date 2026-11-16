import { expect, test } from "@playwright/test";

const ROTAS = ["/", "/privacidade", "/termos"];

for (const rota of ROTAS) {
  test(`${rota}: sem erro de console, violação de CSP ou requisição falha`, async ({ page }) => {
    const problemas: string[] = [];
    page.on("console", (m) => m.type() === "error" && problemas.push(`console: ${m.text()}`));
    page.on("pageerror", (e) => problemas.push(`exceção: ${e.message}`));
    page.on("requestfailed", (r) => problemas.push(`falhou: ${r.url()} (${r.failure()?.errorText})`));
    page.on("response", (r) => r.status() >= 400 && problemas.push(`${r.status()}: ${r.url()}`));
    await page.addInitScript(() => {
      document.addEventListener("securitypolicyviolation", (e) =>
        console.error(`CSP ${e.violatedDirective} bloqueou ${e.blockedURI} (${e.sourceFile}:${e.lineNumber})`),
      );
    });
    await page.goto(rota);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    await page.waitForTimeout(3000); // tempo para Turnstile e imagens tardias
    expect(problemas).toEqual([]);
  });

  test(`${rota}: links, âncoras e arquivos respondem`, async ({ page, request }) => {
    await page.goto(rota);
    const { urls, ancoras, ids } = await page.evaluate(() => {
      const attr = (sel: string, a: string) => [...document.querySelectorAll(sel)].map((e) => e.getAttribute(a) ?? "");
      const srcset = attr("[srcset],[imagesrcset]", "srcset")
        .concat(attr("[imagesrcset]", "imagesrcset"))
        .flatMap((s) => s.split(",").map((p) => p.trim().split(/\s+/)[0]));
      const brutos = [...attr("a[href]", "href"), ...attr("link[href]", "href"), ...attr("[src]", "src"), ...srcset].filter(Boolean);
      return {
        urls: [...new Set(brutos.filter((u) => !u.startsWith("#") && !/^(mailto|tel|data|blob):/.test(u)))],
        ancoras: [...new Set(brutos.filter((u) => u.startsWith("#") && u.length > 1))],
        ids: [...document.querySelectorAll("[id]")].map((e) => e.id),
      };
    });
    const quebrados: string[] = [];
    for (const a of ancoras) if (!ids.includes(a.slice(1))) quebrados.push(`âncora sem alvo: ${a}`);
    for (const u of urls) {
      const url = new URL(u, page.url());
      if (url.origin !== new URL(page.url()).origin) continue; // externos são listados em docs/QA.md, não chamados aqui
      const r = await request.get(url.href);
      if (r.status() >= 400) quebrados.push(`${r.status()}: ${u}`);
      const alvo = url.hash.slice(1);
      if (alvo && url.pathname !== new URL(page.url()).pathname) {
        const html = await r.text();
        if (!html.includes(`id="${alvo}"`)) quebrados.push(`âncora sem alvo em outra página: ${u}`);
      }
    }
    expect(quebrados).toEqual([]);
  });
}

test("arquivos de apoio existem (robots, sitemap, manifesto, ícone, imagem de compartilhamento)", async ({ page, request }) => {
  await page.goto("/");
  const metas = await page.evaluate(() =>
    [...document.querySelectorAll('meta[property^="og:image"],meta[name="twitter:image"],link[rel~="icon"],link[rel="manifest"],link[rel="apple-touch-icon"]')].map(
      (e) => e.getAttribute("content") ?? e.getAttribute("href") ?? "",
    ),
  );
  const faltando: string[] = [];
  for (const u of ["/robots.txt", "/sitemap.xml", ...metas.filter((m) => /^(\/|http:\/\/localhost)/.test(m))]) {
    const r = await request.get(u);
    if (r.status() !== 200) faltando.push(`${r.status()}: ${u}`);
  }
  expect(faltando).toEqual([]);
});
