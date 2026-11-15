import { describe, expect, it } from "vitest";
import { montarChamadas } from "./Rastreamento";

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
