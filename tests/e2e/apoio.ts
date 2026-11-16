import { expect, test, type Locator, type Page, type Request } from "@playwright/test";

export const TERCEIROS_RASTREIO = /facebook\.(com|net)|fbcdn\.net|google-analytics\.com|analytics\.google\.com|googletagmanager\.com|doubleclick\.net/;

export type Contato = { nome: string; whatsapp: string; email: string };

/** Contato único por execução: o servidor deduplica por e-mail e WhatsApp. */
export function contatoNovo(): Contato {
  const n = String(Date.now()).slice(-8);
  return { nome: "Teste QA", whatsapp: `119${n}`, email: `qa-${n}@example.com` };
}

export async function preencherContato(form: Locator, c: Contato): Promise<void> {
  await form.locator('[name="nome"]').fill(c.nome);
  await form.locator('[name="whatsapp"]').fill(c.whatsapp);
  await form.locator('[name="email"]').fill(c.email);
}

/**
 * Espera o token do Turnstile (chave pública de teste da Cloudflare, depende de rede).
 * Sem token o teste é pulado como pendência de ambiente: o antirrobô não é contornado.
 */
export async function esperarTurnstile(form: Locator): Promise<void> {
  const campo = form.locator('[name="cf-turnstile-response"]');
  const chegou = await expect
    .poll(async () => ((await campo.count()) ? campo.inputValue() : ""), { timeout: 30_000 })
    .not.toBe("")
    .then(() => true, () => false);
  test.skip(!chegou, "Pendência de ambiente: o Turnstile não entregou token (rede ou CSP)");
}

/** Clica em enviar e devolve a requisição feita à rota e o status da resposta. */
export async function enviar(page: Page, form: Locator, rota: string): Promise<{ req: Request; status: number }> {
  const [resposta] = await Promise.all([
    page.waitForResponse((r) => r.url().endsWith(rota) && r.request().method() === "POST"),
    form.locator('button[type="submit"]').click(),
  ]);
  return { req: resposta.request(), status: resposta.status() };
}
