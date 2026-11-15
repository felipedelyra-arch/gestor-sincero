import type { CadastroJornada, PedidoRessonancia as EntradaRessonancia } from "@/shared/contratos";

// E-mail e WhatsApp só existem aqui cifrados (AES-256-GCM) e em hash de busca (HMAC-SHA256).
export type ContatoProtegido = {
  emailCifrado: string;
  emailHash: string;
  whatsappCifrado: string;
  whatsappHash: string;
};

type Origem = Pick<CadastroJornada, "utm" | "afiliado">;

export type Cadastro = ContatoProtegido &
  Origem &
  Pick<CadastroJornada, "nome" | "empresa" | "cargo" | "variacao">;

export type PedidoRessonancia = ContatoProtegido &
  Origem &
  Pick<
    EntradaRessonancia,
    "nome" | "empresa" | "segmento" | "faixaFaturamento" | "numeroFuncionarios" | "principalDesafio"
  >;

export type Formulario = "cadastro-jornada" | "ressonancia";

export type Consentimento = {
  formulario: Formulario;
  referenciaId: string; // id do cadastro ou do pedido
  canal: "whatsapp" | "email" | "privacidade";
  aceito: boolean;
  texto: string; // texto exibido ao visitante no momento do aceite
  versaoTexto: string; // SHA-256 (12 hex) do texto
  data: string; // ISO 8601
  ipHash: string | null;
};

export type EventoAuditoria = {
  tipo:
    | "registro_criado"
    | "registro_atualizado"
    | "antirrobo_reprovado"
    | "falha_manual"
    | "falha_notificador"
    | "falha_meta";
  formulario: Formulario;
  referenciaId: string | null;
  ipHash: string | null;
  data: string; // ISO 8601
};
