import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { site } from "@config/site";
import type { RespostaFormulario } from "@/shared/contratos";
import { POST as postCadastro } from "@/app/api/cadastro-jornada/route";
import { POST as postRessonancia } from "@/app/api/ressonancia/route";
import { memoria } from "./infra/memoria";

// `after` do Next só existe dentro de uma requisição real; aqui as tarefas rodam e são aguardadas.
const segundoPlano = vi.hoisted(() => [] as Promise<void>[]);
vi.mock("next/server", () => ({
  after: (tarefa: () => Promise<void>) => void segundoPlano.push(tarefa()),
}));

const origem = new URL(site.url).origin;
const EMAIL = "ana.souza@exemplo.com.br";
const WHATSAPP = "5514999998888";

const cadastro = {
  nome: "Ana Souza",
  whatsapp: "(14) 99999-8888",
  email: "Ana.Souza@Exemplo.com.br",
  consentimentoWhatsapp: true,
  consentimentoEmail: false,
  cienciaPrivacidade: true,
  variacao: "a",
  turnstileToken: "token",
  utm: { source: "meta" },
};

const pedido = {
  nome: "Ana Souza",
  whatsapp: "(14) 99999-8888",
  email: "Ana.Souza@Exemplo.com.br",
  consentimentoWhatsapp: false,
  consentimentoEmail: true,
  cienciaPrivacidade: true,
  turnstileToken: "token",
  empresa: "Souza Ltda",
  segmento: "Varejo",
  faixaFaturamento: "360-mil-a-4-8-milhoes",
  numeroFuncionarios: "6-20",
  principalDesafio: "Vendas em queda",
};

type Opcoes = { headers?: Record<string, string>; ip?: string };

async function enviar(rota: (req: Request) => Promise<Response>, corpo: unknown, { headers, ip }: Opcoes = {}) {
  const req = new Request(`${origem}/api/teste`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: origem, "x-forwarded-for": ip ?? "203.0.113.7", ...headers },
    body: typeof corpo === "string" ? corpo : JSON.stringify(corpo),
  });
  const res = await rota(req);
  const texto = await res.text();
  await Promise.all(segundoPlano.splice(0));
  return { res, texto, json: JSON.parse(texto) as RespostaFormulario };
}

beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "");
  memoria.limpar();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

test("cadastro: caminho feliz grava, registra consentimentos e devolve o link do manual", async () => {
  const link = vi.spyOn(memoria.armazenamento, "linkAssinado").mockResolvedValue("https://arquivos.exemplo/manual?assinatura=1");
  const notificar = vi.spyOn(memoria.notificador, "cadastroCriado");
  const { res, json } = await enviar(postCadastro, cadastro);

  expect(res.status).toBe(200);
  expect(res.headers.get("cache-control")).toBe("no-store");
  expect(json).toEqual({ ok: true, manualUrl: "https://arquivos.exemplo/manual?assinatura=1", idEvento: expect.stringMatching(/^[0-9a-f-]{36}$/) });
  expect(link).toHaveBeenCalledWith(86400);

  expect(memoria.dados.cadastros).toHaveLength(1);
  expect(memoria.dados.cadastros[0]).toMatchObject({ nome: "Ana Souza", variacao: "a", utm: { source: "meta" } });
  expect(memoria.dados.consentimentos.map((c) => [c.canal, c.aceito])).toEqual([
    ["whatsapp", true],
    ["email", false],
    ["privacidade", true],
  ]);
  const [consentimento] = memoria.dados.consentimentos;
  expect(consentimento.texto.length).toBeGreaterThan(0);
  expect(consentimento.versaoTexto).toMatch(/^[0-9a-f]{12}$/);
  expect(consentimento.ipHash).toMatch(/^[0-9a-f]{64}$/);
  expect(memoria.dados.auditoria.map((e) => e.tipo)).toEqual(["registro_criado"]);
  expect(notificar).toHaveBeenCalledWith(expect.objectContaining({ email: EMAIL, whatsapp: WHATSAPP, novo: true }));
});

test("cadastro: sem manual no armazenamento responde ok sem manualUrl", async () => {
  const { json } = await enviar(postCadastro, cadastro);
  expect(json).toEqual({ ok: true, idEvento: expect.stringMatching(/^[0-9a-f-]{36}$/) });
  expect(memoria.dados.cadastros).toHaveLength(1);
});

