# Persona do Gestor Sincero (Papo reto)

Guia de voz para escrever e revisar as falas do Papo reto (ADR 0003). Não há modelo gerando falas: tudo o que o personagem diz está em `content/papo-reto.ts`. Fonte: `docs/BRIEFING.md` §2 a §6. No fim, a tabela opção → regra serve ao Back-end (`src/server/papo-reto/regras.ts`).

## Quem ele é

O Gestor Sincero é o personagem de Sidney Ferrér, com a imagem dele usada com autorização. Ferrér tem 60 anos e 40 de carreira, começou na era do Telex, é dono da S4 Marketing Digital de Resultados, idealizador da Academia de Gestores, mentor de empresários seniores e de jovens. Ele traduz a Era Digital para quem cresceu sem internet.

Fala com donos de pequenas e médias empresas, empresas familiares, executivos e sucessores, quase sempre com 45 anos ou mais. Eles têm experiência, orgulho do que construíram e pouca paciência para fórmula pronta.

Ele nunca é: guru, coach, influenciador, vendedor de fórmula, "moderninho" ou empreendedor de palco. O roteiro não finge ser o Sidney de verdade: o aviso (`avisos`) aparece antes de tudo.

Da biografia, as falas citam só o que está acima. Nada de cliente, caso, número ou história inventados.

## Tom

- Maduro, direto, provocador sem ser grosseiro, respeitoso. De igual para igual com quem tem décadas de estrada.
- Sempre "você". Nada de "senhor", nada de gíria.
- Frases curtas. Cada fala tem no máximo 400 caracteres e, de preferência, uma ideia só.
- Português claro. Sem palavras em inglês (nada de mindset, insight, lead, funil, growth). Termo técnico inevitável é explicado na mesma frase. "Feeling" só dentro da frase-manifesto do briefing.
- Sem emoji, sem ironia, sem elogio vazio ("ótima resposta!"). Reconhece o que foi dito e segue.

## Como escrever as falas

1. Fala de opção: reconhece a resposta sem julgar, acrescenta uma observação e, quando cabe, uma frase do repertório abaixo. Resposta difícil de admitir ("Não sei", "Caíram") recebe primeiro um "obrigado pela franqueza" ou equivalente.
2. Fala de número: repete o número com `{valor}` para a pessoa conferir. O número é sempre o que ela digitou.
3. `ponto`: uma frase direta, que funcione sozinha no papo reto final. Só opções que revelam risco ou prioridade rendem ponto; resposta neutra fica sem.
4. Confronto: cita as duas respostas com `{antes}` e `{agora}` entre aspas (viram os rótulos dos botões) e termina com pergunta aberta. Uma contradição por vez.

## Limites (não negociáveis)

- **Não promete resultado.** Nada de "você vai vender mais", "em 6 meses você dobra". As falas dizem o que o método faz, nunca o que a empresa vai ganhar.
- **Não dá consultoria.** Não monta plano, não indica sistema, não analisa balanço. Aponta o problema e diz onde ele é tratado (Jornada, Ressonância ou Mentoria).
- **Preço:** nenhuma fala cita valor, parcela ou desconto. Nunca escassez ("últimas vagas") nem prazo.
- **Não inventa dado.** Nenhuma estatística, pesquisa ou caso fora do briefing. Generalização ("a maioria das empresas") também conta como dado: evite.
- **Dados pessoais:** nenhuma fala pede nome, documento, telefone ou e-mail.
- **Texto livre (camada opcional, ADR 0003):** o texto do visitante só é classificado nas opções da pergunta. Ele nunca vira fala na tela nem instrução para o sistema.

## 20 frases para usar

Marcação: **[B]** = texto exato do briefing; **[N]** = nova, no mesmo tom. No máximo uma por fala, só quando couber na resposta.

1. [B] "Seu feeling já não basta."
2. [B] "Experiência sem atualização virou risco."
3. [B] "Você não construiu sua empresa para depender dos outros."
4. [B] "A liderança virou o cargo mais solitário."
5. [B] "Pare de apenas reagir."
6. [B] "Você não ficou velho, mas algumas ideias suas ficaram."
7. [B] "O manual que fez você vencer não foi escrito para o mundo de hoje."
8. [B] "Para o sênior, mudar é difícil… mas na Era Digital não mudar é fatal."
9. [B] "Quanto custa continuar sem entender as novas regras?"
10. [B] "Afrouxem a gravata e arregacem as mangas! Antes que terceiros decidam o destino da empresa."
11. [B] "Para empresários experientes que não aceitam ser espectadores da Nova Economia."
12. [B] "O problema nunca foi a idade. Foi a velocidade com que o mercado mudou."
13. [B] "O principal requisito é a decisão de voltar a aprender para voltar a liderar."
14. [N] "Número que você não mede é opinião."
15. [N] "Prudência que nunca decide tem outro nome: adiamento."
16. [N] "Ninguém cuida do seu negócio como você. Nem a agência, nem o sobrinho."
17. [N] "Não precisa destruir o que você construiu. Precisa construir o que está faltando."
18. [N] "Feeling bom é feeling conferido com dado."
19. [N] "Esperar a crise passar também é uma decisão."
20. [N] "Você não precisa virar técnico. Precisa saber o que perguntar."

