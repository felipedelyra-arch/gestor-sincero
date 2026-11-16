import { createHmac } from "node:crypto";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { site } from "@config/site";
import type { RespostaFormulario } from "@/shared/contratos";
import { POST as postCadastro } from "@/app/api/cadastro-jornada/route";
import { POST as postRessonancia } from "@/app/api/ressonancia/route";
import { memoria } from "./infra/memoria";
import { env, simularServicos, SUPABASE, WEBHOOK } from "./teste/servicosSimulados";

// As rotas com os adaptadores reais (Supabase, Turnstile, webhook, Meta) e a rede simulada no fetch.

const segundoPlano = vi.hoisted(() => [] as Promise<void>[]);
vi.mock("next/server", () => ({
  after: (tarefa: () => Promise<void>) => void segundoPlano.push(tarefa()),
}));
// O Pixel é PENDENTE em config/site.ts; aqui ele existe para a API de Conversões ser ligada.
// A chave pública do Turnstile vem de teste por padrão; aqui cada teste escolhe a sua.
const chaves = vi.hoisted(() => ({ publica: "0x4AAAAAAAchave-publica-real" }));
vi.mock("@config/site", async (original) => {
  const real = await original<typeof import("@config/site")>();
  return {
    site: {
      ...real.site,
      rastreamento: { ...real.site.rastreamento, metaPixelId: "123456789" },
      get turnstileSiteKey() {
        return chaves.publica;
      },
    },
  };
});

const origem = new URL(site.url).origin;
const EMAIL = "ana.souza@exemplo.com.br";
const WHATSAPP = "5514999998888";
const IP = "203.0.113.7";

const cadastro = {
  nome: "Ana Souza",
  whatsapp: "(14) 99999-8888",
  email: "Ana.Souza@Exemplo.com.br",
  consentimentoWhatsapp: true,
  consentimentoEmail: false,
  cienciaPrivacidade: true,
  variacao: "a",
  turnstileToken: "token-do-visitante",
  utm: { source: "meta" },
};

const pedido = {
  ...cadastro,
  variacao: undefined,
  empresa: "Souza Ltda",
  segmento: "Varejo",
  faixaFaturamento: "360-mil-a-4-8-milhoes",
  numeroFuncionarios: "6-20",
  principalDesafio: "Vendas em queda",
};

async function enviar(rota: (req: Request) => Promise<Response>, corpo: unknown, headers: Record<string, string> = {}) {
  const req = new Request(`${origem}/api/teste`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: origem, "x-forwarded-for": IP, ...headers },
    body: typeof corpo === "string" ? corpo : JSON.stringify(corpo),
  });
  const res = await rota(req);
  const texto = await res.text();
  await Promise.all(segundoPlano.splice(0));
  return { res, texto, json: JSON.parse(texto) as RespostaFormulario };
}

let rede: ReturnType<typeof simularServicos>;
let log: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  rede = simularServicos();
  chaves.publica = "0x4AAAAAAAchave-publica-real";
  memoria.limpar();
  log = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  // Nenhum segredo, e-mail ou telefone em log, em nenhum cenário.
  const registrado = JSON.stringify(log.mock.calls);
  for (const segredo of [...Object.values(env).filter((v) => v.length > 12 && !v.startsWith("https")), EMAIL, WHATSAPP]) {
    expect(registrado).not.toContain(segredo);
  }
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

