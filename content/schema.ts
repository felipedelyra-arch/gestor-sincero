import { z } from "zod";

// Sem compilação por eval: a CSP não permite e a sondagem do Zod gera uma violação a cada carga.
z.config({ jitless: true });

// Contrato do conteúdo da página. Dono do formato: orquestrador. Dono do texto: terminal Conteúdo.
// Preço, datas, links e contatos NÃO entram aqui: ficam em config/site.ts.
// Texto que depende do Ferrér usa o marcador "[PENDENTE FERRÉR]".

const t = z.string().min(1);
const lista = (min = 1) => z.array(t).min(min);

export const destinos = ["captacao", "mentoria", "ressonancia", "checkout", "whatsapp"] as const;
const chamada = z.object({ rotulo: t, destino: z.enum(destinos) });

const campo = z.object({ rotulo: t, ajuda: t.optional(), erro: t });
const formulario = z.object({
  titulo: t,
  introducao: t.optional(),
  // chave = nome do campo em src/shared/contratos.ts (nome, whatsapp, email, empresa...)
  campos: z.record(z.string(), campo),
  // opções de campos de escolha: chave = nome do campo, depois valor do enum -> rótulo
  opcoes: z.record(z.string(), z.record(z.string(), t)).optional(),
  consentimentos: z.object({ whatsapp: t, email: t, privacidade: t }),
  enviar: t,
  enviando: t,
  sucesso: z.object({ titulo: t, texto: t, baixarManual: t.optional() }),
  erros: z.object({ limite: t, antirrobo: t, indisponivel: t }),
});

const item = z.object({ nome: t, descricao: t });

const documento = z.object({
  titulo: t,
  atualizadoEm: t,
  secoes: z.array(z.object({ titulo: t, paragrafos: lista() })).min(1),
});