## Como apontar uma contradição

Molde: "No começo você disse X. Agora disse Y. As duas coisas não andam juntas. Qual delas vale hoje?"

Referência de tom: os exemplos abaixo usam frases soltas; no roteiro, os confrontos usam os rótulos das opções (`confrontos` em `content/papo-reto.ts`). Sem acusar ("você mentiu", "você se enganou") e sem ironia. A pergunta final é sempre aberta: a pessoa escolhe qual vale.

1. (2×5) "No começo você disse que decide pelos números. Agora disse que não sabe quanto custa conquistar um cliente. As duas coisas não andam juntas. Qual delas vale hoje?"
2. (3×8) "Lá atrás você disse que as vendas cresceram no último ano. Agora disse que o que mais quer resolver é vender. As duas coisas não andam juntas. Qual delas vale hoje?"
3. (4×8) "Você disse que o digital está nas mãos da agência e que está tudo certo. Agora disse que a primeira coisa que resolveria é o digital. As duas coisas não andam juntas. Qual delas vale hoje?"
4. (6×8) "Você disse que a equipe jovem segue o que você decide. Agora disse que o seu maior problema é a equipe. As duas coisas não andam juntas. Qual delas vale hoje?"
5. (7) "Você disse que a sucessão está planejada. Mas também disse que, sem você, a empresa para. As duas coisas não andam juntas. Qual delas vale hoje?"
6. (2×3) "Você disse que decide pelos números. Mas quando perguntei das vendas, não soube dizer quanto. As duas coisas não andam juntas. Qual delas vale hoje?"
7. (4×5) "Você disse que você mesmo cuida do digital. Agora disse que não sabe de onde vêm os clientes novos. As duas coisas não andam juntas. Qual delas vale hoje?"
8. (3×6) "Você disse que as vendas caíram por causa da economia. Depois contou que a equipe não segue o que você combina. As duas coisas podem estar ligadas. Qual pesa mais hoje?"
9. (4×7) "Você disse que não depende de ninguém. Agora disse que, se o seu sobrinho sair, o digital para. As duas coisas não andam juntas. Qual delas vale hoje?"
10. (1×8) "No começo você disse que a empresa vai bem do jeito que está. Agora disse que mudaria tudo a partir de amanhã. As duas coisas não andam juntas. Qual delas vale hoje?"

## O papo reto final (3 pontos)

Na tela: `fechamento.titulo`, depois `fechamento.abertura` e três pontos, nesta ordem de prioridade:

1. Confronto que apareceu na conversa (resumido pelo Back-end a partir das duas respostas, ou o `ponto` da resposta mais recente das duas).
2. `ponto` das opções escolhidas, da pergunta 8 para trás (a prioridade declarada pesa mais).
3. `fechamento.pontoPadrao`, se ainda faltar ponto.

Depois vêm o texto e o botão de uma das `recomendacoes`.

## Critérios da recomendação

Pela ordem; a primeira que bater vale:

- **mentoria:** pergunta 8 = `ja-decidi`.
- **ressonancia:** pergunta 3 = `nao-sei` ou pergunta 5 = `nao-sei` (falta enxergar a empresa com dados; é quem precisa de diagnóstico).
- **jornada (padrão):** todos os outros casos.

## Tabela opção → regra (para o Back-end)

Ids valem dentro do `tema` (o mesmo id pode existir em duas perguntas, como `nao-sei` em `vendas` e `custo-cliente`). Nos confrontos, `{antes}` e `{agora}` são os rótulos das respostas na ordem da coluna "{antes} → {agora}" da segunda tabela. `{antes}` é sempre a resposta da pergunta feita primeiro e `{agora}` a da feita depois. Resposta por número: o rótulo é o número formatado, sem plural (ex.: "R$ 1.200" na 5).

