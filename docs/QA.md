# QA da Onda 3 (16/11/2026)

Alvo: `http://localhost:3000` em modo prod (build do orquestrador), sem `.env.local` (sem Supabase, Turnstile real, Pixel ou GA4). Chromium sem interface, 1 worker. Nada de código de produção foi alterado.

## Reteste final (16/11/2026, build de prod de 1057e8a: Ressonância em /ressonancia, pendências ocultas)

Specs: `ressonancia` reescrito para a rota nova (o botão do resumo leva a `/ressonancia`); `saude` ganhou a varredura de pendências nas 4 rotas; `cabecalho` ganhou as âncoras de `/ressonancia` voltando para `/#seção` e o menu do celular; `acessibilidade` passa a auditar `/ressonancia` e os details e o menu dela; `design-v2` roda fonte, rolagem e alvos também em `/ressonancia`. Corrigido na medida de largura: um recorte com overflow oculto que cabe na tela (o retrato do topo em 390) não conta como vazamento.

| Critério | Meta | Medido | Situação |
|---|---|---|---|
| Pendência visível em `/`, `/ressonancia`, `/privacidade`, `/termos` (HTML e texto) | nenhuma "PENDENTE" nem "a validar" | nenhuma nas 4 rotas (saude, 4 testes) | aprovado |
| Botão do resumo da landing leva a `/ressonancia` | sim | sim | aprovado |
| Âncoras do cabeçalho em `/ressonancia` voltam para `/#seção` e a seção fica visível | sim | 5 de 5 em 1280; menu de 390 leva à inicial | aprovado |
| Lighthouse celular, `/` (3 medições, mediana) | ≥ 95 | 97, 98, 98 (mediana 98, LCP 0,9 s, TBT 160 ms, CLS 0) | aprovado |
| Lighthouse desktop, `/` | ≥ 95 | 100 (LCP 0,5 s, TBT 20 ms, CLS 0,007) | aprovado |
| Lighthouse celular, `/ressonancia` (1 medição) | ≥ 95 e LCP < 2,5 s | desempenho 96, mas LCP 2,6 s; TBT 110 ms; página de 442 KiB | LCP reprovado (R-M2) |
| Acessibilidade e boas práticas, `/` e `/ressonancia` | 100 | 100 e 100 | aprovado |
| SEO | | 69 nas duas (`noindex` proposital, B6) | conhecido |
| axe, 4 rotas em 390 e 1280 | 0 graves | 0 violações de qualquer gravidade (16 arquivos); "incompletas" só de contraste, que o axe não decide sozinho | aprovado |
| axe com details abertos e menu do celular aberto | 0 graves | 0 violações | aprovado |
| Maior fonte em `/` e `/ressonancia` | ≤ 56px | 56px em 1280 e 1920; 36px em 390 | aprovado |
| Rolagem horizontal, 390, 1280 e 1920, fechado e aberto (`/` e `/ressonancia`) | nenhuma | nenhuma | aprovado |
| Alvos de toque ≥ 48px, `/` e `/ressonancia` (fechado e aberto) | sim | sim em todas as larguras | aprovado |
| Altura total de `/` em 390, 1280 e 1920 | ≤ 18.000 / 12.000px | 15.316 (390, com details fechados; 18.668 abertos) / 9.888 / 9.865 | aprovado |
| Altura total de `/ressonancia` | sem meta de design | 6.567 (390) / 4.829 (1280) / 4.817 (1920) | informativo |
| Topo de `/` na primeira tela | 1280x800, 1920x943, 390x844 | 1280: seção acaba em 602px; 390: seção acaba em 703px e as duas chamadas em 627 e 679px, acima do banner (735px) | aprovado |
| Alturas por seção de `/` em 1280 (alvo do DESIGN) | não é critério (decisão do orquestrador); só anotação | anotado no teste; 8 acima do alvo (ver R-M1, anotação) | anotação |
| Prints de `/` e `/ressonancia`, 390 e 1280, por seção | sem texto cortado, sobreposição ou buraco | nenhum texto cortado nem sobreposto; sem buraco onde estava pendente | aprovado (ver achados de baixa) |
| Specs e2e | | saude 13/13; acessibilidade 17/17; cabecalho 6/6; design-v2 9 de 9 após a troca de critério (alturas por seção viraram anotação; topo medido contra o banner); variacoes 6/6; comparativo 2/2; cookies 3 + 1 pulado; checkout 1 + 1 pulado; cadastro 2 + 1 pulado; ressonancia 2 + 1 pulado | ver pulos |
| `tsc --noEmit` e `eslint tests/e2e` | limpos | limpos | aprovado |

Altura por seção em 1280 (alvo entre parênteses): espelho 643 (620), dados 593 (520), inimigo 530 (520), virada 807 (760), quem é 897 (820), jornada 1.124 (900), dicionário 759 (560), para quem 733 (560), fechamento 386 (360). Passam: topo, método, ressonância (547, dentro de 2.200), mentoria, perguntas, rodapé.

