import type { Recomendacao } from "@/shared/papoReto";

// Regras fixas do Papo reto (ADR 0003 e tabela em docs/persona-ferrer.md). Funções puras sobre as respostas, sem modelo.
// Os temas e ids de opção são os de content/papo-reto.ts; renomear lá exige mudar aqui (o teste regras.test.ts confere).

export type RespostaDada = { opcao: string | null; numero: number | null };
/** Respostas já dadas, por tema da pergunta. */
export type RespostasPorTema = Readonly<Record<string, RespostaDada | undefined>>;
/** `antes` e `agora` são temas: antes = a pergunta feita primeiro, agora = a feita depois. */
export type Disparo = { id: string; antes: string; agora: string };

type Regra = {
  id: string;
  /** Pares [tema, id da opção] que a regra lê, para o teste conferir contra o conteúdo real. */
  usa: readonly (readonly [string, string])[];
  testa(r: RespostasPorTema): Pick<Disparo, "antes" | "agora"> | null;
};

const ele = (r: RespostasPorTema, tema: string, ...ids: string[]) => ids.includes(r[tema]?.opcao ?? "");
const comNumero = (r: RespostasPorTema, tema: string) => r[tema]?.numero != null;

export const regras: readonly Regra[] = [
  {
    id: "numeros-sem-custo",
    usa: [["decisao", "numeros"], ["custo-cliente", "nao-sei"], ["custo-cliente", "tenho-ideia"]],
    testa: (r) => (ele(r, "decisao", "numeros") && ele(r, "custo-cliente", "nao-sei", "tenho-ideia") ? { antes: "decisao", agora: "custo-cliente" } : null),
  },
  {
    id: "vendas-boas-problema-vender",
    usa: [["vendas", "cresceram"], ["prioridade", "vender-mais"]],
    testa: (r) => (ele(r, "vendas", "cresceram") && ele(r, "prioridade", "vender-mais") ? { antes: "vendas", agora: "prioridade" } : null),
  },
  {
    id: "digital-terceirizado-quer-digital",
    usa: [["digital", "agencia"], ["digital", "parente"], ["prioridade", "digital"]],
    testa: (r) => (ele(r, "digital", "agencia", "parente") && ele(r, "prioridade", "digital") ? { antes: "digital", agora: "prioridade" } : null),
  },
  {
    id: "equipe-segue-mas-problema-equipe",
    usa: [["equipe", "segue"], ["prioridade", "equipe"]],
    testa: (r) => (ele(r, "equipe", "segue") && ele(r, "prioridade", "equipe") ? { antes: "equipe", agora: "prioridade" } : null),
  },
  {
    id: "sucessao-planejada-sem-numeros",
    usa: [["sucessao", "planejada"], ["vendas", "nao-sei"], ["custo-cliente", "nao-sei"]],
    testa: (r) => {
      if (!ele(r, "sucessao", "planejada")) return null;
      // Se as duas respostas são "não sei", vale a da pergunta 5.
      if (ele(r, "custo-cliente", "nao-sei")) return { antes: "custo-cliente", agora: "sucessao" };
      return ele(r, "vendas", "nao-sei") ? { antes: "vendas", agora: "sucessao" } : null;
    },
  },
  {
    id: "experiencia-mas-vendas-caindo",
    usa: [["decisao", "experiencia"], ["vendas", "cairam"]],
    testa: (r) => (ele(r, "decisao", "experiencia") && ele(r, "vendas", "cairam") ? { antes: "decisao", agora: "vendas" } : null),
  },
  {
    id: "sabe-custo-mas-decide-no-feeling",
    usa: [["decisao", "experiencia"]],
    testa: (r) => (ele(r, "decisao", "experiencia") && comNumero(r, "custo-cliente") ? { antes: "decisao", agora: "custo-cliente" } : null),
  },
  {
    id: "sem-sucessao-prioridade-outra",
    usa: [["sucessao", "so-eu"], ["sucessao", "nao-pensei"], ["prioridade", "ja-decidi"]],
    // A pergunta 8 precisa já ter sido respondida (e diferente de ja-decidi).
    testa: (r) =>
      ele(r, "sucessao", "so-eu", "nao-pensei") && r["prioridade"]?.opcao != null && !ele(r, "prioridade", "ja-decidi")
        ? { antes: "sucessao", agora: "prioridade" }
        : null,
  },
  {
    id: "cuida-digital-mas-depende-de-terceiros",
    usa: [["digital", "eu-mesmo"], ["prioridade", "depender-de-terceiros"]],
    testa: (r) => (ele(r, "digital", "eu-mesmo") && ele(r, "prioridade", "depender-de-terceiros") ? { antes: "digital", agora: "prioridade" } : null),
  },
];

/** Todas as regras que disparam com as respostas atuais, na ordem da tabela. */
export function disparadas(respostas: RespostasPorTema): Disparo[] {
  return regras.flatMap((regra) => {
    const par = regra.testa(respostas);
    return par ? [{ id: regra.id, ...par }] : [];
  });
}

/** Pela ordem, a primeira que bate vale: ja-decidi = mentoria; "não sei" em vendas ou custo = ressonância; o resto = jornada. */
export function recomendar(r: RespostasPorTema): Recomendacao {
  if (ele(r, "prioridade", "ja-decidi")) return "mentoria";
  if (ele(r, "vendas", "nao-sei") || ele(r, "custo-cliente", "nao-sei")) return "ressonancia";
  return "jornada";
}
