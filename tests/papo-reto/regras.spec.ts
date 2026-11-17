import { expect, test, type APIRequestContext } from "@playwright/test";
import { R, N, abrir, conversa, novoIp, responder, type Resposta, type Turno } from "./apoio";

// Regras de contradição (ADR 0003, docs/persona-ferrer.md) contra a rota, por requisição.
// Para cada regra: uma sequência que dispara e uma parecida que não dispara ("alarme falso" se disparar).

type Conversa = { turnos: Turno[]; statuses: number[] };

async function rodar(request: APIRequestContext, respostas: Resposta[]): Promise<Conversa> {
  const ip = novoIp();
  const primeiro = await abrir(request, ip);
  expect(primeiro.status, "primeiro turno").toBe(200);
  const resto = await responder(request, ip, primeiro.corpo.estado!, respostas);
  return { turnos: [primeiro.corpo, ...resto.map((r) => r.corpo)], statuses: [primeiro.status, ...resto.map((r) => r.status)] };
}

const regrasDisparadas = (c: Conversa) => c.turnos.map((t) => t.regra).filter((r): r is string => !!r);

/** Confronto: "Sobre ..." com {antes} e {agora} preenchidos e as duas respostas entre aspas. */
function confrontoCompleto(fala: string): boolean {
  return fala.startsWith("Sobre ") && !/[{}]/.test(fala) && (fala.match(/"/g) ?? []).length === 4;
}

const CASOS = [
  { id: "numeros-sem-custo", dispara: { 2: R("numeros"), 5: R("nao-sei") }, parecida: { 2: R("numeros"), 5: N(500) } },
  { id: "vendas-boas-problema-vender", dispara: { 3: R("cresceram") }, parecida: { 3: R("cresceram"), 8: R("depender-de-terceiros") } },
  { id: "digital-terceirizado-quer-digital", dispara: { 4: R("agencia"), 8: R("digital") }, parecida: { 4: R("equipe"), 8: R("digital") } },
  { id: "equipe-segue-mas-problema-equipe", dispara: { 6: R("segue"), 8: R("equipe") }, parecida: { 6: R("sem-jovens"), 8: R("equipe") } },
  { id: "sucessao-planejada-sem-numeros", dispara: { 3: R("nao-sei"), 7: R("planejada") }, parecida: { 3: R("paradas") } },
  { id: "experiencia-mas-vendas-caindo", dispara: { 2: R("experiencia"), 3: R("cairam") }, parecida: { 2: R("experiencia"), 5: R("nao-sei") } },
  { id: "sabe-custo-mas-decide-no-feeling", dispara: { 2: R("experiencia"), 5: N(800) }, parecida: { 2: R("experiencia"), 5: R("nao-sei") } },
  { id: "sem-sucessao-prioridade-outra", dispara: { 7: R("nao-pensei") }, parecida: {} },
  { id: "cuida-digital-mas-depende-de-terceiros", dispara: { 4: R("eu-mesmo"), 8: R("depender-de-terceiros") }, parecida: { 8: R("depender-de-terceiros") } },
] as const;

const medidas: { id: string; disparou: boolean; alarme: boolean }[] = [];

for (const caso of CASOS) {
  test(`${caso.id}: dispara e não dispara na parecida`, async ({ request }) => {
    const sim = await rodar(request, conversa(caso.dispara as Partial<Record<number, Resposta>>));
    const nao = await rodar(request, conversa(caso.parecida as Partial<Record<number, Resposta>>));

    const disparou = regrasDisparadas(sim).includes(caso.id);
    const alarme = regrasDisparadas(nao).includes(caso.id);
    medidas.push({ id: caso.id, disparou, alarme });

    expect(sim.statuses.every((s) => s === 200), "todas as respostas 200").toBe(true);
    expect(nao.statuses.every((s) => s === 200), "todas as respostas 200 (parecida)").toBe(true);
    expect(disparou, "a sequência que deveria disparar").toBe(true);
    expect(alarme, "alarme falso na sequência parecida").toBe(false);

    const turno = sim.turnos.find((t) => t.regra === caso.id)!;
    expect(turno.avatar, "avatar cético no confronto").toBe("cetico");
    expect(confrontoCompleto(turno.fala!), `fala sem chaves sobrando: ${turno.fala}`).toBe(true);
  });
}

test("uma conversa completa tem 8 turnos, final com 3 pontos distintos e nada de chave sobrando", async ({ request }) => {
  for (const cenario of [CASOS[0].dispara, CASOS[4].dispara, {}] as Partial<Record<number, Resposta>>[]) {
    const c = await rodar(request, conversa(cenario));
    const ultimo = c.turnos.at(-1)!;
    expect(ultimo.encerrada).toBe(true);
    expect(ultimo.pergunta).toBeNull();
    expect(ultimo.final?.pontos.length, "três pontos").toBe(3);
    expect(new Set(ultimo.final!.pontos).size, "pontos sem repetição").toBe(3);
    for (const t of c.turnos) expect(/[{}]/.test(t.fala ?? ""), "chave sobrando").toBe(false);
  }
});

test("recomendação: ja-decidi leva à mentoria, não-sei em 3 ou 5 leva à ressonância, o resto à jornada", async ({ request }) => {
  const casos: [string, Partial<Record<number, Resposta>>][] = [
    ["mentoria", { 8: R("ja-decidi") }],
    ["mentoria", { 3: R("nao-sei"), 8: R("ja-decidi") }],
    ["ressonancia", { 3: R("nao-sei") }],
    ["ressonancia", { 5: R("nao-sei") }],
    ["jornada", {}],
    ["jornada", { 3: R("cairam"), 8: R("equipe") }],
    ["jornada", { 8: R("digital") }],
  ];
  for (const [esperada, mudar] of casos) {
    const c = await rodar(request, conversa(mudar));
    expect(c.turnos.at(-1)!.final?.recomendacao, JSON.stringify(mudar)).toBe(esperada);
  }
});

test("medição: regras disparadas e alarmes falsos", async () => {
  const disparadas = medidas.filter((m) => m.disparou).length;
  const alarmes = medidas.filter((m) => m.alarme).length;
  console.log(`MEDIDA regras disparadas: ${disparadas} de ${CASOS.length}; alarmes falsos: ${alarmes} de ${CASOS.length}`);
  test.info().annotations.push({ type: "medida", description: `disparadas ${disparadas}/${CASOS.length}; alarmes falsos ${alarmes}/${CASOS.length}` });
  expect(medidas.length).toBe(CASOS.length);
});
