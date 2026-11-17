import { pagina } from "@content";
import { site } from "@config/site";
import { LinkRastreado } from "../ui/LinkRastreado";
import { SinalAbrir } from "../ui/SinalAbrir";

/**
 * S13. Título centralizado e sanfona nativa (details/summary) numa coluna centralizada de 760px. Abaixo da última, a
 * linha de dúvida com o link do WhatsApp (mesma mensagem do botão fixo); sem número em config, a linha não aparece.
 */
export function PerguntasFrequentes() {
  const { titulo, itens, duvida } = pagina.perguntas;
  const numero = site.contatos.whatsapp;
  return (
    <section id="perguntas" aria-labelledby="perguntas-titulo" className="py-12 lg:py-14">
      <div className="conteiner-v2">
        <h2 id="perguntas-titulo" data-revela data-desloca suppressHydrationWarning className="text-center font-titulo text-secao font-medium text-balance">
          {titulo}
        </h2>
        <div className="mx-auto mt-10 max-w-[760px]">
          <div className="border-b border-filete-ouro">
            {itens.map((item) => (
              <details key={item.pergunta} className="group border-t border-filete-ouro">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4">
                  <h3 className="font-medium">{item.pergunta}</h3>
                  <SinalAbrir />
                </summary>
                <p className="pr-10 pb-6 text-pretty">{item.resposta}</p>
              </details>
            ))}
          </div>
          {duvida && numero && (
            <p className="mt-8 text-center">
              {duvida.texto}{" "}
              <LinkRastreado
                href={`https://wa.me/${numero}?text=${encodeURIComponent(pagina.whatsapp.mensagem)}`}
                evento="clique_whatsapp"
                className="inline-flex min-h-12 items-center font-medium text-ouro-claro underline decoration-ouro-escuro underline-offset-4 hover:decoration-ouro"
              >
                {duvida.rotuloLink}
              </LinkRastreado>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
