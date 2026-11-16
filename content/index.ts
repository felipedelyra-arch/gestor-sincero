import { paginaSchema, papoRetoSchema, type Pagina, type PapoReto } from "./schema";
import { papoRetoBruto } from "./papo-reto";
import { paginaBruta } from "./pagina";
import { semPendentes } from "./pendentes";

// Validação em tempo de build: conteúdo fora do contrato quebra o build, não a página.
const validada: Pagina = paginaSchema.parse(paginaBruta);

// Em produção nada pendente aparece; em dev os marcadores ficam à vista para ninguém esquecer deles.
export const pagina: Pagina = process.env.NODE_ENV === "production" ? semPendentes(validada) : validada;

const papoRetoValidado: PapoReto = papoRetoSchema.parse(papoRetoBruto);
export const papoReto: PapoReto = process.env.NODE_ENV === "production" ? semPendentes(papoRetoValidado) : papoRetoValidado;

export type { Pagina, Formulario, Chamada, PapoReto } from "./schema";
