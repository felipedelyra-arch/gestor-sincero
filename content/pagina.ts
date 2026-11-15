import type { PaginaEntrada } from "./schema";

// TEXTO PROVISÓRIO do orquestrador, só para o Front-end montar o layout.
// O terminal Conteúdo substitui tudo pelo copy final (pode dividir em vários arquivos,
// desde que content/index.ts continue exportando `pagina`).

const P = "[PROVISÓRIO]";

const formularioBase = {
  consentimentos: {
    whatsapp: `${P} Aceito receber mensagens do Gestor Sincero por WhatsApp.`,
    email: `${P} Aceito receber e-mails do Gestor Sincero.`,
    privacidade: `${P} Li e estou ciente da política de privacidade.`,
  },
  enviando: "Enviando",
  erros: {
    limite: `${P} Muitas tentativas. Aguarde alguns minutos e envie de novo.`,
    antirrobo: `${P} Não foi possível confirmar o envio. Recarregue a página e tente de novo.`,
    indisponivel: `${P} O envio falhou do nosso lado. Tente de novo em instantes.`,
  },
};

const camposContato = {
  nome: { rotulo: "Nome", erro: `${P} Informe seu nome.` },
  whatsapp: { rotulo: "WhatsApp", ajuda: "Com DDD", erro: `${P} Informe um número com DDD.` },
  email: { rotulo: "E-mail", erro: `${P} Informe um e-mail válido.` },
};

