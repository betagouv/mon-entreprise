#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3004}"
BASE_URL="http://localhost:$PORT/api/v1"
LOG_FILE=$(mktemp)

PORT="$PORT" node dist/index.js >"$LOG_FILE" 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true; rm -f "$LOG_FILE"' EXIT

fail() {
	echo "✗ $1" >&2
	echo '--- Log du serveur ---' >&2
	cat "$LOG_FILE" >&2
	exit 1
}

for _ in $(seq 1 60); do
	curl -sf -o /dev/null "$BASE_URL/doc/" && break
	kill -0 "$SERVER_PID" 2>/dev/null || fail 'Le serveur a crashé au démarrage'
	sleep 1
done
curl -sf -o /dev/null "$BASE_URL/doc/" ||
	fail "L'API ne répond pas après 60 s (limite de boot Scalingo)"

RESPONSE=$(curl -sf -X POST "$BASE_URL/evaluate" \
	-H 'Content-Type: application/json' \
	-d '{"situation":{"salarié . contrat . salaire brut":"3500 €/mois"},"expressions":["salarié . rémunération . net . à payer avant impôt"]}') ||
	fail '/evaluate ne répond pas'
grep -q '"evaluate"' <<< "$RESPONSE" || fail '/evaluate ne renvoie pas d’évaluation'

curl -sf -o /dev/null "$BASE_URL/modeles/ti/rules" ||
	fail '/modeles/ti/rules ne répond pas'

echo "✓ L'API compilée démarre et répond"
