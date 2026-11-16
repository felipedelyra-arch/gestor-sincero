"use client";

import { useEffect } from "react";
import { useConsentimento } from "./consentimento";

export const EVENTO_RASTREAMENTO = "gs:evento";

export type NomeEvento = "inicio_formulario" | "cadastro" | "clique_checkout" | "clique_whatsapp";
type Primitivo = string | number | boolean;
export type DetalheEvento = { nome: NomeEvento; dados?: Record<string, unknown> };

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
  interface WindowEventMap {
    "gs:evento": CustomEvent<DetalheEvento>;
  }
}

// Nome nosso -> [evento da Meta, evento do GA4]. `null` na Meta = evento personalizado.
const mapa: Record<NomeEvento, [meta: string | null, ga4: string]> = {
  inicio_formulario: [null, "form_start"],
  cadastro: ["Lead", "generate_lead"],
  clique_checkout: ["InitiateCheckout", "begin_checkout"],
  clique_whatsapp: ["Contact", "clique_whatsapp"],
};

/** Para os outros componentes dispararem eventos sem conhecer fbq/gtag. */
export function dispararEvento(nome: NomeEvento, dados?: Record<string, unknown>): void {
  window.dispatchEvent(new CustomEvent<DetalheEvento>(EVENTO_RASTREAMENTO, { detail: { nome, dados } }));
}

function carregarScript(src: string): void {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function iniciarPixel(id: string): void {
  if (window.fbq) return;
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  }) as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = window._fbq = fbq;
  carregarScript("https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", id);
  fbq("track", "PageView");
}

function iniciarGa4(id: string): void {
  if (window.gtag) return;
  const fila = (window.dataLayer ??= []);
  // O gtag.js só entende o objeto `arguments`, não um array.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    fila.push(arguments);
  };
  carregarScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
  window.gtag("js", new Date());
  window.gtag("config", id);
}

// Só valores simples seguem para terceiros (nada de objeto com dado pessoal aninhado).
function limpar(dados: unknown): Record<string, Primitivo> {
  if (typeof dados !== "object" || dados === null) return {};
  return Object.fromEntries(
    Object.entries(dados).filter((par): par is [string, Primitivo] =>
      ["string", "number", "boolean"].includes(typeof par[1]),
    ),
  );
}

/** Argumentos de fbq e gtag para um evento nosso. Função pura. */
export function montarChamadas(nome: NomeEvento, dadosBrutos?: unknown): { meta: unknown[]; ga4: unknown[] } {
  const [meta, ga4] = mapa[nome];
  const { idEvento, ...dados } = limpar(dadosBrutos);
  return {
    // eventID deduplica com o mesmo evento enviado pelo servidor (API de Conversões).
    meta: [meta ? "track" : "trackCustom", meta ?? nome, dados, ...(idEvento ? [{ eventID: String(idEvento) }] : [])],
    ga4: ["event", ga4, dados],
  };
}

// IDs chegam do layout (servidor); `null` = pendente em config/site.ts.
type Props = { metaPixelId: string | null; ga4Id: string | null };

export function Rastreamento({ metaPixelId, ga4Id }: Props) {
  const aceito = useConsentimento() === "aceito";

  useEffect(() => {
    if (!aceito) return; // sem aceite: nenhum script, e os eventos são descartados
    if (metaPixelId) iniciarPixel(metaPixelId);
    if (ga4Id) iniciarGa4(ga4Id);

    const repassar = (e: CustomEvent<DetalheEvento>) => {
      const nome = e.detail?.nome;
      if (!nome || !Object.hasOwn(mapa, nome)) return;
      const { meta, ga4 } = montarChamadas(nome, e.detail.dados);
      if (metaPixelId) window.fbq?.(...meta);
      if (ga4Id) window.gtag?.(...ga4);
    };
    window.addEventListener(EVENTO_RASTREAMENTO, repassar);
    return () => window.removeEventListener(EVENTO_RASTREAMENTO, repassar);
  }, [aceito, metaPixelId, ga4Id]);

  return null;
}
