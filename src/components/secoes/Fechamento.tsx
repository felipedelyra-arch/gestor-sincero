import { pagina } from "@content";
import { Secao } from "../ui/Secao";

export function Fechamento() {
  return <Secao id="fechamento" titulo={pagina.fechamento.frases[0]} />;
}
