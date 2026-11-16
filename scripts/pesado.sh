#!/usr/bin/env bash
# Uso: scripts/pesado.sh <comando...>
# Um processo pesado por vez, com RAM minima, teto de memoria e tempo limite.
set -euo pipefail
MIN_MB="${PESADO_MIN_MB:-3000}"
TETO="${PESADO_TETO:-4G}"
TEMPO="${PESADO_TEMPO:-900}"
[ "$#" -ge 1 ] || { echo "Uso: scripts/pesado.sh <comando...>"; exit 64; }

exec 9>/tmp/nodeshell-pesado.lock
if ! flock -w 1200 9; then echo "PESADO: fila ocupada ha 20 min. Desisti."; exit 75; fi

tentativas=0
while :; do
  livre=$(awk '/MemAvailable/ {print int($2/1024)}' /proc/meminfo)
  if [ "$livre" -ge "$MIN_MB" ]; then break; fi
  tentativas=$((tentativas+1))
  if [ "$tentativas" -ge 30 ]; then echo "PESADO: so ${livre} MB livres apos 5 min. Abortado."; exit 75; fi
  echo "PESADO: so ${livre} MB livres (minimo ${MIN_MB}). Esperando..."
  sleep 10
done

export NODE_OPTIONS="--max-old-space-size=2048"
echo "PESADO: ${livre} MB livres. Rodando: $*"
if systemd-run --user --scope -q true >/dev/null 2>&1; then
  exec systemd-run --user --scope -q -p MemoryMax="$TETO" -p MemorySwapMax=1G \
    nice -n 10 ionice -c 3 timeout -k 10 "$TEMPO" "$@"
fi
exec nice -n 10 ionice -c 3 timeout -k 10 "$TEMPO" "$@"
