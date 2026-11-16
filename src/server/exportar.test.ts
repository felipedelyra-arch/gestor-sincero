import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { GET } from "@/app/api/admin/exportar/route";
import { celulaCsv } from "./aplicacao/exportar";
import { criarCifra } from "./infra/cripto/cifra";
import { env, simularServicos } from "./teste/servicosSimulados";

const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.assinatura-de-teste";
const EMAIL = "ana.souza@exemplo.com.br";
const WHATSAPP = "5514999998888";
const ADMIN = "22222222-2222-4222-8222-222222222222";
const TITULAR = "a".repeat(64);

function pedir(consulta: string, headers: Record<string, string> = { authorization: `Bearer ${TOKEN}` }) {
  return GET(new Request(`https://site.exemplo/api/admin/exportar${consulta}`, { headers: { "x-forwarded-for": "203.0.113.7", ...headers } }));
}

let rede: ReturnType<typeof simularServicos>;
const leituras = () => rede.chamadas.filter((c) => c.metodo === "GET" && c.url.pathname.startsWith("/rest/v1/"));

beforeEach(() => {
  rede = simularServicos();
  vi.spyOn(console, "error").mockImplementation(() => {});
  const cifra = criarCifra(env);
  rede.usuario = { id: ADMIN, app_metadata: { papel: "admin" } };
  rede.tabelas.cadastros = [
    {
      id: "11111111-1111-4111-8111-111111111111",
      criado_em: "2026-11-15T12:00:00+00:00",
      nome: '=HYPERLINK("https://atacante.example";"clique")',
      email_cifrado: cifra.cifrar(EMAIL),
      whatsapp_cifrado: cifra.cifrar(WHATSAPP),
      email_hash: TITULAR,
      empresa: 'Souza, "Filhos" Ltda',
      cargo: null,
      variacao: "a",
      utm: { source: "meta", campaign: "+cmd|' /C calc'!A0" },
      afiliado: " @parceiro",
    },
  ];
  rede.tabelas.consentimentos = [
    { registro_id: "11111111-1111-4111-8111-111111111111", titular_hash: TITULAR, canal: "email", concedido: false },
    { registro_id: "11111111-1111-4111-8111-111111111111", titular_hash: TITULAR, canal: "whatsapp", concedido: true },
    { registro_id: "11111111-1111-4111-8111-111111111111", titular_hash: TITULAR, canal: "email", concedido: true },
  ];
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

test("admin recebe o CSV com contato decifrado, último consentimento e fórmulas neutralizadas", async () => {
  const res = await pedir("?tipo=cadastros");
  expect(res.status).toBe(200);
  expect(res.headers.get("content-type")).toBe("text/csv; charset=utf-8");
  expect(res.headers.get("content-disposition")).toMatch(/^attachment; filename="cadastros-\d{4}-\d{2}-\d{2}\.csv"$/);
  expect(res.headers.get("cache-control")).toBe("no-store");

  // res.text() tiraria o BOM; aqui ele é conferido.
  const bruto = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await res.arrayBuffer());
  expect(bruto.startsWith("﻿")).toBe(true);
  const [cabecalho, linha, sobra] = bruto.slice(1).split("\r\n");
  expect(sobra).toBe("");
  expect(cabecalho).toBe(
    '"id","criado_em","email","whatsapp","consentimento_whatsapp","consentimento_email","nome","empresa","cargo","variacao","afiliado","utm_source","utm_medium","utm_campaign","utm_term","utm_content"',
  );
  expect(linha).toBe(
    [
      '"11111111-1111-4111-8111-111111111111"',
      '"2026-11-15T12:00:00+00:00"',
      `"${EMAIL}"`,
      `"${WHATSAPP}"`,
      '"sim"',
      '"sim"',
      `"'=HYPERLINK(""https://atacante.example"";""clique"")"`,
      '"Souza, ""Filhos"" Ltda"',
      '""',
      '"a"',
      `"' @parceiro"`,
      '"meta"',
      '""',
      `"'+cmd|' /C calc'!A0"`,
      '""',
      '""',
    ].join(","),
  );

  // O token do admin vai ao Supabase Auth; a leitura das tabelas usa a service role.
  expect(rede.para("/auth/v1/user")[0].headers.get("authorization")).toBe(`Bearer ${TOKEN}`);
  expect(leituras()[0].headers.get("apikey")).toBe(env.SUPABASE_SERVICE_ROLE_KEY);
  // A auditoria guarda quem exportou.
  expect(JSON.parse(rede.para("/rest/v1/eventos_auditoria")[0].corpo)).toMatchObject({
    tipo: "exportacao_admin",
    formulario: "cadastro-jornada",
    usuario_id: ADMIN,
  });
});

test("aceite gravado por outro titular no mesmo registro não conta na exportação", async () => {
  const id = "11111111-1111-4111-8111-111111111111";
  const outro = "b".repeat(64);
  // O titular recusou os dois canais; depois, outra pessoa "aceitou" apontando para o registro dele.
  rede.tabelas.consentimentos = [
    { registro_id: id, titular_hash: TITULAR, canal: "whatsapp", concedido: false },
    { registro_id: id, titular_hash: TITULAR, canal: "email", concedido: false },
    { registro_id: id, titular_hash: outro, canal: "whatsapp", concedido: true },
    { registro_id: id, titular_hash: outro, canal: "email", concedido: true },
  ];
  const [, linha] = (await (await pedir("?tipo=cadastros")).text()).split("\r\n");
  expect(linha).toContain(`"${WHATSAPP}","nao","nao",`);

  // Sem nenhum aceite do próprio titular, as colunas ficam vazias (nunca "sim").
  rede.tabelas.consentimentos = rede.tabelas.consentimentos.slice(2);
  const [, semTitular] = (await (await pedir("?tipo=cadastros")).text()).split("\r\n");
  expect(semTitular).toContain(`"${WHATSAPP}","","",`);
});

test("ressonância sem registros devolve só o cabeçalho", async () => {
  const res = await pedir("?tipo=ressonancia");
  expect(res.status).toBe(200);
  const texto = await res.text();
  expect(texto.trim().split("\r\n")).toHaveLength(1);
  expect(texto).toContain('"principal_desafio"');
  expect(leituras()[0].url.pathname).toBe("/rest/v1/pedidos_ressonancia");
});

test("mais de 1000 registros: lê todas as páginas", async () => {
  const [modelo] = rede.tabelas.cadastros as Record<string, unknown>[];
  rede.tabelas.cadastros = Array.from({ length: 1001 }, (_, i) => ({ ...modelo, id: `id-${i}` }));
  const linhas = (await (await pedir("?tipo=cadastros")).text()).trim().split("\r\n");
  expect(linhas).toHaveLength(1002);
  expect(linhas.at(-1)).toContain('"id-1000"');
});

test("token ausente, malformado, inválido ou de quem não é admin: 401 igual e nenhuma leitura", async () => {
  const semAdmin: NonNullable<typeof rede.usuario>[] = [{ app_metadata: {} }, { app_metadata: { papel: "editor" } }, { app_metadata: { papel: "admin " } }];
  const tentativas: (() => Promise<Response>)[] = [
    () => pedir("?tipo=cadastros", {}),
    () => pedir("?tipo=cadastros", { authorization: TOKEN }),
    () => pedir("?tipo=cadastros", { authorization: "Bearer nao-e-jwt" }),
    () => pedir("?tipo=cadastros", { authorization: `Bearer ${TOKEN} extra` }),
    () => pedir("?tipo=cadastros", { authorization: `Basic ${TOKEN}` }),
    () => ((rede.usuario = null), pedir("?tipo=cadastros")),
    ...semAdmin.map((usuario) => () => ((rede.usuario = usuario), pedir("?tipo=cadastros"))),
  ];
  for (const tentar of tentativas) {
    const res = await tentar();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ ok: false, erro: "nao-autorizado" });
  }
  // Só os que têm formato de JWT chegam ao Supabase Auth.
  expect(rede.para("/auth/v1/user")).toHaveLength(4);
  expect(leituras()).toHaveLength(0);
});

