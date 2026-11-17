import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { site } from "@config/site";
import { AUDIO_MAX_BYTES, LIMITE_LIVRE, MAX_MENSAGENS, type RespostaTranscricao } from "@/shared/papoReto";
import { GET } from "@/app/api/papo-reto/route";
import { POST } from "@/app/api/papo-reto/audio/route";
import { POST as POST_TURNO } from "@/app/api/papo-reto/route";
import { assinarEstado, type EstadoConversa } from "./aplicacao/papoReto";
import { memoria } from "./infra/memoria";
import { env, simularServicos } from "./teste/servicosSimulados";

// Resposta por voz: fetch simulado, chave fictícia, nenhuma chamada de rede real.

vi.mock("next/server", () => ({ after: (t: () => Promise<void>) => void t(), connection: async () => {} }));
const flags = vi.hoisted(() => ({ ativo: true }));
vi.mock("@config/site", async (original) => {
  const real = await original<typeof import("@config/site")>();
  return {
    site: {
      ...real.site,
      turnstileSiteKey: "0x4AAAAAAAchave-publica-real",
      get papoReto() {
        return { ...real.site.papoReto, ativo: flags.ativo };
      },
    },
  };
});

const origem = new URL(site.url).origin;
const CHAVE = "gsk_chave-ficticia-de-teste-0123456789";
const GROQ = "https://api.groq.com/openai/v1/audio/transcriptions";
const FALA = "faturo uns cinquenta mil por mês";

const groq = { chamadas: [] as { headers: Headers; form: FormData }[], responder: (): Response | Promise<Response> => Response.json({}, { status: 500 }) };
let log: ReturnType<typeof vi.spyOn>;

const novoEstado = (extra: Partial<EstadoConversa> = {}): EstadoConversa => ({
  v: 1, sid: crypto.randomUUID(), q: 1, n: 0, cons: false, t: Date.now(), fim: false, r: [], c: [], ...extra,
});
const assinado = (extra?: Partial<EstadoConversa>) => assinarEstado(novoEstado(extra), env.PAPO_RETO_SEGREDO);

function formulario(campos: { audio?: Blob | null; estado?: string | null } = {}) {
  const f = new FormData();
  const audio = campos.audio === undefined ? new Blob(["bytes-de-audio"], { type: "audio/webm;codecs=opus" }) : campos.audio;
  if (audio) f.append("audio", audio, "gravacao.webm");
  const estado = campos.estado === undefined ? assinado() : campos.estado;
  if (estado !== null) f.append("estado", estado);
  return f;
}

async function enviar(corpo: BodyInit, cabecalhos: Record<string, string> = {}) {
  // O Request serializa o multipart e gera o content-type com boundary.
  const base = new Request(`${origem}/api/papo-reto/audio`, { method: "POST", body: corpo });
  const res = await POST(
    new Request(base, { headers: { origin: origem, "x-forwarded-for": "203.0.113.9", ...Object.fromEntries(base.headers), ...cabecalhos } }),
  );
  const texto = await res.text();
  return { status: res.status, res, texto, json: (texto ? JSON.parse(texto) : null) as RespostaTranscricao };
}
const falaOk = () => Response.json({ text: `  ${FALA}  ` });

