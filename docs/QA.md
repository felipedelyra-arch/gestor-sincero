# QA da Onda 3 (16/11/2026)

Alvo: `http://localhost:3000` em modo prod (build do orquestrador), sem `.env.local` (sem Supabase, Turnstile real, Pixel ou GA4). Chromium sem interface, 1 worker. Nada de código de produção foi alterado.

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

Testes e2e (`tests/e2e/`): 38 testes; 25 passam, 3 falham (A3), 4 são pulados por pendência de ambiente (2 por P1, 1 por M3, 1 por M4) e 6 são os prints (só com `PRINTS=1`).

## Achados por gravidade

### Crítico (impede publicar)

- C1. Marcadores `[PENDENTE FERRÉR]` aparecem para o visitante. Em `/`: fonte dos dados (`content/pagina.ts:87`), duas respostas das perguntas frequentes (`content/pagina.ts:429` e `:431`, a segunda é só o marcador) e o aviso "Amostra a validar pelo Ferrér" (`content/pagina.ts:254`). Em `/privacidade`: controladora, encarregado, fornecedor de envio, plataforma de pagamento e prazo de retenção (`content/legal.ts:17`, `:18`, `:46`, `:48`, `:60`). Em `/termos`: empresa operadora e foro (`content/legal.ts:109`, `:158`). Repetir: abrir cada rota e procurar "PENDENTE".
- C2. Política de privacidade sem controlador nem canal. O texto manda usar "os contatos oficiais que aparecem no rodapé" (`content/legal.ts:18`), mas o rodapé não mostra contato algum porque `config/site.ts:70` e `:71` estão `null`. Ver `tests/prints/390/15-footer.jpg`. O §9 do briefing exige controlador, finalidade, retenção e canal.
- C3. Números sem fonte confirmada na seção de dados: 7,3%, 20%, 71%, 92% e "o grupo com o maior índice de geração de emprego" (`content/pagina.ts:81` a `:87`), com a fonte ainda "Sebrae/IBGE [PENDENTE FERRÉR: estudo e ano]". O §6 proíbe número sem fonte.

### Alto

- A1. LCP do celular reprovado porque o maior elemento da primeira tela é o texto do banner de cookies (`p#gs-cookies-texto`), que só existe depois da hidratação: `src/components/global/BannerCookies.tsx:29` devolve `null` até hidratar. Atraso de renderização do elemento medido pelo Lighthouse: 628 ms sem limitação e LCP final de 3,5 s com a limitação de celular. Repetir: `CHROME_PATH=<chromium do playwright> scripts/pesado.sh npx lighthouse http://localhost:3000/ --output=json` e ler `lcp-breakdown-insight`.
- A2. Thread principal ocupada no celular: TBT 820 a 950 ms, 1,97 s de execução de script. Tarefas longas: 551 ms e 280 ms em `01t2i9pe5vz2-.js` (229 KB, React DOM e hidratação) e 208 ms em `2a3iml0rheide.js` (71 KB, GSAP). JavaScript não usado na carga: 27 KB de 72 KB e 22 KB de 47 KB (transferidos) em dois chunks. O chunk com o Zod (`42j_jl3p2yilg.js`, 153 KB) é carregado também em `/privacidade` e `/termos`, puxado por `src/components/global/origem.ts:1` no layout.
- A3. A CSP bloqueia um `eval` em todas as rotas: `script-src bloqueou eval (/_next/static/chunks/42j_jl3p2yilg.js:1)`. É o chunk que contém o Zod; a origem provável é a sondagem de `eval` do Zod 4 (não rastreei a linha no código-fonte). A página funciona, mas a violação é registrada a cada carga e derruba Boas Práticas para 96 (`inspector-issues`). Repetir: `scripts/pesado.sh npx playwright test tests/e2e/saude.spec.ts` (3 testes falham com essa mensagem).
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

- P1. Caminho feliz dos formulários (tela de sucesso, foco no título, link do manual): ainda não verificado; roda no fim, com o servidor em modo dev (adaptadores em memória), trocado pelo orquestrador.
- P2. IDs de teste de Pixel e GA4 no build (M3).
- P3. URL de checkout em `config/site.ts` (M4); nenhum valor foi inventado.
- P4. Medição de celular em máquina calibrada ou no PageSpeed depois do deploy de prévia.

## Como repetir

Um arquivo por vez: `scripts/pesado.sh npx playwright test tests/e2e/<arquivo>.spec.ts`. Prints: `PRINTS=1 scripts/pesado.sh npx playwright test tests/e2e/prints.spec.ts` (grava em `tests/prints/390` e `tests/prints/1280`, 18 imagens cada).
