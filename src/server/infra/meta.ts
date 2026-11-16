import type { ConversoesMeta } from "../dominio/portas";

const VERSAO_API = "v24.0";

/**
 * API de Conversões da Meta. Só recebe e-mail e telefone em SHA-256 e o idEvento (o mesmo do Pixel,
 * para a Meta não contar em dobro). Quem decide se pode enviar (aceite de cookies) é o caso de uso.
 */
export function criarConversoesMeta(pixelId: string, token: string, urlDoSite: string): ConversoesMeta {
  return {
    async enviarLead(lead) {
      const res = await fetch(`https://graph.facebook.com/${VERSAO_API}/${encodeURIComponent(pixelId)}/events`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        // Token no corpo, não na URL: URL acaba em log de proxy.
        body: JSON.stringify({
          access_token: token,
          data: [
            {
              event_name: "Lead",
              event_time: lead.momento,
              event_id: lead.idEvento,
              action_source: "website",
              event_source_url: urlDoSite,
              user_data: { em: [lead.emailSha256], ph: [lead.telefoneSha256] },
              custom_data: { formulario: lead.formulario },
            },
          ],
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`meta: status ${res.status}`);
    },
  };
}
