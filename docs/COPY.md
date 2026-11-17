# Copy da página do Gestor Sincero

Texto final de cada seção, na ordem em que aparece na página, para revisão do Ferrér. Cada seção traz uma linha explicando a escolha.

Gerado a partir de `content/pagina.ts`, que é a fonte usada pela página. Para mudar um texto, altere lá.

O que aparece como `[PENDENTE FERRÉR]` depende de resposta sua e está listado em `docs/PERGUNTAS_FERRER.md`. Preço, datas, horário e contatos não estão neste texto: a página busca em `config/site.ts`.

## Títulos propostos (aguardam aprovação do Felipe)

Design v2, Onda 2. Já aplicados em `content/pagina.ts`; se algum for recusado, volta o texto da coluna "Antes". O nome do produto saiu do título e passou para a primeira frase da introdução, para não sumir da seção.

| Seção | Antes | Depois |
|---|---|---|
| 02 Espelho da dor | Você se reconhece? | Quantas destas acontecem na sua empresa? |
| 05 Comparativo | A mesma empresa, em duas versões | Em qual das duas colunas está a sua empresa? |
| 06 Quem é | Quem é o Gestor Sincero | Do Telex à inteligência artificial |
| 07 Método | Método Empresas do Futuro | Primeiro muda a cabeça de quem decide. Depois, a operação. |
| 08 Jornada | Jornada Executiva Gestão Sem Maquiagem | Três reuniões de conselho com o Gestor Sincero |
| 09 Dicionário | Dicionário do Internetês | O que a agência quis dizer naquela reunião |
| 11 Mentoria | Mentoria Empresas do Futuro | Seis meses ao lado de quem já esteve na sua cadeira |
| 12 Para quem é | Para quem é e para quem não é | Esta mentoria não é para todo mundo |
| 12 Requisitos | Requisitos | O que você precisa trazer |
| 14 Perguntas | Perguntas frequentes | Antes que você pergunte |

Mantidos, porque já são específicos: 03 "Quem tem estrada segue gerando emprego neste país", 04 "O inimigo tem voz de prudência", 05 "Sua empresa não precisa nascer de novo. Precisa de um segundo motor.", o título do formulário da Jornada e os títulos da página /ressonancia.

## Regras de texto da Onda 2

- **Frases de efeito soltas: só três na página.** O título do topo, a citação da seção 06 ("Experiência sem atualização vira nostalgia.") e a pergunta do fechamento ("Quanto custa continuar sem entender as novas regras?"). As outras viraram parte de um parágrafo: o fechamento dos Dados, o do Inimigo, "Você não construiu sua empresa para depender dos outros." (agora no 2º parágrafo da Virada), a frase do requisito principal e "Afrouxem a gravata..." (agora no texto do fechamento). As frases-manifesto mantêm o texto exato.
- **Nenhum "Sem X e sem Y".** "Sem plateia e sem julgamento" e "Sem palco e sem espetáculo" foram reescritas em frase direta.
- **Espelho da dor com uma instrução só**, a da introdução. O texto de "nenhum marcado" deixou de ser instrução (e a página hoje nem o exibe).
- **Voz do blog do Ferrér** (`docs/voz-ferrer/`): vocativo "Gestor," em poucos pontos, pergunta direta, cena concreta, frase curta. "Informatizar a bagunça" (Método) vem do próprio blog. Sem emoji, sem promessa, sem número novo, sempre "você". Inglês segue a regra do §6: os termos aparecem só como verbetes do Dicionário.
- **Classe gramatical do Dicionário:** os seis verbetes são substantivos masculinos ("o lead", "o funil", "o CRM", "o tráfego pago", "o algoritmo", "o prompt"), todos `s.m.`.

## Botões que levam à captação

| Onde | Rótulo | Decisão |
|---|---|---|
| Cabeçalho | Receber o manual | curto, cabe na barra fixa |
| Topo (principal) | Quero o manual e a vaga | já definido |
| Formulário da Jornada | Quero o manual e a vaga | acompanha o topo: mesma ação, mesmo rótulo; dentro da seção da Jornada o "na Jornada" sobra |
| Fechamento | Quero o manual e a vaga | acompanha o topo, pelo mesmo motivo |
| Papo reto, recomendação da Jornada | Quero o manual e a vaga | acompanha o topo; o texto da recomendação já nomeia a Jornada |

