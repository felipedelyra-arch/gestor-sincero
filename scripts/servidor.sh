#!/usr/bin/env bash
# Uso: scripts/servidor.sh dev | prod | parar | status
# Garante um unico servidor na porta 3000.
set -euo pipefail
PORTA=3000
PIDF=/tmp/nodeshell-servidor.pid
LOG=/tmp/nodeshell-servidor.log
porta_ocupada() { (exec 3<>"/dev/tcp/127.0.0.1/${PORTA}") 2>/dev/null; }
meu_vivo() { [ -f "$PIDF" ] && kill -0 "$(cat "$PIDF")" 2>/dev/null; }

case "${1:-status}" in
  dev|prod)
    if meu_vivo || porta_ocupada; then echo "SERVIDOR: ja existe um em http://localhost:${PORTA}. Reutilize."; exit 0; fi
    livre=$(awk '/MemAvailable/ {print int($2/1024)}' /proc/meminfo)
    if [ "$livre" -lt 3000 ]; then echo "SERVIDOR: so ${livre} MB livres. Nao subi."; exit 75; fi
    if [ "$1" = dev ]; then CMD=(npx next dev -p "$PORTA"); else CMD=(npx next start -p "$PORTA"); fi
    NODE_OPTIONS="--max-old-space-size=2048" setsid nohup "${CMD[@]}" >"$LOG" 2>&1 &
    echo $! >"$PIDF"
    echo "SERVIDOR: $1 subindo em http://localhost:${PORTA} (log: $LOG)"
    ;;
  parar)
    if [ -f "$PIDF" ]; then kill -TERM -- "-$(cat "$PIDF")" 2>/dev/null || true; rm -f "$PIDF"; sleep 1; fi
    if porta_ocupada; then echo "SERVIDOR: porta ${PORTA} ainda ocupada por outro processo. Veja: ss -ltnp | grep :${PORTA}"; exit 1; fi
    echo "SERVIDOR: parado"
    ;;
  status)
    if meu_vivo || porta_ocupada; then echo "SERVIDOR: rodando em http://localhost:${PORTA}"; else echo "SERVIDOR: parado"; fi
    ;;
  *) echo "Uso: scripts/servidor.sh dev | prod | parar | status"; exit 64 ;;
esac
