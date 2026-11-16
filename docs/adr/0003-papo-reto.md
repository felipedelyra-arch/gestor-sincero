# ADR 0003: Papo reto com o Gestor Sincero

Data: 16/11/2026. Estado: aceito, em teste (custo zero).

## Contexto

Conversa em texto com o personagem do Ferrér: 6 a 8 perguntas, aponta contradições e termina com uma recomendação (Jornada, Ressonância ou Mentoria). Não substitui o formulário da Jornada.

## Decisões (revisadas em 16/11: custo zero, sem modelo gerando falas)

1. **Modo base sem IA.** Cada uma das 8 perguntas tem opções por botão e/ou campo numérico; a fala do personagem para cada resposta está pré-escrita em `content/papo-reto.ts`. Funciona inteiro sem rede externa.
2. **Contradições e recomendação por regras** em `src/server/papo-reto/regras.ts`: cada regra tem id, perguntas envolvidas e condição; a fala de confronto fica em `content` (`confrontos[id]`), porque texto só mora em `content/`. Mínimo de 8 regras, cada uma com teste. O "papo reto" final junta 3 pontos a partir das respostas (campo `ponto` das opções, contradições primeiro).
3. **Uma rota BFF, sem estado no servidor.** `POST /api/papo-reto` recebe a resposta e um `estado` assinado por HMAC (respostas dadas, pergunta atual, contagem) e devolve o estado novo. O limite de 20 mensagens sai da contagem assinada.
4. **Camada opcional de texto livre.** Com `GROQ_API_KEY`, o texto de "quer explicar melhor?" vai ao Groq (`AI_MODEL_LIVRE`) só para ser classificado nas opções da pergunta (`extracaoLivreSchema`). O texto vai como dado delimitado, sem ferramentas; saída validada por Zod; timeout de 8 s. Sem chave, erro, 429 ou timeout: o texto é ignorado e a conversa segue, sem erro na tela. Proibido provedor que treine com os dados (Gemini grátis fora). Antes de ligar: conferir na documentação do Groq a política de dados e o nome do modelo.
5. **Sem consentimento, nada é salvo.** Com consentimento: tabela `papo_reto` com texto em AES-256-GCM, RLS sem acesso público e limpeza de 30 dias.
6. **Desligado em produção** (`site.papoReto.ativo`) até haver Supabase, Turnstile e a autorização escrita de imagem. Os vídeos em `public/ferrer-avatar/` ficam fora do git e do envio à Vercel até essa autorização.
7. **Aviso em duas versões.** `avisos.roteiro` no modo base (não há IA); `avisos.comIA` só quando a camada de texto livre está ligada.

## Antes de ligar em produção

Parágrafo na política de privacidade (conversa guardada por 30 dias com consentimento; se o texto livre estiver ligado, Groq como operadora e transferência internacional) e autorização de imagem arquivada.

## Ligar na prévia depois da autorização de imagem (um commit)

1. Em `.gitignore`, apagar a linha `/public/ferrer-avatar/`; em `.vercelignore`, apagar a linha `/public/ferrer-avatar`.
2. `git add .gitignore .vercelignore public/ferrer-avatar && git commit -m "Papo reto: vídeos do personagem versionados após autorização de imagem"`.
3. Na Vercel, variável `NEXT_PUBLIC_PAPO_RETO=1` só no ambiente de prévia (e `PAPO_RETO_SEGREDO`, Supabase e Turnstile, sem os quais a rota responde indisponível).

O `.zip` continua fora do git e do envio.