Copy: varredura de `content/` sem emoji, sem termos proibidos do briefing §6 (webinar, VSL, lead, funil, mindset, growth, insight, curso online, infoproduto, treinamento, garantia de resultado, escassez). Sobram só os usos permitidos: "Growth hacker" (biografia), verbetes do Dicionário (Lead, Funil, CRM, Prompt), "Coach" e "Guru" na lista do que ele não é, e a pergunta "Isso é curso online?", que a resposta nega. Palavra em inglês fora desses casos: "Pensamento Startup Enxuta" (ver R-B1).

### Achados do reteste final

Crítico: nenhum. C1 a C3 seguem abertos; o que mudou é que a pendência não aparece mais na tela, mas o conteúdo continua faltando (fonte da seção 03, resposta de "As reuniões ficam gravadas?", contatos e razão social do rodapé).

Médio:

- **R-M1** (anotação, não é critério) alturas por seção de `/` em 1280 acima do DESIGN: jornada 1.124 (`src/components/secoes/Jornada.tsx`), dicionário 759 (`src/components/secoes/Dicionario.tsx`), quem é 897 (`src/components/secoes/QuemE.tsx`), dados 593 (`src/components/secoes/BlocoDados.tsx`), para quem 733 (`src/components/secoes/ParaQuemE.tsx`), virada 807 (`src/components/secoes/Virada.tsx`), espelho 643 (`src/components/secoes/EspelhoDaDor.tsx`), fechamento 386 (`src/components/secoes/Fechamento.tsx`). Era reprovado por `tests/e2e/design-v2.spec.ts`; agora só anota (decisão do orquestrador).
- **R-M2** `/ressonancia` no celular: LCP de 2,6 s (meta < 2,5 s). O elemento do LCP não saiu no relatório da Lighthouse e o detalhamento do LCP soma pouco (~115 ms), então a causa não está verificada. Medir de novo antes de mexer. Arquivo: `tests/lighthouse/ressonancia-celular.json`.

Baixo:

- **R-B1** "Pensamento Startup Enxuta" em `content/pagina.ts:195`: termo em inglês, contra o §6 do briefing. Decidir se o nome do pilar fica ou se vira tradução (Ferrér).
- **R-B2** prova do Dicionário em `content/pagina.ts:260`: "No Prêmio Tupaenses Excelentes de 2025, Sidney Ferrér presenteou todos os homenageados com um exemplar do Dicionário do Internetês." É um fato novo que não consta nas fontes que eu tenho; confirmar com o Ferrér antes de publicar.
- **R-B3** datas e preço ainda aparecem ao visitante como texto de placeholder, sem o marcador: "Datas a confirmar. Quem se inscreve é avisado primeiro." (`content/pagina.ts:224`) e "Valor a confirmar" (`content/pagina.ts:383`). Não é "PENDENTE", então passa na varredura, mas é decisão de produto: confirmar se é para ficar assim.
- **R-B4** na landing, o resumo da Ressonância (`src/components/secoes/Ressonancia.tsx:14`, print `1280/10-ressonancia.jpg`) tem o texto recuado e um vão grande antes da capa; o bloco parece deslocado em 1280.
- **R-B5** Dicionário em 390 e Jornada em 390 mostram o segundo cartão cortado de propósito (carrossel). Não é defeito, mas quem vê só o print pode ler como texto cortado.

### Não verificado no reteste final

- Prints de `/privacidade` e `/termos` regravados, mas não olhados linha a linha nesta rodada; prints de 1920 não existem.
- Tela de sucesso, link do manual e Turnstile sob demanda: o envio para no 503 esperado sem Supabase, então os testes de sucesso pulam como pendência de ambiente.
- Rolagem dos carrosséis por teclado e botões, além do que a medida de alvos cobre.
- Rastreamento após o aceite, checkout (sem URL), `canonical` e `og:url` (só em prévia da Vercel).
- Lighthouse de `/ressonancia` feita uma vez só, como pedido; a diferença de LCP entre as medições da home pode ser ruído.

## Reteste do redesign v2 (16/11/2026, build de prod com dbcd7fb e a127c22, sem gsap e lenis)

Os 8 specs antigos passaram sem ajuste de seletor. Specs novos: `tests/e2e/cabecalho.spec.ts` e `tests/e2e/design-v2.spec.ts`; `acessibilidade.spec.ts` ganhou os casos com os details abertos e com o menu do celular aberto.