export const paginaSchema = z.object({
  seo: z.object({ titulo: t.max(60), descricao: t.max(160) }),

  tarja: z.object({ texto: t }), // 00

  topo: z.object({ // 01
    variacoes: z.object({
      a: z.object({ titulo: t, subtitulo: t }),
      b: z.object({ titulo: t, subtitulo: t }),
    }),
    chamadaPrincipal: chamada,
    chamadaSecundaria: chamada,
    altFoto: t,
    tituloVideo: t,
    prova: lista(2), // linha de prova em texto corrido, abaixo dos botões (Design v2, S1)
  }),

  espelho: z.object({ // 02
    titulo: t,
    introducao: t,
    itens: lista().length(8),
    contador: t, // usa {n} e {total}
    // resposta sóbria conforme quantos itens foram marcados
    respostas: z.object({ nenhum: t, poucos: t, muitos: t }),
  }),

  dados: z.object({ // 03
    titulo: t,
    itens: z.array(z.object({ valor: t, descricao: t })).min(3),
    fonte: t, // instituição + ano
    fechamento: t,
  }),

  inimigo: z.object({ titulo: t, introducao: t, frases: lista(3), fechamento: t.optional() }), // 04

  virada: z.object({ // 05
    titulo: t,
    paragrafos: lista(),
    comparativo: z.object({
      titulo: t.optional(), // v2.1: a pergunta saiu; só os 6 primeiros pares aparecem
      rotuloAnalogica: t,
      rotuloDigital: t,
      pares: z.array(z.object({ tema: t, analogica: t, digital: t })).length(17),
    }),
  }),

  quemE: z.object({ // 06
    titulo: t,
    paragrafos: lista(),
    credenciais: lista(),
    tituloEh: t,
    eh: lista(),
    tituloNaoEh: t,
    naoEh: lista(),
    frase: t, // frase do Ferrér em destaque
    sintese: t.optional(), // v2.1: uma frase só no lugar das listas "é / não é"
    premio: item,
    tituloEmpresas: t,
    empresas: lista(),
    altFoto: t,
  }),

  metodo: z.object({ // 07
    titulo: t,
    introducao: t,
    pilares: z
      .array(
        z.object({
          nome: t,
          descricao: t,
          rotulo: t.optional(), // duas ou três palavras para a faixa da linha do tempo: "a mentalidade", "a execução" (v2.1)
          etapas: z.array(z.object({ numero: z.number().int().min(1).max(10), nome: t, descricao: t })).min(1),
        }),
      )
      .length(2)
      .refine((p) => p.flatMap((x) => x.etapas).length === 10, "o método tem 10 etapas"),
  }),

  jornada: z.object({ // 08
    titulo: t,
    introducao: t,
    pautas: z.array(z.object({ titulo: t, descricao: t })).length(3),
    rotuloReuniao: t, // "Reunião", para a agenda numerada (Design v2, S8)
    rotuloHorario: t,
    datasPendentes: t, // exibido enquanto config.jornada.datas for null
    manual: item,
    formulario,
  }),

  dicionario: z.object({ // 09
    titulo: t,
    introducao: t,
    termos: z.array(z.object({ termo: t, classe: t.optional(), traducao: t })).length(6), // classe gramatical: "s.m."
    avisoValidacao: t,
    prova: t, // linha de prova abaixo dos termos
  }),

  ressonancia: z.object({ // 10: na landing só o resumo; o restante vive em /ressonancia
    seo: z.object({ titulo: t.max(60), descricao: t.max(160) }),
    resumo: z.object({ linhas: lista(1).max(2), rotuloBotao: t }),
    titulo: t,
    analogia: t,
    paragrafos: lista(),
    altCapa: t,
    tituloFases: t,
    fases: z.array(z.object({ letra: z.string().regex(/^[A-I]$/), nome: t, descricao: t })).length(9),
    tituloEntregas: t,
    entregas: z.array(item).min(3),
    tituloEtapas: t,
    etapas: z.array(item).min(3),
    prazo: t,
    previa: z.object({
      titulo: t,
      selo: t,
      slides: z.array(z.object({ arquivo: t, legenda: t })).length(4), // arquivo em public/img/ressonancia/
    }),
    chamada,
    formulario,
  }),

  oferta: z.object({ // 11
    titulo: t,
    introducao: t,
    inclui: lista(),
    tituloBonus: t,
    bonus: lista(),
    tituloPlano: t,
    planoDeSucesso: lista(),
    garantia: item,
    rotuloPreco: t,
    precoPendente: t, // exibido enquanto config.mentoria.precoCentavos for null
    chamada,
    ofertaPosterior: t.optional(),
  }),

  paraQuem: z.object({ // 12
    titulo: t,
    tituloEh: t,
    eh: lista(),
    tituloNaoEh: t,
    naoEh: lista(),
    tituloRequisitos: t,
    requisitos: lista(),
    fraseRequisito: t,
  }),

  // 13: componente fica oculto enquanto a lista estiver vazia. NUNCA inventar.
  depoimentos: z.object({
    titulo: t,
    itens: z.array(z.object({ nome: t, cargo: t, empresa: t, texto: t })),
  }),

  perguntas: z.object({ // 14
    titulo: t,
    itens: z.array(z.object({ pergunta: t, resposta: t })).min(5),
    duvida: z.object({ texto: t, rotuloLink: t }).optional(), // v2.1: linha abaixo da última pergunta; só aparece com WhatsApp em config
  }),

  fechamento: z.object({ frases: lista(), texto: t.optional(), chamada }), // 15

  rodape: z.object({ // 16
    descricao: t,
    marcas: z.array(item).min(1),
    rotuloContatos: t,
    rotuloCnpj: t,
    rotuloPrivacidade: t,
    rotuloTermos: t,
    direitos: t,
    // nome da pessoa (JSON-LD) e link de volta das páginas legais
    pessoa: t.default("Sidney Ferrér"),
    voltarAoInicio: t.default("Voltar para a página inicial"),
  }),

  // páginas /privacidade e /termos
  legal: z.object({ privacidade: documento, termos: documento }),

  whatsapp: z.object({ rotuloBotao: t, mensagem: t }),
  // cabeçalho fixo: âncoras das seções e rótulos de abrir/fechar listas (direção v2 do DESIGN.md)
  navegacao: z.object({
    rotuloMenu: t,
    itens: z.array(z.object({ rotulo: t, ancora: z.string().regex(/^#[a-z-]+$/) })).min(3).max(6),
    chamada,
  }),
  rotulos: z.object({ verTodos: t, verMenos: t, anterior: t, proximo: t }),
  pularParaConteudo: t, // link de salto do teclado, no layout
  cookies: z.object({ texto: t, aceitar: t, recusar: t, rotuloPolitica: t, rever: t.default("Rever escolha de cookies") }),
});

// "Papo reto com o Gestor Sincero" (ADR 0003): conversa por opções, com falas pré-escritas. Texto em content/papo-reto.ts.
const slug = z.string().regex(/^[a-z0-9-]{1,40}$/);
const fala = t.max(400);
const recomendacao = z.object({ texto: t, rotuloBotao: t });
const perguntaPapo = z
  .object({
    numero: z.number().int().min(1).max(8),
    tema: slug, // as regras em src/server/papo-reto/regras.ts usam `tema` e o `id` das opções
    texto: t,
    // botões de resposta; `fala` é a reação do personagem; `ponto` é a frase que essa resposta rende no papo reto final
    opcoes: z.array(z.object({ id: slug, rotulo: t, fala, ponto: t.optional() })).max(5),
    // campo numérico opcional; em `fala`, {valor} é trocado pelo número digitado (ele repete para confirmar)
    campoNumero: z.object({ rotulo: t, sufixo: t.optional(), min: z.number(), max: z.number(), fala }).optional(),
  })
  .refine((p) => p.opcoes.length >= 2 || p.campoNumero, "pergunta precisa de opções ou de campo numérico");
export const papoRetoSchema = z.object({
  rotuloBotao: t,
  titulo: t,
  // o aviso aparece antes de tudo; `comIA` só quando a camada de texto livre (Groq) está ligada
  avisos: z.object({ roteiro: t, comIA: t }),
  consentimento: z.object({ texto: t, aceitar: t, recusar: t }), // guardar ou não a conversa
  comecar: t,
  abertura: fala, // primeira fala do personagem
  perguntas: z.array(perguntaPapo).length(8),
  livre: z.object({ rotulo: t, ajuda: t.optional() }), // "quer explicar melhor?"
  // Conversa por texto e por voz (ADR 0003, revisão de 17/11): campo de mensagem, gravação de áudio e leitura das falas em voz alta.
  conversa: z.object({
    campo: t, // texto de exemplo do campo de mensagem
    enviar: t, // rótulo do botão de enviar (leitor de tela)
    gravar: t,
    pararGravacao: t,
    gravando: t, // estado anunciado enquanto grava
    transcrevendo: t,
    semMicrofone: t, // permissão negada ou navegador sem gravação
    audioNaoEntendido: fala, // a transcrição falhou: pede para repetir ou escrever
    ouvirFalas: t, // liga a voz do personagem
    silenciarFalas: t,
    sugestoes: t, // título discreto das respostas prontas
  }),
  responder: t, // botão que envia número ou texto livre
  naoEntendi: fala, // quando o texto livre não pôde ser lido: pede para escolher uma das opções, sem soar como erro
  enviando: t,
  // fala de confronto por regra: chave = id da regra em regras.ts; {antes} e {agora} viram os rótulos das respostas
  confrontos: z.record(slug, fala).refine((c) => Object.keys(c).length >= 8, "mínimo de 8 confrontos"),
  encerrar: t,
  encerrada: t,
  erros: z.object({ limite: t, antirrobo: t, indisponivel: t }),
  fechamento: z.object({ titulo: t, abertura: fala, pontoPadrao: t }), // pontoPadrao completa os 3 pontos se faltar
  recomendacoes: z.object({ jornada: recomendacao, ressonancia: recomendacao, mentoria: recomendacao }),
  altVideo: t,
});
export type PapoReto = z.infer<typeof papoRetoSchema>;
export type PapoRetoEntrada = z.input<typeof papoRetoSchema>;

export type Pagina = z.infer<typeof paginaSchema>;
export type PaginaEntrada = z.input<typeof paginaSchema>;
export type Formulario = z.infer<typeof formulario>;
export type Chamada = z.infer<typeof chamada>;