test("cadastro grava pelo rpc com contato cifrado, service role só no cabeçalho e link assinado do manual", async () => {
  const { res, json } = await enviar(postCadastro, cadastro);
  expect(res.status).toBe(200);
  expect(json).toEqual({
    ok: true,
    manualUrl: `${SUPABASE}/storage/v1/object/sign/manual/manual.pdf?token=assinatura-de-teste`,
    idEvento: expect.stringMatching(/^[0-9a-f-]{36}$/),
  });

  const [rpc] = rede.para("/rpc/registrar_cadastro");
  expect(rpc.headers.get("apikey")).toBe(env.SUPABASE_SERVICE_ROLE_KEY);
  const args = JSON.parse(rpc.corpo);
  expect(args.p_cadastro).toMatchObject({ nome: "Ana Souza", variacao: "a", utm: { source: "meta" } });
  expect(args.p_cadastro.emailHash).toMatch(/^[0-9a-f]{64}$/);
  expect(args.p_cadastro.emailCifrado).toMatch(/^k1:/);
  expect(args.p_consentimentos.map((c: { canal: string; aceito: boolean }) => [c.canal, c.aceito])).toEqual([
    ["whatsapp", true],
    ["email", false],
    ["privacidade", true],
  ]);
  expect(args.p_auditoria).toMatchObject({ formulario: "cadastro-jornada" });

  // Nada em claro vai ao banco: nem contato, nem IP.
  for (const chamada of rede.para(SUPABASE)) {
    for (const claro of [EMAIL, WHATSAPP, "99999-8888", IP]) expect(chamada.corpo + chamada.url.href).not.toContain(claro);
  }
  expect(JSON.parse(rede.para("/storage/v1/object/sign/")[0].corpo)).toEqual({ expiresIn: 86400 });
  expect(memoria.dados.cadastros).toHaveLength(0);
});

test("Turnstile é conferido no servidor com segredo, token e IP; reprovado bloqueia e só gera auditoria", async () => {
  await enviar(postCadastro, cadastro);
  const verificacao = new URLSearchParams(rede.para("challenges.cloudflare.com")[0].corpo);
  expect(Object.fromEntries(verificacao)).toEqual({ secret: env.TURNSTILE_SECRET_KEY, response: "token-do-visitante", remoteip: IP });

  rede.turnstile = false;
  const { res, json } = await enviar(postRessonancia, pedido);
  expect(res.status).toBe(400);
  expect(json).toEqual({ ok: false, erro: "antirrobo" });
  expect(rede.para("/rpc/registrar_pedido")).toHaveLength(0);
  expect(JSON.parse(rede.para("/rest/v1/eventos_auditoria")[0].corpo)).toMatchObject({
    tipo: "antirrobo_reprovado",
    formulario: "ressonancia",
    registro_id: null,
  });
});

test("Turnstile fora do ar nunca aprova: 503 e nada gravado", async () => {
  rede.fora.add("turnstile");
  const { res, json } = await enviar(postCadastro, cadastro);
  expect(res.status).toBe(503);
  expect(json).toEqual({ ok: false, erro: "indisponivel" });
  expect(rede.para("/rpc/registrar_cadastro")).toHaveLength(0);
});

test("webhook sai assinado com HMAC e leva os dados em claro só para a automação", async () => {
  await enviar(postCadastro, cadastro);
  const [chamada] = rede.para(WEBHOOK);
  const momento = chamada.headers.get("x-gs-timestamp");
  const esperado = createHmac("sha256", env.WEBHOOK_AUTOMACAO_SEGREDO).update(`${momento}.${chamada.corpo}`).digest("hex");
  expect(chamada.headers.get("x-gs-assinatura")).toBe(`sha256=${esperado}`);
  expect(Math.abs(Date.now() / 1000 - Number(momento))).toBeLessThan(5);
  expect(JSON.parse(chamada.corpo)).toMatchObject({ evento: "cadastro.criado", dados: { email: EMAIL, whatsapp: WHATSAPP, novo: true } });
  expect(chamada.corpo).not.toContain("turnstileToken");
  expect(chamada.corpo).not.toContain(env.WEBHOOK_AUTOMACAO_SEGREDO);
});

