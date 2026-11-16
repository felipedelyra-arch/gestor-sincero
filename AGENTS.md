<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Regras do squad (Gestor Sincero)

- Pasta única de trabalho: `/home/felipe/Área de trabalho/gestor-sincero` (branch `master`). Se a sua sessão abriu em um worktree do nodshell, entre nessa pasta e trabalhe só nela; o worktree não tem `node_modules` e não é usado.
- Leia de `docs/BRIEFING.md` só as seções (§) indicadas na sua tarefa, `docs/PLAN.md` e, para UI, `docs/DESIGN.md`.

### Regras de recursos (16 GB de RAM; o notebook já travou). Valem acima de qualquer prazo.

- R1 Sessões: no máximo 3 vivas (orquestrador + 2 executores). Não dispare subagentes. Ao fim da onda, encerre a sua sessão (`/exit`).
- R2 Pesado só por `scripts/pesado.sh <comando>` (npm, next build, tsc, eslint, vitest, playwright, lighthouse, snyk/socket, imagens em lote, rembg, LibreOffice). Um por vez no sistema; se ele abortar por memória, pare e avise o orquestrador, sem tentar de novo.
- R3 Servidor só por `scripts/servidor.sh dev | prod | parar | status`, um só, em http://localhost:3000. O dono é o Front-end; o Back-end reutiliza e nunca sobe outro. Nunca `next dev`/`next start` direto.
- R4 Proibido: modo watch; teste, lint ou typecheck do projeto inteiro sem necessidade (só o arquivo ou módulo alterado); mais de 1 worker; playwright fora do chromium sem interface; `npm install` (só o orquestrador instala); `pkill node`, `killall node` ou matar navegador pelo nome (encerre pelo PID que você abriu); worktrees; Docker.
- R5 Limpeza: ao terminar, encerre tudo o que abriu e confirme no relatório.
- R6 Memória: se `free -m` mostrar menos de 1,5 GB disponíveis, pare e avise o orquestrador.
- R7 Retomada: commit ao fim de cada tarefa (só os seus caminhos) e uma linha em `docs/STATUS.md`.
- R8 Relatório em até 6 linhas: feito / arquivos / pendências / processos encerrados (sim ou não). Leia só o necessário, edições pontuais, sem arquivos extras.
- Mexa só nas pastas do seu terminal (tabela em `docs/PLAN.md`). Arquivos da raiz, `config/`, `content/schema.ts` e `src/shared/` são do orquestrador: precisa mudar, peça.
- Vários agentes usam esta mesma pasta: nunca `git add -A`, `git stash`, `git reset` nem troca de branch. Commit só dos seus caminhos: `git add <seus caminhos> && git commit -m "..."`. Se o git acusar trava, espere e tente de novo.
- Commits pequenos, em português, sem atribuição a IA (sem Co-Authored-By).
- Precisa de dependência nova? Peça ao orquestrador.
- TypeScript strict, sem `any`. Texto de página só em `content/`; preço, datas, links e contatos só em `config/site.ts`.
- Nunca invente número, depoimento ou dado. O que faltar vira `[PENDENTE FERRÉR]` e uma linha em `docs/PERGUNTAS_FERRER.md`.
- Antes de dizer que terminou: `scripts/pesado.sh npx tsc --noEmit`, `scripts/pesado.sh npx eslint <seus arquivos>` e, se houver teste seu, `scripts/pesado.sh npx vitest run <arquivo>`. Depois acrescente sua linha em `docs/STATUS.md`.
