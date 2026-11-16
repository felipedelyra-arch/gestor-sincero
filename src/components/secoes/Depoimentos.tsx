import { pagina } from "@content";
import { Secao } from "../ui/Secao";

/** 13. Não renderiza nada enquanto não houver depoimento real autorizado. */
export function Depoimentos() {
  if (pagina.depoimentos.itens.length === 0) return null;
  return <Secao id="depoimentos" titulo={pagina.depoimentos.titulo} />;
}
