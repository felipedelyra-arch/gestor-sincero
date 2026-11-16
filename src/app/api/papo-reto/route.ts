import { after } from "next/server";
import { responderRotaPapoReto } from "@/server/aplicacao/httpPapoReto";

// Runtime Node é o padrão (com cacheComponents o export `runtime` não é aceito).
// Só POST é exportado: o Next responde 405 aos demais métodos.
export function POST(req: Request): Promise<Response> {
  return responderRotaPapoReto(req, after);
}
