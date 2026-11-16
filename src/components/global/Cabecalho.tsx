import Link from "next/link";
import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";
import { Imagem } from "../ui/Imagem";
import { MenuCelular } from "./MenuCelular";

/** Cabeçalho fixo: logo, âncoras das seções e a chamada de captação. No celular as âncoras vão para o menu. */
export function Cabecalho() {
  const { rotuloMenu, itens, chamada } = pagina.navegacao;
  return (
    <header className="sticky top-0 z-40 border-b border-chumbo bg-preto">
      <div className="conteiner flex h-(--altura-cabecalho) items-center justify-between gap-3">
        <Link href="/" className="flex min-h-12 shrink-0 items-center">
          <Imagem
            nome="logo-gestor-sincero"
            alt={site.nome}
            tamanhos="110px"
            largura={640}
            altura={196}
            className="h-8 w-auto"
          />
        </Link>
        <nav aria-label={rotuloMenu} className="hidden lg:block">
          <ul className="flex gap-8">
            {itens.map((item) => (
              <li key={item.ancora}>
                <a
                  href={item.ancora}
                  className="inline-flex min-h-12 items-center text-apoio font-medium text-texto-2 transition-colors duration-200 hover:text-texto"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          <Botao chamada={chamada} variante="compacto" />
          <MenuCelular rotulo={rotuloMenu} itens={itens} />
        </div>
      </div>
    </header>
  );
}