O rótulo longo do briefing ("Quero meu manual e minha vaga na Jornada") saiu da página. Os outros botões (mentoria, Ressonância) não mudaram.

## Pedidos ao Front-end (dependem de componente)

- `dados.fechamento`, `inimigo.fechamento` e `paraQuem.fraseRequisito` agora são parágrafos de corpo, não frases de efeito: hoje saem em `font-titulo` (BlocoDados.tsx:31, Inimigo.tsx:24, ParaQuemE.tsx:35, este centralizado). Trocar para texto de corpo. Se preferir tirar os campos, o orquestrador torna `fechamento` opcional no schema.
- O DESIGN-v2 (S12) pede "o requisito principal em manifesto"; isso conflita com a regra das três frases soltas. Fica para o orquestrador decidir.

## Busca e compartilhamento

_Por quê: é o que aparece no Google e no WhatsApp quando alguém envia o endereço; usa a frase-manifesto do público e cita as duas portas de entrada._

Título: Gestor Sincero | Gestão Sem Maquiagem

Descrição: Educação executiva para empresários experientes que não aceitam ser espectadores da Nova Economia. Manual gratuito e Jornada Executiva com Sidney Ferrér.

## 00 Tarja

_Por quê: filtra o público logo na primeira linha e avisa quem tem mais de 45 anos que a conversa é com ele._

Exclusivo para fundadores e executivos com mais de 45 anos

## 01 Topo

_Por quê: duas versões para você escolher: a A provoca pelo prazo vencido, a B tira a culpa da idade. As duas levam primeiro ao manual e à Jornada, porque sênior não compra frio._

Versão A: **O prazo de validade da sua gestão analógica acabou.**

Você continua sendo quem construiu a empresa. O que venceu foi o jeito de tocar o negócio. Receba o manual Gestão Sem Maquiagem e participe de três reuniões executivas com Sidney Ferrér, o Gestor Sincero.

Versão B: **O problema nunca foi a idade. Foi a velocidade com que o mercado mudou.**

Para empresários experientes que não aceitam ser espectadores da Nova Economia. Comece pelo manual Gestão Sem Maquiagem e por três reuniões executivas com Sidney Ferrér, o Gestor Sincero.

Botão principal: **Quero o manual e a vaga**

Botão secundário: **Conhecer a mentoria**

Título do vídeo: Sidney Ferrér apresenta o Gestor Sincero

Descrição da foto para leitores de tela: Sidney Ferrér, o Gestor Sincero, de terno escuro e braços cruzados

## 02 Espelho da dor

_Por quê: o empresário se reconhece sozinho, marcando as frases, sem ser acusado de nada; a resposta final acolhe e não promete._

**Quantas destas acontecem na sua empresa?**

Gestor, marque só o que já é verdade hoje. Ninguém além de você vê esta lista.

- As vendas caíram e ninguém na empresa consegue explicar o motivo.
- Concorrentes menores e mais novos estão crescendo na sua frente.
- O digital da empresa está na mão da agência, do sobrinho ou de um terceiro, e você não tem como avaliar o que entregam.
- A equipe mais jovem já não ouve você como ouvia.
- Sobram ferramentas e falta resultado.
- As decisões grandes ainda saem da intuição, sem número para conferir.
- A sucessão não tem plano, e a conversa vive sendo adiada.
- Você se pega dizendo "vou esperar, isso passa" com mais frequência do que gostaria.

Contador: {n} de {total} marcados

Nenhum marcado (não aparece na página): Nenhuma frase marcada até agora.

Poucos marcados: Poucos sinais, e essa é a melhor hora para agir. Com calma, antes que a pressa decida por você.

Muitos marcados: Você não está sozinho, e isso não diz nada sobre a sua capacidade. A liderança virou o cargo mais solitário. O mercado mudou depressa, e ninguém mandou aviso para quem estava ocupado tocando a empresa.

## 03 Dados

_Por quê: prova com número e fonte de que o empresário experiente pesa na economia, antes de dizer que o jogo mudou. Os números são os do seu briefing e a fonte exata está pendente._

