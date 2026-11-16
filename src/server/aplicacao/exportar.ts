import { z } from "zod";
import type { Formulario } from "../dominio/entidades";
import type { TipoExportacao } from "../dominio/portas";
import { comporAdmin } from "./composicao";
import { ipDe } from "./http";

// GET /api/admin/exportar?tipo=cadastros|ressonancia com "Authorization: Bearer <JWT do Supabase Auth>".

const LIMITE_PEDIDOS = 10;
const LIMITE_JANELA_SEGUNDOS = 10 * 60;
const JWT = /^Bearer ([\w-]+\.[\w-]+\.[\w-]+)$/;
const TOKEN_MAXIMO = 4096;

const consultaSchema = z.object({ tipo: z.enum(["cadastros", "ressonancia"]) });
const formularioDe: Record<TipoExportacao, Formulario> = { cadastros: "cadastro-jornada", ressonancia: "ressonancia" };

type Erro = "validacao" | "nao-autorizado" | "limite" | "indisponivel";
const recusar = (erro: Erro, status: number) =>
  Response.json({ ok: false, erro }, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Planilhas executam células que começam com = + - @ (ou tab/CR): o apóstrofo na frente força texto.
 * Tudo vai entre aspas, com as aspas internas dobradas.
 */
export function celulaCsv(valor: string): string {
  const seguro = /^[\t\r]|^\s*[=+\-@]/.test(valor) ? `'${valor}` : valor;
  return `"${seguro.replaceAll('"', '""')}"`;
}

const simNao = (v: boolean | null) => (v === null ? "" : v ? "sim" : "nao");

export async function responderExportacao(req: Request): Promise<Response> {
  try {
    const portas = comporAdmin();
    if (!portas) return recusar("indisponivel", 503);

    // Limite antes de conferir o token: freia tentativa em massa de token.
    const ip = ipDe(req);
    const ipHash = ip ? portas.cifra.hashBusca(ip) : null;
    if (!(await portas.limitador.consumir(`exportar:${ipHash ?? "sem-ip"}`, LIMITE_PEDIDOS, LIMITE_JANELA_SEGUNDOS))) {
      return recusar("limite", 429);
    }

    const cabecalho = req.headers.get("authorization") ?? "";
    const token = cabecalho.length <= TOKEN_MAXIMO ? JWT.exec(cabecalho)?.[1] : undefined;
    // Token ausente, malformado, vencido ou de quem não é admin: a mesma resposta.
    const usuarioId = token ? await portas.autenticador.ehAdmin(token) : null;
    if (!usuarioId) return recusar("nao-autorizado", 401);

    const consulta = consultaSchema.safeParse(Object.fromEntries(new URL(req.url).searchParams));
    if (!consulta.success) return recusar("validacao", 400);
    const { tipo } = consulta.data;

    const { colunas, registros } = await portas.leitor.listar(tipo);
    const linhas = [
      ["id", "criado_em", "email", "whatsapp", "consentimento_whatsapp", "consentimento_email", ...colunas],
      ...registros.map((r) => [
        r.id,
        r.criadoEm,
        portas.cifra.decifrar(r.emailCifrado),
        portas.cifra.decifrar(r.whatsappCifrado),
        simNao(r.consentimentos.whatsapp),
        simNao(r.consentimentos.email),
        ...colunas.map((c) => r.campos[c] ?? ""),
      ]),
    ];
    // A exportação tira dado pessoal do banco: fica registrada, com quem exportou, antes de o arquivo sair.
    await portas.repositorio.registrarAuditoria({
      tipo: "exportacao_admin",
      formulario: formularioDe[tipo],
      referenciaId: null,
      ipHash,
      data: new Date().toISOString(),
      usuarioId,
    });

    // BOM: o Excel só lê acentos em UTF-8 com ele.
    const csv = `﻿${linhas.map((l) => l.map(celulaCsv).join(",")).join("\r\n")}\r\n`;
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${tipo}-${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (erro) {
    console.error(`[exportar] falha interna: ${erro instanceof Error ? erro.name : "desconhecida"}`);
    return recusar("indisponivel", 503);
  }
}
