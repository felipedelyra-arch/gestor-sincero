import type { PaginaEntrada } from "./schema";
import { legal } from "./legal";
import { site } from "../config/site";

// Nome do prêmio: fonte única em config/site.ts (pendente de confirmação do Ferrér).
const premio = site.premio.nomeConfirmado ?? site.premio.nomeNoCertificado;

// Copy final da página (seções 00 a 16). Versão para leitura e revisão do Ferrér: docs/COPY.md.
// Preço, datas, links e contatos não entram aqui: vêm de config/site.ts.
// O que depende do Ferrér usa "[PENDENTE FERRÉR]" e tem linha em docs/PERGUNTAS_FERRER.md.

const formularioBase = {
  consentimentos: {
    whatsapp: "Aceito receber conteúdos e convites do Gestor Sincero por WhatsApp. Posso cancelar quando quiser.",
    email: "Aceito receber conteúdos e convites do Gestor Sincero por e-mail. Posso cancelar quando quiser.",
    // também aparece como mensagem de erro quando a caixa fica desmarcada
    privacidade: "Li a política de privacidade e estou ciente de como meus dados serão usados.",
  },
  enviando: "Enviando",
  erros: {
    limite: "Recebemos muitas tentativas seguidas deste aparelho. Aguarde alguns minutos e envie de novo.",
    antirrobo: "A verificação de segurança não foi concluída. Recarregue a página e envie de novo.",
    indisponivel: "O envio falhou do nosso lado, e seus dados não foram gravados. Tente de novo em instantes.",
  },
};

const camposContato = {
  nome: { rotulo: "Nome", erro: "Escreva seu nome." },
  whatsapp: { rotulo: "WhatsApp", ajuda: "Com DDD. Pode digitar só os números.", erro: "Confira o número. Faltou o DDD ou algum dígito." },
  email: { rotulo: "E-mail", erro: "Confira o e-mail. Ele precisa ter o @ e o final do endereço." },
};

