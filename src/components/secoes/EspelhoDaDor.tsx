import { pagina } from "@content";
import { Secao } from "../ui/Secao";
import { EspelhoDaDorLista } from "./EspelhoDaDorLista";

/** 02. Oito cartões que o visitante marca; contador e resposta sóbria ao final. */
export function EspelhoDaDor() {
  const { titulo, introducao, itens, contador, respostas } = pagina.espelho;
  return (
    <Secao id="espelho" titulo={titulo} apoio={introducao} fundo="marinho">
      <EspelhoDaDorLista introducao={introducao} itens={itens} contador={contador} respostas={respostas} />
    </Secao>
  );
}
