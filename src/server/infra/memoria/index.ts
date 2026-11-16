import { createCipheriv, createDecipheriv, createHmac, randomBytes, randomUUID } from "node:crypto";
import type { Cadastro, Consentimento, ContatoProtegido, EventoAuditoria, PedidoRessonancia } from "../../dominio/entidades";
import type {
  ArmazenamentoManual,
  AuditoriaRegistro,
  Cifra,
  ConsentimentoNovo,
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

type Gravado<T> = T & { id: string; atualizadoEm: string };

// Mesma regra da migração 0002: só é a mesma pessoa se e-mail E telefone coincidem; se só um
// coincide, vira registro novo (o consentimento de um nunca cai no registro de outro).
const mesmoContato = (a: ContatoProtegido, b: ContatoProtegido) =>
  a.emailHash === b.emailHash && a.whatsappHash === b.whatsappHash;
// Pedido: a mesma pessoa pode pedir para outra empresa; só repete se a empresa também for a mesma.
const mesmoPedido = (a: PedidoRessonancia, b: PedidoRessonancia) =>
  mesmoContato(a, b) && a.empresa.trim().toLowerCase() === b.empresa.trim().toLowerCase();

function registrar<T extends ContatoProtegido>(
  lista: Gravado<T>[],
  registro: T,
  consentimentos: ConsentimentoNovo[],
  auditoria: AuditoriaRegistro,
  mesmo: (a: T, b: T) => boolean = mesmoContato,
): ResultadoGravacao {
  let gravado = lista.find((r) => mesmo(r, registro));
  const novo = !gravado;
  // Repetido não sobrescreve nada do primeiro registro: só marca a data.
  if (gravado) gravado.atualizadoEm = auditoria.data;
  else lista.push((gravado = { ...registro, id: randomUUID(), atualizadoEm: auditoria.data }));
  const { id } = gravado;
  dados.consentimentos.push(...consentimentos.map((c) => ({ ...c, referenciaId: id })));
  dados.auditoria.push({ ...auditoria, tipo: novo ? "registro_criado" : "registro_atualizado", referenciaId: id });
  return { id, novo };
}

const dados = {
  cadastros: [] as Gravado<Cadastro>[],
  pedidos: [] as Gravado<PedidoRessonancia>[],
  consentimentos: [] as Consentimento[],
  auditoria: [] as EventoAuditoria[],
  limites: new Map<string, { usos: number; expira: number }>(),
};

const repositorio: RepositorioCadastros = {
  registrarCadastro: async (d) => registrar(dados.cadastros, d.cadastro, d.consentimentos, d.auditoria),
  registrarPedidoRessonancia: async (d) => registrar(dados.pedidos, d.pedido, d.consentimentos, d.auditoria, mesmoPedido),
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
