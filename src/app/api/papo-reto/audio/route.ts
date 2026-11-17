import { responderRotaPapoRetoAudio } from "@/server/aplicacao/httpPapoReto";

// Só POST é exportado: o Next responde 405 aos demais métodos.
export function POST(req: Request): Promise<Response> {
  return responderRotaPapoRetoAudio(req);
}
