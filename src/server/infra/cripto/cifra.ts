import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
import { z } from "zod";
import type { Cifra } from "../../dominio/portas";

export type EnvCifra = {
  CRIPTO_CHAVES?: string;
  CRIPTO_CHAVE_ATUAL?: string;
  HASH_PIMENTA?: string;
};

const ALGORITMO = "aes-256-gcm";
const TAMANHO_IV = 12;
const TAMANHO_TAG = 16;
const ID_CHAVE = /^[A-Za-z0-9_-]{1,32}$/; // sem ":" nem ",", que são os separadores

// As mensagens citam só o nome da variável e o id da chave, nunca o valor.
const envSchema = z.object({
  CRIPTO_CHAVES: z.string().min(1),
  CRIPTO_CHAVE_ATUAL: z.string().regex(ID_CHAVE),
  HASH_PIMENTA: z.string().min(32),
});

function carregarChaves(lista: string): Map<string, Buffer> {
  const chaves = new Map<string, Buffer>();
  for (const item of lista.split(",")) {
    const separador = item.indexOf(":");
    const id = item.slice(0, separador).trim();
    const base64 = item.slice(separador + 1).trim();
    if (separador < 1 || !ID_CHAVE.test(id)) {
      throw new Error('CRIPTO_CHAVES: item fora do formato "id:base64de32bytes"');
    }
    if (chaves.has(id)) throw new Error(`CRIPTO_CHAVES: id de chave repetido (${id})`);
    const chave = Buffer.from(base64, "base64");
    // Buffer.from ignora caracteres inválidos; reencodar pega base64 malformado.
    if (chave.length !== 32 || chave.toString("base64") !== base64) {
      throw new Error(`CRIPTO_CHAVES: a chave "${id}" precisa ser base64 de exatamente 32 bytes`);
    }
    chaves.set(id, chave);
  }
  return chaves;
}

export function criarCifra(env: EnvCifra): Cifra {
  const lido = envSchema.safeParse(env);
  if (!lido.success) {
    const variaveis = [...new Set(lido.error.issues.map((i) => String(i.path[0])))].join(", ");
    throw new Error(
      `Configuração de cifra ausente ou inválida: ${variaveis} (HASH_PIMENTA exige 32+ caracteres)`,
    );
  }
  const chaves = carregarChaves(lido.data.CRIPTO_CHAVES);
  const idAtual = lido.data.CRIPTO_CHAVE_ATUAL;
  const chaveAtual = chaves.get(idAtual);
  if (!chaveAtual) throw new Error("CRIPTO_CHAVE_ATUAL não está listada em CRIPTO_CHAVES");
  const pimenta = lido.data.HASH_PIMENTA;

  return {
    cifrar(texto) {
      const iv = randomBytes(TAMANHO_IV);
      const cifra = createCipheriv(ALGORITMO, chaveAtual, iv, { authTagLength: TAMANHO_TAG });
      cifra.setAAD(Buffer.from(idAtual)); // amarra o texto cifrado ao id da chave
      const dados = Buffer.concat([cifra.update(texto, "utf8"), cifra.final()]);
      return [idAtual, iv.toString("base64"), cifra.getAuthTag().toString("base64"), dados.toString("base64")].join(":");
    },

    decifrar(cifrado) {
      // Erro único e sem detalhe: não revela se falhou a chave, o formato ou a autenticação.
      const falha = new Error("Não foi possível decifrar o valor");
      const partes = cifrado.split(":");
      if (partes.length !== 4) throw falha;
      const [id, ivB64, tagB64, dadosB64] = partes;
      const chave = chaves.get(id);
      const iv = Buffer.from(ivB64, "base64");
      const tag = Buffer.from(tagB64, "base64");
      // Tag curta enfraquece o GCM: exigir os 16 bytes completos.
      if (!chave || iv.length !== TAMANHO_IV || tag.length !== TAMANHO_TAG) throw falha;
      try {
        const decifra = createDecipheriv(ALGORITMO, chave, iv, { authTagLength: TAMANHO_TAG });
        decifra.setAAD(Buffer.from(id));
        decifra.setAuthTag(tag);
        return Buffer.concat([decifra.update(Buffer.from(dadosB64, "base64")), decifra.final()]).toString("utf8");
      } catch {
        throw falha;
      }
    },

    // Determinístico de propósito (deduplicação). Quem chama normaliza antes (o contrato Zod já faz).
    hashBusca(texto) {
      return createHmac("sha256", pimenta).update(texto, "utf8").digest("hex");
    },
  };
}