**Quem tem estrada segue gerando emprego neste país**

- 7,3% dos empreendedores têm 65 anos ou mais, o grupo com o maior índice de geração de emprego
- 20% são empregadores
- 71% têm de 1 a 5 funcionários
- 92% estão há mais de 2 anos no negócio

Fonte: Sebrae/IBGE [PENDENTE FERRÉR: estudo e ano]

Repare no que esses números dizem. Quem tem estrada continua contratando, pagando a folha e segurando o negócio de pé ano após ano. A idade não tirou ninguém do jogo. O que mudou foi a regra do jogo.

## 04 O inimigo

_Por quê: dá nome ao adversário sem atacar o leitor: a prudência que virou adiamento, nas frases que ele mesmo diz._

**O inimigo tem voz de prudência**

Ele não aparece no balanço nem bate à porta. Mora em frases razoáveis, ditas por gente séria na mesa de reunião, que empurram a decisão para o ano que vem. E carrega uma crença antiga, a de que o mercado ainda paga pelas mesmas escolhas de 10 ou 20 anos atrás. Reconhece alguma destas?

- Vou estudar depois.
- Meu sobrinho cuida das redes.
- Meu comercial resolve na raça.
- Vou esperar. Isso passa.
- Sempre fiz assim.

Nenhuma delas é mentira, e é isso que as torna perigosas. Cada uma parece prudência e adia a decisão por mais um ano, e o ano adiado não volta. Experiência sem atualização virou risco.

## 05 A virada

_Por quê: é o alívio depois da dor: o legado fica, e o que entra é um segundo motor. Os 17 pares mostram a diferença em linguagem de dono, sem jargão._

**Sua empresa não precisa nascer de novo. Precisa de um segundo motor.**

Ninguém aqui vai pedir que você derrube o que levou décadas para erguer. O legado fica. Os clientes, o nome e a palavra dada também.

O que falta é criar, dentro da própria empresa, a versão digital do negócio. Um segundo motor de crescimento, ligado ao primeiro e comandado por você, e não pela agência ou pelo sobrinho. Você não construiu sua empresa para depender dos outros.

**Em qual das duas colunas está a sua empresa?**

| Tema | Analógica | Digital |
|---|---|---|
| Site | Um panfleto parado na internet | Uma máquina de vendas que trabalha todos os dias |
| Redes sociais | Vitrine para mostrar produto | Canal de relacionamento com o cliente |
| Anúncios | Impulsionamento no palpite | Investimento com desempenho medido |
| Canais de venda | Cada um para um lado | Integrados, com o mesmo cliente e a mesma história |
| Cadastro de clientes | Planilhas espalhadas | Sistema de gestão de clientes |
| Pós-venda | Reage quando o cliente reclama | Procura o cliente antes do problema |
| Gestão | Decide pela intuição | Decide olhando os dados |
| Liderança | Centraliza tudo no dono | Ágil, com autonomia para a equipe |
| Contratação | Escolhe pelo currículo | Escolhe pela capacidade de se adaptar |
| Retenção de pessoas | Ficam por obrigação | Ficam por propósito |
| Erro | É punido | Vira aprendizado |
| Responsabilidade socioambiental e governança (ESG) | Fica no papel | Está na cultura |
| Métricas | De vaidade, como curtidas e seguidores | De crescimento, como vendas e margem |
| Inovação | Só lança quando está perfeito | Testa rápido e corrige |
| Estrutura | Tudo instalado no escritório | Nuvem e inteligência artificial |
| Concorrência | O vizinho do bairro | Qualquer empresa do mundo |
| Crise | Hora de esperar passar | Hora de mudar a rota |

## 06 Quem é o Gestor Sincero

_Por quê: trajetória e prova no lugar de adjetivo; dizer o que ele não é afasta a imagem de guru. As quatro décadas dependem da pergunta sobre 40 ou 35 anos._

**Do Telex à inteligência artificial**

Gestor Sincero é o nome com que Sidney Ferrér assina o que aprendeu em quatro décadas de carreira. Ele começou na era do Telex e viu de dentro cada troca de regra do mercado, como executivo e como dono de empresa. Viu a chegada do computador pessoal, da internet, das redes sociais e agora da inteligência artificial.