test("ressonância: caminho feliz grava o pedido e nunca devolve manualUrl", async () => {
  vi.spyOn(memoria.armazenamento, "linkAssinado").mockResolvedValue("https://arquivos.exemplo/manual");
  const notificar = vi.spyOn(memoria.notificador, "pedidoRessonanciaCriado");
  const { res, json } = await enviar(postRessonancia, pedido);

  expect(res.status).toBe(200);
  expect(json).toEqual({ ok: true, idEvento: expect.stringMatching(/^[0-9a-f-]{36}$/) });
  expect(memoria.dados.pedidos).toHaveLength(1);
  expect(memoria.dados.pedidos[0]).toMatchObject({ empresa: "Souza Ltda", faixaFaturamento: "360-mil-a-4-8-milhoes" });
  expect(memoria.dados.cadastros).toHaveLength(0);
  expect(memoria.dados.consentimentos).toHaveLength(3);
  expect(notificar).toHaveBeenCalledOnce();
});

test("validação aponta o campo e não grava", async () => {
  const { res, json } = await enviar(postCadastro, { ...cadastro, email: "nao-e-email", whatsapp: "123", cienciaPrivacidade: false });
  expect(res.status).toBe(400);
  expect(json).toEqual({ ok: false, erro: "validacao", campos: { email: "invalido", whatsapp: "invalido", cienciaPrivacidade: "invalido" } });

  const semCampos = await enviar(postRessonancia, { ...pedido, segmento: "", faixaFaturamento: "outra" });
  expect(semCampos.json).toEqual({ ok: false, erro: "validacao", campos: { segmento: "invalido", faixaFaturamento: "invalido" } });

  for (const corpo of ["{quebrado", "[]", "null"]) expect((await enviar(postCadastro, corpo)).res.status).toBe(400);
  expect(memoria.dados.cadastros).toHaveLength(0);
  expect(memoria.dados.pedidos).toHaveLength(0);
});

test("armadilha preenchida devolve sucesso falso sem gravar nem verificar", async () => {
  const turnstile = vi.spyOn(memoria.antirrobo, "verificar");
  const { res, json } = await enviar(postCadastro, { ...cadastro, website: "https://spam.example" });
  expect(res.status).toBe(200);
  expect(json).toEqual({ ok: true, idEvento: expect.stringMatching(/^[0-9a-f-]{36}$/) });
  expect(turnstile).not.toHaveBeenCalled();
  expect(memoria.dados).toMatchObject({ cadastros: [], consentimentos: [], auditoria: [] });
});

test("Turnstile reprovado bloqueia e só gera auditoria", async () => {
  vi.spyOn(memoria.antirrobo, "verificar").mockResolvedValue(false);
  const { res, json } = await enviar(postCadastro, cadastro);
  expect(res.status).toBe(400);
  expect(json).toEqual({ ok: false, erro: "antirrobo" });
  expect(memoria.dados.cadastros).toHaveLength(0);
  expect(memoria.dados.auditoria.map((e) => e.tipo)).toEqual(["antirrobo_reprovado"]);
});

test("6º envio do mesmo IP é bloqueado, por rota", async () => {
  for (let i = 0; i < 5; i++) expect((await enviar(postCadastro, cadastro)).res.status).toBe(200);
  const sexto = await enviar(postCadastro, cadastro);
  expect(sexto.res.status).toBe(429);
  expect(sexto.json).toEqual({ ok: false, erro: "limite" });

  // Outra rota e outro IP têm cota própria.
  expect((await enviar(postRessonancia, pedido)).res.status).toBe(200);
  expect((await enviar(postCadastro, cadastro, { ip: "198.51.100.9, 203.0.113.7" })).res.status).toBe(200);
});

test("corpo de 1 MB é recusado antes do parse", async () => {
  const parse = vi.spyOn(JSON, "parse");
  const gigante = JSON.stringify({ ...cadastro, nome: "a".repeat(1024 * 1024) });
  const { res } = await enviar(postCadastro, gigante);
  expect(res.status).toBe(413);
  expect(parse).not.toHaveBeenCalledWith(gigante); // o único parse é o da resposta, feito pelo teste
  expect(memoria.dados.cadastros).toHaveLength(0);
});

test("corpo grande com Content-Length mentiroso também é recusado", async () => {
  const { res } = await enviar(postCadastro, JSON.stringify({ ...cadastro, nome: "a".repeat(20_000) }), {
    headers: { "content-length": "10" },
  });
  expect(res.status).toBe(413);
});

test("Content-Type diferente de application/json é recusado", async () => {
  for (const tipo of ["text/plain", "application/x-www-form-urlencoded", "multipart/form-data"]) {
    const { res } = await enviar(postCadastro, cadastro, { headers: { "content-type": tipo } });
    expect(res.status).toBe(400);
  }
  expect(memoria.dados.cadastros).toHaveLength(0);
});

