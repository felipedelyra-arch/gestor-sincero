import { responderExportacao } from "@/server/aplicacao/exportar";

// Lê cabeçalhos da requisição, então roda a cada pedido (nunca é pré-renderizada).
export function GET(req: Request): Promise<Response> {
  return responderExportacao(req);
}
