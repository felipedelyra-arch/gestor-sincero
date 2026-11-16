import { pagina } from "@content";
import { Secao } from "../ui/Secao";

export function BlocoDados() {
  return <Secao id="dados" titulo={pagina.dados.titulo} />;
}
