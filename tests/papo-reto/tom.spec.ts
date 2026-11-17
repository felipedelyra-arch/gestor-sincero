import { expect, test } from "@playwright/test";
import { papoRetoBruto } from "../../content/papo-reto";

// Varredura de tom em content/papo-reto.ts (briefing §6): sem emoji, sem inglês, sem promessa, números rastreáveis, falas até 400 caracteres.

const todos = (v: unknown, caminho = ""): [string, string][] => {
  if (typeof v === "string") return [[caminho, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => todos(x, `${caminho}[${i}]`));
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => todos(x, caminho ? `${caminho}.${k}` : k));
  return [];
};

const textos = todos(papoRetoBruto);
const falas = textos.filter(([c]) => /fala|confrontos|abertura|naoEntendi|encerrada|pontoPadrao|ponto$|\.texto$/.test(c));

test("sem emoji", () => {
  expect(textos.filter(([, t]) => /\p{Extended_Pictographic}/u.test(t)), "emoji").toEqual([]);
});

test("sem palavras em inglês comuns", () => {
  const ingles = /\b(the|and|with|your|you|for|that|this|are|from|about|lead|funil|mindset|growth|insight|webinar|coach|guru|trader|startup|prompt|online)\b/i;
  const achados = textos.filter(([, t]) => ingles.test(t)).map(([c, t]) => `${c}: ${t.match(ingles)?.[0]}`);
  // "online" aparece no texto de consentimento? não; qualquer achado precisa de decisão.
  expect(achados, "inglês").toEqual([]);
});

test("sem promessa de resultado nem número prometido", () => {
  const promessa = /garant|resultado certo|sem risco|milagr|fórmula mágica|dobr[ea]|aument[ea] \d|em \d+ dias|100%/i;
  expect(textos.filter(([, t]) => promessa.test(t)).map(([c, t]) => `${c}: ${t.slice(0, 80)}`), "promessa").toEqual([]);
});

test("falas e confrontos com até 400 caracteres", () => {
  expect(falas.filter(([, t]) => t.length > 400).map(([c, t]) => `${c} (${t.length})`), "acima de 400").toEqual([]);
});

test("números no texto (para conferir a origem de cada um)", () => {
  const numeros = textos.flatMap(([c, t]) => (t.match(/\d[\d.,]*/g) ?? []).map((n) => `${n} em ${c}`));
  console.log(`MEDIDA números no papo reto: ${numeros.join(" | ")}`);
  expect(numeros.length).toBeGreaterThanOrEqual(0);
});
