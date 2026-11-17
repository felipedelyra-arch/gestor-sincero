# Design v2: editorial executiva

Vale acima de `docs/DESIGN.md` em tudo o que for visual. Segurança (BRIEFING §9), rotas, validação, Turnstile, CSP e conteúdo de funil não mudam.

Leitor: dono de empresa com 45 anos ou mais, que lê jornal de negócios e relatório anual. Trabalho da página: fazer esse leitor reconhecer um autor com estrada e pedir o manual com a vaga na Jornada.

Sensação: revista de negócios impressa, relatório anual de empresa tradicional, capa e miolo de livro de autor. Nada de painel de aplicativo.

O elemento memorável é um só: **a frase do Ferrér em corpo grande ao lado do retrato dele.** Todo o resto fica quieto para isso aparecer.

## Diagnóstico da v1 (17/11, no ar)

Esqueleto repetido (título centralizado + subtítulo cinza + grade de cartões) em todas as seções; 77 cartões; alternância automática preto/marinho com o mesmo padding; contêiner estreito e tudo centralizado; topo de 504px com foto pequena e corte seco; pílulas, checks dourados, "+" de sanfona, contador, tabela de preço e "Ver todos"; um único estilo de título para tudo; texto de cartão em 15px; duas fotos reais; vícios de texto ("Sem X e sem Y", frase de efeito fechando cada seção); dados sem fonte.

## Princípios

- **P1 Cartão é exceção.** No máximo 8 elementos com borda + fundo próprio na página inteira (campos de formulário e botões não contam). No lugar: filete, espaço, numeração tipográfica, lista tipográfica.
- **P2 Assimetria em 12 colunas.** Texto alinhado à esquerda. No máximo 2 seções inteiras centralizadas: o fechamento e uma frase-manifesto. Larguras variam: coluna de leitura, grade cheia, sangria até a borda.
- **P3 Ritmo variado.** Três tamanhos de seção de verdade. O fundo só muda quando o conteúdo pede.
- **P4 Três níveis de texto, bem distintos:** manifesto, título de seção, corpo.
- **P5 Fotografia como protagonista.** Fotos grandes, sangrando até a borda. Sem banco de imagens: onde faltar foto, o espaço fica preparado e o pedido vai para `docs/PERGUNTAS_FERRER.md`.
- **P6 Iconografia mínima.** Sem check em lista, sem "+" decorativo, sem pílula. Sanfona só nas perguntas frequentes.
- **P7 Movimento contido.** No máximo 1 elemento revelado por seção (o título ou a imagem), por opacidade, 400ms, uma vez. Nada em parágrafo, nada em cascata. `prefers-reduced-motion` desliga tudo.
- **P8 Dourado raro.** Botão principal, numeração, filetes, um destaque pontual. Número de estatística não é dourado inteiro.
- **P9 Uma seção cor de papel** (Dicionário), com cara de página de livro. Flag `site.secaoPapel` (padrão: ligada).

## Cor

| Nome | Valor | Uso |
|---|---|---|
| preto | #070809 | fundo padrão |
| preto-2 | #0B0C0E | fundo dos poucos cartões e dos campos |
| marinho | #0C1422 | fundo só da Jornada (convite) e do bloco de investimento |
| chumbo | #2A2C30 | filete neutro, borda de campo |
| filete-ouro | #493B21 | filete dourado apagado (o filete padrão entre itens) |
| ouro | #CEA33D | botão principal, numeração, traço das frases riscadas, filete do rodapé |
| texto | #F2F0EA | todo texto de leitura |
| texto-2 | #B9B5AA | só legenda, nota de rodapé, coluna "Analógica" |
| papel | #F2F0EA | fundo da seção do Dicionário |
| tinta | #0B0C0E | texto sobre papel |

Sem degradê colorido. O único degradê é preto transparente → preto, para fundir a base das fotos.

## Tipografia

Famílias: **Outfit** (títulos e, por padrão, manifesto), **Inter** (corpo). Flag `site.tipografiaManifesto`: `"outfit"` (padrão) ou `"serifa"`. Com `"serifa"`, as frases-manifesto e os números grandes usam **Newsreader** (peso 400, itálico disponível), auto-hospedada por `next/font`, carregada só quando a flag pede. Nenhum outro texto usa serifa, exceto os verbetes do Dicionário quando `secaoPapel` está ligada.

Raiz em 18px em todas as larguras. Valores em px (desktop ≥ 1024 / celular):

