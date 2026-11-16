import { expect, test } from "@playwright/test";
import { pagina } from "../../content";
import { contatoNovo, enviar, esperarTurnstile, preencherContato } from "./apoio";

const f = pagina.jornada.formulario;
const ROTA = "/api/cadastro-jornada";

test.describe("Cadastro da Jornada", () => {
  test("envio vazio mostra os erros, foca o primeiro campo e não chama a rota", async ({ page }) => {
    let chamou = false;
    page.on("request", (r) => (chamou ||= r.url().endsWith(ROTA)));
    await page.goto("/");
    const form = page.locator("#jornada form");
    await form.scrollIntoViewIfNeeded();
    await form.locator('button[type="submit"]').click();

    await expect(form.getByText(f.campos.nome.erro)).toBeVisible();
    await expect(form.getByText(f.campos.whatsapp.erro)).toBeVisible();
    await expect(form.getByText(f.campos.email.erro)).toBeVisible();
    await expect(form.locator('[name="nome"]')).toBeFocused();
    await expect(form.locator('[name="nome"]')).toHaveAttribute("aria-invalid", "true");
    await expect(form.locator('[name="cienciaPrivacidade"]')).toHaveAttribute("aria-invalid", "true");
    expect(chamou).toBe(false);
  });

  test("WhatsApp e e-mail inválidos são barrados no navegador", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("#jornada form");
    await preencherContato(form, { nome: "Teste QA", whatsapp: "1234", email: "sem-arroba" });
    await form.locator('button[type="submit"]').click();
    await expect(form.getByText(f.campos.whatsapp.erro)).toBeVisible();
    await expect(form.getByText(f.campos.email.erro)).toBeVisible();
    await expect(form.getByText(f.campos.nome.erro)).toHaveCount(0);
  });

  test("cadastro completo leva origem, variação e consentimentos e mostra a confirmação", async ({ page }) => {
    await page.goto("/?v=b&utm_source=qa&utm_medium=e2e&utm_campaign=onda3&afiliado=parceiro-1");
    const form = page.locator("#jornada form");
    await form.scrollIntoViewIfNeeded();
    const contato = contatoNovo();
    await preencherContato(form, contato);
    await form.locator('[name="empresa"]').fill("Empresa QA");
    await form.getByText(f.consentimentos.email).click();
    await form.getByText(f.consentimentos.privacidade).click();
    await esperarTurnstile(form);

    const { req, status, corpoResposta } = await enviar(page, form, ROTA);
    const corpo = req.postDataJSON();
    expect(corpo).toMatchObject({
      nome: contato.nome,
      whatsapp: `55${contato.whatsapp}`,
      email: contato.email,
      empresa: "Empresa QA",
      consentimentoWhatsapp: false,
      consentimentoEmail: true,
      cienciaPrivacidade: true,
      variacao: "b",
      afiliado: "parceiro-1",
      utm: { source: "qa", medium: "e2e", campaign: "onda3" },
      website: "",
    });
    expect(corpo.turnstileToken).not.toBe("");
    // Sem resposta ao banner de cookies, o servidor não pode repassar a conversão à Meta.
    expect(req.headers()["x-gs-consentimento"]).toBe("recusado");

    if (status === 503) {
      await expect(page.locator("#jornada").getByText(f.erros.indisponivel)).toBeVisible();
      test.skip(true, "Pendência de ambiente: rota 503 (prod sem Supabase não usa memória); tela de sucesso não verificada");
    }
    expect(status).toBe(200);
    const titulo = page.locator("#jornada").getByRole("heading", { name: f.sucesso.titulo });
    await expect(titulo).toBeVisible();
    await expect(titulo).toBeFocused();
    await expect(form).toHaveCount(0);
    // Link do manual: só aparece quando o servidor devolve um link assinado (o adaptador em memória não devolve).
    const manual = page.locator("#jornada").getByRole("link", { name: f.sucesso.baixarManual });
    if (!corpoResposta.manualUrl) {
      await expect(manual).toHaveCount(0);
      test.info().annotations.push({ type: "pendência de ambiente", description: "sem manualUrl na resposta: link do manual não verificado" });
      return;
    }
    expect(corpoResposta.manualUrl).toMatch(/^(\/(?!\/)|https:\/\/)/);
    await expect(manual).toBeVisible();
    await expect(manual).toHaveAttribute("href", corpoResposta.manualUrl);
  });
});