| Critério | Meta | Medido | Situação |
|---|---|---|---|
| Lighthouse desempenho, celular | ≥ 95 | 96, 96, 97 (mediana 96) | aprovado |
| Lighthouse desempenho, desktop | ≥ 95 | 100 | aprovado |
| Acessibilidade, boas práticas (celular e desktop) | ≥ 95 | 100 e 100 | aprovado |
| SEO | ≥ 95 | 69 (só `is-crawlable`, `noindex` proposital, B6) | conhecido |
| LCP celular / desktop | < 2,5 s | 2,3 s nas três / 0,5 s | aprovado, com ressalva (V2-M4) |
| TBT celular / desktop | | 160, 180, 150 ms / 10 ms | |
| CLS celular / desktop | < 0,1 | 0 / 0,01 | aprovado |
| axe, 3 rotas em 390 e 1280 | 0 graves | 0 violações de qualquer gravidade | aprovado |
| axe com os 23 details abertos (390 e 1280) e com o menu aberto (390) | 0 graves | 0 violações | aprovado |
| Maior fonte da página | ≤ 56px | 56px (h1) em 1280 e 1920; 36px em 390; igual com os details abertos | aprovado |
| Rolagem horizontal (390, 1280, 1920; fechado e com tudo aberto) | nenhuma | nenhuma, nenhum elemento fora da largura | aprovado |
| Altura total em 1280 / 1920 | ≤ 12.000px | 11.968 / 11.958 | aprovado |
| Altura total em 390 | ≤ 18.000px | 19.778 | reprovado (V2-M2) |
| Topo inteiro na primeira tela, 1280x800 e 1920x943 | sim | seção termina em 602px | aprovado |
| Topo inteiro na primeira tela, 390x844 | sim | título e as duas chamadas cabem (até 610px, banner começa em 735px); o retrato termina em 992px | reprovado em parte (V2-M1) |
| Alvos de toque (botões, links do menu, resumos de details, caixas de marcar) | ≥ 48px | 54 a 59 alvos por largura, todos ≥ 48px, também com os details abertos | aprovado |
| Âncoras do cabeçalho (1280) e do menu (390) | seção logo abaixo do cabeçalho | as 5 param entre 0 e 40px abaixo dele | aprovado |
| Menu do celular | abre por toque e teclado, fecha ao escolher | confere; sem JavaScript abre e as âncoras funcionam (só não fecha sozinho) | aprovado |
| Console, CSP, requisições, links e âncoras (`saude`) | sem erro | 7 de 7 | aprovado |
| Variações do topo, comparativo, cookies, checkout | | 6 de 6; 2 de 2; 3 + 1 pulado (M3); 1 + 1 pulado (M4) | aprovado |
| Formulários | | validação e corpo enviado conferem; envio completo pulado nos dois pelo 503 esperado em prod (P1) | pendência de ambiente |

Lighthouse 13.6.0, página de 333 KiB no celular. O índice da máquina ficou em 1673 a 1742 (era ~950 na medição anterior): a máquina estava mais folgada, então a nota não se compara direto com os 87 a 92 de antes. Maior tarefa longa no celular: 258 a 328 ms em `01t2i9pe5vz2-.js` (era 410 a 494 ms). Gravados: `tests/lighthouse/celular.json` (mediana) e `tests/lighthouse/desktop.json`.

Altura por seção em 1280 (alvo do DESIGN v2 entre parênteses): topo 504 (720), espelho 643 (620), dados 632 (520), inimigo 530 (520), virada 807 (760), quem é 926 (820), método 609 (680), jornada 1148 (900), dicionário 729 (560), ressonância 2453 (2200), mentoria 796 (900), para quem 733 (560), perguntas 625 (620), fechamento 386 (360), rodapé 348 (360).

### Achados do redesign v2

Crítico (já conhecidos, seguem abertos):

- **C1** marcadores visíveis ao visitante: `content/pagina.ts:87` (print `03-dados.jpg`), `content/pagina.ts:435` (resposta de "As reuniões ficam gravadas?"), `content/legal.ts:17, :18, :46, :48, :60, :109, :158` (prints `privacidade.jpg` e `termos.jpg`). Do mesmo tipo: "Amostra a validar pelo Ferrér" (`content/pagina.ts:254`, print `09-dicionario.jpg`).
- **C2** rodapé sem contato nem razão social (print `15-footer.jpg`). **C3** números sem fonte confirmada.

Médio:

- **V2-M1** em 390x844 o topo não cabe inteiro na primeira tela: o retrato começa em ~620px e termina em 992px, e o banner de cookies cobre de 735px para baixo; aparece só o alto da cabeça (`src/components/secoes/Topo.tsx:11–21`, print `390/00-primeira-tela-com-cookies.jpg`).
- **V2-M2** página com 19.778px em 390 (meta 18.000). As maiores: ressonância 4.274, jornada 1.996, quem é 1.796, mentoria 1.696, para quem 1.415.
- **V2-M3** em 1280 a coluna da prévia da Ressonância acaba ~750px antes do formulário ao lado e deixa um vazio grande à esquerda (`src/components/secoes/Ressonancia.tsx:105`, print `1280/10-ressonancia.jpg`).
- **V2-M4** o LCP do celular passou de 1,0 s (subtítulo) para 2,3 s: agora é o retrato (`div.entra > picture > img`), que no celular fica abaixo das chamadas. Dentro da meta, com pouca folga.
- **V2-M5** 11 das 15 seções passam da altura-alvo em 1280 (lista acima); as mais distantes: jornada +248, ressonância +253, para quem +173, dicionário +169, dados +112, quem é +106. A página só cabe nos 12.000px por 32px.

Baixo:

- **V2-B1** `1280/07-metodo.jpg`: os dois cartões dos pilares têm alturas diferentes (4 e 6 etapas), sobra um degrau sob o da esquerda (`src/components/secoes/Metodo.tsx:11`, `items-start`).
- **V2-B2** `1280/termos.jpg` e `1280/privacidade.jpg`: texto em coluna estreita à esquerda, metade direita vazia; as páginas legais não têm o cabeçalho novo, só o link de voltar.
- **V2-B3** "Simulação com dados fictícios" aparece três vezes no mesmo cartão da prévia (rótulo, imagem e legenda), prints `10-ressonancia.jpg`.
- **V2-B4** `1280/06-quem-e.jpg`: "Ver todos" das etiquetas cai sozinho numa segunda linha, com recuo diferente das etiquetas.
- **V2-B5** quebras forçadas estranhas em 390: "Esta / é uma amostra" (`09-dicionario.jpg`) e os títulos das pautas (`08-jornada.jpg`); "Datas a confirmar" repetido nas três pautas.
- **V2-B6** Inimigo tem 5 cartões de citação; o DESIGN v2 fala em 3 (`04-inimigo.jpg`). Conferir se é decisão.
- **V2-B7** sem JavaScript o menu do celular não fecha ao escolher a âncora (fica aberto sobre a seção); com JavaScript fecha.

