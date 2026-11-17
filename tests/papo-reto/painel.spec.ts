import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { papoRetoBruto } from "../../content/papo-reto";
import { novoIp } from "./apoio";

// Painel do Papo reto no navegador (Chromium sem interface). Conversa só pelo teclado, sem mouse.
const Q = papoRetoBruto.perguntas;
const opcao = (numero: number, id: string) => Q[numero - 1].opcoes.find((o) => o.id === id)!.rotulo;
const ABRIR = "Conversar com o Gestor Sincero";

/** Recusa os cookies pelo teclado: no dev, o indicador do Next cobre o canto de baixo em 390px e intercepta o clique. */
async function recusar(page: Page) {
  await teclar(page.getByRole("button", { name: /recusar/i }));
}

async function abrirPainel(page: Page): Promise<Locator> {
  // Sem IP, o servidor de dev põe todo mundo na mesma cota (3 conversas por dia). Cada teste ganha o seu IP,
  // só na chamada à rota: o Turnstile e o resto da página seguem como estão.
  await page.route("**/api/papo-reto", (rota) => rota.continue({ headers: { ...rota.request().headers(), "x-forwarded-for": novoIp() } }));
  await page.goto("/");
  await recusar(page);
  await page.getByRole("button", { name: ABRIR }).first().click();
  const painel = page.getByRole("dialog");
  await expect(painel).toBeVisible();
  return painel;
}

/** Ativa pelo teclado: foca e aperta Enter (sem clique do mouse). */
async function teclar(alvo: Locator) {
  await alvo.focus();
  await alvo.page().keyboard.press("Enter");
}

async function digitarNumero(painel: Locator, rotulo: string, valor: string) {
  const campo = painel.getByLabel(rotulo, { exact: true });
  await campo.focus();
  await campo.page().keyboard.type(valor);
  await campo.page().keyboard.press("Enter"); // envia o formulário pelo teclado
}

async function consentirEComecar(painel: Locator) {
  await teclar(painel.getByRole("button", { name: papoRetoBruto.consentimento.aceitar }));
  const comecar = painel.getByRole("button", { name: papoRetoBruto.comecar });
  await expect(comecar).toBeEnabled();
  await teclar(comecar);
  await expect(painel.getByText(Q[0].texto, { exact: true })).toBeVisible({ timeout: 30_000 });
}

/** Responde a pergunta n pelo teclado e espera a próxima pergunta (ou a recomendação). */
async function responder(painel: Locator, n: number, resposta: { id?: string; numero?: string }) {
  if (resposta.numero !== undefined) {
    await digitarNumero(painel, Q[n - 1].campoNumero!.rotulo, resposta.numero);
  } else {
    await teclar(painel.getByRole("button", { name: opcao(n, resposta.id!), exact: true }));
  }
  if (n < Q.length) await expect(painel.getByText(Q[n].texto, { exact: true })).toBeVisible({ timeout: 30_000 });
}

