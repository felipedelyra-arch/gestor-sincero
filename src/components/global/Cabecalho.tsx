import Link from "next/link";
import { pagina } from "@content";
import { site } from "@config/site";
import { Botao } from "../ui/Botao";
import { Imagem } from "../ui/Imagem";
import { MenuCelular } from "./MenuCelular";

/**
 * S0. Cabeçalho fixo: logo (40px de altura), links à esquerda ao lado dele e a chamada curta à direita.
 * No celular os links vão para o menu.
 */
export function Cabecalho({ base = "" }: { base?: string }) {
  const { rotuloMenu, chamada } = pagina.navegacao;
  // fora da página inicial as âncoras levam de volta a ela ("/#metodo")
  const itens = pagina.navegacao.itens.map((i) => ({ ...i, ancora: base + i.ancora }));
  return (
    <header className="sticky top-0 z-40 border-b border-chumbo bg-preto">
      <div className="conteiner-v2 flex h-(--altura-cabecalho) items-center gap-4 lg:gap-10">
        <Link href="/" className="flex min-h-12 shrink-0 items-center">
          <Imagem
            nome="logo-gestor-sincero"
            alt={site.nome}
            tamanhos="130px"
            largura={640}
            altura={196}
            className="h-10 w-auto"
          />
        </Link>
        <nav aria-label={rotuloMenu} className="hidden lg:block">
          <ul className="flex gap-8">
            {itens.map((item) => (
              <li key={item.ancora}>
                <a
                  href={item.ancora}
                  className="inline-flex min-h-12 items-center text-apoio font-medium text-texto transition-colors duration-200 hover:text-ouro-claro"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Botao chamada={chamada} variante="compacto" base={base} className="whitespace-nowrap max-sm:px-3" />
          <MenuCelular rotulo={rotuloMenu} itens={itens} />
        </div>
      </div>
    </header>
  );
}
