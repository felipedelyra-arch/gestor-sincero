import { z } from "zod";

// Sem compilação por eval: a CSP não permite e a sondagem do Zod gera uma violação a cada carga.
z.config({ jitless: true });

// Contrato único entre formulários (navegador) e rotas BFF (servidor).
// Dono: orquestrador. Front e Back importam daqui; mudanças passam por ele.

const textoCurto = (max: number) => z.string().trim().min(1).max(max);
const opcional = (max: number) => z.string().trim().max(max).optional();

export const whatsappSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .pipe(z.string().regex(/^(55)?\d{10,11}$/))
  .transform((v) => (v.startsWith("55") && v.length > 11 ? v : `55${v}`));

const utmSchema = z
  .object({
    source: opcional(120),
    medium: opcional(120),
    campaign: opcional(120),
    term: opcional(120),
    content: opcional(120),
  })
  .optional();

const comum = {
  nome: textoCurto(120).min(2),
  whatsapp: whatsappSchema,
  email: z.email().max(254).transform((v) => v.toLowerCase()),
  // Consentimentos de contato são separados e opcionais (LGPD); a ciência do aviso é obrigatória.
  consentimentoWhatsapp: z.boolean(),
  consentimentoEmail: z.boolean(),
  cienciaPrivacidade: z.literal(true),
  utm: utmSchema,
  afiliado: opcional(80),
  turnstileToken: textoCurto(2048),
  // Campo armadilha: humanos não veem. Preenchido = robô (servidor responde sucesso falso e descarta).
  website: z.string().max(200).optional(),
};

export const cadastroJornadaSchema = z.object({
  ...comum,
  empresa: opcional(120),
  cargo: opcional(80),
  variacao: z.enum(["a", "b"]),
});

export const faixasFaturamento = [
  "ate-360-mil",
  "360-mil-a-4-8-milhoes",
  "4-8-a-30-milhoes",
  "acima-de-30-milhoes",
  "prefiro-nao-informar",
] as const;

export const faixasFuncionarios = ["1-5", "6-20", "21-50", "51-200", "mais-de-200"] as const;

export const pedidoRessonanciaSchema = z.object({
  ...comum,
  empresa: textoCurto(120),
  segmento: textoCurto(120),
  faixaFaturamento: z.enum(faixasFaturamento),
  numeroFuncionarios: z.enum(faixasFuncionarios),
  principalDesafio: textoCurto(1000),
});

export type CadastroJornada = z.infer<typeof cadastroJornadaSchema>;
export type PedidoRessonancia = z.infer<typeof pedidoRessonanciaSchema>;

// Respostas das rotas. Nunca carregam detalhe interno.
export type RespostaFormulario =
  // manualUrl: link assinado e com validade (só no cadastro da Jornada)
  // idEvento: id aleatório do evento de conversão; o navegador repassa ao Pixel para a Meta não contar em dobro
  | { ok: true; manualUrl?: string; idEvento?: string }
  | { ok: false; erro: "validacao"; campos: Record<string, string> } // chave = nome do campo
  | { ok: false; erro: "limite" | "antirrobo" | "indisponivel" };

export const rotas = {
  cadastroJornada: "/api/cadastro-jornada",
  ressonancia: "/api/ressonancia",
} as const;