Hoje comanda a S4 Marketing Digital de Resultados e faz uma ponte que pouca gente faz. De um lado, a velocidade dos jovens. Do outro, a visão estratégica e a experiência em crise de quem tem estrada. Ele traduz a Era Digital para quem cresceu sem internet, sem pedir que ninguém vire técnico.

Citação em destaque: **Experiência sem atualização vira nostalgia.**

**Credenciais**

- Growth hacker
- Dono da S4 Marketing Digital de Resultados
- Idealizador da Academia de Gestores
- Reitor da Escola de Inovação Aberta
- Diretor de arte
- Encarregado de dados (LGPD)
- Consultor e mentor de empresas nascentes
- Ex-secretário de Turismo
- MBAs em marketing digital, gestão de negócios e gestão de equipes
- Autor de 3 livros

**O que ele é**

- Empresário sobrevivente
- Executivo
- Mentor de seniores e de jovens
- Tradutor da Era Digital para quem cresceu sem internet

**O que ele não é**

- Guru
- Coach
- Influenciador
- Vendedor de fórmula
- Empreendedor de palco

Prêmio: Prêmio Tupaenses Excelentes. Portal Imprensa Brasileira, julho de 2025

Empresas por onde passou: Marfinite, Purificadores Europa, Guia do Imóvel, Topvinil/Traffic, Red Eventos (Jaguariúna Rodeo), Gráfica Brasil, Revista Go Where!, TIM, Humano Educação

## 07 Método Empresas do Futuro

_Por quê: mostra que existe método e ordem. A linha de cada etapa foi escrita a partir do nome da etapa e precisa da sua validação._

**Primeiro muda a cabeça de quem decide. Depois, a operação.**

O Método Empresas do Futuro tem dez etapas em dois pilares. Comprar ferramenta antes de mudar a forma de pensar é informatizar a bagunça, por isso a ordem importa.

**Melhoria Contínua. A mentalidade. O que precisa mudar na cabeça de quem decide antes de mudar na operação.**

- 1. Empoderamento. Retomar o comando e entender o digital o bastante para decidir sem intérprete.
- 2. Posicionamento. Definir como a empresa quer ser vista e escolhida no mercado de hoje.
- 3. Engajamento. Trazer a equipe, de todas as gerações, para dentro da mudança.
- 4. Ecossistema. Tratar clientes, parceiros e fornecedores como uma rede que faz o negócio crescer.

**Empresa Digital. A execução. A versão digital do negócio saindo do papel, uma etapa por vez.**

- 5. Equipe. Montar o time da versão digital, somando a velocidade dos jovens à visão de quem tem estrada.
- 6. Pensamento Startup Enxuta. Testar pequeno, medir e corrigir rápido, como fazem as empresas nascentes, antes de investir alto.
- 7. Métodos. Trocar o improviso por rotinas de trabalho que a equipe consegue repetir.
- 8. Integração. Ligar canais, sistemas e áreas para a informação parar de se perder no caminho.
- 9. Escalabilidade. Preparar a empresa para crescer sem que o custo e a confusão cresçam junto.
- 10. Gamificação. Usar metas, placar e reconhecimento para manter a equipe no jogo.

## 08 Jornada Executiva Gestão Sem Maquiagem

_Por quê: é a chamada principal da página: três reuniões com cara de conselho, nunca de lançamento, e um formulário curto com consentimentos separados._

**Três reuniões de conselho com o Gestor Sincero**

A Jornada Executiva Gestão Sem Maquiagem são três reuniões ao vivo, com pauta e hora marcada, no formato de um conselho executivo. É conversa de mesa, de quem toca empresa para quem toca empresa. Quem se inscreve recebe também o manual Gestão Sem Maquiagem.

- Pauta 1: **Você não ficou velho, mas algumas ideias suas ficaram**. Uma conversa franca sobre as crenças que sustentaram a empresa por décadas e hoje seguram o crescimento.
- Pauta 2: **O manual que fez você vencer não foi escrito para o mundo de hoje**. O que mudou no jeito de vender, contratar e liderar, e por que repetir a receita antiga passou a ser arriscado.
- Pauta 3: **Como criar a versão digital da sua empresa sem destruir o legado**. O segundo motor de crescimento, do primeiro passo em diante. E a pergunta que fecha a Jornada: quanto custa não mudar agora?

