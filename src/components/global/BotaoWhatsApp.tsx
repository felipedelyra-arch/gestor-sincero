"use client";

import { dispararEvento } from "./Rastreamento";

// Número, rótulo e mensagem chegam do layout (servidor); sem número, o layout não monta o botão.
type Props = { numero: string; rotuloBotao: string; mensagem: string };

export function BotaoWhatsApp({ numero, rotuloBotao, mensagem }: Props) {
  return (
    <a
      href={`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={rotuloBotao}
      title={rotuloBotao}
      onClick={() => dispararEvento("clique_whatsapp")}
      // Sobe acima do banner de cookies e some enquanto a pessoa preenche um formulário.
      className="fixed right-4 bottom-[calc(var(--gs-banner-altura,0px)+1rem)] z-40 flex size-14 items-center justify-center rounded-[2px] border border-ouro-escuro bg-preto-2 text-ouro transition-colors duration-200 hover:text-ouro-claro focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-texto [body:has(form:focus-within)_&]:hidden"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Z" />
      </svg>
    </a>
  );
}
