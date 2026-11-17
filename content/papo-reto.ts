import type { PapoRetoEntrada } from "./schema";

// Textos do "Papo reto com o Gestor Sincero" (ADR 0003): conversa por opções, falas pré-escritas.
// Os `id` das opções e as chaves de `confrontos` são lidos por src/server/papo-reto/regras.ts; tabela em docs/persona-ferrer.md.
// Nos confrontos, {antes} e {agora} viram os rótulos das respostas, por isso vão entre aspas.
export const papoRetoBruto: PapoRetoEntrada = {
  rotuloBotao: "Conversar com o Gestor Sincero",
  titulo: "Papo reto com o Gestor Sincero",
  avisos: {
    roteiro:
      "Assistente com a imagem de Sidney Ferrér, usada com autorização. As respostas são geradas por regras e não substituem uma consultoria.",
    comIA:
      'Assistente com a imagem de Sidney Ferrér, usada com autorização. As respostas são geradas por regras e não substituem uma consultoria. Se você escrever ou responder por áudio, um assistente de inteligência artificial transcreve e lê a sua resposta para entendê-la. O áudio não é guardado.',
  },
  consentimento: {
    texto:
      "Posso guardar esta conversa? Se você aceitar, as suas respostas ficam guardadas cifradas por 30 dias e depois são apagadas. Se recusar, nada é guardado e a conversa funciona do mesmo jeito. Não escreva nome, documentos, senhas nem dados de saúde.",
    aceitar: "Pode guardar",
    recusar: "Não guardar",
  },
  comecar: "Começar a conversa",
  abertura:
    "Muito prazer, eu sou o Gestor Sincero. São oito perguntas rápidas sobre a sua empresa, quase todas com resposta para escolher. Vou ser franco com você: se uma resposta brigar com outra, eu aviso. No fim, você leva um papo reto em três pontos e a minha sugestão de próximo passo. Combinado?",
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
        fala: "Anos de mercado: {valor}. Anotado. Agora pense comigo: quanta regra do mercado mudou nesse tempo? E a empresa, mudou junto ou ficou esperando passar?",
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
          fala: "Decide olhando os números. Então guarde bem essa resposta, que daqui a pouco eu volto nela.",
        },
        {
          id: "experiencia",
          rotulo: "Mais da minha experiência",
          fala: "Experiência é patrimônio, ninguém tira isso de você. O perigo é deixar que ela decida sozinha num mercado que trocou as regras no meio do jogo. Seu feeling já não basta.",
          ponto: "As decisões grandes saem da sua experiência, e experiência sem atualização virou risco.",
        },
        {
          id: "um-pouco-de-cada",
          rotulo: "Um pouco de cada",
          fala: "Resposta honesta. Agora me diga: quando os números apontam para um lado e a sua experiência para o outro, quem ganha a discussão?",
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
          fala: "Bom, o motor ainda funciona. Só fica uma pergunta: é o mesmo motor que vai levar a empresa pelos próximos anos?",
        },
        {
          id: "paradas",
          rotulo: "Ficaram paradas",
          fala: "Ficar parado num mercado que anda é andar para trás devagar. Falta descobrir se o problema está em quem compra ou em como você vende.",
          ponto: "As vendas pararam de crescer, e o mercado não espera quem fica parado.",
        },
        {
          id: "cairam",
          rotulo: "Caíram",
          fala: "Obrigado pela franqueza. A culpa costuma ir para a economia, para o governo, para os jovens. Às vezes eles pesam mesmo. Mas alguém já olhou o que mudou dentro de casa?",
          ponto: "As vendas caíram no último ano. Antes de culpar a economia, vale olhar o que mudou dentro de casa.",
        },
        {
          id: "nao-sei",
          rotulo: "Não sei dizer",
          fala: "Pelo menos você admite, e isso já é um começo. Mas guarde isto: número que você não mede é opinião.",
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
          fala: "Respeito quem põe a mão na massa. Só cuidado para o digital não virar mais uma gaveta que só você sabe abrir.",
        },
        {
          id: "equipe",
          rotulo: "Alguém da equipe",
          fala: "Bom ter alguém de casa. A pergunta é se essa pessoa sabe o que a empresa quer do digital ou só publica o que deu tempo de fazer.",
        },
        {
          id: "agencia",
          rotulo: "Uma agência",
          fala: "Agência boa ajuda muito. O perigo é a empresa não saber o que pedir nem como cobrar. Aí o relatório chega bonito todo mês, e ninguém sabe dizer quanto ele vendeu. Você não construiu sua empresa para depender dos outros.",
          ponto: "O digital está nas mãos de uma agência, e a empresa precisa saber o que pedir e como cobrar.",
        },
        {
          id: "parente",
          rotulo: "Um filho ou sobrinho",
          fala: "Acontece nas melhores famílias, e quase sempre com boa intenção. Mas o digital da empresa não pode ficar para a folga de alguém da família.",
          ponto: "O digital depende de alguém da família, e você não construiu sua empresa para depender dos outros.",
        },
        {
          id: "ninguem",
          rotulo: "Ninguém, na prática",
          fala: "Pelo menos é sincero. Agora pense: enquanto o digital não tem dono, o cliente que procura a sua empresa na internet encontra quem? O concorrente.",
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
          fala: "Ideia já é um começo. Mas, sem o número exato, como você sabe se cada cliente novo dá lucro ou só dá trabalho?",
          ponto: "O custo de conquistar um cliente é uma estimativa, não um número medido.",
        },
        {
          id: "nao-sei",
          rotulo: "Não sei",
          fala: "Obrigado pela franqueza. Esse é o número que diz se cada venda nova paga a conta. Sem ele, investir em venda vira aposta.",
          ponto: "Você não sabe quanto custa conquistar um cliente, e sem esse número investir em venda vira aposta.",
        },
      ],
      campoNumero: {
        rotulo: "Custo por cliente novo",
        sufixo: "reais",
        min: 0,
        max: 1000000,
        fala: "Custo por cliente novo: R$ {valor}. Anotado. Você tem o número na mão, e isso muda a conversa. A pergunta agora é se ele cabe na sua margem.",
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
          fala: "Bom sinal. Aproveite essa confiança e traga alguém jovem para perto das decisões.",
        },
        {
          id: "segue-em-parte",
          rotulo: "Segue em parte",
          fala: "Conheço bem essa cena. Todo mundo concorda na reunião e, no corredor, faz diferente.",
          ponto: "A equipe jovem segue só em parte, e falta uma linguagem comum entre as gerações.",
        },
        {
          id: "jeito-dela",
          rotulo: "Faz do jeito dela",
          fala: "Isso incomoda, eu sei. A liderança virou o cargo mais solitário. Mas o problema costuma ser falta de linguagem comum, não de respeito.",
          ponto: "A equipe mais jovem faz do jeito dela, e a autoridade precisa ser reconstruída com linguagem comum, não com cobrança.",
        },
        {
          id: "sem-jovens",
          rotulo: "Não tenho equipe jovem",
          fala: "Entendido. Mas uma hora essa geração chega, como equipe ou como cliente. Melhor pensar nisso antes de precisar.",
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
          fala: "Essa decisão protege o legado. Vou só conferir se o resto da conversa acompanha esse plano.",
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
          fala: "Essa frase costuma vir com orgulho, e com razão: foi você quem construiu tudo. Mas empresa que só anda com o dono é um risco para o próprio legado. E se amanhã você precisar parar?",
          ponto: "A empresa depende de você para funcionar, e isso é um risco para o legado.",
        },
        {
          id: "nao-pensei",
          rotulo: "Ainda não pensei nisso",
          fala: "Você não está sozinho nessa, é uma conversa que dá vontade de deixar para depois. Mas sucessão sem plano deixa o legado nas mãos do acaso.",
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
          fala: "Justo. Mas, antes de vender mais, me diga: você sabe de onde vem cada venda de hoje?",
          ponto: "Você quer vender mais, e o primeiro passo é saber de onde vem cada venda hoje.",
        },
        {
          id: "digital",
          rotulo: "Resolver o digital",
          fala: "Entendido. Resolver o digital não começa por trocar de agência ou de sobrinho. Começa por decidir o que ele precisa entregar.",
          ponto: "Você quer resolver o digital, e isso começa por decidir o que ele precisa entregar, não por trocar quem faz.",
        },
        {
          id: "equipe",
          rotulo: "Acertar a equipe",
          fala: "Faz sentido. Muito problema que parece de venda nasce na equipe.",
          ponto: "Você quer acertar a equipe, e isso começa por levar alguém jovem para perto das decisões.",
        },
        {
          id: "depender-de-terceiros",
          rotulo: "Parar de depender de terceiros",
          fala: "Você não construiu sua empresa para depender dos outros. O primeiro passo é separar o que só a empresa pode decidir do que pode ficar com alguém de fora.",
          ponto: "Você quer parar de depender de terceiros, e isso começa por separar o que só a empresa pode decidir.",
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
  conversa: {
    campo: "Escreva a sua resposta",
    enviar: "Enviar resposta",
    gravar: "Responder por áudio",
    pararGravacao: "Parar e enviar o áudio",
    gravando: "Gravando. Fale e toque de novo para enviar.",
    transcrevendo: "Ouvindo o seu áudio",
    semMicrofone: "Não consegui usar o microfone. Escreva a resposta ou escolha uma das opções.",
    audioNaoEntendido: "Não peguei o que você disse. Pode repetir, mais perto do microfone, ou escrever?",
    ouvirFalas: "Ouvir as respostas em voz alta",
    silenciarFalas: "Silenciar a voz",
    semVoz: "Este navegador não tem voz instalada, então não consigo falar aqui. No celular a voz funciona.",
    sugestoes: "Respostas rápidas",
  },
  naoEntendi: "Quero ter certeza de que entendi direito. Escolha a resposta que chega mais perto do seu caso, e seguimos.",
  responder: "Responder",
  enviando: "Enviando",
  confrontos: {
    "numeros-sem-custo":
      'Sobre as decisões, você disse "{antes}". Sobre o custo de um cliente novo, disse "{agora}". Decide pelos números sem ter esse número na mão? Qual das duas vale hoje?',
    "vendas-boas-problema-vender":
      'Sobre as vendas do último ano, você disse "{antes}". Agora, como prioridade, escolheu "{agora}". Se as vendas vão bem, por que vender é o primeiro problema? Qual das duas vale hoje?',
    "digital-terceirizado-quer-digital":
      'Sobre quem cuida do digital, você disse "{antes}". Agora, como prioridade, escolheu "{agora}". Se o digital estivesse em boas mãos, ele não seria o primeiro problema. Qual das duas vale hoje?',
    "equipe-segue-mas-problema-equipe":
      'Espera aí. Sobre a equipe jovem, você disse "{antes}". Agora, como prioridade, escolheu "{agora}". Equipe que segue sem problema não costuma ser a primeira dor. Qual das duas vale hoje?',
    "sucessao-planejada-sem-numeros":
      'Sobre os números da empresa, você disse "{antes}". Agora, sobre a sucessão, disse "{agora}". Sucessão planejada pede números que passem de mão em mão. Sem eles, o sucessor herda o quê? Qual das duas vale hoje?',
    "experiencia-mas-vendas-caindo":
      'Sobre as decisões, você disse "{antes}". Sobre as vendas, disse "{agora}". Se é a experiência que decide e as vendas caem, talvez seja ela que esteja pedindo atualização. O que mudou no seu mercado?',
    "sabe-custo-mas-decide-no-feeling":
      'Sobre as decisões, você disse "{antes}". Sobre o custo de um cliente novo, você respondeu "{agora}". Tem o número na mão e deixa a experiência decidir sozinha? Qual dos dois manda hoje?',
    "sem-sucessao-prioridade-outra":
      'Sobre a sucessão, você disse "{antes}". Agora, como prioridade, escolheu "{agora}". Faz sentido, mas sucessão sem plano deixa o legado nas mãos do acaso. Quando essa conversa entra na pauta?',
    "cuida-digital-mas-depende-de-terceiros":
      'Sobre quem cuida do digital, você disse "{antes}". Agora, como prioridade, escolheu "{agora}". Se o digital está nas suas mãos, de quem exatamente a empresa depende? Qual das duas vale hoje?',
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
    abertura: "Você respondeu com franqueza, então vou retribuir. Aqui vai o que eu vi, em três pontos e direto ao assunto.",
    pontoPadrao: "Experiência sem atualização virou risco. Vale conferir as suas certezas com dados antes do próximo passo.",
  },
  recomendacoes: {
    jornada: {
      texto:
        "Meu conselho é começar pela Jornada Executiva Gestão Sem Maquiagem. São três reuniões ao vivo, com o manual gratuito, para rever essas ideias com calma antes de decidir qualquer coisa.",
      rotuloBotao: "Quero o manual e a vaga",
    },
    ressonancia: {
      texto:
        "Pelo que você contou, falta enxergar a empresa por dentro, com dados e não no achismo. A Ressonância Digital da S4 examina marketing, gestão e vendas em 52 temas e mostra por onde começar.",
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