export const paginaBruta: PaginaEntrada = {
  seo: {
    titulo: "Gestor Sincero | Gestão Sem Maquiagem",
    descricao:
      "Educação executiva para empresários experientes que não aceitam ser espectadores da Nova Economia. Manual gratuito e Jornada Executiva com Sidney Ferrér.",
  },

  tarja: { texto: "Exclusivo para fundadores e executivos com mais de 45 anos" },

  topo: {
    variacoes: {
      a: {
        titulo: "O prazo de validade da sua gestão analógica acabou.",
        subtitulo:
          "Você continua sendo quem construiu a empresa. O que venceu foi o jeito de tocar o negócio. Receba o manual Gestão Sem Maquiagem e participe de três reuniões executivas com Sidney Ferrér, o Gestor Sincero.",
      },
      b: {
        titulo: "O problema nunca foi a idade. Foi a velocidade com que o mercado mudou.",
        subtitulo:
          "Para empresários experientes que não aceitam ser espectadores da Nova Economia. Comece pelo manual Gestão Sem Maquiagem e por três reuniões executivas com Sidney Ferrér, o Gestor Sincero.",
      },
    },
    chamadaPrincipal: { rotulo: "Quero meu manual e minha vaga na Jornada", destino: "captacao" },
    chamadaSecundaria: { rotulo: "Conhecer a mentoria", destino: "mentoria" },
    altFoto: "Sidney Ferrér, o Gestor Sincero, de terno escuro e braços cruzados",
    tituloVideo: "Sidney Ferrér apresenta o Gestor Sincero",
  },

  espelho: {
    titulo: "Você se reconhece?",
    introducao: "Marque o que é verdade hoje na sua empresa. Sem plateia e sem julgamento.",
    itens: [
      "As vendas caíram e ninguém na empresa consegue explicar o motivo.",
      "Concorrentes menores e mais novos estão crescendo na sua frente.",
      "O digital da empresa está na mão da agência, do sobrinho ou de um terceiro, e você não tem como avaliar o que entregam.",
      "A equipe mais jovem já não ouve você como ouvia.",
      "Sobram ferramentas e falta resultado.",
      "As decisões grandes ainda saem da intuição, sem número para conferir.",
      "A sucessão não tem plano, e a conversa vive sendo adiada.",
      'Você se pega dizendo "vou esperar, isso passa" com mais frequência do que gostaria.',
    ],
    contador: "{n} de {total} marcados",
    respostas: {
      nenhum: "Marque as frases que descrevem o seu momento.",
      poucos: "Poucos sinais. É a melhor hora para agir, com calma e antes que a pressa decida por você.",
      muitos:
        "Você não está sozinho, e isso nada diz sobre a sua capacidade. A liderança virou o cargo mais solitário. O mercado mudou depressa, e quase ninguém avisou quem estava ocupado tocando a empresa.",
    },
  },

  dados: {
    titulo: "Quem tem estrada segue gerando emprego neste país",
    itens: [
      { valor: "7,3%", descricao: "dos empreendedores têm 65 anos ou mais, o grupo com o maior índice de geração de emprego" },
      { valor: "20%", descricao: "são empregadores" },
      { valor: "71%", descricao: "têm de 1 a 5 funcionários" },
      { valor: "92%", descricao: "estão há mais de 2 anos no negócio" },
    ],
    fonte: "Sebrae/IBGE [PENDENTE FERRÉR: estudo e ano]",
    fechamento: "O problema nunca foi a idade. Foi a velocidade com que o mercado mudou.",
  },

  inimigo: {
    titulo: "O inimigo tem voz de prudência",
    introducao:
      "Ele não aparece no balanço nem bate à porta. Mora em frases razoáveis, ditas por gente séria, que adiam a decisão por mais um ano. E carrega uma crença antiga, a de que o mercado ainda recompensa as mesmas escolhas de 10 ou 20 anos atrás.",
    frases: [
      "Vou estudar depois.",
      "Meu sobrinho cuida das redes.",
      "Meu comercial resolve na raça.",
      "Vou esperar. Isso passa.",
      "Sempre fiz assim.",
    ],
    fechamento: "Experiência sem atualização virou risco.",
  },

  virada: {
    titulo: "Sua empresa não precisa nascer de novo. Precisa de um segundo motor.",
    paragrafos: [
      "Ninguém aqui vai pedir que você derrube o que levou décadas para erguer. O legado fica, assim como os clientes, o nome e a palavra dada.",
      "O que falta é criar, dentro da própria empresa, a versão digital do negócio. Um segundo motor de crescimento, ligado ao primeiro e comandado por você.",
      "Você não construiu sua empresa para depender dos outros.",
    ],
    comparativo: {
      titulo: "A mesma empresa, em duas versões",
      rotuloAnalogica: "Analógica",
      rotuloDigital: "Digital",
      pares: [
        { tema: "Site", analogica: "Um panfleto parado na internet", digital: "Uma máquina de vendas que trabalha todos os dias" },
        { tema: "Redes sociais", analogica: "Vitrine para mostrar produto", digital: "Canal de relacionamento com o cliente" },
        { tema: "Anúncios", analogica: "Impulsionamento no palpite", digital: "Investimento com desempenho medido" },
        { tema: "Canais de venda", analogica: "Cada um para um lado", digital: "Integrados, com o mesmo cliente e a mesma história" },
        { tema: "Cadastro de clientes", analogica: "Planilhas espalhadas", digital: "Sistema de gestão de clientes" },
        { tema: "Pós-venda", analogica: "Reage quando o cliente reclama", digital: "Procura o cliente antes do problema" },
        { tema: "Gestão", analogica: "Decide pela intuição", digital: "Decide olhando os dados" },
        { tema: "Liderança", analogica: "Centraliza tudo no dono", digital: "Ágil, com autonomia para a equipe" },
        { tema: "Contratação", analogica: "Escolhe pelo currículo", digital: "Escolhe pela capacidade de se adaptar" },
        { tema: "Retenção de pessoas", analogica: "Ficam por obrigação", digital: "Ficam por propósito" },
        { tema: "Erro", analogica: "É punido", digital: "Vira aprendizado" },
        { tema: "Responsabilidade socioambiental e governança (ESG)", analogica: "Fica no papel", digital: "Está na cultura" },
        { tema: "Métricas", analogica: "De vaidade, como curtidas e seguidores", digital: "De crescimento, como vendas e margem" },
        { tema: "Inovação", analogica: "Só lança quando está perfeito", digital: "Testa rápido e corrige" },
        { tema: "Estrutura", analogica: "Tudo instalado no escritório", digital: "Nuvem e inteligência artificial" },
        { tema: "Concorrência", analogica: "O vizinho do bairro", digital: "Qualquer empresa do mundo" },
        { tema: "Crise", analogica: "Hora de esperar passar", digital: "Hora de mudar a rota" },
      ],
    },
  },

  quemE: {
    titulo: "Quem é o Gestor Sincero",
    paragrafos: [
      "Gestor Sincero é o nome com que Sidney Ferrér assina o que aprendeu em quatro décadas de carreira. Ele começou na era do Telex e viu de dentro cada troca de regra do mercado, como executivo e como dono de empresa.",
      "Hoje comanda a S4 Marketing Digital de Resultados e faz uma ponte que pouca gente faz. De um lado, a velocidade dos jovens. Do outro, a visão estratégica e a experiência em crise de quem tem estrada. Ele traduz a Era Digital para quem cresceu sem internet.",
    ],
    credenciais: [
      "Growth hacker",
      "Dono da S4 Marketing Digital de Resultados",
      "Idealizador da Academia de Gestores",
      "Reitor da Escola de Inovação Aberta",
      "Diretor de arte",
      "Encarregado de dados (LGPD)",
      "Consultor e mentor de empresas nascentes",
      "Ex-secretário de Turismo",
      "MBAs em marketing digital, gestão de negócios e gestão de equipes",
      "Autor de 3 livros",
    ],
    tituloEh: "O que ele é",
    eh: [
      "Empresário sobrevivente",
      "Executivo",
      "Mentor de seniores e de jovens",
      "Tradutor da Era Digital para quem cresceu sem internet",
    ],
    tituloNaoEh: "O que ele não é",
    naoEh: ["Guru", "Coach", "Influenciador", "Vendedor de fórmula", "Empreendedor de palco"],
    frase: "Experiência sem atualização vira nostalgia.",
    premio: { nome: premio, descricao: `Portal Imprensa Brasileira, julho de ${site.premio.ano}` },
    tituloEmpresas: "Empresas por onde passou",
    empresas: ["Marfinite", "Purificadores Europa", "Guia do Imóvel", "Topvinil/Traffic", "Red Eventos (Jaguariúna Rodeo)", "Gráfica Brasil", "Revista Go Where!", "TIM", "Humano Educação"],
    altFoto: `Sidney Ferrér segurando o certificado do ${premio}`,
  },

  metodo: {
    titulo: "Método Empresas do Futuro",
    introducao: "Dez etapas em dois pilares. Primeiro muda a forma de pensar a empresa, depois a forma de operá-la.",
    pilares: [
      {
        nome: "Melhoria Contínua",
        descricao: "A mentalidade. O que precisa mudar na cabeça de quem decide antes de mudar na operação.",
        etapas: [
          { numero: 1, nome: "Empoderamento", descricao: "Retomar o comando e entender o digital o bastante para decidir sem intérprete." },
          { numero: 2, nome: "Posicionamento", descricao: "Definir como a empresa quer ser vista e escolhida no mercado de hoje." },
          { numero: 3, nome: "Engajamento", descricao: "Trazer a equipe, de todas as gerações, para dentro da mudança." },
          { numero: 4, nome: "Ecossistema", descricao: "Tratar clientes, parceiros e fornecedores como uma rede que faz o negócio crescer." },
        ],
      },
      {
        nome: "Empresa Digital",
        descricao: "A execução. A versão digital do negócio saindo do papel, uma etapa por vez.",
        etapas: [
          { numero: 5, nome: "Equipe", descricao: "Montar o time da versão digital, somando a velocidade dos jovens à visão de quem tem estrada." },
          { numero: 6, nome: "Pensamento Startup Enxuta", descricao: "Testar pequeno, medir e corrigir rápido, como fazem as empresas nascentes, antes de investir alto." },
          { numero: 7, nome: "Métodos", descricao: "Trocar o improviso por rotinas de trabalho que a equipe consegue repetir." },
          { numero: 8, nome: "Integração", descricao: "Ligar canais, sistemas e áreas para a informação parar de se perder no caminho." },
          { numero: 9, nome: "Escalabilidade", descricao: "Preparar a empresa para crescer sem que o custo e a confusão cresçam junto." },
          { numero: 10, nome: "Gamificação", descricao: "Usar metas, placar e reconhecimento para manter a equipe no jogo." },
        ],
      },
    ],
  },

  jornada: {
    titulo: "Jornada Executiva Gestão Sem Maquiagem",
    introducao:
      "Três reuniões ao vivo, com pauta e hora marcada, no formato de um conselho executivo. Sem palco e sem espetáculo. Quem se inscreve recebe também o manual Gestão Sem Maquiagem.",
    pautas: [
      {
        titulo: "Você não ficou velho, mas algumas ideias suas ficaram",
        descricao: "Uma conversa franca sobre as crenças que sustentaram a empresa por décadas e hoje seguram o crescimento.",
      },
      {
        titulo: "O manual que fez você vencer não foi escrito para o mundo de hoje",
        descricao: "O que mudou no jeito de vender, contratar e liderar, e por que repetir a receita antiga passou a ser arriscado.",
      },
      {
        titulo: "Como criar a versão digital da sua empresa sem destruir o legado",
        descricao: "O segundo motor de crescimento, do primeiro passo em diante. E a pergunta que fecha a Jornada: quanto custa não mudar agora?",
      },
    ],
    rotuloHorario: "Sempre às",
    datasPendentes: "Datas a confirmar. Quem se inscreve é avisado primeiro.",
    manual: {
      nome: "Manual Gestão Sem Maquiagem",
      descricao: "Gratuito para quem se inscreve na Jornada. A leitura que prepara você para as três reuniões.",
    },
    formulario: {
      ...formularioBase,
      titulo: "Receba o manual e reserve sua vaga na Jornada",
      introducao: "Usamos seu contato para enviar o manual e os avisos das três reuniões. Convites e conteúdos, só se você autorizar abaixo.",
      campos: {
        ...camposContato,
        empresa: { rotulo: "Empresa (opcional)", erro: "Confira o nome da empresa." },
        cargo: { rotulo: "Cargo (opcional)", erro: "Confira o cargo." },
      },
      enviar: "Quero meu manual e minha vaga na Jornada",
      sucesso: {
        titulo: "Inscrição confirmada",
        texto: "Sua vaga na Jornada está reservada. O manual e os avisos das reuniões chegam pelo contato que você informou.",
        baixarManual: "Baixar o manual agora",
      },
    },
  },

  dicionario: {
    titulo: "Dicionário do Internetês",
    introducao:
      "O mundo digital fala uma língua própria, e boa parte dela é nome novo para coisa que você conhece há anos. Esta é uma amostra do Dicionário do Internetês, o tradutor de gerações com 5.000 verbetes.",
    termos: [
      { termo: "Lead", traducao: "O interessado. Alguém que deixou nome e contato porque quer saber mais sobre o que você vende. Ainda não é cliente." },
      { termo: "Funil", traducao: "O caminho que a pessoa percorre de desconhecida a cliente. Muitos entram, poucos chegam ao fim, e o trabalho é descobrir onde os outros ficaram." },
      { termo: "CRM", traducao: "A velha caderneta de clientes, agora em sistema. Guarda quem comprou, o quê, quando e o que ficou combinado." },
      { termo: "Tráfego pago", traducao: "Anúncio pago na internet. Você paga para aparecer para quem procura o que você vende e fica sabendo quanto custou cada visita." },
      { termo: "Algoritmo", traducao: "O conjunto de regras que cada rede usa para decidir o que mostrar a cada pessoa. Funciona como um porteiro, que escolhe quem vê a sua empresa." },
      { termo: "Prompt", traducao: "O pedido que você escreve para a inteligência artificial. Pedido vago, resposta vaga, como acontece com qualquer funcionário." },
    ],
    avisoValidacao: "[PENDENTE FERRÉR: validar a amostra] Amostra a validar pelo Ferrér", // some em produção
    prova: `No ${premio} de ${site.premio.ano}, Sidney Ferrér presenteou todos os homenageados com um exemplar do Dicionário do Internetês.`,
  },

  ressonancia: {
    seo: {
      titulo: "Ressonância Digital | Gestor Sincero",
      descricao: "O diagnóstico de marketing, gestão e vendas da S4: 52 temas em 9 fases, com nota, prioridades e plano. Solicite o da sua empresa.",
    },
    resumo: {
      linhas: [
        "Assim como uma ressonância médica revela estruturas que os olhos não enxergam, a Ressonância Digital mostra o que a rotina esconde dentro da sua empresa.",
        "É o diagnóstico de marketing, gestão e vendas da S4, com 52 temas examinados em 9 fases.",
      ],
      rotuloBotao: "Conhecer a Ressonância Digital",
    },
    titulo: "Ressonância Digital",
    analogia: "Assim como uma ressonância médica revela estruturas que os olhos não enxergam…",
    paragrafos: [
      "A Ressonância Digital mostra o que a rotina esconde dentro da sua empresa. É o diagnóstico de marketing, gestão e vendas da S4, com 52 temas examinados em 9 fases.",
      "Você recebe um retrato com nota, evidências e ordem de prioridade. A decisão continua sendo sua, agora com os exames na mesa.",
    ],
    altCapa: "Capa do estudo Ressonância Digital, da S4 Marketing Digital",
    tituloFases: "As 9 fases do exame",
    fases: [
      { letra: "A", nome: "Diagnóstico e visão macro", descricao: "O momento da empresa e o cenário em que ela compete." },
      { letra: "B", nome: "Capacidades e capital humano", descricao: "O que a equipe sabe fazer hoje e o que falta para a próxima fase." },
      { letra: "C", nome: "Cliente", descricao: "Quem compra, por que compra e por que deixa de comprar." },
      { letra: "D", nome: "Marca e proposta de valor", descricao: "Como a empresa é percebida e o que promete entregar." },
      { letra: "E", nome: "Estratégia de mercado e vendas", descricao: "Onde a empresa escolhe competir e como pretende vender." },
      { letra: "F", nome: "Marketing, canais e operação comercial", descricao: "Como a empresa atrai, atende e fecha negócio no dia a dia." },
      { letra: "G", nome: "Oferta, preço e retenção", descricao: "O que se vende, por quanto, e o que faz o cliente voltar." },
      { letra: "H", nome: "Saúde financeira", descricao: "Receita, margem e caixa, vistos sem maquiagem." },
      { letra: "I", nome: "Processos, tecnologia e escala", descricao: "O que sustenta a operação e o que impede a empresa de crescer." },
    ],
    tituloEntregas: "O que você recebe",
    entregas: [
      { nome: "Nota de 0 a 100", descricao: "Uma medida única da maturidade da empresa, para acompanhar a evolução ao longo do tempo." },
      { nome: "Prontuários por tema", descricao: "O que foi encontrado em cada tema examinado, com as evidências." },
      { nome: "Plano de prioridades B.A.S.I.C.O.", descricao: "O que atacar primeiro e o que pode esperar, em ordem." },
      { nome: "Rituais de governança", descricao: "As reuniões e os acompanhamentos que mantêm o plano de pé depois da entrega." },
      { nome: "Diagnóstico de implantação de IA", descricao: "Onde a inteligência artificial cabe na sua operação e onde ainda não cabe." },
    ],
    tituloEtapas: "Como o estudo acontece",
    etapas: [
      { nome: "Cartas na mesa", descricao: "A conversa inicial, em que você conta onde a empresa está e aonde quer chegar." },
      { nome: "Imersão e busca de dados", descricao: "A S4 levanta os números e as informações de cada área." },
      { nome: "Análise de marketing, gestão e vendas", descricao: "Os 52 temas são examinados, um a um." },
      { nome: "Diagnóstico da próxima curva", descricao: "A leitura final, com o caminho recomendado para a próxima fase da empresa." },
    ],
    prazo: "Estudo avaliado em 45 a 60 dias",
    previa: {
      titulo: "Como o diagnóstico chega às suas mãos",
      selo: "Simulação com dados fictícios",
      slides: [
        { arquivo: "slide-04", legenda: "Visão executiva. A empresa em uma tela, com o resultado do mês, o ritmo de crescimento e o ponto que pede atenção." },
        { arquivo: "slide-06", legenda: "Síntese de maturidade. Uma nota por área mostra onde concentrar a atenção." },
        { arquivo: "slide-17", legenda: "Excelência operacional. Capacidade de entrega, pessoas, processos e tecnologia." },
        { arquivo: "slide-20", legenda: "Estratégia de crescimento. Mercado, cenários e o plano dos próximos 90 dias." },
      ],
    },
    chamada: { rotulo: "Solicitar a Ressonância da minha empresa", destino: "ressonancia" },
    formulario: {
      ...formularioBase,
      titulo: "Solicite a Ressonância da sua empresa",
      introducao: "Enviar o pedido não gera compromisso. A equipe da S4 lê as informações e retorna pelo contato que você informar.",
      campos: {
        ...camposContato,
        empresa: { rotulo: "Empresa", erro: "Escreva o nome da empresa." },
        segmento: { rotulo: "Segmento", ajuda: "Por exemplo, indústria, comércio ou serviços.", erro: "Escreva o segmento da empresa." },
        faixaFaturamento: { rotulo: "Faturamento anual", ajuda: "Serve só para dimensionar o estudo.", erro: "Escolha uma faixa de faturamento." },
        numeroFuncionarios: { rotulo: "Número de funcionários", erro: "Escolha uma faixa de funcionários." },
        principalDesafio: { rotulo: "Principal desafio hoje", ajuda: "Duas ou três linhas bastam.", erro: "Conte em poucas linhas o principal desafio da empresa." },
      },
      opcoes: {
        faixaFaturamento: {
          "ate-360-mil": "Até R$ 360 mil",
          "360-mil-a-4-8-milhoes": "De R$ 360 mil a R$ 4,8 milhões",
          "4-8-a-30-milhoes": "De R$ 4,8 milhões a R$ 30 milhões",
          "acima-de-30-milhoes": "Acima de R$ 30 milhões",
          "prefiro-nao-informar": "Prefiro não informar",
        },
        numeroFuncionarios: { "1-5": "1 a 5", "6-20": "6 a 20", "21-50": "21 a 50", "51-200": "51 a 200", "mais-de-200": "Mais de 200" },
      },
      enviar: "Solicitar a Ressonância da minha empresa",
      sucesso: {
        titulo: "Pedido recebido",
        texto: "A equipe da S4 vai ler o que você enviou e retornar pelo contato informado para combinar a primeira conversa.",
      },
    },
  },

  oferta: {
    titulo: "Mentoria Empresas do Futuro",
    introducao:
      "Seis meses de educação executiva para criar a versão digital da sua empresa, com o método das 10 etapas e o acompanhamento de quem já esteve na sua cadeira.",
    inclui: [
      "6 meses de mentoria com Sidney Ferrér",
      "Método Empresas do Futuro, com as 10 etapas nos 2 pilares",
      "Área de membros",
      "Encontros da mentoria",
    ],
    tituloBonus: "Bônus",
    bonus: [
      "Mais 6 meses de acesso para você e 2 pessoas da sua equipe",
      "Livro Empresas do Futuro, da Editora S4, em versão física e digital, com frete incluso",
      "Apostilas das 10 etapas",
      "2 reuniões extras com o Sidney",
      "Dicionário do Internetês, com acesso vitalício",
      "Aula magna",
    ],
    tituloPlano: "Plano de sucesso do aluno",
    planoDeSucesso: [
      "Reserve 1 hora por semana",
      "Leve junto alguém jovem da sua equipe",
      "Aplique no seu ritmo",
      "Participe dos encontros",
      "Você não precisa virar especialista",
    ],
    garantia: {
      nome: "Garantia de 7 dias",
      descricao: "Você tem 7 dias, contados da compra, para desistir e receber de volta o valor pago. Não precisa explicar o motivo.",
    },
    rotuloPreco: "Investimento",
    precoPendente: "Valor a confirmar",
    chamada: { rotulo: "Entrar para a Mentoria Empresas do Futuro", destino: "checkout" },
    ofertaPosterior: "Depois da inscrição, você pode incluir 12 meses da revista digital Gestão & Convergência.",
  },

  paraQuem: {
    titulo: "Para quem é e para quem não é",
    tituloEh: "É para você se",
    eh: [
      "Você fundou, herdou ou dirige uma empresa e quer voltar a crescer",
      "Quer entender a Era Digital sem virar técnico",
      "Cansou de depender de agência, sobrinho ou terceiros para decidir",
      "Lidera uma equipe de várias gerações e quer ser ouvido por todas",
      "Pensa na sucessão e quer passar adiante um negócio vivo",
    ],
    tituloNaoEh: "Não é para você se",
    naoEh: [
      "Procura fórmula mágica ou resultado sem trabalho",
      "Quer que alguém resolva o digital sem a sua participação",
      "Acredita que o mercado vai voltar a ser o que era",
      "Não está disposto a rever nenhuma crença",
    ],
    tituloRequisitos: "Requisitos",
    requisitos: [
      "Saber ler e estudar",
      "Familiaridade básica com celular e internet",
      "Abertura para rever crenças",
      "Atitude e humildade",
      "Não é preciso entender de tecnologia, inteligência artificial ou marketing",
    ],
    fraseRequisito: "O principal requisito é a decisão de voltar a aprender para voltar a liderar.",
  },

  // oculto enquanto `itens` estiver vazio; só entram depoimentos reais e autorizados
  depoimentos: { titulo: "Quem já passou pela mentoria", itens: [] },

  perguntas: {
    titulo: "Perguntas frequentes",
    itens: [
      {
        pergunta: "Preciso entender de tecnologia?",
        resposta:
          "Não. Você não precisa entender de tecnologia, de inteligência artificial nem de marketing. Precisa saber ler e estudar, usar o celular e a internet no básico e estar aberto a rever algumas crenças. O objetivo é você decidir bem, e o trabalho técnico continua com os técnicos.",
      },
      {
        pergunta: "Tenho pouco tempo",
        resposta:
          "O plano da mentoria pede 1 hora por semana, e você aplica no seu ritmo. Levar alguém jovem da equipe ajuda bastante: ele executa enquanto você decide.",
      },
      {
        pergunta: "Isso é curso online?",
        resposta:
          "Não. É educação executiva. A Jornada são três reuniões ao vivo, com pauta de conselho. A mentoria dura 6 meses, segue um método de 10 etapas e tem encontros com o Sidney, sempre voltada para a sua empresa.",
      },
      {
        pergunta: "E se não servir para mim?",
        resposta:
          "A mentoria tem garantia de 7 dias. Se nesse prazo você concluir que não é para você, pede o cancelamento e recebe de volta o valor pago.",
      },
      {
        pergunta: "Minha equipe pode participar?",
        resposta:
          "Pode, e é recomendado. Entre os bônus da mentoria está o acesso para você e mais 2 pessoas da sua equipe. O plano de sucesso sugere levar junto alguém jovem, que ajuda na aplicação.",
      },
      {
        pergunta: "A S4 pode fazer a parte digital por mim?",
        resposta:
          "A S4 começa pelo diagnóstico. A Ressonância Digital mostra o que precisa ser feito e em que ordem. O que a S4 executa depois disso: [PENDENTE FERRÉR]. Em qualquer caso, a mentoria existe para você delegar sabendo o que pedir e o que cobrar.",
      },
      { pergunta: "As reuniões ficam gravadas?", resposta: "[PENDENTE FERRÉR]" },
    ],
  },

  fechamento: {
    frases: [
      "Quanto custa continuar sem entender as novas regras?",
      "Afrouxem a gravata e arregacem as mangas! Antes que terceiros decidam o destino da empresa.",
    ],
    texto: "Para o sênior, mudar é difícil… mas na Era Digital não mudar é fatal. O primeiro passo é pequeno: um manual e três reuniões.",
    chamada: { rotulo: "Quero meu manual e minha vaga na Jornada", destino: "captacao" },
  },

  rodape: {
    descricao: "Gestor Sincero é a marca de Sidney Ferrér. Educação executiva para empresários experientes que não aceitam ser espectadores da Nova Economia.",
    marcas: [
      { nome: "S4 Marketing Digital de Resultados", descricao: "A empresa de Sidney Ferrér, responsável pela Ressonância Digital." },
      { nome: "Academia de Gestores", descricao: "Educação executiva para empresários e gestores, idealizada por Sidney Ferrér." },
      { nome: "Escola de Inovação Aberta", descricao: "Escola da qual Sidney Ferrér é reitor." },
    ],
    rotuloContatos: "Contatos",
    rotuloCnpj: "CNPJ",
    rotuloPrivacidade: "Política de privacidade",
    rotuloTermos: "Termos de uso",
    direitos: "Todos os direitos reservados",
  },

  legal,

  whatsapp: {
    rotuloBotao: "Falar pelo WhatsApp",
    mensagem: "Olá. Vim pela página do Gestor Sincero e quero entender qual é o melhor primeiro passo para a minha empresa.",
  },
  navegacao: {
    rotuloMenu: "Menu",
    itens: [
      { rotulo: "Quem é", ancora: "#quem-e" },
      { rotulo: "Método", ancora: "#metodo" },
      { rotulo: "Jornada", ancora: "#jornada" },
      { rotulo: "Ressonância", ancora: "#ressonancia" },
      { rotulo: "Mentoria", ancora: "#mentoria" },
    ],
    chamada: { rotulo: "Quero meu manual", destino: "captacao" },
  },
  rotulos: { verTodos: "Ver todos", verMenos: "Ver menos", anterior: "Anterior", proximo: "Próximo" },
  pularParaConteudo: "Pular para o conteúdo",
  cookies: {
    texto: "Cookies de medição das visitas só são gravados se você aceitar.",
    aceitar: "Aceitar cookies",
    recusar: "Recusar cookies",
    rotuloPolitica: "Ler a política de privacidade",
  },
};
