const MARCA = "[PENDENTE";
const pendente = (v: unknown): boolean => typeof v === "string" && v.includes(MARCA);

/**
 * Tira do conteúdo tudo o que ainda depende do Ferrér, para o marcador nunca chegar à tela.
 * Texto pendente solto vira "" (o componente esconde o bloco); item de lista pendente sai da lista;
 * objeto de lista com algum campo pendente (uma pergunta sem resposta, por exemplo) sai inteiro.
 */
export function semPendentes<T>(valor: T): T {
  if (Array.isArray(valor)) {
    return valor
      .filter((v) => !pendente(v) && !(v && typeof v === "object" && !Array.isArray(v) && Object.values(v).some(pendente)))
      .map(semPendentes) as T;
  }
  if (valor && typeof valor === "object") {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, pendente(v) ? "" : semPendentes(v)])) as T;
  }
  return valor;
}