test("Origin de outro site ou ausente é recusado", async () => {
  const outro = await enviar(postCadastro, cadastro, { headers: { origin: "https://atacante.example" } });
  expect(outro.res.status).toBe(403);
  expect(outro.json.ok).toBe(false);

  const req = new Request(`${origem}/api/teste`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(cadastro) });
  expect((await postCadastro(req)).status).toBe(403);
  expect(memoria.dados.cadastros).toHaveLength(0);
});

test("script injetado é gravado como texto e nunca refletido", async () => {
  const script = '<script>alert("x")</script>';
  const cad = await enviar(postCadastro, { ...cadastro, nome: script, empresa: script, afiliado: `"><img onerror=alert(1)>` });
  expect(cad.res.status).toBe(200);
  expect(cad.texto).not.toContain("script");
  expect(memoria.dados.cadastros[0].nome).toBe(script);
  expect(cad.res.headers.get("content-type")).toContain("application/json");

  const ped = await enviar(postRessonancia, { ...pedido, principalDesafio: `'; DROP TABLE cadastros; -- ${script}` });
  expect(ped.texto).not.toContain("script");
  expect(memoria.dados.pedidos[0].principalDesafio).toContain("DROP TABLE");

  // Valor inválido com script: o erro traz só o nome do campo.
  const erro = await enviar(postCadastro, { ...cadastro, email: script });
  expect(erro.res.status).toBe(400);
  expect(erro.texto).not.toContain("script");
});

test("cadastro repetido não sobrescreve o primeiro registro e responde igual a um novo", async () => {
  const primeiro = await enviar(postCadastro, { ...cadastro, empresa: "Souza Ltda" });
  const original = structuredClone(memoria.dados.cadastros[0]);

  // Mesmo e-mail com outro nome, outra empresa e outro telefone.
  const segundo = await enviar(postCadastro, { ...cadastro, nome: "Invasor", empresa: "Outra", cargo: "x", whatsapp: "11988887777", consentimentoEmail: true });
  // Mesmo WhatsApp com outro e-mail.
  const terceiro = await enviar(postCadastro, { ...cadastro, nome: "Invasor", email: "outra@exemplo.com.br" });

  for (const repetido of [segundo, terceiro]) {
    expect(repetido.res.status).toBe(primeiro.res.status);
    expect(Object.keys(repetido.json)).toEqual(Object.keys(primeiro.json));
  }
  expect(memoria.dados.cadastros).toHaveLength(1);
  const { atualizadoEm, ...mantido } = memoria.dados.cadastros[0];
  expect({ ...mantido, atualizadoEm: original.atualizadoEm }).toEqual(original);
  expect(atualizadoEm >= original.atualizadoEm).toBe(true);
  expect(memoria.cifra.decifrar(mantido.emailCifrado)).toBe(EMAIL);
  expect(memoria.cifra.decifrar(mantido.whatsappCifrado)).toBe(WHATSAPP);

  // Histórico: consentimentos novos e auditoria são acrescentados ao mesmo registro.
  expect(memoria.dados.auditoria.map((e) => e.tipo)).toEqual(["registro_criado", "registro_atualizado", "registro_atualizado"]);
  expect(memoria.dados.consentimentos).toHaveLength(9);
  expect(new Set(memoria.dados.consentimentos.map((c) => c.referenciaId))).toEqual(new Set([original.id]));
  expect(memoria.dados.consentimentos.filter((c) => c.canal === "email").map((c) => c.aceito)).toEqual([false, true, false]);
});

test("pedido de Ressonância repetido também não sobrescreve", async () => {
  await enviar(postRessonancia, pedido);
  await enviar(postRessonancia, { ...pedido, empresa: "Outra", principalDesafio: "Outro" });
  expect(memoria.dados.pedidos).toHaveLength(1);
  expect(memoria.dados.pedidos[0]).toMatchObject({ empresa: "Souza Ltda", principalDesafio: "Vendas em queda" });
});

test("IP vem de x-vercel-forwarded-for, depois x-real-ip, depois x-forwarded-for", async () => {
  const limite = vi.spyOn(memoria.limitador, "consumir");
  const chave = (ip: string) => `cadastro-jornada:${memoria.cifra.hashBusca(ip)}`;
  const casos: [Record<string, string>, string][] = [
    [{ "x-vercel-forwarded-for": "192.0.2.1", "x-real-ip": "192.0.2.2", "x-forwarded-for": "192.0.2.3" }, chave("192.0.2.1")],
    [{ "x-real-ip": "192.0.2.2", "x-forwarded-for": "192.0.2.3" }, chave("192.0.2.2")],
    [{ "x-forwarded-for": " 192.0.2.3 , 10.0.0.1" }, chave("192.0.2.3")],
    [{ "x-forwarded-for": "" }, "cadastro-jornada:sem-ip"],
  ];
  for (const [headers, esperado] of casos) {
    await enviar(postCadastro, cadastro, { headers });
    expect(limite).toHaveBeenLastCalledWith(esperado, 5, 600);
  }
});

