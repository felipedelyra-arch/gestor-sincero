import { expect, test } from "@playwright/test";
import { L, N, R, ROTA, ORIGEM, SEGREDO_DEV, abrir, assinar, cabecalhos, conversa, decodificar, enviar, novoIp, responder } from "./apoio";

// Limites e abuso contra a rota de dev. Estado forjado usa o segredo de desenvolvimento (composicao.ts), nunca o de produção.

test("20 mensagens cabem; a 21ª responde limite (429)", async ({ request }) => {
  const ip = novoIp();
  const abre = await abrir(request, ip);
  let estado = abre.corpo.estado!;
  for (let i = 1; i <= 20; i++) {
    const r = await enviar(request, { estado, turnstileToken: null, consentimento: false, resposta: L(`mensagem ${i}`) }, ip);
    expect(r.status, `mensagem ${i}`).toBe(200);
    estado = r.corpo.estado!;
  }
  const extra = await enviar(request, { estado, turnstileToken: null, consentimento: false, resposta: L("mais uma") }, ip);
  expect(extra.status).toBe(429);
  expect(extra.corpo.erro).toBe("limite");
});

test("estado com um caractere trocado é recusado sem gastar cota", async ({ request }) => {
  const ip = novoIp();
  const { corpo } = await abrir(request, ip);
  const [carga, assinatura] = corpo.estado!.split(".");
  const trocado = `${carga.slice(0, 5)}${carga[5] === "A" ? "B" : "A"}${carga.slice(6)}.${assinatura}`;
  const r = await enviar(request, { estado: trocado, turnstileToken: null, consentimento: false, resposta: R("um-pouco-de-cada") }, ip);
  expect(r.status).toBe(400);
  expect(r.corpo.erro).toBe("validacao");
});

test("estado assinado com outra chave é recusado", async ({ request }) => {
  const ip = novoIp();
  const { corpo } = await abrir(request, ip);
  const outra = assinar(decodificar(corpo.estado!), "chave-de-outro-ambiente-que-nao-e-esta");
  const r = await enviar(request, { estado: outra, turnstileToken: null, consentimento: false, resposta: R("um-pouco-de-cada") }, ip);
  expect(r.status).toBe(400);
});

test("estado de outra conversa, válido e assinado, é aceito (sem vínculo com a sessão, por desenho do ADR 0003)", async ({ request }) => {
  const ipA = novoIp();
  const ipB = novoIp();
  const a = await abrir(request, ipA);
  const b = await abrir(request, ipB);
  const r = await enviar(request, { estado: b.corpo.estado!, turnstileToken: null, consentimento: false, resposta: N(10) }, ipA);
  // Anotação, não defeito: o servidor não guarda a conversa. A proteção é o limite por IP (60 turnos por dia).
  expect(r.status).toBe(200);
  expect(a.status).toBe(200);
  test.info().annotations.push({ type: "observacao", description: "estado de outra conversa aceito: sem vínculo com IP ou sessão (ADR 0003, decisão 3)" });
});

test("estado vencido (mais de 2 horas) é recusado", async ({ request }) => {
  const ip = novoIp();
  const { corpo } = await abrir(request, ip);
  const velho = assinar({ ...decodificar(corpo.estado!), t: Date.now() - 3 * 60 * 60 * 1000 }, SEGREDO_DEV);
  const r = await enviar(request, { estado: velho, turnstileToken: null, consentimento: false, resposta: R("numeros") }, ip);
  expect(r.status).toBe(400);
  expect(r.corpo.erro).toBe("validacao");
});

test("conversa encerrada não aceita mais respostas", async ({ request }) => {
  const ip = novoIp();
  const abre = await abrir(request, ip);
  const turnos = await responder(request, ip, abre.corpo.estado!, conversa());
  expect(turnos.at(-1)!.corpo.encerrada).toBe(true);
  const r = await enviar(request, { estado: turnos.at(-1)!.corpo.estado!, turnstileToken: null, consentimento: false, resposta: R("numeros") }, ip);
  expect(r.status).toBe(400);
});

