import { expect, test } from "vitest";
import { pagina } from "@content";
import { site } from "@config/site";
import { cadastroJornadaSchema, whatsappSchema } from "@/shared/contratos";

test("conteúdo e config passam nos schemas", () => {
  expect(pagina.virada.comparativo.pares).toHaveLength(17);
  expect(pagina.depoimentos.itens).toEqual([]);
  expect(site.mentoria.checkoutUrl).toBeNull();
});

test("whatsapp é normalizado para dígitos com DDI", () => {
  expect(whatsappSchema.parse("(14) 99999-8888")).toBe("5514999998888");
  expect(whatsappSchema.parse("+55 14 99999-8888")).toBe("5514999998888");
  expect(whatsappSchema.safeParse("123").success).toBe(false);
});

test("cadastro exige ciência do aviso de privacidade", () => {
  const base = { nome: "Ana", whatsapp: "14999998888", email: "A@B.com", consentimentoWhatsapp: false, consentimentoEmail: false, variacao: "a", turnstileToken: "x" };
  expect(cadastroJornadaSchema.safeParse({ ...base, cienciaPrivacidade: false }).success).toBe(false);
  expect(cadastroJornadaSchema.parse({ ...base, cienciaPrivacidade: true }).email).toBe("a@b.com");
});