Horário: "Sempre às" seguido do horário configurado.

Enquanto não houver datas: Datas a confirmar. Quem se inscreve é avisado primeiro.

Manual Gestão Sem Maquiagem: Gratuito para quem se inscreve na Jornada. A leitura que prepara você para as três reuniões.

**Formulário: Receba o manual e reserve sua vaga na Jornada**

Usamos seu contato para enviar o manual e os avisos das três reuniões. Convites e conteúdos, só se você autorizar abaixo.

- Nome. Erro: Escreva seu nome.
- WhatsApp (ajuda: Com DDD. Pode digitar só os números.). Erro: Confira o número. Faltou o DDD ou algum dígito.
- E-mail. Erro: Confira o e-mail. Ele precisa ter o @ e o final do endereço.
- Empresa (opcional). Erro: Confira o nome da empresa.
- Cargo (opcional). Erro: Confira o cargo.

**Consentimentos (três caixas separadas)**

- WhatsApp: Aceito receber conteúdos e convites do Gestor Sincero por WhatsApp. Posso cancelar quando quiser.
- E-mail: Aceito receber conteúdos e convites do Gestor Sincero por e-mail. Posso cancelar quando quiser.
- Privacidade (obrigatória): Li a política de privacidade e estou ciente de como meus dados serão usados.

Botão: **Quero o manual e a vaga** (durante o envio: Enviando)

Depois do envio: **Inscrição confirmada**. Sua vaga na Jornada está reservada. O manual e os avisos das reuniões chegam pelo contato que você informou. Botão: **Baixar o manual agora**

**Quando o envio falha**

- Recebemos muitas tentativas seguidas deste aparelho. Aguarde alguns minutos e envie de novo.
- A verificação de segurança não foi concluída. Recarregue a página e envie de novo.
- O envio falhou do nosso lado, e seus dados não foram gravados. Tente de novo em instantes.

## 09 Dicionário do Internetês

_Por quê: prova na prática a promessa de traduzir o digital: seis termos explicados com imagens do dia a dia do empresário. As palavras em inglês aparecem aqui só como verbetes a traduzir._

**O que a agência quis dizer naquela reunião**

Imagine a reunião com a agência. Alguém fala em lead, funil e tráfego pago, e todo mundo balança a cabeça. Quantos entenderam? Boa parte dessa língua é nome novo para coisa que você conhece há anos. Esta é uma amostra do Dicionário do Internetês, o tradutor de gerações com 5.000 verbetes.

- **Lead** _s.m._: O interessado. Alguém que deixou nome e contato porque quer saber mais sobre o que você vende. Ainda não é cliente.
- **Funil** _s.m._: O caminho que a pessoa percorre de desconhecida a cliente. Muitos entram, poucos chegam ao fim, e o trabalho é descobrir onde os outros ficaram.
- **CRM** _s.m._: A velha caderneta de clientes, agora em sistema. Guarda quem comprou, o quê, quando e o que ficou combinado.
- **Tráfego pago** _s.m._: Anúncio pago na internet. Você paga para aparecer para quem procura o que você vende e fica sabendo quanto custou cada visita.
- **Algoritmo** _s.m._: O conjunto de regras que cada rede usa para decidir o que mostrar a cada pessoa. Funciona como um porteiro, que escolhe quem vê a sua empresa.
- **Prompt** _s.m._: O pedido que você escreve para a inteligência artificial. Pedido vago, resposta vaga, como acontece com qualquer funcionário.

Aviso: Amostra a validar pelo Ferrér

## 10 Ressonância Digital

_Por quê: apresenta o diagnóstico como exame, com fases, entregas e prazo, para quem prefere medir antes de decidir. A linha de cada fase e de cada entrega saiu do nome e precisa da sua validação._

**Ressonância Digital**

Assim como uma ressonância médica revela estruturas que os olhos não enxergam…

