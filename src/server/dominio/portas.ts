import type { CadastroJornada, PedidoRessonancia as EntradaRessonancia } from "@/shared/contratos";
import type { Cadastro, Consentimento, EventoAuditoria, Formulario, PedidoRessonancia } from "./entidades";

// Portas do domínio. Não importam Next nem Supabase; a infra implementa.

export interface Cifra {
  /** AES-256-GCM; devolve "idChave:iv:tag:dados" (partes em base64). */
  cifrar(texto: string): string;
  decifrar(cifrado: string): string;
  /** HMAC-SHA256 com a pimenta, em hex. Determinístico: serve para deduplicar e para hash de IP. */
  hashBusca(texto: string): string;
}

export type ResultadoGravacao = { id: string; novo: boolean };

export interface RepositorioCadastros {
  /** Deduplica por emailHash ou whatsappHash: se existir, atualiza e devolve novo = false. */
  salvarCadastro(cadastro: Cadastro): Promise<ResultadoGravacao>;
  /** Mesma regra de deduplicação de salvarCadastro. */
  salvarPedidoRessonancia(pedido: PedidoRessonancia): Promise<ResultadoGravacao>;
  /** Só acrescenta (histórico); nunca atualiza registros anteriores. */
  registrarConsentimentos(consentimentos: Consentimento[]): Promise<void>;
  registrarAuditoria(evento: EventoAuditoria): Promise<void>;
}

export interface LimitadorDeTaxa {
  /** Conta um uso de forma atômica. true = dentro do limite; false = bloqueado. */
  consumir(chave: string, max: number, janelaSegundos: number): Promise<boolean>;
}

export interface VerificadorAntirrobo {
  verificar(token: string, ip: string | null): Promise<boolean>;
}

export interface ArmazenamentoManual {
  /** null = manual ainda não disponível no armazenamento. */
  linkAssinado(validadeSegundos: number): Promise<string | null>;
}

// O webhook da S4 recebe os dados em claro (canal servidor a servidor, assinado) para a automação.
type SemControle<T> = Omit<T, "turnstileToken" | "website" | "cienciaPrivacidade">;
export type NotificacaoCadastro = SemControle<CadastroJornada> & ResultadoGravacao;
export type NotificacaoRessonancia = SemControle<EntradaRessonancia> & ResultadoGravacao;

export interface Notificador {
  cadastroCriado(dados: NotificacaoCadastro): Promise<void>;
  pedidoRessonanciaCriado(dados: NotificacaoRessonancia): Promise<void>;
}

export type LeadMeta = {
  formulario: Formulario;
  idEvento: string; // id do registro; serve para deduplicar o evento na Meta
  emailSha256: string; // hex, e-mail já normalizado em minúsculas
  telefoneSha256: string; // hex, só dígitos com DDI
  momento: number; // segundos desde 1970
};

export interface ConversoesMeta {
  enviarLead(lead: LeadMeta): Promise<void>;
}
