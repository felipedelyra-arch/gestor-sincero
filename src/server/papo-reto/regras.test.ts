import { expect, test } from "vitest";
import { papoReto } from "@content";
import { disparadas, recomendar, regras, type RespostasPorTema } from "./regras";

const r = (o: Record<string, string | number>): RespostasPorTema =>
  Object.fromEntries(Object.entries(o).map(([tema, v]) => [tema, typeof v === "number" ? { opcao: null, numero: v } : { opcao: v, numero: null }]));
const ids = (respostas: RespostasPorTema) => disparadas(respostas).map((d) => d.id);

// Cada regra: um caso que dispara (com a ordem antes/agora) e casos que não disparam.
const casos: { id: string; dispara: [Record<string, string | number>, string, string][]; nao: Record<string, string | number>[] }[] = [
  {
    id: "numeros-sem-custo",
    dispara: [
      [{ decisao: "numeros", "custo-cliente": "nao-sei" }, "decisao", "custo-cliente"],
      [{ decisao: "numeros", "custo-cliente": "tenho-ideia" }, "decisao", "custo-cliente"],
    ],
    nao: [{ decisao: "numeros", "custo-cliente": 150 }, { decisao: "um-pouco-de-cada", "custo-cliente": "nao-sei" }, { decisao: "numeros" }],
  },
  {
    id: "vendas-boas-problema-vender",
    dispara: [[{ vendas: "cresceram", prioridade: "vender-mais" }, "vendas", "prioridade"]],
    nao: [{ vendas: "paradas", prioridade: "vender-mais" }, { vendas: "cresceram", prioridade: "digital" }, { vendas: "cresceram" }],
  },
  {
    id: "digital-terceirizado-quer-digital",
    dispara: [
      [{ digital: "agencia", prioridade: "digital" }, "digital", "prioridade"],
      [{ digital: "parente", prioridade: "digital" }, "digital", "prioridade"],
    ],
    nao: [{ digital: "equipe", prioridade: "digital" }, { digital: "ninguem", prioridade: "digital" }, { digital: "agencia", prioridade: "equipe" }],
  },
  {
    id: "equipe-segue-mas-problema-equipe",
    dispara: [[{ equipe: "segue", prioridade: "equipe" }, "equipe", "prioridade"]],
    nao: [{ equipe: "segue-em-parte", prioridade: "equipe" }, { equipe: "segue", prioridade: "vender-mais" }],
  },
  {
    id: "sucessao-planejada-sem-numeros",
    dispara: [
      [{ sucessao: "planejada", vendas: "nao-sei" }, "vendas", "sucessao"],
      [{ sucessao: "planejada", "custo-cliente": "nao-sei" }, "custo-cliente", "sucessao"],
      // as duas "não sei": vale a da pergunta 5
      [{ sucessao: "planejada", vendas: "nao-sei", "custo-cliente": "nao-sei" }, "custo-cliente", "sucessao"],
    ],
    nao: [{ sucessao: "planejada", vendas: "cresceram", "custo-cliente": 150 }, { sucessao: "em-conversa", vendas: "nao-sei" }],
  },
  {
    id: "experiencia-mas-vendas-caindo",
    dispara: [[{ decisao: "experiencia", vendas: "cairam" }, "decisao", "vendas"]],
    nao: [{ decisao: "numeros", vendas: "cairam" }, { decisao: "experiencia", vendas: "paradas" }],
  },
  {
    id: "sabe-custo-mas-decide-no-feeling",
    dispara: [[{ decisao: "experiencia", "custo-cliente": 1200 }, "decisao", "custo-cliente"]],
    nao: [{ decisao: "experiencia", "custo-cliente": "nao-sei" }, { decisao: "numeros", "custo-cliente": 1200 }, { decisao: "experiencia" }],
  },
  {
    id: "sem-sucessao-prioridade-outra",
    dispara: [
      [{ sucessao: "so-eu", prioridade: "vender-mais" }, "sucessao", "prioridade"],
      [{ sucessao: "nao-pensei", prioridade: "equipe" }, "sucessao", "prioridade"],
    ],
    // sem a P8 respondida, ou com ja-decidi, ou com sucessão resolvida/em conversa, não dispara
    nao: [{ sucessao: "so-eu" }, { sucessao: "nao-pensei", prioridade: "ja-decidi" }, { sucessao: "em-conversa", prioridade: "equipe" }],
  },
  {
    id: "cuida-digital-mas-depende-de-terceiros",
    dispara: [[{ digital: "eu-mesmo", prioridade: "depender-de-terceiros" }, "digital", "prioridade"]],
    nao: [{ digital: "agencia", prioridade: "depender-de-terceiros" }, { digital: "eu-mesmo", prioridade: "digital" }],
  },
];