for (const [largura, altura] of [[390, 844], [1280, 800]] as const) {
  test.describe(`painel em ${largura}px`, () => {
    test.use({ viewport: { width: largura, height: altura } });

    test("aviso e consentimento aparecem antes de qualquer pergunta", async ({ page }) => {
      const painel = await abrirPainel(page);
      await expect(painel.getByText(papoRetoBruto.avisos.roteiro)).toBeVisible();
      await expect(painel.getByText(papoRetoBruto.consentimento.texto)).toBeVisible();
      await expect(painel.getByText(Q[0].texto, { exact: true })).toHaveCount(0);
      await expect(painel.getByRole("button", { name: papoRetoBruto.comecar })).toHaveAttribute("aria-disabled", "true");
      await teclar(painel.getByRole("button", { name: papoRetoBruto.consentimento.aceitar }));
      await expect(painel.getByRole("button", { name: papoRetoBruto.consentimento.aceitar })).toHaveAttribute("aria-pressed", "true");
      await expect(painel.getByRole("button", { name: papoRetoBruto.comecar })).not.toHaveAttribute("aria-disabled", "true");
    });

    test("conversa completa só pelo teclado até a recomendação", async ({ page }) => {
      const painel = await abrirPainel(page);
      await consentirEComecar(painel);
      await responder(painel, 1, { numero: "10" });
      await responder(painel, 2, { id: "um-pouco-de-cada" });
      await responder(painel, 3, { id: "paradas" });
      await responder(painel, 4, { id: "equipe" });
      await responder(painel, 5, { numero: "500" });
      await responder(painel, 6, { id: "sem-jovens" });
      await responder(painel, 7, { id: "planejada" });
      await responder(painel, 8, { id: "vender-mais" });
      const recomendacao = painel.getByRole("button", { name: papoRetoBruto.recomendacoes.jornada.rotuloBotao });
      await expect(recomendacao).toBeFocused({ timeout: 15_000 });
      const pontos = painel.locator("ol li").filter({ hasText: /./ });
      expect(await painel.locator("ul li.border-l").count(), "três pontos no papo reto").toBe(3);
      await expect(pontos.first()).toBeVisible();
    });

    test("contradição mostra o confronto com o clipe cético e as respostas entre aspas", async ({ page }) => {
      const painel = await abrirPainel(page);
      await consentirEComecar(painel);
      await responder(painel, 1, { numero: "10" });
      await responder(painel, 2, { id: "numeros" });
      await responder(painel, 3, { id: "paradas" });
      await responder(painel, 4, { id: "equipe" });
      await teclar(painel.getByRole("button", { name: opcao(5, "nao-sei"), exact: true }));
      // O clipe cético entra antes da fala de confronto (a fala só aparece depois que o clipe termina).
      await expect(page.locator('video[src*="ferrer-cetico"]').first()).toBeAttached({ timeout: 15_000 });
      const confronto = painel.getByText(/^Sobre as decisões, você disse/);
      await expect(confronto).toBeVisible({ timeout: 30_000 });
      const texto = (await confronto.textContent()) ?? "";
      expect(texto).not.toMatch(/[{}]/);
      expect((texto.match(/"/g) ?? []).length).toBe(4);
    });

    test("encerrar a conversa fecha o painel e devolve o foco ao botão", async ({ page }) => {
      const painel = await abrirPainel(page);
      await painel.getByRole("button", { name: papoRetoBruto.encerrar }).click();
      await expect(painel).toBeHidden();
      await expect(page.getByRole("button", { name: ABRIR }).first()).toBeFocused();
    });

    test("botões do painel têm pelo menos 48px de altura", async ({ page }) => {
      const painel = await abrirPainel(page);
      const medir = () =>
        painel.locator("button:visible, summary:visible, input:visible, textarea:visible").evaluateAll((els) =>
          els.map((e) => ({ nome: (e.textContent ?? e.getAttribute("aria-label") ?? "").trim().slice(0, 40), altura: Math.round(e.getBoundingClientRect().height) })),
        );
      const consentimento = await medir();
      await consentirEComecar(painel);
      await responder(painel, 1, { numero: "10" });
      const pergunta = await medir();
      const todos = [...consentimento, ...pergunta];
      console.log(`MEDIDA alvos do painel ${largura}: ${JSON.stringify(todos.filter((x) => x.altura < 48))}`);
      expect(todos.filter((x) => x.altura < 48), "alvos menores que 48px").toEqual([]);
    });

    test("axe com o painel aberto, no consentimento e numa pergunta", async ({ page }) => {
      const painel = await abrirPainel(page);
      const rodar = () =>
        new AxeBuilder({ page }).include('dialog[open]').withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
      const antes = await rodar();
      await consentirEComecar(painel);
      await responder(painel, 1, { numero: "10" });
      const depois = await rodar();
      const graves = [...antes.violations, ...depois.violations].filter((v) => v.impact === "critical" || v.impact === "serious");
      console.log(`MEDIDA axe painel ${largura}: ${[...antes.violations, ...depois.violations].map((v) => `${v.id}:${v.impact}`).join(" ") || "sem violações"}`);
      expect(graves.map((v) => v.id)).toEqual([]);
    });
  });
}

test("prefers-reduced-motion: nenhum vídeo do painel é baixado, só o poster", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const videos: string[] = [];
  page.on("request", (r) => /ferrer-avatar\/.*\.(mp4|webm)/.test(r.url()) && videos.push(r.url()));
  const painel = await abrirPainel(page);
  await consentirEComecar(painel);
  await page.waitForTimeout(1000);
  expect(videos, "vídeos baixados com movimento reduzido").toEqual([]);
  await expect(painel.locator('img[src*="ferrer-poster"]').first()).toBeAttached();
});

test("nenhum vídeo, poster ou script do painel antes do clique (nem com o ponteiro sobre o botão)", async ({ page }) => {
  const antes: string[] = [];
  const scripts: string[] = [];
  page.on("request", (r) => {
    if (/ferrer-avatar/.test(r.url())) antes.push(r.url());
    if (r.resourceType() === "script" && r.url().startsWith("http://localhost:3000/_next/")) scripts.push(r.url());
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await recusar(page);
  await page.waitForLoadState("networkidle");
  expect(antes, "mídia do painel antes do clique").toEqual([]);
  const linhaDeBase = scripts.length;
  await page.getByRole("button", { name: ABRIR }).first().hover();
  await page.waitForTimeout(1500);
  // Achado (ver QA): o ponteiro sobre o botão já baixa o pedaço de JavaScript do painel.
  console.log(`MEDIDA scripts do painel após hover: ${scripts.length - linhaDeBase} novo(s): ${scripts.slice(linhaDeBase).map((u) => u.split("/").pop()).join(" ")}`);
  expect(scripts.length - linhaDeBase, "scripts do painel baixados só com o ponteiro sobre o botão").toBe(0);
});

test("variações A e B em 390px: as três ações do topo acima do banner de cookies", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const v of ["a", "b"]) {
    await page.goto(`/?v=${v}`);
    await expect(page.locator("#gs-cookies-texto")).toBeVisible();
    const medidas = await page.evaluate(() => {
      const texto = document.getElementById("gs-cookies-texto")!;
      let banner: HTMLElement = texto;
      while (banner.parentElement && getComputedStyle(banner).position !== "fixed") banner = banner.parentElement;
      const topo = banner.getBoundingClientRect().top;
      const achar = (rotulo: RegExp) => {
        const el = [...document.querySelectorAll<HTMLElement>("main a, main button")].find((e) => rotulo.test((e.textContent ?? "").trim()));
        return el ? { rotulo: (el.textContent ?? "").trim(), base: Math.round(el.getBoundingClientRect().bottom), altura: Math.round(el.getBoundingClientRect().height), topo: Math.round(topo) } : null;
      };
      return [achar(/Quero meu manual/), achar(/Conhecer a mentoria/), achar(/Conversar com o Gestor Sincero/)];
    });
    console.log(`MEDIDA topo variação ${v}: ${JSON.stringify(medidas)}`);
    for (const m of medidas) {
      expect(m, `ação do topo na variação ${v}`).not.toBeNull();
      expect(m!.base, `"${m!.rotulo}" acima do banner (variação ${v})`).toBeLessThanOrEqual(m!.topo);
    }
  }
});