Sem achado nos demais prints: nenhum texto cortado nem sobreposição em `01` a `15` nas duas larguras.

### Não verificado no redesign v2

- Tela de sucesso, link do manual e "Turnstile só quando a Cloudflare pede ação": o envio para no 503 esperado em prod (sem Supabase); o Turnstile não chegou a ser exercitado.
- Rastreamento após o aceite (sem IDs), checkout (sem URL), `canonical`/`og:url` (A4, só em prévia da Vercel).
- 1920: só as medidas (fonte, alturas, topo, rolagem); sem prints nem axe nessa largura.
- Carrosséis: botões medidos (48px) e axe sem violação; a rolagem por botão e por teclado não tem teste próprio.
- Prints das páginas legais em 390 conferidos só por axe e `saude`, não linha a linha.

## Medição final (16/11/2026, build de prod com 7a14517, 98059da, 38bc87e e a2e25e6)

| Critério | Meta | Medido | Situação |
|---|---|---|---|
| Lighthouse desempenho, celular | ≥ 95 | 87, 92, 90 (mediana 90) | reprovado |
| Lighthouse desempenho, desktop | ≥ 95 | 100 | aprovado |
| LCP celular | < 2,5 s | 1,0 s nas três | aprovado |
| LCP desktop | < 2,5 s | 0,5 s | aprovado |
| Lighthouse acessibilidade | ≥ 95 | 100 | aprovado |
| Lighthouse boas práticas | ≥ 95 | 100 | aprovado |
| Lighthouse SEO | ≥ 95 | 69 | reprovado só pelo `noindex` proposital (B6) |
| axe, violações graves | 0 | 0 de qualquer gravidade, nas 3 rotas, em 390 e 1280 | aprovado |

| Medição | Desempenho | LCP | TBT | CLS | FCP | TTI | Maior tarefa longa | Índice da máquina |
|---|---|---|---|---|---|---|---|---|
| Celular 1 | 87 | 1,0 s | 500 ms | 0 | 1,0 s | 3,5 s | 494 ms | 964 |
| Celular 2 | 92 | 1,0 s | 340 ms | 0 | 1,0 s | 3,3 s | 410 ms | 941 |
| Celular 3 (mediana, em `tests/lighthouse/celular.json`) | 90 | 1,0 s | 430 ms | 0 | 1,0 s | 3,4 s | 438 ms | 952 |
| Desktop (`tests/lighthouse/desktop.json`) | 100 | 0,5 s | 50 ms | 0 | 0,3 s | 0,7 s | 112 ms | 949 |

Elemento do LCP: celular, o subtítulo do topo (`section.relative > div.conteiner > div.relative > p.entra`); desktop, o retrato (`picture > img`). Página com 366 KiB (antes 396). Acessibilidade 100, boas práticas 100 e SEO 69 nas quatro medições.

Specs em prod, um por vez: `saude` 7 de 7; `acessibilidade` 8 de 8; `cookies` 3 passam e 1 pulado (M3); `variacoes-topo` 6 de 6; `cadastro-jornada` 2 passam e 1 pulado; `ressonancia` 1 passa e 1 pulado; `comparativo` (novo) 2 de 2; `prints` 6 de 6.

- Formulários com hidratação tardia: depois de rolar até eles, preencher e enviar funciona nos dois. O corpo enviado confere (UTM, afiliado, variação, consentimentos, token do Turnstile) e a rota responde o 503 esperado com a mensagem de envio indisponível; o pulo é só por esse 503.
- Comparativo dos 17 pares: com JavaScript desligado em 390px, os 17 pares estão no HTML, o rádio "Digital" troca a coluna visível, a seta do teclado volta para "Analógica" e o lado escondido continua no documento para leitor de tela. Em 1280px as duas colunas aparecem juntas (`tests/prints/1280/05-virada.jpg`).
- Prints conferidos: `390/00` e `390/01` mostram as duas chamadas do topo inteiras acima do banner; `1280/01` mostra o retrato maior, descendo até a linha das chamadas e esmaecendo na base.

Segue aberto:

- A2. Desempenho no celular 87 a 92 (meta 95). O que sobra é a hidratação: tarefa longa de 410 a 494 ms em `01t2i9pe5vz2-.js` e TBT de 340 a 500 ms, com a máquina no mesmo índice da Onda 3 (835 a 901), quando o TBT era 820 a 950 ms.
- A4. `canonical` e `og:url` só conferíveis numa prévia da Vercel.
- C1, C2, C3 (dependem do Ferrér) e as pendências de ambiente M3, M4 e o link do manual (P1).

