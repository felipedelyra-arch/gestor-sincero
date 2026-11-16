import { pagina } from "@content";
import { Imagem } from "../ui/Imagem";
import { Secao } from "../ui/Secao";

const subtitulo = "font-titulo text-h3 font-medium";
const linhas = "mt-4 divide-y divide-chumbo border-y border-chumbo *:py-3";

/** 06. Trajetória, o que ele é e não é, o prêmio e as empresas por onde passou. */
export function QuemE() {
  const q = pagina.quemE;
  return (
    <Secao id="quem-e" titulo={q.titulo} fundo="preto-2">
      <div className="grid gap-4">
        {q.paragrafos.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <ul className={`${linhas} mt-8 text-texto-2`}>
        {q.credenciais.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <div className="mt-16 grid gap-12 sm:grid-cols-2 sm:gap-8">
        <div>
          <h3 className={subtitulo}>{q.tituloEh}</h3>
          <ul className={linhas}>
            {q.eh.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={subtitulo}>{q.tituloNaoEh}</h3>
          <ul className={`${linhas} text-texto-2`}>
            {q.naoEh.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </div>

      <figure className="mt-16 grid gap-6 sm:grid-cols-[2fr_3fr] sm:items-end">
        <Imagem
          nome="ferrer-premio"
          alt={q.altFoto}
          tamanhos="(min-width: 640px) 240px, 100vw"
          largura={480}
          altura={640}
          className="w-full rounded-base"
        />
        <figcaption>
          <p className={subtitulo}>{q.premio.nome}</p>
          <p className="mt-2 text-texto-2">{q.premio.descricao}</p>
        </figcaption>
      </figure>

      <h3 className={`${subtitulo} mt-16`}>{q.tituloEmpresas}</h3>
      <ul className="mt-4 columns-1 gap-8 text-texto-2 sm:columns-2 *:break-inside-avoid *:py-1.5">
        {q.empresas.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </Secao>
  );
}
