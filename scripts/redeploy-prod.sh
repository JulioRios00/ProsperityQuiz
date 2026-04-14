#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILE="docker-compose.prod.yml"
SERVICES=(backend frontend nginx)
NO_CACHE="false"
PULL_CODE="false"

for arg in "$@"; do
  case "$arg" in
    --no-cache)
      NO_CACHE="true"
      ;;
    --pull)
      PULL_CODE="true"
      ;;
    --help|-h)
      echo "Usage: ./scripts/redeploy-prod.sh [--pull] [--no-cache]"
      echo "  --pull      Run git pull --ff-only before redeploy"
      echo "  --no-cache  Rebuild backend/frontend images with --no-cache"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Use --help for usage."
      exit 1
      ;;
  esac
done

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "❌ $COMPOSE_FILE not found in $ROOT_DIR"
  exit 1
fi

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose -f "$COMPOSE_FILE")
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE=(docker-compose -f "$COMPOSE_FILE")
else
  echo "❌ Neither 'docker compose' nor 'docker-compose' is available."
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "⚠️ .env not found at $ROOT_DIR/.env"
else
  if grep -qE '^VITE_GA4_ID=.*VITE_FB_PIXEL_ID=' .env; then
    echo "⚠️ .env looks malformed: VITE_GA4_ID and VITE_FB_PIXEL_ID appear on the same line."
  fi

  for key in DB_PASSWORD SECRET_KEY JWT_SECRET_KEY; do
    value="$(grep -E "^${key}=" .env | head -n1 | cut -d'=' -f2- || true)"
    if [[ "$value" =~ ^\$[^\$] ]]; then
      echo "⚠️ $key starts with a single '$'. Compose may expand it as a variable."
      echo "   Consider escaping as '$$...' in .env on the server."
    fi
  done
fi

if [[ "$PULL_CODE" == "true" ]]; then
  echo "🔄 Pulling latest code..."
  git pull --ff-only
fi

echo "🧪 Validating compose config..."
"${COMPOSE[@]}" config >/dev/null

echo "🔐 Checking TLS cert files in nginx volume (if HTTPS is enabled)..."
if docker volume inspect quiz-funnel_nginx_certs >/dev/null 2>&1; then
  if ! docker run --rm -v quiz-funnel_nginx_certs:/etc/letsencrypt alpine sh -lc 'test -f /etc/letsencrypt/live/fullchain.pem && test -f /etc/letsencrypt/live/privkey.pem' >/dev/null 2>&1; then
    echo "⚠️ TLS cert files not found at /etc/letsencrypt/live/{fullchain.pem,privkey.pem}."
    echo "   Nginx may fail if SSL is enabled in nginx/nginx.conf."
  fi
fi

echo "🏗️ Building images..."
if [[ "$NO_CACHE" == "true" ]]; then
  "${COMPOSE[@]}" build --no-cache backend frontend
else
  "${COMPOSE[@]}" build backend frontend
fi

echo "🚀 Recreating services: ${SERVICES[*]}"
"${COMPOSE[@]}" up -d --force-recreate "${SERVICES[@]}"

echo "📋 Service status"
"${COMPOSE[@]}" ps

echo "🔎 Quick health checks"
HTTP_ROOT_CODE="$(curl -s -o /dev/null -w '%{http_code}' http://localhost/ || true)"
HTTP_API_CODE="$(curl -s -o /dev/null -w '%{http_code}' http://localhost/api/v1/health || true)"
HTTPS_CODE="$(curl -k -s -o /dev/null -w '%{http_code}' https://localhost/ || true)"

echo "  /                -> ${HTTP_ROOT_CODE}"
echo "  /api/v1/health   -> ${HTTP_API_CODE}"
echo "  https://localhost -> ${HTTPS_CODE}"

echo "📦 Frontend bundle check (A/B dashboard text)"
docker exec quiz-funnel-frontend sh -lc "grep -R 'Faça login para acessar o dashboard' /usr/share/nginx/html/assets | head -n 1 || true"

echo "✅ Done"
