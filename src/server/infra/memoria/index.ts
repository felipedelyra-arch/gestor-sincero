import { createCipheriv, createDecipheriv, createHmac, randomBytes, randomUUID } from "node:crypto";
import type { Cadastro, Consentimento, ContatoProtegido, EventoAuditoria, PedidoRessonancia } from "../../dominio/entidades";
import type {
  ArmazenamentoManual,
  Cifra,
  ConversoesMeta,
  LimitadorDeTaxa,
  Notificador,
  RepositorioCadastros,
  ResultadoGravacao,
  VerificadorAntirrobo,
} from "../../dominio/portas";

// Adaptadores em memória: só desenvolvimento e testes. A composição nunca os usa em produção.

// shortcut: chave e pimenta sorteadas a cada processo (nada sobrevive ao reinício); a cifra real é a da infra/cripto.
const chave = randomBytes(32);
const pimenta = randomBytes(32);

const cifra: Cifra = {
  cifrar(texto) {
    const iv = randomBytes(12);
    const c = createCipheriv("aes-256-gcm", chave, iv);
    const dados = Buffer.concat([c.update(texto, "utf8"), c.final()]);
    return ["mem", iv, c.getAuthTag(), dados].map((p) => (typeof p === "string" ? p : p.toString("base64"))).join(":");
  },
  decifrar(cifrado) {
    const [, iv, tag, dados] = cifrado.split(":").map((p) => Buffer.from(p, "base64"));
    const d = createDecipheriv("aes-256-gcm", chave, iv).setAuthTag(tag);
    return Buffer.concat([d.update(dados), d.final()]).toString("utf8");
  },
  hashBusca: (texto) => createHmac("sha256", pimenta).update(texto).digest("hex"),
};

type Gravado<T> = T & { id: string };

function salvar<T extends ContatoProtegido>(lista: Gravado<T>[], registro: T): ResultadoGravacao {
  const existente = lista.find((r) => r.emailHash === registro.emailHash || r.whatsappHash === registro.whatsappHash);
  if (existente) {
    Object.assign(existente, registro);
    return { id: existente.id, novo: false };
  }
  const id = randomUUID();
  lista.push({ ...registro, id });
  return { id, novo: true };
}

const dados = {
  cadastros: [] as Gravado<Cadastro>[],
  pedidos: [] as Gravado<PedidoRessonancia>[],
  consentimentos: [] as Consentimento[],
  auditoria: [] as EventoAuditoria[],
  limites: new Map<string, { usos: number; expira: number }>(),
};

const repositorio: RepositorioCadastros = {
  salvarCadastro: async (cadastro) => salvar(dados.cadastros, cadastro),
  salvarPedidoRessonancia: async (pedido) => salvar(dados.pedidos, pedido),
  registrarConsentimentos: async (lista) => void dados.consentimentos.push(...lista),
  registrarAuditoria: async (evento) => void dados.auditoria.push(evento),
};

const limitador: LimitadorDeTaxa = {
  async consumir(chaveLimite, max, janelaSegundos) {
    const agora = Date.now();
    let item = dados.limites.get(chaveLimite);
    if (!item || item.expira <= agora) {
      item = { usos: 0, expira: agora + janelaSegundos * 1000 };
      dados.limites.set(chaveLimite, item);
    }
    item.usos += 1;
    return item.usos <= max;
  },
};

const antirrobo: VerificadorAntirrobo = { verificar: async () => true };
const armazenamento: ArmazenamentoManual = { linkAssinado: async () => null };
const notificador: Notificador = { cadastroCriado: async () => {}, pedidoRessonanciaCriado: async () => {} };
const meta: ConversoesMeta = { enviarLead: async () => {} };

export const memoria = {
  cifra,
  repositorio,
  limitador,
  antirrobo,
  armazenamento,
  notificador,
  meta,
  dados,
  limpar() {
    dados.cadastros.length = 0;
    dados.pedidos.length = 0;
    dados.consentimentos.length = 0;
    dados.auditoria.length = 0;
    dados.limites.clear();
  },
};
