import { pagina } from "@content";
import { ConversaPapoReto } from "../papo-reto/ConversaPapoReto";
import { Botao } from "../ui/Botao";
import { Imagem } from "../ui/Imagem";

/**
 * S14. Fechamento centralizado sobre o retrato do Ferrér escurecido: uma frase em manifesto, um parágrafo e um botão
 * (o Papo reto fica como link de texto ao lado). A foto vai bem apagada para o texto manter o contraste AA.
 */
export function Fechamento() {
  const { frases, texto, chamada } = pagina.fechamento;
  return (
    <section id="fechamento" aria-labelledby="fechamento-titulo" className="relative isolate overflow-hidden py-(--sec-ampla)">
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.2] blur-sm">
        <Imagem
          nome="ferrer-retrato"
          alt=""
          tamanhos="100vw"
          largura={1080}
          altura={1080}
          className="size-full object-cover object-[50%_18%]"
        />
      </div>
      <div data-revela suppressHydrationWarning className="conteiner-v2 flex flex-col items-center text-center">
        <h2 id="fechamento-titulo" className="manifesto max-w-[20ch] text-balance">
          {frases[0]}
        </h2>
        {texto && <p className="mt-10 max-w-[56ch] text-lead text-pretty">{texto}</p>}
        <div className="mt-10 flex flex-col items-center gap-x-8 gap-y-2 sm:flex-row">
          <Botao chamada={chamada} />
          <ConversaPapoReto variante="secundario" />
        </div>
      </div>
    </section>
  );
}