A Ressonância Digital mostra o que a rotina esconde dentro da sua empresa. É o diagnóstico de marketing, gestão e vendas da S4, com 52 temas examinados em 9 fases.

Você recebe um retrato com nota, evidências e ordem de prioridade. A decisão continua sendo sua, agora com os exames na mesa.

**As 9 fases**

- A. Diagnóstico e visão macro. O momento da empresa e o cenário em que ela compete.
- B. Capacidades e capital humano. O que a equipe sabe fazer hoje e o que falta para a próxima fase.
- C. Cliente. Quem compra, por que compra e por que deixa de comprar.
- D. Marca e proposta de valor. Como a empresa é percebida e o que promete entregar.
- E. Estratégia de mercado e vendas. Onde a empresa escolhe competir e como pretende vender.
- F. Marketing, canais e operação comercial. Como a empresa atrai, atende e fecha negócio no dia a dia.
- G. Oferta, preço e retenção. O que se vende, por quanto, e o que faz o cliente voltar.
- H. Saúde financeira. Receita, margem e caixa, vistos sem maquiagem.
- I. Processos, tecnologia e escala. O que sustenta a operação e o que impede a empresa de crescer.

**O que você recebe**

- Nota de 0 a 100. Uma medida única da maturidade da empresa, para acompanhar a evolução ao longo do tempo.
- Prontuários por tema. O que foi encontrado em cada tema examinado, com as evidências.
- Plano de prioridades B.A.S.I.C.O.. O que atacar primeiro e o que pode esperar, em ordem.
- Rituais de governança. As reuniões e os acompanhamentos que mantêm o plano de pé depois da entrega.
- Diagnóstico de implantação de IA. Onde a inteligência artificial cabe na sua operação e onde ainda não cabe.

**Etapas**

- Cartas na mesa. A conversa inicial, em que você conta onde a empresa está e aonde quer chegar.
- Imersão e busca de dados. A S4 levanta os números e as informações de cada área.
- Análise de marketing, gestão e vendas. Os 52 temas são examinados, um a um.
- Diagnóstico da próxima curva. A leitura final, com o caminho recomendado para a próxima fase da empresa.

Prazo: Estudo avaliado em 45 a 60 dias

**Como o diagnóstico chega às suas mãos** (todas as imagens com o selo "Simulação com dados fictícios")

- Visão executiva. A empresa em uma tela, com o resultado do mês, o ritmo de crescimento e o ponto que pede atenção.
- Síntese de maturidade. Uma nota por área mostra onde concentrar a atenção.
- Excelência operacional. Capacidade de entrega, pessoas, processos e tecnologia.
- Estratégia de crescimento. Mercado, cenários e o plano dos próximos 90 dias.

Botão: **Solicitar a Ressonância da minha empresa**

**Formulário: Solicite a Ressonância da sua empresa**

Enviar o pedido não gera compromisso. A equipe da S4 lê as informações e retorna pelo contato que você informar.

- Nome. Erro: Escreva seu nome.
- WhatsApp (ajuda: Com DDD. Pode digitar só os números.). Erro: Confira o número. Faltou o DDD ou algum dígito.
- E-mail. Erro: Confira o e-mail. Ele precisa ter o @ e o final do endereço.
- Empresa. Erro: Escreva o nome da empresa.
- Segmento (ajuda: Por exemplo, indústria, comércio ou serviços.). Erro: Escreva o segmento da empresa.
- Faturamento anual (ajuda: Serve só para dimensionar o estudo.). Erro: Escolha uma faixa de faturamento.
- Número de funcionários. Erro: Escolha uma faixa de funcionários.
- Principal desafio hoje (ajuda: Duas ou três linhas bastam.). Erro: Conte em poucas linhas o principal desafio da empresa.

**Consentimentos (três caixas separadas)**

- WhatsApp: Aceito receber conteúdos e convites do Gestor Sincero por WhatsApp. Posso cancelar quando quiser.
- E-mail: Aceito receber conteúdos e convites do Gestor Sincero por e-mail. Posso cancelar quando quiser.
- Privacidade (obrigatória): Li a política de privacidade e estou ciente de como meus dados serão usados.

Botão: **Solicitar a Ressonância da minha empresa** (durante o envio: Enviando)