export const paginaBruta: PaginaEntrada = {
  seo: {
    titulo: "Gestor Sincero | Gestão Sem Maquiagem",
    descricao: `${P} Educação executiva para empresários experientes que não aceitam ser espectadores da Nova Economia.`,
  },

  tarja: { texto: "Exclusivo para fundadores e executivos com mais de 45 anos" },

  topo: {
    variacoes: {
      a: {
        titulo: "O prazo de validade da sua gestão analógica acabou.",
        subtitulo: `${P} Para empresários experientes que não aceitam ser espectadores da Nova Economia.`,
      },
      b: {
        titulo: "O problema nunca foi a idade. Foi a velocidade com que o mercado mudou.",
        subtitulo: `${P} Para empresários experientes que não aceitam ser espectadores da Nova Economia.`,
      },
    },
    chamadaPrincipal: { rotulo: "Quero meu manual e minha vaga na Jornada", destino: "captacao" },
    chamadaSecundaria: { rotulo: "Conhecer a mentoria", destino: "mentoria" },
    altFoto: "Sidney Ferrér, o Gestor Sincero, de terno escuro e braços cruzados",
    tituloVideo: `${P} Apresentação do Gestor Sincero`,
  },

  espelho: {
    titulo: "Você se reconhece?",
    introducao: `${P} Marque o que acontece hoje na sua empresa.`,
    itens: [
      `${P} As vendas caíram e ninguém sabe explicar o motivo.`,
      `${P} Concorrentes menores estão crescendo mais rápido.`,
      `${P} O digital da empresa depende de agência, sobrinho ou terceiros.`,
      `${P} A equipe jovem já não ouve como antes.`,
      `${P} Há ferramentas demais e resultado de menos.`,
      `${P} As decisões ainda saem do feeling.`,
      `${P} A sucessão não tem plano.`,
      `${P} "Vou esperar, isso passa" virou resposta padrão.`,
    ],
    contador: "{n} de {total} marcados",
    respostas: {
      nenhum: `${P} Marque os itens para ver a leitura.`,
      poucos: `${P} Poucos sinais, e bom momento para agir cedo.`,
      muitos: `${P} Você não está sozinho. O jogo mudou rápido.`,
    },
  },

  dados: {
    titulo: `${P} Quem tem experiência ainda sustenta boa parte do emprego no país`,
    itens: [
      { valor: "7,3%", descricao: `${P} dos empreendedores têm 65 anos ou mais` },
      { valor: "20%", descricao: `${P} são empregadores` },
      { valor: "92%", descricao: `${P} estão há mais de 2 anos no negócio` },
    ],
    fonte: "Sebrae/IBGE [PENDENTE FERRÉR: estudo e ano]",
    fechamento: "O problema nunca foi a idade. Foi a velocidade com que o mercado mudou.",
  },

  inimigo: {
    titulo: `${P} A procrastinação disfarçada de prudência`,
    introducao: `${P} As frases que adiam a decisão.`,
    frases: ["Vou estudar depois.", "Meu sobrinho cuida das redes.", "Meu comercial resolve na raça.", "Sempre fiz assim."],
    fechamento: "Experiência sem atualização virou risco.",
  },

  virada: {
    titulo: `${P} A versão digital da sua empresa`,
    paragrafos: [`${P} Não é preciso destruir o legado nem começar do zero. É preciso criar, dentro da empresa, um segundo motor de crescimento.`],
    comparativo: {
      titulo: `${P} Empresa analógica e empresa digital`,
      rotuloAnalogica: "Analógica",
      rotuloDigital: "Digital",
      pares: [
        { tema: "Site", analogica: "Panfleto", digital: "Máquina de vendas" },
        { tema: "Redes sociais", analogica: "Vitrine", digital: "Relacionamento" },
        { tema: "Anúncios", analogica: "Impulsionamento no feeling", digital: "Performance" },
        { tema: "Canais", analogica: "Desconectados", digital: "Integrados" },
        { tema: "Clientes", analogica: "Planilhas", digital: "Sistema de gestão de clientes" },
        { tema: "Pós-venda", analogica: "Reativo", digital: "Proativo" },
        { tema: "Gestão", analogica: "Por feeling", digital: "Por dados" },
        { tema: "Liderança", analogica: "Centralizadora", digital: "Ágil" },
        { tema: "Contratação", analogica: "Por currículo", digital: "Por adaptabilidade" },
        { tema: "Retenção", analogica: "Por obrigação", digital: "Por propósito" },
        { tema: "Erro", analogica: "Punido", digital: "Aprendizado" },
        { tema: "ESG", analogica: "No papel", digital: "Na cultura" },
        { tema: "Métricas", analogica: "De vaidade", digital: "De crescimento" },
        { tema: "Inovação", analogica: "Pela perfeição", digital: "Pelo teste rápido" },
        { tema: "Estrutura", analogica: "Local", digital: "Nuvem e IA" },
        { tema: "Concorrência", analogica: "Local", digital: "Global" },
        { tema: "Crise", analogica: "Espera", digital: "Mudança de rota" },
      ],
    },
  },

  quemE: {
    titulo: "Quem é o Gestor Sincero",
    paragrafos: [`${P} Sidney Ferrér começou na era do Telex e atravessou quatro décadas de mudanças no mercado.`],
    credenciais: ["Growth hacker", "Reitor da Escola de Inovação Aberta", "DPO (LGPD)", "Autor de 3 livros"],
    tituloEh: "O que ele é",
    eh: ["Empresário sobrevivente", "Executivo", "Mentor de seniores e de jovens", "Tradutor da Era Digital"],
    tituloNaoEh: "O que ele não é",
    naoEh: ["Guru", "Coach", "Influenciador", "Vendedor de fórmula"],
    premio: { nome: "Prêmio Tupaenses Excelentes", descricao: "Portal Imprensa Brasileira, julho de 2025" },
    tituloEmpresas: `${P} Empresas por onde passou`,
    empresas: ["Marfinite", "Purificadores Europa", "Guia do Imóvel", "Topvinil/Traffic", "Red Eventos (Jaguariúna Rodeo)", "Gráfica Brasil", "Revista Go Where!", "TIM", "Humano Educação"],
    altFoto: "Sidney Ferrér segurando o certificado do Prêmio Tupaenses Excelentes",
  },

  metodo: {
    titulo: "Método Empresas do Futuro",
    introducao: `${P} Dez etapas em dois pilares.`,
    pilares: [
      {
        nome: "Melhoria Contínua",
        descricao: "Mentalidade",
        etapas: [
          { numero: 1, nome: "Empoderamento", descricao: P },
          { numero: 2, nome: "Posicionamento", descricao: P },
          { numero: 3, nome: "Engajamento", descricao: P },
          { numero: 4, nome: "Ecossistema", descricao: P },
        ],
      },
      {
        nome: "Empresa Digital",
        descricao: "Execução",
        etapas: [
          { numero: 5, nome: "Equipe", descricao: P },
          { numero: 6, nome: "Pensamento Startup Enxuta", descricao: P },
          { numero: 7, nome: "Métodos", descricao: P },
          { numero: 8, nome: "Integração", descricao: P },
          { numero: 9, nome: "Escalabilidade", descricao: P },
          { numero: 10, nome: "Gamificação", descricao: P },
        ],
      },
    ],
  },

  jornada: {
    titulo: "Jornada Executiva Gestão Sem Maquiagem",
    introducao: `${P} Três reuniões ao vivo, em formato de conselho executivo.`,
    pautas: [
      { titulo: "Você não ficou velho, mas algumas ideias suas ficaram", descricao: P },
      { titulo: "O manual que fez você vencer não foi escrito para o mundo de hoje", descricao: P },
      { titulo: "Como criar a versão digital da sua empresa sem destruir o legado", descricao: "Quanto custa não mudar agora?" },
    ],
    rotuloHorario: "Sempre às",
    datasPendentes: "Datas a confirmar",
    manual: { nome: "Manual Gestão Sem Maquiagem", descricao: `${P} Gratuito, enviado logo após a inscrição.` },
    formulario: {
      ...formularioBase,
      titulo: `${P} Receba o manual e garanta sua vaga`,
      campos: {
        ...camposContato,
        empresa: { rotulo: "Empresa (opcional)", erro: P },
        cargo: { rotulo: "Cargo (opcional)", erro: P },
      },
      enviar: "Quero meu manual e minha vaga na Jornada",
      sucesso: { titulo: `${P} Inscrição confirmada`, texto: `${P} Seu manual está pronto para baixar.`, baixarManual: "Baixar o manual" },
    },
  },

  dicionario: {
    titulo: "Dicionário do Internetês",
    introducao: `${P} Termos do mundo digital na linguagem do empresário.`,
    termos: [
      { termo: "Lead", traducao: P },
      { termo: "Funil", traducao: P },
      { termo: "CRM", traducao: P },
      { termo: "Tráfego pago", traducao: P },
      { termo: "Algoritmo", traducao: P },
      { termo: "Prompt", traducao: P },
    ],
    avisoValidacao: "Amostra a validar pelo Ferrér",
  },

  ressonancia: {
    titulo: "Ressonância Digital",
    analogia: "Assim como uma ressonância médica revela estruturas que os olhos não enxergam…",
    paragrafos: [`${P} Diagnóstico de marketing, gestão e vendas da S4, com 52 temas em 9 fases.`],
    fases: [
      { letra: "A", nome: "Diagnóstico e visão macro", descricao: P },
      { letra: "B", nome: "Capacidades e capital humano", descricao: P },
      { letra: "C", nome: "Cliente", descricao: P },
      { letra: "D", nome: "Marca e proposta de valor", descricao: P },
      { letra: "E", nome: "Estratégia de mercado e vendas", descricao: P },
      { letra: "F", nome: "Marketing, canais e operação comercial", descricao: P },
      { letra: "G", nome: "Oferta, preço e retenção", descricao: P },
      { letra: "H", nome: "Saúde financeira", descricao: P },
      { letra: "I", nome: "Processos, tecnologia e escala", descricao: P },
    ],
    entregas: [
      { nome: "Score de 0 a 100", descricao: P },
      { nome: "Prontuários por tema", descricao: P },
      { nome: "Plano de prioridades B.A.S.I.C.O.", descricao: P },
      { nome: "Rituais de governança", descricao: P },
      { nome: "Diagnóstico de implantação de IA", descricao: P },
    ],
    etapas: [
      { nome: "Briefing", descricao: "Cartas na mesa" },
      { nome: "Imersão e busca de dados", descricao: P },
      { nome: "Análise de marketing, gestão e vendas", descricao: P },
      { nome: "Diagnóstico da próxima curva", descricao: P },
    ],
    prazo: "Estudo avaliado em 45 a 60 dias",
    previa: {
      titulo: `${P} Como o diagnóstico é entregue`,
      selo: "Simulação com dados fictícios",
      slides: [
        { arquivo: "slide-04", legenda: P },
        { arquivo: "slide-06", legenda: P },
        { arquivo: "slide-17", legenda: P },
        { arquivo: "slide-20", legenda: P },
      ],
    },
    chamada: { rotulo: "Solicitar a Ressonância da minha empresa", destino: "ressonancia" },
    formulario: {
      ...formularioBase,
      titulo: `${P} Solicite o diagnóstico da sua empresa`,
      campos: {
        ...camposContato,
        empresa: { rotulo: "Empresa", erro: `${P} Informe o nome da empresa.` },
        segmento: { rotulo: "Segmento", erro: `${P} Informe o segmento.` },
        faixaFaturamento: { rotulo: "Faturamento anual", erro: `${P} Escolha uma faixa.` },
        numeroFuncionarios: { rotulo: "Número de funcionários", erro: `${P} Escolha uma faixa.` },
        principalDesafio: { rotulo: "Principal desafio hoje", erro: `${P} Conte em poucas linhas.` },
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
      sucesso: { titulo: `${P} Pedido recebido`, texto: `${P} A equipe da S4 entra em contato.` },
    },
  },

  oferta: {
    titulo: "Mentoria Empresas do Futuro",
    introducao: `${P} Seis meses de educação executiva, com área de membros.`,
    inclui: ["6 meses de mentoria", "Área de membros", "Método de 10 etapas"],
    tituloBonus: "Bônus",
    bonus: [
      "Mais 6 meses de acesso para você e 2 pessoas da sua equipe",
      "Livro físico e online Empresas do Futuro, com frete incluso",
      "Apostilas das 10 etapas",
      "2 reuniões extras com o Sidney",
      "Dicionário do Internetês vitalício",
      "Masterclass",
    ],
    tituloPlano: "Plano de sucesso do aluno",
    planoDeSucesso: ["1 hora por semana", "Leve alguém jovem da equipe junto", "Aplique no seu ritmo", "Participe dos encontros", "Não precisa virar especialista"],
    garantia: { nome: "Garantia de 7 dias", descricao: P },
    rotuloPreco: "Investimento",
    precoPendente: "Valor a confirmar",
    chamada: { rotulo: `${P} Entrar para a mentoria`, destino: "checkout" },
  },

  paraQuem: {
    titulo: "Para quem é e para quem não é",
    tituloEh: "É para você se",
    eh: [P, P, P],
    tituloNaoEh: "Não é para você se",
    naoEh: [P, P, P],
    tituloRequisitos: "Requisitos",
    requisitos: ["Saber ler e estudar", "Familiaridade básica com celular e internet", "Abertura para rever crenças", "Atitude e humildade"],
    fraseRequisito: "O principal requisito é a decisão de voltar a aprender para voltar a liderar.",
  },

  depoimentos: { titulo: `${P} Quem já passou pela mentoria`, itens: [] },

  perguntas: {
    titulo: "Perguntas frequentes",
    itens: [
      { pergunta: "Preciso entender de tecnologia?", resposta: P },
      { pergunta: "Tenho pouco tempo", resposta: P },
      { pergunta: "Isso é curso online?", resposta: P },
      { pergunta: "E se não servir para mim?", resposta: P },
      { pergunta: "Minha equipe pode participar?", resposta: P },
      { pergunta: "A S4 pode fazer a parte digital por mim?", resposta: P },
      { pergunta: "As reuniões ficam gravadas?", resposta: "[PENDENTE FERRÉR]" },
    ],
  },

  fechamento: {
    frases: ["Quanto custa continuar sem entender as novas regras?", "Afrouxem a gravata e arregacem as mangas!"],
    chamada: { rotulo: "Quero meu manual e minha vaga na Jornada", destino: "captacao" },
  },

  rodape: {
    descricao: `${P} Gestor Sincero é a marca de Sidney Ferrér.`,
    marcas: [
      { nome: "S4 Marketing Digital de Resultados", descricao: P },
      { nome: "Academia de Gestores", descricao: P },
      { nome: "Escola de Inovação Aberta", descricao: P },
    ],
    rotuloContatos: "Contatos",
    rotuloPrivacidade: "Política de privacidade",
    rotuloTermos: "Termos de uso",
    direitos: "Todos os direitos reservados",
  },

  whatsapp: { rotuloBotao: "Falar pelo WhatsApp", mensagem: `${P} Olá, vim pela página do Gestor Sincero e quero saber mais.` },
  cookies: {
    texto: `${P} Usamos cookies de medição só com o seu aceite.`,
    aceitar: "Aceitar",
    recusar: "Recusar",
    rotuloPolitica: "Política de privacidade",
  },
};
