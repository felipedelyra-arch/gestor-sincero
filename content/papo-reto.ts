import type { PapoRetoEntrada } from "./schema";

// TEXTO PROVISÓRIO do orquestrador, só para Back-end e Front-end montarem. O terminal Conteúdo reescreve tudo.
const P = "[PROVISÓRIO]";

export const papoRetoBruto: PapoRetoEntrada = {
  rotuloBotao: "Conversar com o Gestor Sincero",
  titulo: "Papo reto com o Gestor Sincero",
  avisoIA:
    "Assistente de inteligência artificial com a imagem de Sidney Ferrér, usada com autorização. Não substitui uma consultoria.",
  consentimento: { texto: P, aceitar: P, recusar: P },
  comecar: P,
  abertura: P,
  perguntas: [
    { numero: 1, tema: "empresa", texto: "Em uma frase, o que sua empresa faz e há quanto tempo?" },
    { numero: 2, tema: "decisao", texto: "As decisões grandes hoje saem mais de números ou da sua experiência?" },
    { numero: 3, tema: "vendas", texto: "Como foram as vendas nos últimos 12 meses?" },
    { numero: 4, tema: "digital", texto: "Quem cuida do digital da empresa?" },
    { numero: 5, tema: "custo-cliente", texto: "Você sabe quanto custa conquistar um cliente novo?" },
    { numero: 6, tema: "equipe", texto: "A equipe mais jovem segue o que você decide?" },
    { numero: 7, tema: "sucessao", texto: "A sucessão está planejada?" },
    { numero: 8, tema: "prioridade", texto: "Se pudesse resolver uma coisa amanhã, qual seria?" },
  ],
  campo: { rotulo: P, enviar: P, enviando: P },
  encerrar: P,
  encerrada: P,
  falaPadrao: P,
  erros: { limite: P, antirrobo: P, indisponivel: P },
  fechamento: { titulo: P },
  recomendacoes: {
    jornada: { texto: P, rotuloBotao: P },
    ressonancia: { texto: P, rotuloBotao: P },
    mentoria: { texto: P, rotuloBotao: P },
  },
  altVideo: P,
};
