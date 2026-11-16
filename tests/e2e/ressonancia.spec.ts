import { expect, test } from "@playwright/test";
import { pagina } from "../../content";
import { contatoNovo, enviar, esperarTurnstile, preencherContato } from "./apoio";

const f = pagina.ressonancia.formulario;
const ROTA = "/api/ressonancia";
const PAGINA = "/ressonancia";
const FORM = "#pedido form";

test.describe("Pedido de Ressonância", () => {
  test("o resumo da landing leva à página /ressonancia", async ({ page }) => {
    await page.goto("/");
    const botao = page.locator('#ressonancia a[href="/ressonancia"]');
    await botao.scrollIntoViewIfNeeded();
    await botao.click();
    await expect(page).toHaveURL(/\/ressonancia$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("campos próprios do pedido são obrigatórios", async ({ page }) => {
    await page.goto(PAGINA);
    const form = page.locator(FORM);
    await form.scrollIntoViewIfNeeded();
    await preencherContato(form, contatoNovo());
    await form.getByText(f.consentimentos.privacidade).click();
    await form.locator('button[type="submit"]').click();

    for (const nome of ["empresa", "segmento", "faixaFaturamento", "numeroFuncionarios", "principalDesafio"]) {
      await expect(form.locator(`[name="${nome}"]`), nome).toHaveAttribute("aria-invalid", "true");
    }
    await expect(form.locator('[name="empresa"]')).toBeFocused();
  });

  test("pedido completo envia o contrato e mostra a confirmação", async ({ page }) => {
    await page.goto(`${PAGINA}?utm_source=qa&ref=parceiro-2`);
    const form = page.locator(FORM);
    await form.scrollIntoViewIfNeeded();
    const contato = contatoNovo();
    await preencherContato(form, contato);
    await form.locator('[name="empresa"]').fill("Empresa QA");
    await form.locator('[name="segmento"]').fill("Indústria");
    await form.locator('[name="faixaFaturamento"]').selectOption("4-8-a-30-milhoes");
    await form.locator('[name="numeroFuncionarios"]').selectOption("21-50");
    await form.locator('[name="principalDesafio"]').fill("Teste automatizado de QA, favor desconsiderar.");
    await form.getByText(f.consentimentos.whatsapp).click();
    await form.getByText(f.consentimentos.privacidade).click();
    await esperarTurnstile(form);

    const { req, status } = await enviar(page, form, ROTA);
    const corpo = req.postDataJSON();
    expect(corpo).toMatchObject({
      whatsapp: `55${contato.whatsapp}`,
      email: contato.email,
      empresa: "Empresa QA",
      segmento: "Indústria",
      faixaFaturamento: "4-8-a-30-milhoes",
      numeroFuncionarios: "21-50",
      consentimentoWhatsapp: true,
      consentimentoEmail: false,
      cienciaPrivacidade: true,
      afiliado: "parceiro-2",
      utm: { source: "qa" },
    });
    expect(corpo.turnstileToken).not.toBe("");

    if (status === 503) {
      await expect(page.getByText(f.erros.indisponivel)).toBeVisible();
      test.skip(true, "Pendência de ambiente: rota 503 (prod sem Supabase não usa memória); tela de sucesso não verificada");
    }
    expect(status).toBe(200);
    await expect(page.getByRole("heading", { name: f.sucesso.titulo })).toBeFocused();
  });
});