| Nível | Desktop | Celular | Peso | Entrelinha | Tracking |
|---|---|---|---|---|---|
| Manifesto (frases do Ferrér, título do topo, número em destaque) | clamp(64, 5.6vw, 88) | clamp(36, 9.6vw, 44) | Outfit 500 / Newsreader 400 | 1,04 | -0,02em |
| Título de seção | 40 | 30 | Outfit 500 | 1,12 | -0,01em |
| Subtítulo (h3, nome de etapa, verbete) | 24 | 22 | Outfit 500 | 1,25 | 0 |
| Corpo | 18 | 18 | Inter 400 | 1,6 | 0 |
| Corpo grande (abertura de seção, item do Espelho) | 20 | 19 | Inter 400 | 1,55 | 0 |
| Legenda e nota de rodapé | 15 | 15 | Inter 400 | 1,5 | 0 |
| Cabeçalho de tabela | 14 | 13 | Inter 500, versalete (`font-variant-caps: all-small-caps`) | 1,3 | 0,06em |
| Numeração grande (Método, agenda) | 56 | 40 | Outfit 400, cor ouro | 1 | -0,02em |

Regras: nenhum texto de leitura abaixo de 18px; 15px só em legenda, nota e rodapé; frase-manifesto no máximo 3 vezes soltas na página (topo, Quem é, fechamento) mais as que o briefing estrutura dentro de uma seção (o requisito final da 12); comprimento de linha de 60 a 72 caracteres no corpo; texto principal sempre `texto`, nunca `texto-2`.

## Grade e larguras

Contêiner de 1280px, 12 colunas, calha de 32px; margem lateral de 48px (desktop), 32px (tablet), 20px (celular).

Quatro larguras de conteúdo:

- **leitura**: 680px, alinhada à esquerda a partir da coluna 1 (ou coluna 3 quando há numeração à margem).
- **grade**: as 12 colunas.
- **dividida**: 5 + 7 ou 7 + 5 (nunca 6 + 6), com a coluna maior para a imagem ou a tabela.
- **sangria**: a imagem vai até a borda da janela de um lado; o texto fica na grade.

```
Topo (88vh)                          Quem é (perfil de revista)
+----------------------+-----------+ +-----------+----------------------+
| Título manifesto     |  retrato  | |  foto do  | texto corrido        |
| subtítulo            |  grande   | |  prêmio   | "Experiência sem..." |
| [botão] link link    |  sangra   | |  altura   | credenciais 2 col.   |
| linha de prova       |  →borda   | |  toda     | é | não é            |
+----------------------+-----------+ +-----------+----------------------+

Virada (tabela, grade cheia)         Método (2 pilares)
| texto em coluna de leitura       | | 1 Etapa  linha      | 5 Etapa  linha |
| ANALÓGICA        | DIGITAL       | | 2 Etapa  linha      | 6 Etapa  linha |
| ----------------- filete ------- | | ...                 | ...            |
```

## Espaçamento

Escala de 4px. Três tamanhos de seção (padding vertical desktop / celular):

| Tamanho | Desktop | Celular | Seções |
|---|---|---|---|
| curta | 64 | 48 | Dados, Ressonância (resumo), Para quem, Rodapé |
| média | 112 | 72 | Espelho, Inimigo, Método, Dicionário, Mentoria, Perguntas |
| ampla | 176 | 104 | Topo (88vh), Virada, Quem é, Jornada, Fechamento |

Dentro da seção: 48px entre título e conteúdo; 24px entre parágrafos e itens; 16px de padding vertical em cada linha com filete.

## Filetes

- **Entre itens de lista, linhas de tabela e de agenda:** 1px `filete-ouro`.
- **Neutro (bordas de campo, divisória vertical entre duas colunas de texto):** 1px `chumbo`.
- **Topo do rodapé:** 1px `ouro`.
- **Risco das frases do Inimigo:** 1px `ouro` atravessando a frase na altura do meio (`text-decoration: line-through` com cor e espessura definidas).
- Sem sombra. Raio: 0 em tudo, exceto 2px em botões e campos.

## Fundo por seção

Preto em toda a página, com três exceções pedidas pelo conteúdo: Jornada em marinho (um convite, outro papel), Dicionário em papel (página de livro), Fechamento com fundo fotográfico escurecido. A Ressonância usa a própria imagem como fundo de um dos lados.

## O que deixa de existir

- Cartão genérico (`ui/Cartao`) como forma padrão de agrupar conteúdo.
- Pílula ou etiqueta (credenciais, requisitos, empresas).
- Check dourado em lista.
- "+" decorativo e sanfona fora das perguntas frequentes (Método, empresas, fases).
- Botão "Ver todos" (Virada, credenciais).
- Contador "0 de 8 marcados".
- Caixa de estatística.
- Tabela de preço.
- Cabeça de seção centralizada com subtítulo cinza.
- Alternância automática preto/marinho.
- Revelação de cada cartão em cascata.

Os poucos elementos com borda e fundo que ficam (meta ≤ 8): bloco de investimento da Mentoria; o cartão do formulário da Jornada; o painel do Papo reto; o banner de cookies; a capa/mockup do manual. Sobra folga de três.

## Seções