Não verificado nesta rodada: tela de sucesso e link do manual (precisam de dev ou Supabase), rastreamento após o aceite, checkout, o commit 98059da (revogar cookies recarrega a página) e o 38bc87e (deduplicação, limite de taxa, auditoria) não têm teste e2e próprio, e a varredura de copy não foi refeita depois de a2e25e6.

## Reteste da Onda 4 (16/11/2026, build de prod com d3a648b, 47bc936, 088ecf9 e f6983cb)

| Critério | Meta | Onda 3 | Onda 4 | Situação |
|---|---|---|---|---|
| Lighthouse desempenho, celular | ≥ 95 | 71, 69, 71 | 93 e 84 (2 medições) | ainda reprovado |
| Lighthouse desempenho, desktop | ≥ 95 | 100 | 100 | aprovado |
| LCP celular | < 2,5 s | 3,5 s | 0,9 s e 1,0 s | aprovado |
| LCP desktop | < 2,5 s | 0,8 s | 0,5 s | aprovado |
| Lighthouse acessibilidade | ≥ 95 | 100 | 100 | aprovado |
| Lighthouse boas práticas | ≥ 95 | 96 | 100 | aprovado |
| Lighthouse SEO | ≥ 95 | 69 | 69 | reprovado só pelo `noindex` proposital (B6) |
| axe, violações graves | 0 | 0 | 0 (e 0 moderadas) | aprovado |

Lighthouse 13.6.0, relatórios regravados em `tests/lighthouse/` (celular 1 e desktop):

| Medição | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS | FCP | TTI | Índice da máquina |
|---|---|---|---|---|---|---|---|---|---|---|
| Celular 1 (arquivo) | 93 | 100 | 100 | 69 | 0,9 s | 320 ms | 0 | 0,9 s | 3,5 s | 1646 |
| Celular 2 | 84 | 100 | 100 | 69 | 1,0 s | 640 ms | 0 | não anotado | não anotado | 948 |
| Desktop (arquivo) | 100 | 100 | 100 | 69 | 0,5 s | 10 ms | 0 | 0,3 s | 0,7 s | 1602 |

Elemento do LCP: no celular, o subtítulo do topo (`section.relative > div.conteiner > div.lg:col-span-7 > p.entra`, atraso de renderização 141 ms); no desktop, o retrato (`picture > img`, alt "Sidney Ferrér, o Gestor Sincero…"). O banner de cookies deixou de ser o LCP.

Ressalva de comparação: a nota do celular acompanha a carga da máquina. Com índice 1646 deu 93; com 948 (perto dos 835 a 901 da Onda 3) deu 84. O ganho de LCP aparece nas duas medições; o do TBT só pode ser comparado na medição 2 (640 ms contra 820 a 950 ms).

Specs rodados em prod: `saude` 7 de 7, `acessibilidade` 8 de 8, `cookies` 3 passam e 1 pulado (M3), `variacoes-topo` 6 de 6, `prints` 6 de 6 (todos os 36 regravados). Nenhum teste dependia do texto antigo do banner (todos leem de `content`).

| Item | Situação | Evidência |
|---|---|---|
| A1 LCP no banner | corrigido e conferido | LCP do celular 0,9 s a 1,0 s; elemento é o subtítulo do topo |
| A2 thread principal no celular | ainda aberto, melhorou | TBT 320 ms e 640 ms; maior tarefa longa 296 ms em `01t2i9pe5vz2-.js` (hidratação); thread principal 2,6 s (antes 3,8 s); `/privacidade` e `/termos` não carregam mais chunk com Zod; página 396 KiB (antes 410). Desempenho 84 a 93, abaixo de 95 |
| A3 `eval` bloqueado pela CSP | corrigido e conferido | `saude.spec.ts` 7 de 7 com a CSP de prod (sem `'unsafe-eval'`); `inspector-issues` e console vazios no Lighthouse; Boas Práticas 100 |
| A4 endereço do site | corrigido em parte, não conferível aqui | `config/site.ts:57` a `:59` usa `VERCEL_URL` antes de cair em localhost, e `src/server/aplicacao/http.ts:63` a `:67` aceita o host da requisição. Local: origem certa segue adiante (503 pela falha fechada), outra origem responde 403. `canonical` e `og:url` continuam `http://localhost:3000` neste build, porque não há variável; só dá para conferir numa prévia da Vercel |
| M1 banner cobrindo o botão no celular | corrigido e conferido | `tests/prints/390/00-primeira-tela-com-cookies.jpg`: banner com cerca de 150 px (antes 225), botão principal inteiro visível; o link secundário "Conhecer a mentoria" ainda fica meio coberto |
| M2 corte reto no retrato em 1280px | corrigido e conferido na base | `tests/prints/1280/01-topo.jpg`: a base esmaece no preto. A borda esquerda do braço ainda tem uma transição leve, visível só de perto |
| B1 tarja fora de região | corrigido e conferido | axe com 0 violações em `/` (390 e 1280, com e sem erros de formulário) |
| B5 manifesto e ícone | corrigido e conferido | `<link rel="manifest" href="/manifest.webmanifest">` e `apple-touch-icon` no HTML; `saude.spec.ts` confere que respondem 200 |
| B7 CSP e CORP | corrigido em parte | `Cross-Origin-Resource-Policy: same-origin` presente; `Permissions-Policy` sem `bluetooth` e `browsing-topics`, nenhum aviso no console; `script-src 'unsafe-inline'` continua (limite do ADR 0002) |

