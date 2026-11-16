import { Cabecalho } from "@/components/global/Cabecalho";
import { BlocoDados } from "@/components/secoes/BlocoDados";
import { Depoimentos } from "@/components/secoes/Depoimentos";
import { Dicionario } from "@/components/secoes/Dicionario";
import { EspelhoDaDor } from "@/components/secoes/EspelhoDaDor";
import { Fechamento } from "@/components/secoes/Fechamento";
import { Inimigo } from "@/components/secoes/Inimigo";
import { Jornada } from "@/components/secoes/Jornada";
import { Metodo } from "@/components/secoes/Metodo";
import { OfertaMentoria } from "@/components/secoes/OfertaMentoria";
import { ParaQuemE } from "@/components/secoes/ParaQuemE";
import { PerguntasFrequentes } from "@/components/secoes/PerguntasFrequentes";
import { QuemE } from "@/components/secoes/QuemE";
import { Ressonancia } from "@/components/secoes/Ressonancia";
import { Rodape } from "@/components/secoes/Rodape";
import { Tarja } from "@/components/secoes/Tarja";
import { Topo } from "@/components/secoes/Topo";
import { Virada } from "@/components/secoes/Virada";

export default function Page() {
  return (
    <>
      <Tarja />
      <Cabecalho />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Topo />
        <EspelhoDaDor />
        <BlocoDados />
        <Inimigo />
        <Virada />
        <QuemE />
        <Metodo />
        <Jornada />
        <Dicionario />
        <Ressonancia />
        <OfertaMentoria />
        <ParaQuemE />
        <Depoimentos />
        <PerguntasFrequentes />
        <Fechamento />
      </main>
      <Rodape />
    </>
  );
}
