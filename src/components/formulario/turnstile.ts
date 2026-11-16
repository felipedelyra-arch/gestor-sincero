// Widget Cloudflare Turnstile em modo explícito. O script só é pedido quando um formulário chama `carregarTurnstile`.

type Opcoes = {
  sitekey: string;
  theme: "dark";
  language: string;
  /** O widget só ocupa espaço se a Cloudflare precisar de uma ação do visitante. */
  appearance: "interaction-only";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (alvo: HTMLElement, opcoes: Opcoes) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

let script: Promise<void> | undefined;

/** Uma única tag de script, mesmo com dois formulários na página. */
export function carregarTurnstile(): Promise<void> {
  script ??= new Promise((pronto, falha) => {
    const tag = document.createElement("script");
    tag.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    tag.async = true;
    tag.onload = () => pronto();
    tag.onerror = () => {
      script = undefined; // permite nova tentativa
      falha(new Error("turnstile"));
    };
    document.head.append(tag);
  });
  return script;
}
