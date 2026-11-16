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

// O id só existe depois da gravação: o repositório preenche referenciaId e o tipo da auditoria
// ("registro_criado" se novo, "registro_atualizado" se repetido).
export type ConsentimentoNovo = Omit<Consentimento, "referenciaId">;
export type AuditoriaRegistro = Omit<EventoAuditoria, "tipo" | "referenciaId">;

export interface RepositorioCadastros {
  /**
   * Atômico (uma transação): registro + consentimentos + auditoria.
   * Repetido (mesmo emailHash ou whatsappHash): não sobrescreve nenhum campo do primeiro registro,
   * só atualiza atualizado_em, acrescenta os consentimentos e a auditoria, e devolve novo = false.
   */
  registrarCadastro(dados: {
    cadastro: Cadastro;
    consentimentos: ConsentimentoNovo[];
    auditoria: AuditoriaRegistro;
  }): Promise<ResultadoGravacao>;
  /** Mesmas regras de registrarCadastro. */
  registrarPedidoRessonancia(dados: {
    pedido: PedidoRessonancia;
    consentimentos: ConsentimentoNovo[];
    auditoria: AuditoriaRegistro;
  }): Promise<ResultadoGravacao>;
  /** Eventos avulsos (antirrobô reprovado, falha de notificador, da Meta ou do manual). */
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
  idEvento: string; // aleatório, o mesmo devolvido ao navegador: a Meta deduplica com o Pixel
  emailSha256: string; // hex, e-mail já normalizado em minúsculas
  telefoneSha256: string; // hex, só dígitos com DDI
  momento: number; // segundos desde 1970
};

export interface ConversoesMeta {
  enviarLead(lead: LeadMeta): Promise<void>;
}

export type TipoExportacao = "cadastros" | "ressonancia";

export type RegistroExportado = {
  id: string;
  criadoEm: string;
  emailCifrado: string;
  whatsappCifrado: string;
  /** Último consentimento registrado por canal; null = nunca registrado. */
  consentimentos: { whatsapp: boolean | null; email: boolean | null };
  /** Demais colunas, já em texto, com as chaves de `colunas`. */
  campos: Record<string, string>;
};

export interface LeitorExportacao {
  listar(tipo: TipoExportacao): Promise<{ colunas: string[]; registros: RegistroExportado[] }>;
}

export interface AutenticadorAdmin {
  /** true só para token válido de usuário com app_metadata.papel = "admin". */
  ehAdmin(token: string): Promise<boolean>;
}