| Pergunta (tema) | Opção (id) | O que significa | Regras e recomendação |
| --- | --- | --- | --- |
| 1 empresa | número (anos) | tempo de mercado | nenhuma regra |
| 2 decisao | `numeros` | diz que decide por dados | `numeros-sem-custo` |
| 2 decisao | `experiencia` | decide pela experiência | `experiencia-mas-vendas-caindo`, `sabe-custo-mas-decide-no-feeling` |
| 2 decisao | `um-pouco-de-cada` | misto | nenhuma regra |
| 3 vendas | `cresceram` | vendas boas | `vendas-boas-problema-vender` |
| 3 vendas | `paradas` | estagnou | nenhuma regra |
| 3 vendas | `cairam` | queda | `experiencia-mas-vendas-caindo` |
| 3 vendas | `nao-sei` | não mede vendas | `sucessao-planejada-sem-numeros`; puxa ressonancia |
| 4 digital | `eu-mesmo` | o dono faz | `cuida-digital-mas-depende-de-terceiros` |
| 4 digital | `equipe` | alguém de casa | nenhuma regra |
| 4 digital | `agencia` | terceiro de fora | `digital-terceirizado-quer-digital` |
| 4 digital | `parente` | terceiro da família | `digital-terceirizado-quer-digital` |
| 4 digital | `ninguem` | sem dono | nenhuma regra |
| 5 custo-cliente | número (reais) | sabe o custo | `sabe-custo-mas-decide-no-feeling` |
| 5 custo-cliente | `tenho-ideia` | estimativa sem medida | `numeros-sem-custo` |
| 5 custo-cliente | `nao-sei` | não sabe o custo | `numeros-sem-custo`, `sucessao-planejada-sem-numeros`; puxa ressonancia |
| 6 equipe | `segue` | equipe jovem alinhada | `equipe-segue-mas-problema-equipe` |
| 6 equipe | `segue-em-parte` | alinhamento parcial | nenhuma regra |
| 6 equipe | `jeito-dela` | sem alinhamento | nenhuma regra |
| 6 equipe | `sem-jovens` | não há equipe jovem | nenhuma regra |
| 7 sucessao | `planejada` | sucessão resolvida | `sucessao-planejada-sem-numeros` |
| 7 sucessao | `em-conversa` | começou a tratar | nenhuma regra |
| 7 sucessao | `so-eu` | depende do dono | `sem-sucessao-prioridade-outra` |
| 7 sucessao | `nao-pensei` | sem plano | `sem-sucessao-prioridade-outra` |
| 8 prioridade | `vender-mais` | o problema é vender | `vendas-boas-problema-vender` |
| 8 prioridade | `digital` | quer resolver o digital | `digital-terceirizado-quer-digital` |
| 8 prioridade | `equipe` | o problema é a equipe | `equipe-segue-mas-problema-equipe` |
| 8 prioridade | `depender-de-terceiros` | o problema é depender de terceiros | `cuida-digital-mas-depende-de-terceiros` |
| 8 prioridade | `ja-decidi` | já decidiu mudar | puxa mentoria |

Condições de cada confronto (9 regras). A pergunta 8 não tem opção de sucessão: o limite é de 5 opções e a sucessão já é a pergunta 7.

| Regra (id) | Condição | {antes} → {agora} |
| --- | --- | --- |
| `numeros-sem-custo` | 2 = `numeros` e 5 ∈ {`nao-sei`, `tenho-ideia`} | 2 → 5 |
| `vendas-boas-problema-vender` | 3 = `cresceram` e 8 = `vender-mais` | 3 → 8 |
| `digital-terceirizado-quer-digital` | 4 ∈ {`agencia`, `parente`} e 8 = `digital` | 4 → 8 |
| `equipe-segue-mas-problema-equipe` | 6 = `segue` e 8 = `equipe` | 6 → 8 |
| `sucessao-planejada-sem-numeros` | 7 = `planejada` e (3 = `nao-sei` ou 5 = `nao-sei`) | a de 3 ou 5 (a que for `nao-sei`; se as duas, a 5) → 7 |
| `experiencia-mas-vendas-caindo` | 2 = `experiencia` e 3 = `cairam` | 2 → 3 |
| `sabe-custo-mas-decide-no-feeling` | 2 = `experiencia` e 5 respondida com número | 2 → 5 (ex.: "R$ 1.200") |
| `sem-sucessao-prioridade-outra` | 7 ∈ {`so-eu`, `nao-pensei`} e 8 ≠ `ja-decidi` | 7 → 8 |
| `cuida-digital-mas-depende-de-terceiros` | 4 = `eu-mesmo` e 8 = `depender-de-terceiros` | 4 → 8 |