beforeEach(() => {
  simularServicos();
  vi.stubEnv("GROQ_API_KEY", CHAVE);
  vi.stubEnv("AI_MODEL_AUDIO", "");
  vi.stubEnv("SUPABASE_URL", "");
  const servicos = fetch;
  groq.chamadas = [];
  groq.responder = falaOk;
  vi.stubGlobal("fetch", async (entrada: RequestInfo | URL, init?: RequestInit) => {
    const req = new Request(entrada, init);
    if (req.url !== GROQ) return servicos(entrada, init);
    groq.chamadas.push({ headers: req.headers, form: await req.formData() });
    return groq.responder();
  });
  flags.ativo = true;
  memoria.limpar();
  log = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  // A chave e o texto transcrito nunca aparecem em log.
  const registrado = JSON.stringify(log.mock.calls);
  expect(registrado).not.toContain(CHAVE);
  expect(registrado).not.toContain(FALA);
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

test("transcrição ok devolve o texto aparado, no-store, e chama o Groq no formato combinado", async () => {
  const { status, res, json } = await enviar(formulario());
  expect(status).toBe(200);
  expect(json).toEqual({ ok: true, texto: FALA });
  expect(res.headers.get("cache-control")).toBe("no-store");

  expect(groq.chamadas).toHaveLength(1);
  const { headers, form } = groq.chamadas[0];
  expect(headers.get("authorization")).toBe(`Bearer ${CHAVE}`);
  expect(Object.fromEntries([...form].filter(([k]) => k !== "file"))).toEqual({
    model: "whisper-large-v3-turbo", language: "pt", response_format: "json", temperature: "0",
  });
  expect((form.get("file") as File).name).toBe("audio.webm");
});

test("AI_MODEL_AUDIO troca o modelo", async () => {
  vi.stubEnv("AI_MODEL_AUDIO", "whisper-large-v3");
  await enviar(formulario());
  expect(groq.chamadas[0].form.get("model")).toBe("whisper-large-v3");
});

test("texto longo é cortado em LIMITE_LIVRE", async () => {
  groq.responder = () => Response.json({ text: "a".repeat(LIMITE_LIVRE + 200) });
  const { json } = await enviar(formulario());
  expect(json).toEqual({ ok: true, texto: "a".repeat(LIMITE_LIVRE) });
});

test("aceita os tipos da lista, com ou sem codecs", async () => {
  for (const tipo of ["audio/webm", "audio/ogg;codecs=opus", "audio/mp4", "audio/mpeg", "audio/wav"]) {
    const { status } = await enviar(formulario({ audio: new Blob(["x"], { type: tipo }) }));
    expect(status, tipo).toBe(200);
  }
});

test("arquivo acima do limite: 413, sem chamar o Groq nem gastar cota", async () => {
  const grande = new Blob([new Uint8Array(AUDIO_MAX_BYTES + 1)], { type: "audio/webm" });
  const { status, json } = await enviar(formulario({ audio: grande }));
  expect(status).toBe(413);
  expect(json).toEqual({ ok: false, erro: "validacao" });
  expect(groq.chamadas).toHaveLength(0);
});

test("Content-Length declarado acima do limite é recusado antes de ler o corpo", async () => {
  const corpo = new ReadableStream();
  const res = await POST(
    new Request(`${origem}/api/papo-reto/audio`, {
      method: "POST",
      headers: { origin: origem, "content-type": "multipart/form-data; boundary=x", "content-length": String(AUDIO_MAX_BYTES * 5) },
      body: corpo,
      // @ts-expect-error duplex é exigido pelo Node para corpo em stream
      duplex: "half",
    }),
  );
  expect(res.status).toBe(413);
  expect(corpo.locked).toBe(false); // ninguém abriu leitor: o corpo não foi lido
});

test("tipo não permitido: 415", async () => {
  for (const tipo of ["text/plain", "video/webm", "audio/flac", ""]) {
    const { status, json } = await enviar(formulario({ audio: new Blob(["x"], { type: tipo }) }));
    expect(status, tipo).toBe(415);
    expect(json).toEqual({ ok: false, erro: "validacao" });
  }
  expect(groq.chamadas).toHaveLength(0);
});

test("sem arquivo, arquivo vazio ou campo `audio` que não é arquivo: 400", async () => {
  for (const f of [formulario({ audio: null }), formulario({ audio: new Blob([], { type: "audio/webm" }) })]) {
    expect((await enviar(f)).status).toBe(400);
  }
  const texto = new FormData();
  texto.append("audio", "não sou arquivo");
  texto.append("estado", assinado());
  expect((await enviar(texto)).status).toBe(400);
  expect(groq.chamadas).toHaveLength(0);
});

test("corpo que não é multipart: 400", async () => {
  const { status } = await enviar(JSON.stringify({ estado: assinado() }), { "content-type": "application/json" });
  expect(status).toBe(400);
});

test("estado ausente, adulterado, vencido ou encerrado: validacao, sem Groq e sem gastar cota", async () => {
  const bom = assinado();
  const [carga, mac] = bom.split(".");
  const adulterado = `${Buffer.from(JSON.stringify({ ...novoEstado(), q: 8 })).toString("base64url")}.${mac}`;
  const casos = [
    null,
    "lixo",
    adulterado,
    `${carga}.${mac.slice(0, -2)}xx`,
    assinado({ t: Date.now() - 3 * 60 * 60 * 1000 }),
    assinado({ fim: true }),
  ];
  for (const estado of casos) {
    const { status, json } = await enviar(formulario({ estado }));
    expect(status).toBe(400);
    expect(json).toEqual({ ok: false, erro: "validacao" });
  }
  expect(groq.chamadas).toHaveLength(0);
});

test("estado já no teto de mensagens: limite", async () => {
  const { status, json } = await enviar(formulario({ estado: assinado({ n: MAX_MENSAGENS }) }));
  expect(status).toBe(429);
  expect(json).toEqual({ ok: false, erro: "limite" });
});

test("Origin de outro site ou ausente: 403 sem Groq", async () => {
  const base = new Request(`${origem}/api/papo-reto/audio`, { method: "POST", body: formulario() });
  const ct = base.headers.get("content-type")!;
  for (const origin of ["https://atacante.example", ""]) {
    const headers: Record<string, string> = { "content-type": ct };
    if (origin) headers.origin = origin;
    const res = await POST(new Request(`${origem}/api/papo-reto/audio`, { method: "POST", headers, body: formulario() }));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ ok: false, erro: "antirrobo" });
  }
  expect(groq.chamadas).toHaveLength(0);
});