test("falha do notificador e da Meta não derruba a resposta nem perde o cadastro", async () => {
  vi.spyOn(memoria.notificador, "cadastroCriado").mockRejectedValue(new Error("webhook fora do ar"));
  vi.spyOn(memoria.meta, "enviarLead").mockRejectedValue(new Error("meta fora do ar"));
  const { res, json } = await enviar(postCadastro, cadastro, { headers: { "x-gs-consentimento": "aceito" } });
  expect(res.status).toBe(200);
  expect(json.ok).toBe(true);
  expect(memoria.dados.cadastros).toHaveLength(1);
  expect(memoria.dados.auditoria.map((e) => e.tipo)).toEqual(["registro_criado", "falha_notificador", "falha_meta"]);
});

test("Meta só recebe o evento com aceite de cookies, e só com dados em hash", async () => {
  const meta = vi.spyOn(memoria.meta, "enviarLead");
  await enviar(postCadastro, cadastro);
  await enviar(postCadastro, cadastro, { headers: { "x-gs-consentimento": "recusado" } });
  expect(meta).not.toHaveBeenCalled();

  const { json } = await enviar(postCadastro, cadastro, { headers: { "x-gs-consentimento": "aceito" } });
  expect(meta).toHaveBeenCalledOnce();
  const [lead] = meta.mock.calls[0];
  const enviado = JSON.stringify(lead);
  expect(enviado).not.toContain(EMAIL);
  expect(enviado).not.toContain(WHATSAPP);
  expect(lead.emailSha256).toMatch(/^[0-9a-f]{64}$/);

  // idEvento: o mesmo na Meta e na resposta, aleatório, nunca o id do registro.
  expect(json).toMatchObject({ ok: true, idEvento: lead.idEvento });
  expect(lead.idEvento).not.toBe(memoria.dados.cadastros[0].id);
});

test("idEvento muda a cada envio e a armadilha devolve um com a mesma forma", async () => {
  const ids = new Set<unknown>();
  for (const corpo of [cadastro, cadastro, { ...cadastro, website: "x" }, { ...cadastro, website: "x" }]) {
    const { json } = await enviar(postCadastro, corpo);
    expect(json).toEqual({ ok: true, idEvento: expect.stringMatching(/^[0-9a-f-]{36}$/) });
    ids.add(json.ok && json.idEvento);
  }
  expect(ids.size).toBe(4);
  expect(memoria.dados.cadastros).toHaveLength(1);
});

test("e-mail, telefone e IP nunca ficam em claro no repositório", async () => {
  await enviar(postCadastro, cadastro);
  await enviar(postRessonancia, pedido);
  const gravado = JSON.stringify(memoria.dados, (_chave, valor: unknown) => (valor instanceof Map ? [...valor] : valor));
  for (const claro of [EMAIL, "Ana.Souza@Exemplo.com.br", WHATSAPP, "14999998888", "99999-8888", "203.0.113.7"]) {
    expect(gravado).not.toContain(claro);
  }
  const [registro] = memoria.dados.cadastros;
  expect(memoria.cifra.decifrar(registro.emailCifrado)).toBe(EMAIL);
  expect(memoria.cifra.decifrar(registro.whatsappCifrado)).toBe(WHATSAPP);
  expect(registro.emailHash).toBe(memoria.cifra.hashBusca(EMAIL));
  expect(registro.emailCifrado).not.toBe(memoria.cifra.cifrar(EMAIL)); // IV novo a cada cifragem
});

test("falha interna vira 503 sem detalhe e sem dado pessoal no log", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(memoria.repositorio, "registrarCadastro").mockRejectedValue(new Error(`duplicate key ${EMAIL}`));
  const { res, texto } = await enviar(postCadastro, cadastro);
  expect(res.status).toBe(503);
  expect(JSON.parse(texto)).toEqual({ ok: false, erro: "indisponivel" });
  expect(JSON.stringify(log.mock.calls)).not.toContain(EMAIL);
});

test("produção sem variáveis, ou com Supabase sem as demais variáveis, responde 503 e não grava em memória", async () => {
  vi.stubEnv("NODE_ENV", "production");
  const semVariaveis = await enviar(postCadastro, cadastro);
  expect(semVariaveis.res.status).toBe(503);
  expect(semVariaveis.json).toEqual({ ok: false, erro: "indisponivel" });

  vi.stubEnv("SUPABASE_URL", "https://projeto.supabase.co");
  expect((await enviar(postRessonancia, pedido)).res.status).toBe(503);
  expect(memoria.dados).toMatchObject({ cadastros: [], pedidos: [], consentimentos: [], auditoria: [] });
});
