# Direção de design

Público: dono de empresa com 45 anos ou mais, lendo no celular depois de um anúncio. Trabalho da página: fazer esse leitor se reconhecer e pedir o manual com a vaga na Jornada.
Sensação: sala de conselho à noite. Sólida, silenciosa, cinematográfica.

## Direção v2 (16/11/2026): vale acima de tudo o que vem depois neste arquivo

Retorno do Felipe sobre a prévia: página poluída, letras grandes demais, elementos "jogados", a linha dourada que cresce na rolagem incomoda. Referência escolhida por ele: a home do G4 (g4business.com), só na estrutura. A identidade continua a do Gestor Sincero (preto, marinho, dourado como acento, fotos reais). As 17 seções do briefing §8 continuam todas, na mesma ordem, na mesma página.

O que muda:

1. **Sai o fio dourado.** `FioDourado` é removido da página. O dourado fica em botão principal, número, rótulo pequeno e filete de 1px em cartões.
2. **Entra um cabeçalho fixo** (64px desktop, 56px celular): logo à esquerda, âncoras ao centro (`pagina.navegacao.itens`), botão de captação à direita. No celular: logo, botão e menu recolhido (details nativo). A tarja vira uma faixa fina (32px, texto de apoio) acima do cabeçalho e rola com a página.
3. **Escala de texto fixa e menor.** Raiz em 18px em todas as larguras (sai o 125% do desktop). Tetos, em px:

| Papel | Celular | Desktop (≥1024) |
|---|---|---|
| h1 do topo | 36 / 1,12 | 56 / 1,08 |
| h2 de seção | 28 / 1,15 | 40 / 1,12 |
| h3 e título de cartão | 20 / 1,25 | 22 / 1,25 |
| frase-manifesto | 26 / 1,2 | 36 / 1,15 |
| número de destaque | 36 | 48 |
| corpo | 18 / 1,6 | 18 / 1,6 |
| apoio e rótulo | 15 / 1,5 | 15 / 1,5 |

   Nada na página passa de 56px. Frase-manifesto aparece no máximo uma vez por seção.
4. **Seção com cabeça centralizada e corpo em largura cheia.** Sai a grade "título em 4 colunas, corpo em 7". Cada seção: rótulo pequeno em dourado (opcional), h2, uma linha de apoio (máx. 60ch), e embaixo o conteúdo usando as 12 colunas do contêiner de 1200px. Espaço vertical da seção: 64px no celular, 96px no desktop.
5. **Conteúdo em cartões e grades, não em listas empilhadas.** Cartão: fundo `preto-2` (ou `marinho` sobre preto), borda 1px `chumbo`, raio 12px, 24px de respiro. Fundos alternam preto → marinho → preto para dar ritmo.
6. **Tudo que é lista longa mostra um resumo e abre o resto** com details nativo ou carrossel com scroll-snap (sem biblioteca): rótulos em `pagina.rotulos`.

Formato de cada seção:

| Seção | Formato | Altura-alvo em 1280 |
|---|---|---|
| 01 Topo | texto à esquerda, retrato à direita, tudo na primeira tela | ≤ 720 |
| 02 Espelho | 8 itens marcáveis em grade 4x2 (2x4 no celular) + resposta | ≤ 620 |
| 03 Dados | 4 cartões de número em linha + fonte + uma frase | ≤ 520 |
| 04 Inimigo | 3 cartões de citação em linha + uma frase-manifesto | ≤ 520 |
| 05 Virada | 2 parágrafos + tabela com 6 pares; "ver os 17" abre o resto | ≤ 760 |
| 06 Quem é | foto do prêmio + biografia curta; "é / não é" em 2 cartões; empresas em etiquetas de texto | ≤ 820 |
| 07 Método | 2 cartões lado a lado (um por pilar) com as etapas numeradas | ≤ 680 |
| 08 Jornada | esquerda: 3 pautas em cartões compactos, horário, manual; direita: formulário em cartão | ≤ 900 |
| 09 Dicionário | 6 cartões em grade 3x2, selo "a validar" discreto | ≤ 560 |
| 10 Ressonância | texto + capa lado a lado; abas ou details para Fases (grade 3x3), Entregas (5 cartões) e Etapas (4 passos em linha); prévia em carrossel; formulário em cartão com campos em 2 colunas | ≤ 2200 |
| 11 Oferta | esquerda: inclui, bônus e plano em listas de conferência; direita: cartão de preço com garantia e botão | ≤ 900 |
| 12 Para quem | 2 cartões (é / não é) + requisitos em linha | ≤ 560 |
| 14 Perguntas | acordeão centralizado, máx. 800px | ≤ 620 |
| 15 Fechamento | faixa marinho, uma frase de 36px, botão | ≤ 360 |
| 16 Rodapé | 4 colunas | ≤ 360 |

