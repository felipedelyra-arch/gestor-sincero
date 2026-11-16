import type { PapoRetoEntrada } from "./schema";

// Textos do "Papo reto com o Gestor Sincero" (ADR 0003). Persona e regras do modelo em docs/persona-ferrer.md.
// A ordem das perguntas sustenta as contradições conferidas em código: 2×5, 3×8 e 4×8. Não reordene sem mudar as regras.
export const papoRetoBruto: PapoRetoEntrada = {
  rotuloBotao: "Conversar com o Gestor Sincero",
  titulo: "Papo reto com o Gestor Sincero",
  avisoIA:
    "Assistente de inteligência artificial com a imagem de Sidney Ferrér, usada com autorização. Não substitui uma consultoria.",
  consentimento: {
    texto:
      "Posso guardar esta conversa? Se você aceitar, o texto fica guardado cifrado por 30 dias e depois é apagado. Se recusar, nada é guardado e a conversa funciona do mesmo jeito. Nos dois casos, suas respostas são lidas por inteligência artificial, então não escreva documentos, senhas nem dados de saúde.",
    aceitar: "Pode guardar",
    recusar: "Não guardar",
  },
  comecar: "Começar a conversa",
  abertura:
    "Eu sou o Gestor Sincero. Vou fazer umas poucas perguntas sobre a sua empresa e vou ser direto com você: se uma resposta não combinar com outra, eu aviso. No fim, você recebe um papo reto em três pontos e a minha sugestão de próximo passo.",
  perguntas: [
    { numero: 1, tema: "empresa", texto: "Para começar: o que a sua empresa faz e há quantos anos está no mercado?" },
    {
      numero: 2,
      tema: "decisao",
      texto: "Quando você toma uma decisão grande, ela sai mais dos números ou da sua experiência?",
    },
    {
      numero: 3,
      tema: "vendas",
      texto: "Nos últimos 12 meses, as vendas cresceram, ficaram paradas ou caíram? Se tiver o número, me diga.",
    },
    {
      numero: 4,
      tema: "digital",
      texto: "Quem cuida do digital da empresa hoje? Você, alguém da equipe, uma agência ou um parente?",
    },
    {
      numero: 5,
      tema: "custo-cliente",
      texto: "Você sabe quanto custa conquistar um cliente novo? Se souber, qual é o valor?",
    },
    { numero: 6, tema: "equipe", texto: "E a equipe mais jovem: segue o que você decide ou faz do jeito dela?" },
    {
      numero: 7,
      tema: "sucessao",
      texto: "Se você precisasse se afastar amanhã, quem tocaria a empresa? A sucessão está planejada?",
    },
    {
      numero: 8,
      tema: "prioridade",
      texto: "Última pergunta. Se pudesse resolver uma coisa só na empresa a partir de amanhã, qual seria?",
    },
  ],
  campo: { rotulo: "Sua resposta", enviar: "Enviar", enviando: "Enviando" },
  encerrar: "Encerrar a conversa",
  encerrada: "Conversa encerrada. Obrigado pela franqueza. O próximo passo está logo abaixo.",
  falaPadrao: "Quero ter certeza de que entendi. Vou refazer a pergunta, e você responde com as suas palavras.",
  erros: {
    limite:
      "Esta conversa chegou ao limite de mensagens por agora. Tente de novo mais tarde ou siga para a inscrição na Jornada.",
    antirrobo: "Não consegui confirmar que é você, e não um robô. Recarregue a página e tente de novo.",
    indisponivel:
      "A conversa está fora do ar neste momento. Tente de novo em alguns minutos ou faça a sua inscrição na Jornada pelo formulário da página.",
  },
  fechamento: { titulo: "O papo reto sobre a sua empresa" },
  recomendacoes: {
    jornada: {
      texto:
        "O meu conselho é começar pela Jornada Executiva Gestão Sem Maquiagem. São três reuniões ao vivo, com o manual gratuito, para rever essas ideias com calma antes de decidir qualquer coisa.",
      rotuloBotao: "Quero meu manual e minha vaga na Jornada",
    },
    ressonancia: {
      texto:
        "Pelo que você contou, falta enxergar a empresa por dentro, com dados. A Ressonância Digital da S4 examina marketing, gestão e vendas em 52 temas e mostra por onde começar.",
      rotuloBotao: "Solicitar a Ressonância da minha empresa",
    },
    mentoria: {
      texto:
        "Você já decidiu mudar, então não faz sentido esperar. A Mentoria Empresas do Futuro são seis meses de método, em 10 etapas, para criar a versão digital do negócio sem destruir o que você construiu.",
      rotuloBotao: "Conhecer a mentoria",
    },
  },
  altVideo: "Sidney Ferrér em vídeo, como o assistente Gestor Sincero",
};
