import { pagina } from "@content";

export function Rodape() {
  return (
    <footer className="border-t border-chumbo py-12">
      <p className="conteiner text-apoio text-texto-2">{pagina.rodape.descricao}</p>
    </footer>
  );
}