test("Meta só recebe com aceite de cookies: dados em hash, idEvento da resposta e token fora da URL", async () => {
  await enviar(postCadastro, cadastro);
  await enviar(postCadastro, cadastro, { "x-gs-consentimento": "recusado" });
  expect(rede.para("graph.facebook.com")).toHaveLength(0);

  const navegador = `Mozilla/5.0 (teste) ${"x".repeat(2000)}`;
  const { json } = await enviar(postCadastro, cadastro, { "x-gs-consentimento": "aceito", "user-agent": navegador });
  const [chamada] = rede.para("graph.facebook.com");
  expect(chamada.url.pathname).toBe("/v24.0/123456789/events");
  expect(chamada.url.href).not.toContain(env.META_CAPI_TOKEN);
  const corpo = JSON.parse(chamada.corpo);
  expect(corpo.access_token).toBe(env.META_CAPI_TOKEN);
  expect(corpo.data[0]).toMatchObject({ event_name: "Lead", action_source: "website", event_id: json.ok && json.idEvento });
  expect(corpo.data[0].user_data.em[0]).toMatch(/^[0-9a-f]{64}$/);
  expect(corpo.data[0].user_data.ph[0]).toMatch(/^[0-9a-f]{64}$/);
  // A Meta exige o user-agent em eventos de site; vai cortado em 512 caracteres.
  expect(corpo.data[0].user_data.client_user_agent).toBe(navegador.slice(0, 512));
  expect(chamada.corpo).not.toContain(EMAIL);
  expect(chamada.corpo).not.toContain(WHATSAPP);
});

test("webhook e Meta fora do ar não derrubam a resposta e viram auditoria", async () => {
  rede.fora.add("webhook").add("meta");
  const { res, json } = await enviar(postCadastro, cadastro, { "x-gs-consentimento": "aceito" });
  expect(res.status).toBe(200);
  expect(json.ok).toBe(true);
  expect(rede.para("/rest/v1/eventos_auditoria").map((c) => JSON.parse(c.corpo).tipo)).toEqual(["falha_notificador", "falha_meta"]);
});

test("excesso de requisições: o 6º envio do mesmo IP é barrado pelo consumir_limite antes do Turnstile", async () => {
  for (let i = 0; i < 5; i++) expect((await enviar(postCadastro, cadastro)).res.status).toBe(200);
  const sexto = await enviar(postCadastro, cadastro);
  expect(sexto.res.status).toBe(429);
  expect(sexto.json).toEqual({ ok: false, erro: "limite" });
  expect(rede.para("challenges.cloudflare.com")).toHaveLength(5);
  expect(rede.para("/rpc/registrar_cadastro")).toHaveLength(5);
  expect(JSON.parse(rede.para("/rpc/consumir_limite")[0].corpo)).toEqual({
    p_chave: expect.stringMatching(/^cadastro-jornada:[0-9a-f]{64}$/),
    p_max: 5,
    p_janela_segundos: 600,
  });
});

test("script e SQL injetados viajam só como valor JSON do rpc, nunca na URL nem na resposta", async () => {
  const script = '<script>alert("x")</script>';
  const sql = "'; DROP TABLE cadastros; --";
  const { res, texto } = await enviar(postRessonancia, { ...pedido, nome: script, principalDesafio: `${sql} ${script}`, afiliado: sql });
  expect(res.status).toBe(200);
  expect(texto).not.toContain("script");

  const [rpc] = rede.para("/rpc/registrar_pedido");
  expect(JSON.parse(rpc.corpo).p_pedido).toMatchObject({ nome: script, principalDesafio: `${sql} ${script}`, afiliado: sql });
  for (const chamada of rede.chamadas) {
    expect(decodeURIComponent(chamada.url.href)).not.toContain("DROP TABLE");
    expect(decodeURIComponent(chamada.url.href)).not.toContain("<script");
  }
});

test("payload gigante é recusado sem nenhuma chamada externa", async () => {
  const { res } = await enviar(postCadastro, JSON.stringify({ ...cadastro, nome: "a".repeat(1024 * 1024) }));
  expect(res.status).toBe(413);
  expect(rede.chamadas).toHaveLength(0);
});