Não retestado nesta onda: C1, C2, C3 (dependem do Ferrér; o rodapé segue sem contatos em `tests/prints/390/15-footer.jpg`), M3 a M6, B2 a B4, B6 e os specs de formulário, checkout e links fora de `saude`.

A partir daqui, o registro original da Onda 3.

## Critérios de aceite

| Critério | Meta | Medido | Situação |
|---|---|---|---|
| Lighthouse desempenho, celular | ≥ 95 | 71, 69 e 71 (3 medições) | reprovado |
| Lighthouse desempenho, desktop | ≥ 95 | 100 | aprovado |
| LCP celular | < 2,5 s | 3,5 s, 3,6 s e 3,5 s | reprovado |
| LCP desktop | < 2,5 s | 0,8 s | aprovado |
| Lighthouse acessibilidade | ≥ 95 | 100 (celular e desktop) | aprovado |
| Lighthouse boas práticas | ≥ 95 | 96 (celular e desktop) | aprovado, com 1 falha (A3) |
| Lighthouse SEO | ≥ 95 | 69 (celular e desktop) | reprovado só por `noindex` proposital (B6) |
| axe, violações graves | 0 | 0 críticas, 0 sérias | aprovado |

## Números

Lighthouse 13.6.0 em `/`. Relatórios versionados: `tests/lighthouse/celular.json` e `tests/lighthouse/desktop.json` (medição 3 do celular e 2 do desktop; as anteriores não foram guardadas).

| Medição | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT | FCP | Índice de velocidade | TTI |
|---|---|---|---|---|---|---|---|---|---|---|
| Celular 1 | 71 | 100 | 96 | 69 | 3,5 s | 0 | 820 ms | 1,0 s | 1,5 s | 4,1 s |
| Celular 2 | 69 | não anotado | não anotado | não anotado | 3,6 s | 0 | 950 ms | 1,0 s | não anotado | não anotado |
| Celular 3 (arquivo) | 71 | 100 | 96 | 69 | 3,5 s | 0 | 830 ms | 1,0 s | 1,6 s | 4,2 s |
| Desktop 1 | 100 | 100 | 96 | 69 | 0,8 s | 0 | 40 ms | 0,3 s | 0,6 s | 0,8 s |
| Desktop 2 (arquivo) | 100 | 100 | 96 | 69 | 0,8 s | 0 | 20 ms | 0,3 s | 0,5 s | 0,8 s |

O elemento do LCP é o mesmo no celular e no desktop: `p#gs-cookies-texto`, o texto do banner de cookies (A1).

Ressalva: o Lighthouse avisou que esta máquina é mais lenta que a de referência (índice 835 a 901 no celular, 1338 a 1384 no desktop) e as medições rodaram com prioridade baixa (`pesado.sh`). O TBT do celular pode melhorar em máquina calibrada; a causa do LCP (A1) não depende da máquina. Peso total da página: 410 KiB em 19 requisições, nenhuma a terceiros na carga.

