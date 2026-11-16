import type { PapoRetoEntrada } from "./schema";

// Textos do "Papo reto com o Gestor Sincero" (ADR 0003): conversa por opções, falas pré-escritas.
// Os `id` das opções e as chaves de `confrontos` são lidos por src/server/papo-reto/regras.ts; tabela em docs/persona-ferrer.md.
// Nos confrontos, {antes} e {agora} viram os rótulos das respostas, por isso vão entre aspas.
export const papoRetoBruto: PapoRetoEntrada = {
  rotuloBotao: "Conversar com o Gestor Sincero",
  titulo: "Papo reto com o Gestor Sincero",
  avisos: {
    roteiro:
      "Roteiro de perguntas do Gestor Sincero, com a imagem de Sidney Ferrér usada com autorização. Não substitui uma consultoria.",
    comIA:
      "Roteiro de perguntas do Gestor Sincero, com a imagem de Sidney Ferrér usada com autorização. Se você escrever uma explicação, um assistente de inteligência artificial a lê para entender a sua resposta. Não substitui uma consultoria.",
  },
  consentimento: {
    texto:
      "Posso guardar esta conversa? Se você aceitar, as suas respostas ficam guardadas cifradas por 30 dias e depois são apagadas. Se recusar, nada é guardado e a conversa funciona do mesmo jeito. Não escreva nome, documentos, senhas nem dados de saúde.",
    aceitar: "Pode guardar",
    recusar: "Não guardar",
  },
  comecar: "Começar a conversa",
  abertura:
    "Eu sou o Gestor Sincero. São oito perguntas rápidas sobre a sua empresa, quase todas com respostas para escolher. Vou ser direto com você: se uma resposta não combinar com outra, eu aviso. No fim, você recebe um papo reto em três pontos e a minha sugestão de próximo passo.",
  perguntas: [
    {
      numero: 1,
      tema: "empresa",
      texto: "Para começar: há quantos anos a sua empresa está no mercado?",
      opcoes: [],
      campoNumero: {
        rotulo: "Anos de mercado",
        sufixo: "anos",
        min: 1,
        max: 200,
        fala: "Anotado: {valor} anos de mercado. O que me interessa agora é o que mudou no seu mercado nesse tempo, e se a empresa mudou junto.",
      },
    },
    {
      numero: 2,
      tema: "decisao",
      texto: "Quando você toma uma decisão grande, ela sai mais dos números ou da sua experiência?",
      opcoes: [
        {
          id: "numeros",
          rotulo: "Mais dos números",
          fala: "Então você decide olhando os números. Guarde essa resposta, porque daqui a pouco eu volto nela.",
        },
        {
          id: "experiencia",
          rotulo: "Mais da minha experiência",
          fala: "Experiência é patrimônio, ninguém tira isso de você. O risco é ela decidir sozinha num mercado que trocou as regras. Seu feeling já não basta quando o jogo muda tão rápido.",
          ponto: "As decisões grandes saem da sua experiência, e experiência sem atualização virou risco.",
        },
        {
          id: "um-pouco-de-cada",
          rotulo: "Um pouco de cada",
          fala: "É uma resposta honesta. A pergunta que fica é esta: quando os números e a sua experiência discordam, quem ganha?",
        },
      ],
    },
    {
      numero: 3,
      tema: "vendas",
      texto: "Nos últimos 12 meses, as vendas cresceram, ficaram paradas ou caíram?",
      opcoes: [
        {
          id: "cresceram",
          rotulo: "Cresceram",
          fala: "Bom. O motor ainda funciona. A pergunta é se é o mesmo motor que vai levar a empresa pelos próximos anos.",
        },
        {
          id: "paradas",
          rotulo: "Ficaram paradas",
          fala: "Parado, num mercado que anda, é andar para trás devagar. Vale entender se o problema está em quem compra ou em como você vende.",
          ponto: "As vendas pararam de crescer, e o mercado não espera quem fica parado.",
        },
        {
          id: "cairam",
          rotulo: "Caíram",
          fala: "Obrigado pela franqueza. É comum culpar a economia ou o governo, e às vezes eles pesam mesmo. Mas é preciso olhar também o que mudou dentro de casa.",
          ponto: "As vendas caíram no último ano. Antes de culpar a economia, vale olhar o que mudou dentro de casa.",
        },
        {
          id: "nao-sei",
          rotulo: "Não sei dizer",
          fala: "Tudo bem admitir. Mas guarde isto: número que você não mede é opinião.",
          ponto: "Você não sabe dizer como foram as vendas no último ano, e número que você não mede é opinião.",
        },
      ],
    },
    {
      numero: 4,
      tema: "digital",
      texto: "Quem cuida do digital da empresa hoje: site, redes sociais e anúncios?",
      opcoes: [
        {
          id: "eu-mesmo",
          rotulo: "Eu mesmo",
          fala: "Respeito quem põe a mão na massa. Só cuidado para o digital não virar mais uma tarefa que só você sabe fazer.",
        },
        {
          id: "equipe",
          rotulo: "Alguém da equipe",
          fala: "Bom ter alguém de casa. A pergunta é se essa pessoa sabe o que a empresa quer do digital, ou só publica o que dá tempo.",
        },
        {
          id: "agencia",
          rotulo: "Uma agência",
          fala: "Agência boa ajuda muito. O risco é a empresa não saber o que pedir nem como cobrar resultado. Você não construiu sua empresa para depender dos outros.",
          ponto: "O digital está nas mãos de uma agência, e a empresa precisa saber o que pedir e como cobrar.",
        },
        {
          id: "parente",
          rotulo: "Um filho ou sobrinho",
          fala: "Acontece muito, e quase sempre com boa intenção. Mas o digital da empresa não pode depender da agenda de alguém da família.",
          ponto: "O digital depende de alguém da família, e você não construiu sua empresa para depender dos outros.",
        },
        {
          id: "ninguem",
          rotulo: "Ninguém, na prática",
          fala: "Pelo menos é uma resposta honesta. Enquanto o digital não tem dono, o cliente que procura a sua empresa pode acabar encontrando outra.",
          ponto: "O digital da empresa está sem dono.",
        },
      ],
    },
    {
      numero: 5,
      tema: "custo-cliente",
      texto: "Você sabe quanto custa conquistar um cliente novo? Se souber, digite o valor. Se não, escolha uma resposta.",
      opcoes: [
        {
          id: "tenho-ideia",
          rotulo: "Tenho uma ideia, sem número exato",
          fala: "Ideia já é um começo. Mas, sem o número exato, fica difícil saber se cada cliente novo dá lucro ou só dá trabalho.",
          ponto: "O custo de conquistar um cliente é uma estimativa, não um número medido.",
        },
        {
          id: "nao-sei",
          rotulo: "Não sei",
          fala: "Obrigado pela franqueza. Esse é o número que diz se cada venda nova dá lucro ou só dá trabalho. Vale a pena descobrir.",
          ponto: "Você não sabe quanto custa conquistar um cliente, e sem esse número investir em venda vira aposta.",
        },
      ],
      campoNumero: {
        rotulo: "Custo por cliente novo",
        sufixo: "reais",
        min: 0,
        max: 1000000,
        fala: "Anotado: {valor} reais para conquistar um cliente novo. Você tem o número, e isso já muda a conversa. A próxima pergunta é se ele cabe na sua margem.",
      },
    },
    {
      numero: 6,
      tema: "equipe",
      texto: "E a equipe mais jovem: segue o que você decide ou faz do jeito dela?",
      opcoes: [
        {
          id: "segue",
          rotulo: "Segue, sem problema",
          fala: "Bom sinal. Aproveite essa confiança para levar alguém jovem para perto das decisões.",
        },
        {
          id: "segue-em-parte",
          rotulo: "Segue em parte",
          fala: "Acontece muito em empresa com várias gerações: concordam na reunião e fazem diferente depois.",
          ponto: "A equipe jovem segue só em parte, e falta uma linguagem comum entre as gerações.",
        },
        {
          id: "jeito-dela",
          rotulo: "Faz do jeito dela",
          fala: "Isso incomoda, eu sei. A liderança virou o cargo mais solitário. Mas quase sempre é falta de linguagem comum, não de respeito.",
          ponto: "A equipe mais jovem faz do jeito dela, e a autoridade precisa ser reconstruída com linguagem comum, não com cobrança.",
        },
        {
          id: "sem-jovens",
          rotulo: "Não tenho equipe jovem",
          fala: "Entendido. Uma hora a empresa vai precisar dessa geração, como equipe ou como cliente. Vale pensar nisso antes de precisar.",
        },
      ],
    },
    {
      numero: 7,
      tema: "sucessao",
      texto: "Se você precisasse se afastar amanhã, quem tocaria a empresa? A sucessão está planejada?",
      opcoes: [
        {
          id: "planejada",
          rotulo: "Está planejada",
          fala: "Essa é uma decisão que protege o legado. Vou só conferir se o resto da conversa acompanha esse plano.",
        },
        {
          id: "em-conversa",
          rotulo: "Começamos a conversar",
          fala: "Conversar já é mais do que adiar. O passo seguinte é pôr no papel: quem assume, quando e com quais números.",
          ponto: "A sucessão começou a ser conversada, mas ainda não está no papel.",
        },
        {
          id: "so-eu",
          rotulo: "Sem mim, a empresa para",
          fala: "Essa frase costuma vir com orgulho, e com razão: foi você quem construiu tudo. Mas empresa que só anda com o dono é um risco para o próprio legado.",
          ponto: "A empresa depende de você para funcionar, e isso é um risco para o legado.",
        },
        {
          id: "nao-pensei",
          rotulo: "Ainda não pensei nisso",
          fala: "Você não está sozinho nessa. Mas sucessão sem plano deixa o legado nas mãos do acaso.",
          ponto: "A sucessão não tem plano, e o legado fica nas mãos do acaso.",
        },
      ],
    },
    {
      numero: 8,
      tema: "prioridade",
      texto: "Última pergunta. Se pudesse resolver uma coisa na empresa a partir de amanhã, qual seria?",
      opcoes: [
        {
          id: "vender-mais",
          rotulo: "Vender mais",
          fala: "Justo. Antes de vender mais, vale saber de onde vem cada venda de hoje.",
          ponto: "Você quer vender mais, e o primeiro passo é saber de onde vem cada venda hoje.",
        },
        {
          id: "digital",
          rotulo: "Resolver o digital",
          fala: "Entendido. Resolver o digital não começa por trocar quem faz. Começa por decidir o que ele precisa entregar.",
          ponto: "Você quer resolver o digital, e isso começa por decidir o que ele precisa entregar, não por trocar quem faz.",
        },
        {
          id: "equipe",
          rotulo: "Acertar a equipe",
          fala: "Faz sentido. Muito problema que parece de venda começa na equipe.",
          ponto: "Você quer acertar a equipe, e isso começa por levar alguém jovem para perto das decisões.",
        },
        {
          id: "sucessao",
          rotulo: "Planejar a sucessão",
          fala: "É a escolha de quem pensa no legado. Não precisa ser tudo de uma vez, mas precisa começar.",
          ponto: "Você escolheu a sucessão como prioridade, e essa é a decisão que protege o legado.",
        },
        {
          id: "ja-decidi",
          rotulo: "Já decidi mudar a empresa",
          fala: "Então não faz sentido esperar. O principal requisito é a decisão de voltar a aprender para voltar a liderar, e essa você já tomou.",
          ponto: "Você já decidiu mudar, e agora falta método, não coragem.",
        },
      ],
    },
  ],
  livre: {
    rotulo: "Quer explicar melhor?",
    ajuda: "Opcional. Escreva com as suas palavras, sem nome, telefone nem documentos.",
  },
  naoEntendi: "Quero ter certeza de que entendi. Escolha a resposta que chega mais perto do seu caso, e seguimos.",
  responder: "Responder",
  enviando: "Enviando",
  confrontos: {
    "numeros-sem-custo":
      'Sobre as decisões, você disse "{antes}". Sobre o custo de um cliente novo, disse "{agora}". As duas coisas não andam juntas. Qual delas vale hoje?',
    "vendas-boas-problema-vender":
      'Sobre as vendas do último ano, você disse "{antes}". Agora, como prioridade, disse "{agora}". As duas coisas não andam juntas. Qual delas vale hoje?',
    "digital-terceirizado-quer-digital":
      'Sobre quem cuida do digital, você disse "{antes}". Agora, como prioridade, disse "{agora}". Se o digital está em boas mãos, ele não seria o primeiro problema. Qual das duas vale hoje?',
    "equipe-segue-mas-problema-equipe":
      'Sobre a equipe jovem, você disse "{antes}". Agora, como prioridade, disse "{agora}". As duas coisas não andam juntas. Qual delas vale hoje?',
    "sucessao-planejada-sem-numeros":
      'Sobre a sucessão, você disse "{antes}". Sobre os números da empresa, disse "{agora}". Sucessão planejada pede números que passem de mão em mão. Qual das duas vale hoje?',
    "experiencia-mas-vendas-caindo":
      'Sobre as decisões, você disse "{antes}". Sobre as vendas, disse "{agora}". Se a experiência decide e as vendas caem, talvez seja ela que precise de atualização. O que mudou no seu mercado?',
    "sabe-custo-mas-decide-no-feeling":
      'Sobre as decisões, você disse "{antes}". Sobre o custo de um cliente novo, você respondeu "{agora}". Se o número existe, por que a experiência decide sozinha? Qual dos dois manda hoje?',
    "sem-sucessao-prioridade-outra":
      'Sobre a sucessão, você disse "{antes}". Agora, como prioridade, escolheu "{agora}". Faz sentido, mas sucessão sem plano deixa o legado nas mãos do acaso. Quando essa conversa entra na pauta?',
  },
  encerrar: "Encerrar a conversa",
  encerrada: "Conversa encerrada. Obrigado pela franqueza. O próximo passo está logo abaixo.",
  erros: {
    limite:
      "Esta conversa chegou ao limite de respostas por agora. Tente de novo mais tarde ou siga para a inscrição na Jornada.",
    antirrobo: "Não consegui confirmar que é você, e não um robô. Recarregue a página e tente de novo.",
    indisponivel:
      "A conversa está fora do ar neste momento. Tente de novo em alguns minutos ou faça a sua inscrição na Jornada pelo formulário da página.",
  },
  fechamento: {
    titulo: "O papo reto sobre a sua empresa",
    abertura: "Você respondeu com franqueza, então vou fazer o mesmo. Aqui vai o que eu vi, em três pontos.",
    pontoPadrao: "Experiência sem atualização virou risco. Vale conferir as suas certezas com dados antes do próximo passo.",
  },
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
  altVideo: "Sidney Ferrér em vídeo, como o Gestor Sincero",
};