Depois do envio: **Pedido recebido**. A equipe da S4 vai ler o que você enviou e retornar pelo contato informado para combinar a primeira conversa.

**Quando o envio falha**

- Recebemos muitas tentativas seguidas deste aparelho. Aguarde alguns minutos e envie de novo.
- A verificação de segurança não foi concluída. Recarregue a página e envie de novo.
- O envio falhou do nosso lado, e seus dados não foram gravados. Tente de novo em instantes.

## 11 Oferta da mentoria

_Por quê: para quem já chega decidido: o que está incluído, os bônus, o esforço pedido e a garantia, sem pressa artificial. O valor aparece só quando for confirmado._

**Seis meses ao lado de quem já esteve na sua cadeira**

A Mentoria Empresas do Futuro são seis meses de educação executiva para criar a versão digital da sua empresa, com o método das 10 etapas. Você não precisa saber programar nem acompanhar cada novidade. Precisa saber o que perguntar, o que exigir e o que decidir.

**Inclui**

- 6 meses de mentoria com Sidney Ferrér
- Método Empresas do Futuro, com as 10 etapas nos 2 pilares
- Área de membros
- Encontros da mentoria

**Bônus**

- Mais 6 meses de acesso para você e 2 pessoas da sua equipe
- Livro Empresas do Futuro, da Editora S4, em versão física e digital, com frete incluso
- Apostilas das 10 etapas
- 2 reuniões extras com o Sidney
- Dicionário do Internetês, com acesso vitalício
- Aula magna

**Plano de sucesso do aluno**

- Reserve 1 hora por semana
- Leve junto alguém jovem da sua equipe
- Aplique no seu ritmo
- Participe dos encontros
- Você não precisa virar especialista

Garantia de 7 dias: Você tem 7 dias, contados da compra, para desistir e receber de volta o valor pago. Não precisa explicar o motivo.

Preço: "Investimento" seguido do valor configurado. Enquanto não houver valor: Valor a confirmar

Botão: **Entrar para a Mentoria Empresas do Futuro**

Oferta posterior: Depois da inscrição, você pode incluir 12 meses da revista digital Gestão & Convergência.

## 12 Para quem é e para quem não é

_Por quê: dizer para quem não é dá credibilidade e poupa o tempo dos dois lados; os requisitos tiram o medo de precisar entender de tecnologia._

**Esta mentoria não é para todo mundo**

**É para você se**

- Você fundou, herdou ou dirige uma empresa e quer voltar a crescer
- Quer entender a Era Digital sem virar técnico
- Cansou de depender de agência, sobrinho ou terceiros para decidir
- Lidera uma equipe de várias gerações e quer ser ouvido por todas
- Pensa na sucessão e quer passar adiante um negócio vivo

**Não é para você se**

- Procura fórmula mágica ou resultado sem trabalho
- Quer que alguém resolva o digital sem a sua participação
- Acredita que o mercado vai voltar a ser o que era
- Não está disposto a rever nenhuma crença

**O que você precisa trazer**

- Saber ler e estudar
- Familiaridade básica com celular e internet
- Abertura para rever crenças
- Atitude e humildade
- Não é preciso entender de tecnologia, inteligência artificial ou marketing

Repare que nenhum item da lista fala de tecnologia. O principal requisito é a decisão de voltar a aprender para voltar a liderar.

## 13 Depoimentos

_Por quê: a seção fica oculta até existirem depoimentos reais e autorizados. Nada foi inventado._

Título reservado: Quem já passou pela mentoria

## 14 Perguntas frequentes

_Por quê: responde às objeções de quem tem pouco tempo e desconfia de promessa, só com fatos do briefing._

**Antes que você pergunte**

**Preciso entender de tecnologia?**

Não. Você não precisa entender de tecnologia, de inteligência artificial nem de marketing. Precisa saber ler e estudar, usar o celular e a internet no básico e estar aberto a rever algumas crenças. O objetivo é você decidir bem, e o trabalho técnico continua com os técnicos.

**Tenho pouco tempo**

O plano da mentoria pede 1 hora por semana, e você aplica no seu ritmo. Leve junto alguém jovem da equipe: ele executa enquanto você decide.