| # | Seção | Largura | Tamanho | Forma |
|---|---|---|---|---|
| S0 | Navegação e tarja | grade | — | logo com altura mínima de 40px; links à esquerda, ao lado do logo; botão curto (`navegacao.chamada`); tarja em 13px com respiro, acima |
| S1 | Topo | dividida 6+6 com sangria à direita | ampla, mín. 88vh | título em manifesto; retrato ocupando 45 a 55% da largura, até a borda direita e até a base, luz de contorno dourada e degradê na base; botões; linha de prova em texto corrido (`topo.prova`) |
| S2 | Espelho da dor | grade, 2 colunas | média | formulário impresso: uma linha por item, filete, caixa quadrada simples, texto em 19 a 20px; sem contador; a resposta aparece embaixo só com 1 item marcado |
| S3 | Dados | dividida 5+7 | curta | só aparece se `site.dados.fonte` existir; 7,3% em manifesto, os outros três em texto corrido ao lado, fonte em nota |
| S4 | O inimigo | dividida 5+7 | média | introdução à esquerda; 5 frases empilhadas à direita, grandes (subtítulo 24 a 32px), riscadas em ouro |
| S5 | A virada | leitura + grade | ampla | texto em coluna estreita; abaixo, tabela com as 17 linhas visíveis, "Analógica" em `texto-2`, "Digital" em `texto`, cabeçalho em versalete, filetes; no celular cada par vira duas linhas empilhadas, sem rolagem lateral |
| S6 | Quem é | dividida 5+7 | ampla | foto do prêmio na altura toda, à esquerda; texto corrido; citação em manifesto; credenciais em lista de 2 colunas; "é / não é" em duas colunas com filete vertical; empresas em linha corrida |
| S7 | Método | grade, 2 colunas | média | um pilar por coluna; números grandes de 1 a 10; nome e uma linha de descrição sempre visíveis |
| S8 | Jornada | dividida 7+5 | ampla, marinho | agenda numerada com filetes ("Reunião 1, 20h30, título, uma linha"); mockup do manual; formulário com campos de 52px, rótulos de 16px e caixas de 24px |
| S9 | Dicionário | grade, 2 colunas | média, papel | verbete: termo em negrito grande, classe gramatical em itálico pequeno, definição em corpo de livro; prova do prêmio como nota de rodapé da página |
| S10 | Ressonância | sangria | curta | arte grande até a borda; texto e botão ao lado, sobre o lado escuro |
| S11 | Mentoria | dividida 7+5 | média | esquerda: o que é (texto corrido), o que inclui (lista numerada com filetes), bônus (travessão), plano de sucesso (5 linhas numeradas); direita: um bloco com investimento, botão e garantia |
| S12 | Para quem é | grade, 2 colunas | curta | duas colunas de texto com filete vertical; requisitos em frase corrida; o requisito principal em manifesto |
| S13 | Perguntas | leitura | média | sanfona, texto em 18px, mais espaço, alinhada à grade |
| S14 | Fechamento | centralizada | ampla | fundo fotográfico escurecido (retrato ou textura do logo); uma frase em manifesto, um parágrafo, um botão |
| S15 | Rodapé | grade, 3 colunas | curta | logo maior, filete superior dourado |

Numeração tipográfica só onde o conteúdo é sequência de verdade: etapas do método, reuniões da Jornada, o que a mentoria inclui, plano de sucesso. Fora disso, não.

## Flags (config/site.ts)

- `tipografiaManifesto: "outfit" | "serifa"`: padrão `"outfit"`. Proposta aguardando o Felipe.
- `secaoPapel: boolean`: padrão `true`. Proposta aguardando o Felipe.
- `dados.fonte`: `null` enquanto o Ferrér não informar estudo e ano; com `null`, a seção 03 não é renderizada.

## Acessibilidade e desempenho

Contraste AA em todo texto, inclusive sobre foto (o degradê garante 4,5:1 medido no ponto mais claro atrás do texto) e sobre papel. Foco visível em ouro (2px, deslocado 2px). Alvos de toque de 48px. Tabela da Virada com `<table>`, `<th scope>` e, no celular, linhas empilhadas que continuam lidas como par. Riscado do Inimigo não some para o leitor de tela: o texto continua lá. LCP abaixo de 2,5s: no celular o retrato do topo usa o arquivo de 480w com prioridade alta; se o retrato grande virar o LCP e passar do limite, o título volta a ser o maior elemento. CLS abaixo de 0,05: toda imagem com dimensões declaradas. Lighthouse ≥ 95.

## Medidas de aceite (Onda 4)

Elementos com borda + fundo próprio ≤ 8; pílulas 0; ícones de check 0; seções centralizadas ≤ 2; texto visível abaixo de 16px só em legenda e rodapé; sem "Sem … e sem …"; sem marcador pendente visível.