test("Papo reto desligado: 404", async () => {
  flags.ativo = false;
  expect((await enviar(formulario())).status).toBe(404);
  expect((await GET()).status).toBe(404);
  expect(groq.chamadas).toHaveLength(0);
});

test("sem GROQ_API_KEY: indisponivel e nenhuma chamada", async () => {
  vi.stubEnv("GROQ_API_KEY", "");
  const { status, json } = await enviar(formulario());
  expect(status).toBe(503);
  expect(json).toEqual({ ok: false, erro: "indisponivel" });
  expect(groq.chamadas).toHaveLength(0);
});

test("Groq com 429, erro 500, JSON inesperado, rede ou texto vazio: nao-entendido", async () => {
  const falhas: (() => Response | Promise<Response>)[] = [
    () => new Response("{}", { status: 429 }),
    () => new Response("{}", { status: 500 }),
    () => new Response("não é json", { status: 200 }),
    () => Response.json({ outro: 1 }),
    () => Promise.reject(new TypeError("falha de rede")),
    () => Response.json({ text: "   " }),
  ];
  for (const f of falhas) {
    groq.responder = f;
    const { status, json } = await enviar(formulario());
    expect(status).toBe(422);
    expect(json).toEqual({ ok: false, erro: "nao-entendido" });
  }
});

test("timeout de 15 s vira nao-entendido", async () => {
  vi.useFakeTimers();
  try {
    vi.stubGlobal("fetch", (_: unknown, init?: RequestInit) => new Promise<Response>((_ok, falha) => init?.signal?.addEventListener("abort", () => falha(new DOMException("abort", "AbortError")))));
    const pendente = enviar(formulario());
    await vi.advanceTimersByTimeAsync(15_000);
    expect((await pendente).json).toEqual({ ok: false, erro: "nao-entendido" });
  } finally {
    vi.useRealTimers();
  }
});

test("cota por IP: a transcrição divide os 60 turnos diários com o texto e os botões", async () => {
  // 59 turnos já gastos pelo mesmo IP (a cota do IP é a mesma chave do turno de texto).
  const inicio = await POST_TURNO(
    new Request(`${origem}/api/papo-reto`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: origem, "x-forwarded-for": "203.0.113.9" },
      body: JSON.stringify({ estado: null, turnstileToken: "t", consentimento: false, resposta: null }),
    }),
  );
  const { estado } = (await inicio.json()) as { estado: string };
  for (let i = 0; i < 59; i++) expect((await enviar(formulario({ estado }))).status).toBe(200);
  expect((await enviar(formulario({ estado }))).status).toBe(200); // 60º
  const { status, json } = await enviar(formulario({ estado }));
  expect(status).toBe(429);
  expect(json).toEqual({ ok: false, erro: "limite" });
  expect(groq.chamadas).toHaveLength(60);
});

test("nada gravado: o log não leva texto nem chave, e o banco em memória fica vazio", async () => {
  await enviar(formulario());
  groq.responder = () => new Response("{}", { status: 429 });
  await enviar(formulario());
  expect(memoria.dados.papoReto).toHaveLength(0);
  expect(memoria.dados.cadastros).toHaveLength(0);
  expect(JSON.stringify(log.mock.calls)).toContain("status 429");
});

test("GET devolve audio true com chave e false sem chave", async () => {
  const com = await GET();
  expect(await com.json()).toEqual({ ativo: true, comIA: true, audio: true });
  expect(com.headers.get("cache-control")).toBe("no-store");
  vi.stubEnv("GROQ_API_KEY", "");
  expect(await (await GET()).json()).toEqual({ ativo: true, comIA: false, audio: false });
});
