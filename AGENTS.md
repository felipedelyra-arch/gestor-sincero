<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Regras do squad (Gestor Sincero)

- Leia `docs/BRIEFING.md` (seção CONTEXTO COMUM + o bloco do seu terminal), `docs/PLAN.md` e, para UI, `docs/DESIGN.md`.
- Mexa só nas pastas do seu terminal (tabela em `docs/PLAN.md`). Arquivos da raiz, `config/`, `content/schema.ts` e `src/shared/` são do orquestrador: precisa mudar, peça.
- Vários agentes usam esta mesma pasta: nunca `git add -A`, `git stash`, `git reset` nem troca de branch. Commit só dos seus caminhos: `git add <seus caminhos> && git commit -m "..."`. Se o git acusar trava, espere e tente de novo.
- Commits pequenos, em português, sem atribuição a IA (sem Co-Authored-By).
- Não instale dependência sem necessidade; se instalar, rode `npm audit` e avise o orquestrador.
- TypeScript strict, sem `any`. Texto de página só em `content/`; preço, datas, links e contatos só em `config/site.ts`.
- Nunca invente número, depoimento ou dado. O que faltar vira `[PENDENTE FERRÉR]` e uma linha em `docs/PERGUNTAS_FERRER.md`.
- Antes de dizer que terminou: `npm run typecheck && npm run lint` (e `npm test` se houver testes seus). Depois acrescente sua linha em `docs/STATUS.md`.