test("opção inexistente, opção de outra pergunta e número fora do limite são recusados", async ({ request }) => {
  const ip = novoIp();
  const abre = await abrir(request, ip);
  const q1 = abre.corpo.estado!; // pergunta 1 (numérica)
  const q2 = (await enviar(request, { estado: q1, turnstileToken: null, consentimento: false, resposta: N(10) }, ip)).corpo.estado!; // pergunta 2 (opções)
  const contra = [
    { nome: "opção inexistente (P2)", estado: q2, resposta: R("nao-existe") },
    { nome: "opção de outra pergunta (P2 com 'cairam', que é da P3)", estado: q2, resposta: R("cairam") },
    { nome: "número na P2, que não tem campo numérico", estado: q2, resposta: N(3) },
    { nome: "anos abaixo do mínimo (P1 min 1)", estado: q1, resposta: N(0) },
    { nome: "anos acima do máximo (P1 max 200)", estado: q1, resposta: N(201) },
    { nome: "número negativo (P1)", estado: q1, resposta: N(-1) },
    { nome: "resposta vazia", estado: q2, resposta: { opcao: null, numero: null, livre: null } },
    { nome: "opção e número juntos", estado: q2, resposta: { opcao: "numeros", numero: 3, livre: null } },
  ];
  for (const c of contra) {
    const r = await enviar(request, { estado: c.estado, turnstileToken: null, consentimento: false, resposta: c.resposta }, ip);
    expect(r.status, c.nome).toBe(400);
    expect(r.corpo.erro, c.nome).toBe("validacao");
  }
  // O limite exato da P1 (200) passa.
  const exato = await enviar(request, { estado: q1, turnstileToken: null, consentimento: false, resposta: N(200) }, ip);
  expect(exato.status).toBe(200);
});

test("custo acima do máximo (P5, R$ 1.000.000) é recusado", async ({ request }) => {
  const ip = novoIp();
  const abre = await abrir(request, ip);
  const turnos = await responder(request, ip, abre.corpo.estado!, [N(10), R("numeros"), R("paradas"), R("equipe")]);
  const estado = turnos.at(-1)!.corpo.estado!;
  const acima = await enviar(request, { estado, turnstileToken: null, consentimento: false, resposta: N(1_000_001) }, ip);
  expect(acima.status).toBe(400);
  const limite = await enviar(request, { estado, turnstileToken: null, consentimento: false, resposta: N(1_000_000) }, ip);
  expect(limite.status).toBe(200);
});

test("corpo acima de 16 KB é recusado com 413", async ({ request }) => {
  const r = await request.post(ROTA, { headers: cabecalhos(novoIp()), data: JSON.stringify({ estado: "x".repeat(17_000), turnstileToken: "t", consentimento: false, resposta: null }) });
  expect(r.status()).toBe(413);
});

test("primeiro turno sem Turnstile é recusado (antirrobo)", async ({ request }) => {
  const ip = novoIp();
  const sem = await enviar(request, { estado: null, turnstileToken: null, consentimento: false, resposta: null }, ip);
  expect(sem.status).toBe(400);
  expect(sem.corpo.erro).toBe("antirrobo");
  const vazio = await enviar(request, { estado: null, turnstileToken: "", consentimento: false, resposta: null }, ip);
  expect(vazio.status).toBe(400);
  expect(vazio.corpo.erro).toBe("validacao");
});

test("mais de 3 conversas do mesmo IP no dia: a quarta recebe limite (429)", async ({ request }) => {
  const ip = novoIp();
  for (let i = 1; i <= 3; i++) expect((await abrir(request, ip)).status, `conversa ${i}`).toBe(200);
  const quarta = await abrir(request, ip);
  expect(quarta.status).toBe(429);
  expect(quarta.corpo.erro).toBe("limite");
});

test("Origin de outro site, ou sem Origin, é recusado (403)", async ({ request }) => {
  const corpo = { estado: null, turnstileToken: "t", consentimento: false, resposta: null };
  const outro = await enviar(request, corpo, novoIp(), "https://site-de-fora.example");
  expect(outro.status).toBe(403);
  const r = await request.post(ROTA, { headers: { "Content-Type": "application/json" }, data: corpo });
  expect(r.status()).toBe(403);
});

test("content-type diferente de JSON é recusado (400)", async ({ request }) => {
  const r = await request.post(ROTA, { headers: { Origin: ORIGEM, "Content-Type": "text/plain" }, data: "{}" });
  expect(r.status()).toBe(400);
});

test("JSON malformado e método GET", async ({ request }) => {
  const mal = await request.post(ROTA, { headers: cabecalhos(novoIp()), data: "{nao-e-json" });
  expect(mal.status()).toBe(400);
  const get = await request.get(ROTA);
  expect([404, 405]).toContain(get.status());
});
