# Status

| Data | Terminal | Entrega |
|---|---|---|
| 2026-11-15 | Orquestrador | Base Next.js 16, `config/site.ts`, schemas de conteúdo e de formulários, conteúdo provisório, PLAN, DESIGN, ADR 0001 |
| 2026-11-15 | Front-end (global) | `src/components/global` (consentimento, BannerCookies, Rastreamento, origem + CapturaOrigem, BotaoWhatsApp, DadosEstruturados, DocumentoLegal), `metadados.ts`, sitemap, robots, `/privacidade` e `/termos`. Falta ligar no layout (rodada 2) |
| 2026-11-15 | Back-end (núcleo) | Rodada 1: portas e entidades do domínio, casos de uso dos dois formulários, rotas BFF `/api/cadastro-jornada` e `/api/ressonancia`, adaptadores em memória, composição (ponto único para os reais) e 18 testes das rotas |
| 2026-11-15 | Back-end (infra) | `supabase/migrations/0001_inicial.sql` (RLS sem policy, `consumir_limite`, bucket privado `manual`; ainda não aplicada), `src/server/infra/cripto/` (`criarCifra`, 7 testes), headers de segurança e CSP em `next.config.ts`, ADR 0002 |
| 2026-11-15 | Back-end (núcleo) | Rodada 1b: deduplicação sem sobrescrita, gravação atômica na porta (`registrarCadastro` / `registrarPedidoRessonancia`), ordem dos cabeçalhos de IP e `idEvento` aleatório na resposta e na Meta |
| 2026-11-15 | Orquestrador | Retomada com regras de recursos: `scripts/pesado.sh`, `scripts/servidor.sh`, R1 a R8 no `AGENTS.md`, briefing novo (§1 a §10), ondas no PLAN, vitest e playwright com 1 worker. Falta instalar `sharp` e o chromium do playwright |
| 2026-11-15 | Front-end | Globais ligados no layout (cookies, origem, rastreamento, WhatsApp, JSON-LD); `src/components/origem.ts` removido; seções 03 a 08 implementadas (comparativo dos 17 pares, linha do tempo do método, Jornada com formulário e header `x-gs-consentimento`); revelação por opacidade em `Secao`. Conferido em 390px e 1280px. Faltam 09 a 16 |
| 2026-11-15 | Back-end (adaptadores) | Onda 2: adaptadores reais atrás das portas (`src/server/infra/supabase/*`, `turnstile.ts`, `webhook.ts` com HMAC, `meta.ts`), migração `0002_registro_atomico.sql` (`registrar_cadastro`, `registrar_pedido`; não aplicada), composição liga os reais quando há variáveis (sem elas, memória), `GET /api/admin/exportar` em CSV com JWT admin e fórmulas neutralizadas, 21 testes novos com rede simulada. Pendente: `.env.example` (orquestrador), aplicar migrações e testar contra Supabase real |