test("erro do banco vira 503 sem detalhe interno para o cliente", async () => {
  rede.fora.add("supabase");
  const { res, texto } = await enviar(postCadastro, cadastro);
  expect(res.status).toBe(503);
  expect(JSON.parse(texto)).toEqual({ ok: false, erro: "indisponivel" });
  expect(texto).not.toContain("duplicate");
  expect(JSON.stringify(log.mock.calls)).not.toContain("duplicate");
});

test("configuração incompleta responde 503, não chama ninguém e o log cita só o nome da variável", async () => {
  for (const [variavel, valor] of [
    ["SUPABASE_SERVICE_ROLE_KEY", ""],
    ["TURNSTILE_SECRET_KEY", ""],
    ["HASH_PIMENTA", "curta"],
    ["WEBHOOK_AUTOMACAO_SEGREDO", ""],
    ["SUPABASE_URL", "http://projeto.supabase.co"],
  ]) {
    vi.stubEnv(variavel, valor);
    const { res } = await enviar(postCadastro, cadastro);
    expect(res.status).toBe(503);
    expect(String(log.mock.lastCall?.[0])).toContain(variavel);
    vi.stubEnv(variavel, env[variavel as keyof typeof env]);
  }
  expect(rede.chamadas).toHaveLength(0);
  expect(memoria.dados.cadastros).toHaveLength(0);
});

test("produção com chave de teste da Cloudflare (pública ou segredo) falha fechada: 503 e nenhuma chamada", async () => {
  vi.stubEnv("NODE_ENV", "production");
  expect((await enviar(postCadastro, cadastro)).res.status).toBe(200); // chaves reais: produção funciona
  const chamadas = rede.chamadas.length;

  for (const segredo of ["1x0000000000000000000000000000000AA", "2x0000000000000000000000000000000AA", "3x0000000000000000000000000000000AA"]) {
    vi.stubEnv("TURNSTILE_SECRET_KEY", segredo);
    expect((await enviar(postCadastro, cadastro)).res.status).toBe(503);
    expect(String(log.mock.lastCall?.[0])).toContain("TURNSTILE_SECRET_KEY");
  }
  vi.stubEnv("TURNSTILE_SECRET_KEY", env.TURNSTILE_SECRET_KEY);

  for (const publica of ["1x00000000000000000000AA", "2x00000000000000000000AB", "3x00000000000000000000FF"]) {
    chaves.publica = publica;
    expect((await enviar(postRessonancia, pedido)).res.status).toBe(503);
    expect(String(log.mock.lastCall?.[0])).toContain("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
  }
  expect(rede.chamadas).toHaveLength(chamadas);

  // Fora de produção as chaves de teste continuam valendo (desenvolvimento e prévia local).
  vi.stubEnv("NODE_ENV", "test");
  expect((await enviar(postRessonancia, pedido)).res.status).toBe(200);
});

test("as portas reais são montadas uma vez: um cliente e um aviso de configuração por processo", async () => {
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  for (let i = 0; i < 3; i++) expect((await enviar(postCadastro, cadastro)).res.status).toBe(503);
  expect(log.mock.calls.filter((chamada: unknown[]) => String(chamada[0]).includes("[composicao]"))).toHaveLength(1);
});

test("sem webhook, sem token da Meta e sem caminho do manual o cadastro funciona, só sem esses recursos", async () => {
  for (const variavel of ["WEBHOOK_AUTOMACAO_URL", "WEBHOOK_AUTOMACAO_SEGREDO", "META_CAPI_TOKEN", "MANUAL_STORAGE_CAMINHO"]) vi.stubEnv(variavel, "");
  const { json } = await enviar(postCadastro, cadastro, { "x-gs-consentimento": "aceito" });
  expect(json).toEqual({ ok: true, idEvento: expect.any(String) });
  expect(rede.para("/rpc/registrar_cadastro")).toHaveLength(1);
  expect(rede.chamadas.filter((c) => c.url.origin !== SUPABASE && c.url.hostname !== "challenges.cloudflare.com")).toHaveLength(0);
});