test("token gigante é recusado sem consultar o Supabase Auth", async () => {
  const res = await pedir("?tipo=cadastros", { authorization: `Bearer ${"a".repeat(5000)}.b.c` });
  expect(res.status).toBe(401);
  expect(rede.para("/auth/v1/user")).toHaveLength(0);
});

test("tipo ausente ou desconhecido: 400 sem ler tabela", async () => {
  for (const consulta of ["", "?tipo=", "?tipo=usuarios", "?tipo=cadastros;drop", "?tipo=../auth/users"]) {
    const res = await pedir(consulta);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, erro: "validacao" });
  }
  expect(leituras()).toHaveLength(0);
});

test("excesso de requisições: a 11ª tentativa do mesmo IP é barrada antes de conferir o token", async () => {
  rede.usuario = null; // o Supabase Auth simulado recusa qualquer token
  for (let i = 0; i < 10; i++) expect((await pedir("?tipo=cadastros", { authorization: "Bearer a.b.c" })).status).toBe(401);
  rede.usuario = { app_metadata: { papel: "admin" } };
  const res = await pedir("?tipo=cadastros"); // nem o admin de verdade passa com a cota do IP esgotada
  expect(res.status).toBe(429);
  expect(await res.json()).toEqual({ ok: false, erro: "limite" });
  expect(rede.para("/auth/v1/user")).toHaveLength(10);
});

test("sem Supabase configurado, ou com o banco fora do ar: 503 sem detalhe", async () => {
  rede.fora.add("supabase");
  const fora = await pedir("?tipo=cadastros");
  expect(fora.status).toBe(503);
  expect(await fora.text()).toBe('{"ok":false,"erro":"indisponivel"}');

  vi.stubEnv("SUPABASE_URL", "");
  expect((await pedir("?tipo=cadastros")).status).toBe(503);
});

test("celulaCsv neutraliza todos os gatilhos de fórmula e mantém texto comum", () => {
  for (const perigoso of ["=1+1", "+1", "-1", "@SUM(A1)", "\t=1", "\r=1", "  =1", "\tx"]) {
    expect(celulaCsv(perigoso)).toBe(`"'${perigoso}"`);
  }
  expect(celulaCsv("Ana Souza")).toBe('"Ana Souza"');
  expect(celulaCsv("5514999998888")).toBe('"5514999998888"');
  expect(celulaCsv('a "b"\nc')).toBe('"a ""b""\nc"');
});