axe 4.x (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`), em 390px e 1280px:

| Rota | Críticas | Sérias | Moderadas | Regras aprovadas |
|---|---|---|---|---|
| `/` | 0 | 0 | 1 (`region`, ver B1) | 50 |
| `/` com erros dos dois formulários, sem o banner | 0 | 0 | 1 (`region`) | 49 |
| `/privacidade` | 0 | 0 | 0 | 32 |
| `/termos` | 0 | 0 | 0 | 32 |

O axe deixou o contraste de cerca de 355 elementos de `/` como indeterminado (325 por "fundo sobreposto por outro elemento", efeito do fio dourado e das camadas). Medição própria de todo texto visível contra o fundo sólido mais próximo: menor razão 8,52:1 (ouro `rgb(206,163,61)` sobre preto), texto secundário 9,0:1 a 9,8:1, texto principal 16:1 a 17,6:1. Tudo acima de AA (4,5:1). A cor de erro (`--color-erro`, `src/styles/tokens.css:14`) não foi medida em tela.

Testes e2e (`tests/e2e/`): 38 testes; 25 passam, 3 falhavam em prod (A3), 4 eram pulados em prod por pendência de ambiente (2 por P1, que passam em dev; 1 por M3; 1 por M4) e 6 são os prints (só com `PRINTS=1`).

## Achados por gravidade

### Crítico (impede publicar)

- C1. Marcadores `[PENDENTE FERRÉR]` aparecem para o visitante. Em `/`: fonte dos dados (`content/pagina.ts:87`), duas respostas das perguntas frequentes (`content/pagina.ts:429` e `:431`, a segunda é só o marcador) e o aviso "Amostra a validar pelo Ferrér" (`content/pagina.ts:254`). Em `/privacidade`: controladora, encarregado, fornecedor de envio, plataforma de pagamento e prazo de retenção (`content/legal.ts:17`, `:18`, `:46`, `:48`, `:60`). Em `/termos`: empresa operadora e foro (`content/legal.ts:109`, `:158`). Repetir: abrir cada rota e procurar "PENDENTE".
- C2. Política de privacidade sem controlador nem canal. O texto manda usar "os contatos oficiais que aparecem no rodapé" (`content/legal.ts:18`), mas o rodapé não mostra contato algum porque `config/site.ts:70` e `:71` estão `null`. Ver `tests/prints/390/15-footer.jpg`. O §9 do briefing exige controlador, finalidade, retenção e canal.
- C3. Números sem fonte confirmada na seção de dados: 7,3%, 20%, 71%, 92% e "o grupo com o maior índice de geração de emprego" (`content/pagina.ts:81` a `:87`), com a fonte ainda "Sebrae/IBGE [PENDENTE FERRÉR: estudo e ano]". O §6 proíbe número sem fonte.

### Alto

- A1. LCP do celular reprovado porque o maior elemento da primeira tela é o texto do banner de cookies (`p#gs-cookies-texto`), que só existe depois da hidratação: `src/components/global/BannerCookies.tsx:29` devolve `null` até hidratar. Atraso de renderização do elemento medido pelo Lighthouse: 628 ms sem limitação e LCP final de 3,5 s com a limitação de celular. Repetir: `CHROME_PATH=<chromium do playwright> scripts/pesado.sh npx lighthouse http://localhost:3000/ --output=json` e ler `lcp-breakdown-insight`.
- A2. Thread principal ocupada no celular: TBT 820 a 950 ms, 1,97 s de execução de script. Tarefas longas: 551 ms e 280 ms em `01t2i9pe5vz2-.js` (229 KB, React DOM e hidratação) e 208 ms em `2a3iml0rheide.js` (71 KB, GSAP). JavaScript não usado na carga: 27 KB de 72 KB e 22 KB de 47 KB (transferidos) em dois chunks. O chunk com o Zod (`42j_jl3p2yilg.js`, 153 KB) é carregado também em `/privacidade` e `/termos`, puxado por `src/components/global/origem.ts:1` no layout.
- A3. A CSP bloqueava um `eval` em todas as rotas no build de prod: `script-src bloqueou eval (/_next/static/chunks/42j_jl3p2yilg.js:1)`, no chunk que contém o Zod, derrubando Boas Práticas para 96 (`inspector-issues`) e fazendo falhar 3 testes de `tests/e2e/saude.spec.ts`. Correção aplicada pelo orquestrador (`z.config({ jitless: true })`, commit 088ecf9). Reteste em dev: os 7 testes de `saude.spec.ts` passam, mas não é conclusivo, porque a CSP de dev inclui `'unsafe-eval'` (`next.config.ts:13`) e não bloquearia o `eval` de qualquer forma. Falta repetir em prod.
- A4. Sem `NEXT_PUBLIC_SITE_URL` no build, o site assume `http://localhost:3000` (`config/site.ts:53`) sem avisar. Efeitos vistos neste build: `canonical`, `og:url` e `og:image` apontam para localhost, e o valor fica gravado no bundle. Efeito previsto em produção (lido no código, não exercitado): `src/server/aplicacao/http.ts:64` compara o `Origin` com `site.url`, então todo envio de formulário responderia 403 `antirrobo`.

### Médio

- M1. No celular (390x844) o banner de cookies cobre o botão principal da primeira tela: `tests/prints/390/00-primeira-tela-com-cookies.jpg`. O banner ocupa cerca de 225 px de altura.
- M2. Em 1280px o retrato do topo termina em corte reto embaixo e à esquerda: `tests/prints/1280/01-topo.jpg`. O esmaecimento (`src/components/secoes/Topo.tsx:48`) cobre o terço inferior do contêiner, que é mais alto que a foto (`Topo.tsx:23`), então não alcança a base da imagem. Em 390px o esmaecimento funciona. Causa inferida pelo print, não confirmada no DevTools.
- M3. Pendência de ambiente: rastreamento após o aceite não exercitado; o build não tem `NEXT_PUBLIC_META_PIXEL_ID` nem `NEXT_PUBLIC_GA4_ID`. O bloqueio antes do aceite passa, mas passaria de qualquer jeito sem os IDs. Precisa de novo teste com IDs de teste no build.
- M4. Pendência de ambiente: link de checkout com UTM e afiliado não exercitado no navegador, porque `config/site.ts:67` é `null` e o botão da mentoria cai em `#jornada`. A função que monta o link está coberta pelo teste unitário `src/components/global/origem.test.ts` (8 testes passam; 3 são de `montarLinkCheckout`: acrescenta UTM e afiliado, não duplica parâmetro, sem origem devolve o link). O teste e2e já está escrito e passa a valer quando houver URL.
- M5. `npm audit` (rodado também pelo orquestrador, mesmo resultado): 8 vulnerabilidades moderadas, todas na cadeia de desenvolvimento (`minimatch` 7.0.0 a 11.0.0, GHSA-g3hv-75wg-m249, via `@typescript-eslint/*` e `eslint-config-next`). `npm audit --omit=dev`: 0. A correção oferecida rebaixa `eslint-config-next` para 15.5.29 (quebra).
- M6. O Turnstile (`challenges.cloudflare.com`) é carregado antes de qualquer resposta ao banner, quando um formulário se aproxima da tela. É antirrobô (essencial), mas é um terceiro: confirmar que está descrito na política de privacidade.

### Baixo

- B1. axe `region` (moderada): a tarja fixa fica fora de qualquer região (`src/components/secoes/Tarja.tsx:6`).
- B2. Inglês fora da biografia: "Pensamento Startup Enxuta" (`content/pagina.ts:190`, nome de etapa do método; a descrição traduz como "empresas nascentes"). "ESG" aparece já traduzido (`:128`). "Growth hacker" (`:145`) é a exceção permitida. "Lead", "Funil", "CRM" e "Prompt" são verbetes do Dicionário. "Coach" e "curso online" só aparecem em negação.
- B3. Siglas sem explicação: "B.A.S.I.C.O." (`content/pagina.ts:278`) e "IA" no nome da entrega (`:280`, explicada na descrição).
- B4. "Uma máquina de vendas que trabalha todos os dias" (`content/pagina.ts:117`): vem do briefing, mas é a frase mais próxima de promessa de resultado. Nenhuma promessa de faturamento, escassez ou contador foi encontrada.
- B5. Não há `link rel="manifest"` nem `apple-touch-icon` no HTML, embora `public/icon-192.png`, `icon-512.png` e `apple-touch-icon.png` existam. `public/img/manifest.json` é o manifesto de imagens, não o do aplicativo.
- B6. `robots` com `noindex, nofollow`, `robots.txt` com `Disallow: /` e `sitemap.xml` vazio, por `indexar: false` (`config/site.ts:54`). Proposital na prévia; trocar antes de publicar (é o que deixa o SEO em 69).
- B7. CSP com `script-src 'unsafe-inline'` (`next.config.ts:13`), limite já registrado no ADR 0002. Sem `Cross-Origin-Resource-Policy`.

## Varreduras sem achado

- Emoji e símbolos em `content/`: nenhum.
- Termos proibidos do §6 (`webinar`, `VSL`, `mindset`, `insight`, `infoproduto`, `treinamento`): nenhum.
- Números de produto (52 temas, 9 fases, 45 a 60 dias, 5.000 verbetes, 10 etapas, garantia de 7 dias, 3 livros) conferem com o briefing §2 e §5.
- Links: nenhuma âncora sem alvo, nenhum arquivo interno com erro nas três rotas (inclui `srcset`). `robots.txt`, `sitemap.xml`, `og.jpg` e favicon respondem 200. Não há link externo nas páginas.
- Segredos: nada em `.next/static` (só nomes `NEXT_PUBLIC_*` e a chave pública de teste do Turnstile), nada nos arquivos versionados (só valores de teste em `src/server/teste/servicosSimulados.ts`), nada nos 25 commits. `.env.example` sem valores. Sem source maps públicos (`.map` responde 404).
- Headers em todas as rotas, inclusive 404 e API: CSP, HSTS (2 anos, `includeSubDomains`, `preload`), `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy`, `Permissions-Policy`; sem `X-Powered-By`.
- Falha fechada conferida: em modo prod sem `SUPABASE_URL`, `compor()` devolve `null` (`src/server/aplicacao/composicao.ts:84`) e as duas rotas de formulário respondem 503 `indisponivel` sem gravar nada; o formulário mostra a mensagem de envio indisponível. É o comportamento correto, não defeito.
- API: `GET` nas rotas de formulário responde 405; `POST` de outra origem responde 403; a exportação do admin responde 503 sem Supabase; respostas com `Cache-Control: no-store`.
- Cookies: nenhum cookie e nenhuma requisição a Meta ou Google antes do aceite nem após a recusa, mesmo rolando a página e começando a preencher o formulário; a escolha persiste na recarga.
- Variações do topo: `/`, `?v=a`, `?v=x` e `?v=B` mostram A; `?v=b` mostra B; o `<h1>` do HTML estático é o A.
- Origem: UTM, afiliado (`afiliado` e `ref`) e variação chegam no corpo do envio; a primeira visita vence na sessão.
- Rolagem horizontal em 390px e 1280px: nenhuma.

## Pendências de ambiente

- P1 (antigo A5). Caminho feliz dos formulários, conferido em modo dev com adaptadores em memória: os dois envios respondem 200, o formulário some, o título de confirmação aparece e recebe o foco ("Inscrição confirmada" e "Pedido recebido"); `cadastro-jornada.spec.ts` 3 de 3 e `ressonancia.spec.ts` 2 de 2. Não verificado: o link do manual. O adaptador em memória devolve `null` (`src/server/infra/memoria/index.ts:84`), a resposta vem sem `manualUrl` e o botão "Baixar o manual agora" não é exibido (o teste afirma essa ausência e anota a pendência). Precisa de Supabase com o arquivo no bucket. Também não exercitados: deduplicação e limite por IP no navegador.
- P2. IDs de teste de Pixel e GA4 no build (M3).
- P3. URL de checkout em `config/site.ts` (M4); nenhum valor foi inventado.
- P4. Medição de celular em máquina calibrada ou no PageSpeed depois do deploy de prévia.

## Como repetir

Um arquivo por vez: `scripts/pesado.sh npx playwright test tests/e2e/<arquivo>.spec.ts`. Prints: `PRINTS=1 scripts/pesado.sh npx playwright test tests/e2e/prints.spec.ts` (grava em `tests/prints/390` e `tests/prints/1280`, 18 imagens cada).
