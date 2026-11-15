import { after } from "next/server";
import { responderFormulario } from "@/server/aplicacao/http";

// Runtime Node é o padrão (com cacheComponents o export `runtime` não é aceito).
// Só POST é exportado: o Next responde 405 aos demais métodos.
export function POST(req: Request): Promise<Response> {
  return responderFormulario(req, "cadastro-jornada", after);
}
