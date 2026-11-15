import { describe, expect, it } from "vitest";
import { CHAVE_ORIGEM, capturarOrigem, extrairOrigem, montarLinkCheckout } from "./origem";

function memoria() {
  const dados = new Map<string, string>();
  return {
    getItem: (k: string) => dados.get(k) ?? null,
    setItem: (k: string, v: string) => void dados.set(k, v),
  };
}

describe("extrairOrigem", () => {
  it("lê UTM, afiliado e variação", () => {
    expect(extrairOrigem("?utm_source=meta&utm_medium=cpc&utm_campaign=jornada-1&ref=joao.silva&v=b")).toEqual({
      utm: { source: "meta", medium: "cpc", campaign: "jornada-1" },
      afiliado: "joao.silva",
      variacao: "b",
    });
  });

  it("afiliado tem prioridade sobre ref e aff; variação padrão é a", () => {
    expect(extrairOrigem("?aff=c&ref=b&afiliado=a&v=x")).toEqual({ utm: {}, afiliado: "a", variacao: "a" });
  });

  it("descarta valor com caractere proibido ou longo demais", () => {
    const o = extrairOrigem(`?utm_source=<script>&utm_term=${"x".repeat(121)}&afiliado=a%26b&utm_medium=ok`);
    expect(o).toEqual({ utm: { medium: "ok" }, variacao: "a" });
  });
});

describe("capturarOrigem", () => {
  it("grava na primeira visita e não sobrescreve depois", () => {
    const s = memoria();
    capturarOrigem("?utm_source=meta&v=b", s);
    const segunda = capturarOrigem("?utm_source=google&afiliado=x", s);
    expect(segunda).toEqual({ utm: { source: "meta" }, variacao: "b" });
    expect(JSON.parse(s.getItem(CHAVE_ORIGEM) ?? "")).toEqual(segunda);
  });

  it("ignora conteúdo gravado fora do formato", () => {
    const s = memoria();
    s.setItem(CHAVE_ORIGEM, '{"utm":{"source":"<x>"}}');
    expect(capturarOrigem("?utm_source=meta", s).utm.source).toBe("meta");
  });
});

describe("montarLinkCheckout", () => {
  const origem = { utm: { source: "meta", campaign: "jornada 1" }, afiliado: "joao", variacao: "a" as const };

  it("acrescenta UTM e afiliado preservando os parâmetros do link", () => {
    const url = new URL(montarLinkCheckout("https://pay.exemplo.com/p?off=abc", origem));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      off: "abc",
      utm_source: "meta",
      utm_campaign: "jornada 1",
      afiliado: "joao",
    });
  });

  it("não duplica parâmetro que o link já tem", () => {
    const url = new URL(montarLinkCheckout("https://pay.exemplo.com/p?utm_source=antigo", origem));
    expect(url.searchParams.getAll("utm_source")).toEqual(["meta"]);
  });

  it("sem origem devolve o link como veio", () => {
    expect(montarLinkCheckout("https://pay.exemplo.com/p", null)).toBe("https://pay.exemplo.com/p");
  });
});