test("cada uma das 9 regras dispara nos casos certos, com antes e agora na ordem da tabela", () => {
  expect(casos.map((c) => c.id)).toEqual(regras.map((x) => x.id));
  expect(regras).toHaveLength(9);
  for (const { id, dispara, nao } of casos) {
    for (const [respostas, antes, agora] of dispara) {
      expect(disparadas(r(respostas)).find((d) => d.id === id), `${id} ${JSON.stringify(respostas)}`).toEqual({ id, antes, agora });
    }
    for (const respostas of nao) expect(ids(r(respostas)), `${id} não ${JSON.stringify(respostas)}`).not.toContain(id);
  }
});

test("sem respostas, nada dispara; várias regras podem disparar juntas, na ordem da tabela", () => {
  expect(disparadas({})).toEqual([]);
  expect(ids(r({ vendas: "cresceram", sucessao: "so-eu", prioridade: "vender-mais" }))).toEqual([
    "vendas-boas-problema-vender",
    "sem-sucessao-prioridade-outra",
  ]);
});

test("recomendação: ja-decidi = mentoria; não sei em vendas ou custo = ressonância; o resto = jornada", () => {
  expect(recomendar(r({ prioridade: "ja-decidi" }))).toBe("mentoria");
  expect(recomendar(r({ prioridade: "ja-decidi", vendas: "nao-sei" }))).toBe("mentoria"); // a primeira que bate vale
  expect(recomendar(r({ vendas: "nao-sei", prioridade: "equipe" }))).toBe("ressonancia");
  expect(recomendar(r({ "custo-cliente": "nao-sei", prioridade: "equipe" }))).toBe("ressonancia");
  expect(recomendar(r({ vendas: "cresceram", "custo-cliente": 150, prioridade: "equipe" }))).toBe("jornada");
  expect(recomendar({})).toBe("jornada");
});

// ---- Conteúdo real (papoReto de @content) -------------------------------------------------------------

test("todo id de regra tem fala em papoReto.confrontos, e todo confronto tem regra", () => {
  const dasRegras = regras.map((x) => x.id).sort();
  expect(Object.keys(papoReto.confrontos).sort()).toEqual(dasRegras);
  for (const id of dasRegras) {
    const fala = papoReto.confrontos[id];
    expect(fala, id).toBeTruthy();
    expect(fala).toContain("{antes}");
    expect(fala).toContain("{agora}");
  }
});

test("todo tema e id de opção usado pelas regras existe no conteúdo real", () => {
  for (const regra of regras) {
    expect(regra.usa.length, regra.id).toBeGreaterThan(0);
    for (const [tema, opcao] of regra.usa) {
      const pergunta = papoReto.perguntas.find((p) => p.tema === tema);
      expect(pergunta, `${regra.id}: tema ${tema}`).toBeDefined();
      expect(pergunta?.opcoes.map((o) => o.id), `${regra.id}: ${tema}/${opcao}`).toContain(opcao);
    }
  }
  // Regras que leem número (pergunta 5) e a recomendação dependem destes ids/campos.
  expect(papoReto.perguntas.find((p) => p.tema === "custo-cliente")?.campoNumero).toBeDefined();
  expect(papoReto.perguntas.find((p) => p.tema === "prioridade")?.opcoes.map((o) => o.id)).toContain("ja-decidi");
  expect(papoReto.perguntas.find((p) => p.tema === "vendas")?.opcoes.map((o) => o.id)).toContain("nao-sei");
});