Metas: página inteira ≤ 12.000px em 1280 e 1920, ≤ 18.000px em 390; o topo cabe na primeira tela em 390x844, 1280x800 e 1920x943.

Movimento: só revelação por opacidade, curta (300ms), uma vez. Sem parallax. Lenis continua opcional; se sobrar complexidade, sai.

A seção "A ideia: o fio dourado" abaixo está revogada.

## A ideia: o fio dourado

Um único fio dourado de 1px desce pela margem esquerda da página inteira. Ele é o legado: contínuo, nunca interrompido.

- No topo ele nasce junto do título.
- Na seção 05 (A virada) ele se divide em dois: o motor que já existe e o segundo motor. É a tese da página desenhada.
- Na seção 07 ele vira a linha do tempo das 10 etapas (marcas no fio; aqui a numeração existe porque é sequência real).
- Na seção 10 uma faixa horizontal de luz percorre a prévia da Ressonância uma vez, como a varredura do exame.
- No fechamento os dois fios voltam a ser um e terminam no botão final.

Tudo o mais fica quieto. O fio é o único elemento decorativo; se outra decoração aparecer, ela sai.

```
celular                      desktop (12 colunas)
|· tarja                     |· tarja
|                            |
|  Título grande             |  Título grande em        [ retrato
|  em três linhas            |  duas linhas, col 1-7      sangrando
|  subtítulo                 |  subtítulo                 à direita,
|  [botão principal]         |  [principal] [secundário]  col 8-12 ]
|  botão secundário          |
|  [retrato, base esmaece]   |
|                            |
|  Seção: texto em uma       |  Seção: título col 1-4, corpo col 5-11
|  coluna, à esquerda        |  (assimétrico, sempre à esquerda)
```

Alinhamento: tudo à esquerda. Nada centralizado, exceto o conteúdo dos botões. Coluna de texto com no máximo 62 caracteres.

## Tokens

Implementar em `src/styles/tokens.css` com `@theme` do Tailwind 4. Componentes usam só tokens.

Cor

| Token | Valor | Uso |
|---|---|---|
| `--color-preto` | `#070809` | fundo da página |
| `--color-preto-2` | `#0B0C0E` | fundo de seção alternada e de campos |
| `--color-marinho` | `#0C1422` | fundo das seções 08 e 10 (os dois formulários) |
| `--color-chumbo` | `#2A2C30` | fios divisórios, bordas de campo |
| `--color-ouro` | `#CEA33D` | o fio, botão principal, números, foco |
| `--color-ouro-claro` | `#DFB858` | hover do botão principal, texto dourado pequeno |
| `--color-ouro-escuro` | `#927027` | só borda e detalhe; nunca texto |
| `--color-texto` | `#F2F0EA` | texto |
| `--color-texto-2` | `#B9B5AA` | texto de apoio |
| `--color-erro` | `#E8A08C` | mensagem de erro (com ícone e texto, nunca só cor) |

Dourado nunca cobre área grande: o maior bloco dourado da página é o botão principal. Sem degradê colorido; o único esmaecimento permitido é de foto para preto.

Tipografia (via `next/font/google`, `display: swap`, pré-carregar só a Outfit)

- Títulos e frases-manifesto: Outfit 500 (400 nos subtítulos). `letter-spacing: -0.02em` acima de 36px, entrelinha 1,08 a 1,15.
- Corpo, formulários e botões: Inter 400/500, entrelinha 1,6. Números de preço com `tabular-nums`.
- Base 18px no celular, 20px a partir de 1024px.

