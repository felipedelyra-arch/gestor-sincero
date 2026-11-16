import type { TipoCampo } from "../ui/Campo";

export type DefinicaoCampo = {
  /** Nome do campo no contrato (src/shared/contratos.ts) e chave em `formulario.campos` do conteúdo. */
  nome: string;
  tipo?: TipoCampo;
  obrigatorio?: boolean;
  autoComplete?: string;
};

const contato: DefinicaoCampo[] = [
  { nome: "nome", obrigatorio: true, autoComplete: "name" },
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
  { nome: "principalDesafio", tipo: "textarea", obrigatorio: true },
];
