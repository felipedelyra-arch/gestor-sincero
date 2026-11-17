import { z } from "zod";
import { LIMITE_LIVRE } from "@/shared/papoReto";
import type { TranscritorDeAudio } from "../dominio/papoReto";

const URL_GROQ = "https://api.groq.com/openai/v1/audio/transcriptions";
export const MODELO_AUDIO_PADRAO = "whisper-large-v3-turbo";
const TIMEOUT_MS = 15_000;
const saidaSchema = z.object({ text: z.string() });
// O Groq reconhece o formato pela extensão do arquivo.
const EXTENSAO: Record<string, string> = { "audio/webm": "webm", "audio/ogg": "ogg", "audio/mp4": "mp4", "audio/mpeg": "mp3", "audio/wav": "wav" };

/** Adaptador de transcrição do Groq (Whisper). Qualquer falha vira null; a chave, o áudio e o texto nunca vão a log nem a erro. */
export function criarGroqAudio(chave: string, modelo = MODELO_AUDIO_PADRAO, timeoutMs = TIMEOUT_MS): TranscritorDeAudio {
  return {
    async transcrever(audio) {
      const controle = new AbortController();
      const relogio = setTimeout(() => controle.abort(), timeoutMs);
      const falhou = (motivo: string) => {
        console.error(`[groq] transcrição ignorada: ${motivo}`);
        return null;
      };
      try {
        const corpo = new FormData();
        corpo.append("file", audio, `audio.${EXTENSAO[audio.type.split(";")[0].trim().toLowerCase()] ?? "webm"}`);
        corpo.append("model", modelo);
        corpo.append("language", "pt");
        corpo.append("response_format", "json");
        corpo.append("temperature", "0");
        const res = await fetch(URL_GROQ, { method: "POST", headers: { Authorization: `Bearer ${chave}` }, body: corpo, signal: controle.signal });
        if (res.status !== 200) return falhou(`status ${res.status}`);
        const saida = saidaSchema.safeParse(await res.json());
        if (!saida.success) return falhou("saída inesperada");
        return saida.data.text.trim().slice(0, LIMITE_LIVRE).trim() || falhou("texto vazio");
      } catch {
        return falhou(controle.signal.aborted ? "timeout" : "rede");
      } finally {
        clearTimeout(relogio);
      }
    },
  };
}