**Isso é curso online?**

Não. É educação executiva. A Jornada são três reuniões ao vivo, com pauta de conselho. A mentoria dura 6 meses, segue um método de 10 etapas e tem encontros com o Sidney, sempre voltada para a sua empresa.

**E se não servir para mim?**

A mentoria tem garantia de 7 dias. Se nesse prazo você concluir que não é para você, pede o cancelamento e recebe de volta o valor pago.

**Minha equipe pode participar?**

Pode, e é recomendado. Entre os bônus da mentoria está o acesso para você e mais 2 pessoas da sua equipe. O plano de sucesso sugere levar junto alguém jovem, que ajuda na aplicação.

**A S4 pode fazer a parte digital por mim?**

A S4 começa pelo diagnóstico. A Ressonância Digital mostra o que precisa ser feito e em que ordem. O que a S4 executa depois disso: [PENDENTE FERRÉR]. Em qualquer caso, a mentoria existe para você delegar sabendo o que pedir e o que cobrar.

**As reuniões ficam gravadas?**

[PENDENTE FERRÉR]

## 15 Fechamento

_Por quê: termina com a pergunta do custo de não mudar e com o seu chamado, e volta para o passo pequeno: manual e Jornada._

**Quanto custa continuar sem entender as novas regras?**

Para o sênior, mudar é difícil… mas na Era Digital não mudar é fatal. O primeiro passo é pequeno: um manual e três reuniões. Afrouxem a gravata e arregacem as mangas! Antes que terceiros decidam o destino da empresa.

Botão: **Quero o manual e a vaga**

## 16 Rodapé

_Por quê: identifica quem está por trás da página e as marcas do ecossistema, sem repetir a venda._

Gestor Sincero é a marca de Sidney Ferrér. Educação executiva para empresários experientes que não aceitam ser espectadores da Nova Economia.

- S4 Marketing Digital de Resultados. A empresa de Sidney Ferrér, responsável pela Ressonância Digital.
- Academia de Gestores. Educação executiva para empresários e gestores, idealizada por Sidney Ferrér.
- Escola de Inovação Aberta. Escola da qual Sidney Ferrér é reitor.

Rótulos: Contatos · Política de privacidade · Termos de uso · Todos os direitos reservados

## Botão de WhatsApp e aviso de cookies

_Por quê: a mensagem pronta poupa o empresário de pensar no que escrever; o aviso de cookies diz em uma frase o que é medido e dá duas escolhas de mesmo peso._

Botão: **Falar pelo WhatsApp**

Mensagem pronta: Olá. Vim pela página do Gestor Sincero e quero entender qual é o melhor primeiro passo para a minha empresa.

Aviso de cookies: Cookies de medição das visitas só são gravados se você aceitar.

Botões: **Aceitar cookies** e **Recusar cookies**. Link: Ler a política de privacidade

## Política de privacidade e termos de uso

_Por quê: os dois documentos estão em `content/legal.ts` e nas páginas /privacidade e /termos; razão social, CNPJ, encarregado, prazo de guarda, fornecedores e foro seguem pendentes._


## Corte de texto v2.1 (17/11, pedido do Felipe)

- **O inimigo:** a introdução virou "Ele não aparece no balanço. Mora em frases razoáveis que adiam a decisão por mais um ano." Saíram o segundo parágrafo e a frase "Experiência sem atualização virou risco." (a seção Quem é já traz "vira nostalgia").
- **A virada:** um parágrafo só. Saiu a pergunta "Em qual das duas colunas está a sua empresa?". Na página ficam 6 pares (Site, Anúncios, Cadastro de clientes, Gestão, Liderança, Crise); os outros 11 continuam em `content/pagina.ts`, sem aparecer.
- **Quem é:** um parágrafo; 6 credenciais (saíram Growth hacker, Diretor de arte, Encarregado de dados e Consultor e mentor de empresas nascentes); as listas "é / não é" viraram uma frase.
- **Método:** introdução em uma frase; cada etapa com descrição de até 8 palavras.
- **Perguntas:** linha nova "Ficou alguma dúvida? Fale com a equipe no WhatsApp", que só aparece quando houver número em `config/site.ts`.
