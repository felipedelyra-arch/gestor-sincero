import type { APIRequestContext } from "@playwright/test";
import { createHmac } from "node:crypto";

export const ROTA = "/api/papo-reto";
export const ORIGEM = "http://localhost:3000";
/** Segredo de desenvolvimento do Papo reto (src/server/aplicacao/composicao.ts). Só vale fora de produção. */
export const SEGREDO_DEV = "segredo-de-desenvolvimento-do-papo-reto-nao-usar-em-producao";

export type Resposta = { opcao: string | null; numero: number | null; livre: string | null };
export const R = (opcao: string): Resposta => ({ opcao, numero: null, livre: null });
export const N = (numero: number): Resposta => ({ opcao: null, numero, livre: null });
export const L = (livre: string): Resposta => ({ opcao: null, numero: null, livre });

export type Turno = { ok: boolean; erro?: string; fala?: string; avatar?: string; regra?: string | null; pergunta?: number | null; final?: { pontos: string[]; recomendacao: string } | null; encerrada?: boolean; estado?: string };
export type Resultado = { status: number; corpo: Turno };

// IP por execução: o limite de 3 conversas por IP por dia é de memória do servidor de dev, e não pode travar a suíte.
const base = `10.${Math.floor(Math.random() * 200) + 1}.${Math.floor(Math.random() * 200) + 1}`;
let proximo = 1;
export const novoIp = () => `${base}.${proximo++}`;

export function cabecalhos(ip: string, origem = ORIGEM): Record<string, string> {
  return { Origin: origem, "X-Forwarded-For": ip, "Content-Type": "application/json" };
}

export async function enviar(request: APIRequestContext, corpo: unknown, ip: string, origem?: string): Promise<Resultado> {
  const r = await request.post(ROTA, { headers: cabecalhos(ip, origem), data: corpo as object });
  return { status: r.status(), corpo: (await r.json().catch(() => ({ ok: false }))) as Turno };
}

/** Abre a conversa (primeiro turno). Com token de teste: o verificador de desenvolvimento aceita qualquer token. */
export async function abrir(request: APIRequestContext, ip: string, consentimento = false): Promise<Resultado> {
  return enviar(request, { estado: null, turnstileToken: "token-de-teste-qa", consentimento, resposta: null }, ip);
}

/** Responde em sequência a partir do estado devolvido; para ao primeiro erro. */
export async function responder(request: APIRequestContext, ip: string, estado: string, respostas: Resposta[]): Promise<Resultado[]> {
  const saida: Resultado[] = [];
  let atual = estado;
  for (const resposta of respostas) {
    const r = await enviar(request, { estado: atual, turnstileToken: null, consentimento: false, resposta }, ip);
    saida.push(r);
    if (!r.corpo.ok || !r.corpo.estado) break;
    atual = r.corpo.estado;
  }
  return saida;
}

/** Assina de novo um estado com o segredo de desenvolvimento (para simular estado vencido ou alterado). */
export function assinar(estado: object, segredo = SEGREDO_DEV): string {
  const carga = Buffer.from(JSON.stringify(estado)).toString("base64url");
  return `${carga}.${createHmac("sha256", segredo).update(carga).digest("base64url")}`;
}

export function decodificar(token: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString("utf8"));
}

/** Oito respostas da conversa, pergunta 1 a 8, a partir de um mapa parcial sobre a base. */
export const BASE: Record<number, Resposta> = {
  1: N(10),
  2: R("um-pouco-de-cada"),
  3: R("paradas"),
  4: R("equipe"),
  5: N(500),
  6: R("sem-jovens"),
  7: R("planejada"),
  8: R("vender-mais"),
};
export const conversa = (mudar: Partial<Record<number, Resposta>> = {}): Resposta[] => [1, 2, 3, 4, 5, 6, 7, 8].map((n) => mudar[n] ?? BASE[n]);
