import { pagina } from "@content";
import { Secao } from "../ui/Secao";
import { Comparativo } from "./Comparativo";

/** 05. O segundo motor: aqui o fio se divide em dois, um por coluna do comparativo. */
export function Virada() {
  const { titulo, paragrafos, comparativo } = pagina.virada;
  return (
    <Secao id="virada" titulo={titulo}>
      <div className="grid gap-4">
        {paragrafos.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <Comparativo {...comparativo} />
    </Secao>
  );
}
