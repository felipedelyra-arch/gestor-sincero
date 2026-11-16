import { describe, expect, it, vi } from "vitest";
import { montarChamadas, revogarRastreamento } from "./Rastreamento";

describe("montarChamadas", () => {
  it("cadastro com idEvento vira Lead com eventID na Meta e generate_lead no GA4", () => {
    expect(montarChamadas("cadastro", { formulario: "jornada", idEvento: "abc-123" })).toEqual({
      meta: ["track", "Lead", { formulario: "jornada" }, { eventID: "abc-123" }],
      ga4: ["event", "generate_lead", { formulario: "jornada" }],
    });
  });

  it("sem idEvento não manda o quarto argumento", () => {
    expect(montarChamadas("clique_checkout").meta).toEqual(["track", "InitiateCheckout", {}]);
  });

  it("evento sem equivalente na Meta vai como personalizado e descarta valores aninhados", () => {
    const { meta } = montarChamadas("inicio_formulario", { formulario: "jornada", contato: { email: "a@b.c" } });
    expect(meta).toEqual(["trackCustom", "inicio_formulario", { formulario: "jornada" }]);
  });
});

describe("revogarRastreamento", () => {
  function documentoFalso(inicial: string) {
    const gravados: string[] = [];
    return {
      gravados,
      get cookie() {
        return inicial;
      },
      set cookie(valor: string) {
        gravados.push(valor);
      },
    };
  }

  it("com scripts carregados: revoga na Meta e no Google, apaga só os cookies de rastreio e recarrega", () => {
    const fbq = vi.fn();
    const gtag = vi.fn();
    const reload = vi.fn();
    const doc = documentoFalso("gs_outro=1; _fbp=fb.1.2; _ga=GA1.1; _ga_ABC123=GS1; _gato=miau");

    expect(revogarRastreamento({ fbq, gtag, location: { hostname: "www.exemplo.com.br", reload } }, doc)).toBe(true);

    expect(fbq).toHaveBeenCalledWith("consent", "revoke");
    expect(gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "denied", ad_storage: "denied" });
    const apagados = new Set(doc.gravados.map((c) => c.split("=")[0]));
    expect([...apagados]).toEqual(["_fbp", "_ga", "_ga_ABC123"]);
    expect(doc.gravados.every((c) => c.includes("Max-Age=0") && c.includes("path=/"))).toBe(true);
    // sem domínio e no domínio de cima, onde o GA grava
    expect(doc.gravados).toContain("_ga=; Max-Age=0; path=/");
    expect(doc.gravados).toContain("_ga=; Max-Age=0; path=/; domain=.exemplo.com.br");
    expect(reload).toHaveBeenCalledOnce();
  });

  it("sem nada carregado: não mexe em cookie e não recarrega", () => {
    const reload = vi.fn();
    const doc = documentoFalso("_ga=GA1.1");
    expect(revogarRastreamento({ location: { hostname: "exemplo.com.br", reload } }, doc)).toBe(false);
    expect(doc.gravados).toEqual([]);
    expect(reload).not.toHaveBeenCalled();
  });
});
