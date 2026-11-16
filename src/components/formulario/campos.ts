import type { TipoCampo } from "../ui/Campo";

export type DefinicaoCampo = {
  /** Nome do campo no contrato (src/shared/contratos.ts) e chave em `formulario.campos` do conteúdo. */
  nome: string;
  tipo?: TipoCampo;
  obrigatorio?: boolean;
  autoComplete?: string;
  /** Ocupa as duas colunas do formulário (o padrão é meia largura a partir de 640px). */
  larguraTotal?: boolean;
};

const contato: DefinicaoCampo[] = [
  { nome: "nome", obrigatorio: true, autoComplete: "name", larguraTotal: true },
  { nome: "whatsapp", tipo: "tel", obrigatorio: true, autoComplete: "tel-national" },
  { nome: "email", tipo: "email", obrigatorio: true, autoComplete: "email" },
];

export const camposJornada: DefinicaoCampo[] = [
  ...contato,
  { nome: "empresa", autoComplete: "organization" },
  { nome: "cargo", autoComplete: "organization-title" },
];

export const camposRessonancia: DefinicaoCampo[] = [
  ...contato,
  { nome: "empresa", obrigatorio: true, autoComplete: "organization" },
  { nome: "segmento", obrigatorio: true },
  { nome: "faixaFaturamento", tipo: "select", obrigatorio: true },
  { nome: "numeroFuncionarios", tipo: "select", obrigatorio: true },
  { nome: "principalDesafio", tipo: "textarea", obrigatorio: true, larguraTotal: true },
];
