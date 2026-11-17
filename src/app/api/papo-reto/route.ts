import { after, connection } from "next/server";
import { responderConfigPapoReto, responderRotaPapoReto } from "@/server/aplicacao/httpPapoReto";

// Runtime Node é o padrão (com cacheComponents o export `runtime` não é aceito).
// Só GET e POST são exportados: o Next responde 405 aos demais métodos.
export function POST(req: Request): Promise<Response> {
  return responderRotaPapoReto(req, after);
}

export async function GET(): Promise<Response> {
  // Sem isso o Next pré-renderiza o GET no build e congela `comIA` com o ambiente do build.
  await connection();
  return responderConfigPapoReto();
}
