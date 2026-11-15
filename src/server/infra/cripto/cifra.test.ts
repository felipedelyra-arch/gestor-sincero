import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { criarCifra } from "./cifra";

const k1 = randomBytes(32).toString("base64");
const k2 = randomBytes(32).toString("base64");
const pimenta = "pimenta-de-teste-com-mais-de-32-caracteres";
const env = { CRIPTO_CHAVES: `k1:${k1}`, CRIPTO_CHAVE_ATUAL: "k1", HASH_PIMENTA: pimenta };

// Troca um caractere base64 de uma das partes "id:iv:tag:dados".
function adulterar(cifrado: string, parte: number): string {
  const partes = cifrado.split(":");
  const alvo = partes[parte];
  partes[parte] = (alvo[0] === "A" ? "B" : "A") + alvo.slice(1);
  return partes.join(":");
}

describe("criarCifra", () => {
  it("cifra e decifra (ida e volta), inclusive acentos", () => {
    const cifra = criarCifra(env);
    const cifrado = cifra.cifrar("joão.conceição@exemplo.com.br");
    expect(cifrado).toMatch(/^k1:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$/);
    expect(cifrado).not.toContain("exemplo");
    expect(cifra.decifrar(cifrado)).toBe("joão.conceição@exemplo.com.br");
  });

  it("usa IV de 12 bytes diferente a cada chamada", () => {
    const cifra = criarCifra(env);
    const a = cifra.cifrar("5511999990000");
    const b = cifra.cifrar("5511999990000");
    expect(a).not.toBe(b);
    expect(a.split(":")[1]).not.toBe(b.split(":")[1]);
    expect(Buffer.from(a.split(":")[1], "base64")).toHaveLength(12);
  });

  it("rejeita dados, tag, IV e id de chave adulterados", () => {
    const cifra = criarCifra(env);
    const cifrado = cifra.cifrar("a@b.co");
    expect(() => cifra.decifrar(adulterar(cifrado, 3))).toThrow("Não foi possível decifrar");
    expect(() => cifra.decifrar(adulterar(cifrado, 2))).toThrow("Não foi possível decifrar");
    expect(() => cifra.decifrar(adulterar(cifrado, 1))).toThrow("Não foi possível decifrar");
    expect(() => cifra.decifrar(cifrado.replace(/^k1/, "k9"))).toThrow("Não foi possível decifrar");
  });

  it("rejeita tag truncada e formato inválido", () => {
    const cifra = criarCifra(env);
    const [id, iv, tag, dados] = cifra.cifrar("a@b.co").split(":");
    const tagCurta = Buffer.from(tag, "base64").subarray(0, 4).toString("base64");
    expect(() => cifra.decifrar([id, iv, tagCurta, dados].join(":"))).toThrow();
    expect(() => cifra.decifrar("texto-puro")).toThrow();
    expect(() => cifra.decifrar("")).toThrow();
  });

  it("rotação: troca a chave atual para k2 e ainda decifra o que k1 cifrou", () => {
    const antigo = criarCifra(env).cifrar("a@b.co");
    const rotacionada = criarCifra({ ...env, CRIPTO_CHAVES: `k1:${k1},k2:${k2}`, CRIPTO_CHAVE_ATUAL: "k2" });
    expect(rotacionada.decifrar(antigo)).toBe("a@b.co");
    const novo = rotacionada.cifrar("a@b.co");
    expect(novo.startsWith("k2:")).toBe(true);
    expect(rotacionada.decifrar(novo)).toBe("a@b.co");
    // Chave aposentada (fora da lista) deixa de decifrar.
    const soK2 = criarCifra({ ...env, CRIPTO_CHAVES: `k2:${k2}`, CRIPTO_CHAVE_ATUAL: "k2" });
    expect(() => soK2.decifrar(antigo)).toThrow();
  });

  it("rejeita configuração inválida sem imprimir o valor", () => {
    const curta = randomBytes(16).toString("base64");
    const erro = (e: Parameters<typeof criarCifra>[0]) => {
      try {
        criarCifra(e);
      } catch (falha) {
        return (falha as Error).message;
      }
      throw new Error("deveria ter rejeitado");
    };

    expect(erro({ ...env, CRIPTO_CHAVES: `k1:${curta}` })).toContain("32 bytes");
    expect(erro({ ...env, CRIPTO_CHAVES: `k1:${curta}` })).not.toContain(curta);
    expect(erro({ ...env, CRIPTO_CHAVES: `k1:${k1.slice(0, -2)}!!` })).not.toContain(k1.slice(0, 10));
    expect(erro({ ...env, CRIPTO_CHAVES: k1 })).toContain("CRIPTO_CHAVES");
    expect(erro({ ...env, CRIPTO_CHAVES: `k1:${k1},k1:${k2}` })).toContain("repetido");
    expect(erro({ ...env, CRIPTO_CHAVE_ATUAL: "k2" })).toContain("CRIPTO_CHAVE_ATUAL");
    expect(erro({ ...env, CRIPTO_CHAVES: undefined })).toContain("CRIPTO_CHAVES");
    expect(erro({ ...env, HASH_PIMENTA: undefined })).toContain("HASH_PIMENTA");
    expect(erro({ ...env, HASH_PIMENTA: "curta" })).toContain("HASH_PIMENTA");
    expect(erro({})).toMatch(/CRIPTO_CHAVES.*CRIPTO_CHAVE_ATUAL.*HASH_PIMENTA/);
  });

  it("hashBusca é estável, em hex, e muda com outra pimenta", () => {
    const cifra = criarCifra(env);
    const hash = cifra.hashBusca("a@b.co");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(cifra.hashBusca("a@b.co")).toBe(hash);
    expect(criarCifra(env).hashBusca("a@b.co")).toBe(hash);
    expect(cifra.hashBusca("a@b.com")).not.toBe(hash);
    const outra = criarCifra({ ...env, HASH_PIMENTA: "outra-pimenta-de-teste-com-32-caracteres!" });
    expect(outra.hashBusca("a@b.co")).not.toBe(hash);
  });
});
