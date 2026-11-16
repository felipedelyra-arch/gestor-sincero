import { paginaSchema, type Pagina } from "./schema";
import { paginaBruta } from "./pagina";
import { semPendentes } from "./pendentes";

// Validação em tempo de build: conteúdo fora do contrato quebra o build, não a página.
const validada: Pagina = paginaSchema.parse(paginaBruta);

// Em produção nada pendente aparece; em dev os marcadores ficam à vista para ninguém esquecer deles.
export const pagina: Pagina = process.env.NODE_ENV === "production" ? semPendentes(validada) : validada;
export type { Pagina, Formulario, Chamada } from "./schema";