| Passo | Celular | Desktop | Uso |
|---|---|---|---|
| manifesto | `clamp(2.5rem, 9vw, 3.5rem)` | `clamp(4rem, 6.5vw, 6rem)` | título do topo e frases-manifesto |
| h2 | 2rem | 3rem | título de seção |
| h3 | 1.375rem | 1.75rem | subtítulo, nome de etapa |
| corpo | 1rem | 1rem | texto |
| apoio | 0.889rem | 0.85rem | ajuda, fonte de dado, legenda (mínimo 16px reais) |

Espaço: escala de 4px (4, 8, 12, 16, 24, 32, 48, 64, 96, 144). Entre seções: 96px no celular, 144px no desktop. Margem lateral: 20px no celular (o fio fica nessa margem), 48px no tablet, grade de 12 colunas com 1200px de largura máxima no desktop.

Raio: 2px em botões, campos e imagens. Nada de pílula, nada de cartão arredondado.
Sombra: nenhuma em blocos. Só os mockups do livro levam `0 24px 48px rgb(0 0 0 / .6)`.
Divisão: espaço primeiro; quando precisar, fio de 1px em chumbo. Sem caixas ao redor de conteúdo.

## Componentes

- Botão principal: fundo ouro, texto preto, Inter 500, altura mínima 56px, largura total no celular. Hover: ouro-claro. Foco: contorno de 2px em texto, afastado 3px.
- Botão secundário: sem fundo, texto em `--color-texto` com sublinhado dourado de 1px. Mesma área de toque (48px ou mais).
- Campo: rótulo sempre visível acima, fundo preto-2, borda chumbo, 56px de altura, texto 18px. Erro abaixo, ligado por `aria-describedby`.
- Caixa de marcar (espelho da dor e consentimentos): 28px, borda ouro-escuro, marca em ouro; a linha inteira é clicável.
- Tarja 00: fixa no topo, 36px, fundo preto, fio chumbo embaixo, texto de apoio em caixa normal.
- Comparativo 05: duas colunas no desktop; no celular, alternância entre "Analógica" e "Digital" (botões com `aria-pressed`) sobre uma lista `dl` que continua completa para leitor de tela.
- Prévia da Ressonância: 4 imagens em rolagem horizontal com encaixe, selo de simulação dentro de cada imagem e também como texto.
- Perguntas: `details/summary` nativo, estilizado.
- Depoimentos: não renderiza nada com lista vazia.

## Movimento

- Um momento orquestrado: na carga, o fio desce 120px, o título aparece linha a linha (opacidade, 900ms, intervalo de 120ms) e por último o retrato. Só isso.
- Rolagem: Lenis com suavidade baixa (`lerp` perto de 0,1). O fio cresce com a rolagem (`scaleY`, origem no topo). Parallax de no máximo 4% no retrato do topo e no equipamento da Ressonância.
- Seções não entram deslizando. Sem revelação em cascata por cartão, sem hover animado em tudo.
- Interação responde: caixa marcada, alternância do comparativo, abertura de pergunta, estado de envio. Transições de 200ms.
- Só `transform` e `opacity`. Com `prefers-reduced-motion: reduce`: sem Lenis, sem parallax, fio já desenhado, tudo visível.

## O que não entra

Rótulo em caixa alta acima de título, lista com ponto mediano, seta em botão, fonte monoespaçada, cartões iguais em grade, numeração 01/02/03 fora da linha do tempo, emoji, neon, roxo, efeito vidro, contador regressivo, banco de imagens.

## Acessibilidade e desempenho

- Contraste: texto 18:1, apoio 10:1, ouro sobre preto 8,5:1, preto sobre ouro 8,5:1.
- Ordem de foco igual à ordem visual; link "Pular para o conteúdo"; um `h1` (o título do topo); `lang="pt-BR"`.
- Imagem do topo: `priority`, avif com webp de reserva, tamanhos responsivos. Demais imagens com carregamento tardio e dimensões declaradas (CLS abaixo de 0,05).
- GSAP e Lenis carregados depois da primeira pintura, só no cliente. Seções estáticas são componentes de servidor.
