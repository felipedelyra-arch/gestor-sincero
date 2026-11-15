import { paginaSchema, type Pagina } from "./schema";
import { paginaBruta } from "./pagina";

// Validação em tempo de build: conteúdo fora do contrato quebra o build, não a página.
export const pagina: Pagina = paginaSchema.parse(paginaBruta);
export type { Pagina, Formulario, Chamada } from "./schema";
