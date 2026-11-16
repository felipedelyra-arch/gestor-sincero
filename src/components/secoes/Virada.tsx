import { pagina } from "@content";
import { Secao } from "../ui/Secao";
import { Comparativo } from "./Comparativo";

/** 05. O segundo motor: o argumento à esquerda e a tabela das duas versões da empresa à direita. */
export function Virada() {
  const { titulo, paragrafos, comparativo } = pagina.virada;
  return (
    <Secao id="virada" titulo={titulo}>
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="grid gap-4 lg:col-span-4">
          {paragrafos.map((p) => (
            <p key={p} className="text-pretty">
              {p}
            </p>
          ))}
        </div>
        <div className="lg:col-span-8">
          <Comparativo {...comparativo} rotulos={pagina.rotulos} />
        </div>
      </div>
    </Secao>
  );
}
