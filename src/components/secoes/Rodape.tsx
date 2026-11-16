import Link from "next/link";
import { pagina } from "@content";
import { site } from "@config/site";
import { ReverCookies } from "../global/ReverCookies";
import { Imagem } from "../ui/Imagem";
import { LinkRastreado } from "../ui/LinkRastreado";

// Área de toque de 48px também nos links pequenos.
const link = "inline-flex min-h-12 items-center text-left underline decoration-chumbo underline-offset-4 hover:decoration-ouro";

/** "5511987654321" -> "(11) 98765-4321" */
const telefone = (numero: string) => numero.replace(/^55(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");

/** 16. Marcas, contatos e dados da empresa (config: o que estiver pendente não aparece) e links legais. */
export function Rodape() {
  const r = pagina.rodape;
  const { whatsapp, email, instagram } = site.contatos;
  const { razaoSocial, cnpj } = site.empresa;
  return (
    <footer className="border-t border-chumbo py-16 text-apoio text-texto-2">
      <div className="conteiner grid gap-12 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-4">
          <Imagem
            nome="logo-gestor-sincero"
            alt={site.nome}
            tamanhos="160px"
            largura={640}
            altura={196}
            className="h-auto w-40"
          />
          <p className="mt-6 max-w-texto">{r.descricao}</p>
        </div>

        <ul className="grid content-start gap-6 lg:col-span-4">
          {r.marcas.map((marca) => (
            <li key={marca.nome}>
              <p className="font-medium text-texto">{marca.nome}</p>
              <p>{marca.descricao}</p>
            </li>
          ))}
        </ul>

        <div className="lg:col-span-4">
          {(whatsapp || email || instagram) && (
            <>
              <h2 className="font-medium text-texto">{r.rotuloContatos}</h2>
              <ul className="mt-2">
                {whatsapp && (
                  <li>
                    <LinkRastreado
                      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(pagina.whatsapp.mensagem)}`}
                      evento="clique_whatsapp"
                      className={link}
                    >
                      {telefone(whatsapp)}
                    </LinkRastreado>
                  </li>
                )}
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className={`${link} break-all`}>
                      {email}
                    </a>
                  </li>
                )}
                {instagram && (
                  <li>
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className={`${link} break-all`}>
                      {instagram.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </a>
                  </li>
                )}
              </ul>
            </>
          )}
          <ul className="mt-4">
            <li>
              <Link href={site.links.privacidade} className={link}>
                {r.rotuloPrivacidade}
              </Link>
            </li>
            <li>
              <Link href={site.links.termos} className={link}>
                {r.rotuloTermos}
              </Link>
            </li>
            <li>
              <ReverCookies rotulo={pagina.cookies.rever} className={link} />
            </li>
          </ul>
        </div>

        <div className="border-t border-chumbo pt-8 lg:col-span-12">
          {razaoSocial && <p>{razaoSocial}</p>}
          {cnpj && (
            <p className="tabular-nums">
              {r.rotuloCnpj} {cnpj}
            </p>
          )}
          <p>
            © {site.nome}. {r.direitos}
          </p>
        </div>
      </div>
    </footer>
  );
}
