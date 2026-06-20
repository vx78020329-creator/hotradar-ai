#!/bin/bash
# ╔══════════════════════════════════════════════════╗
# ║       HotRadar AI - Deployment Script            ║
# ╚══════════════════════════════════════════════════╝
# Usage: bash deploy/deploy.sh [dev|prod]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MODE="${1:-prod}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[deploy]${NC} $1"; }
warn() { echo -e "${YELLOW}[warn]${NC} $1"; }
err() { echo -e "${RED}[error]${NC} $1"; exit 1; }

# ─── Pre-flight checks ───
command -v docker >/dev/null 2>&1 || err "Docker is not installed"
command -v docker compose >/dev/null 2>&1 || err "Docker Compose is not available"

# Check .env exists
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    warn ".env file not found, copying from .env.example"
    cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
fi

cd "$PROJECT_ROOT"

case "$MODE" in
  dev)
    log "Starting in DEVELOPMENT mode..."
    docker compose -f deploy/docker-compose.dev.yml down --remove-orphans
    docker compose -f deploy/docker-compose.dev.yml build --no-cache
    docker compose -f deploy/docker-compose.dev.yml up -d
    log "Development environment is ready!"
    log "  Frontend: http://localhost:3000"
    log "  Backend:  http://localhost:8000"
    log "  Redis:    localhost:6379"
    ;;

  prod)
    log "Starting in PRODUCTION mode..."

    # Validate environment
    if grep -q "your-secret-key-here" .env; then
      err "Please set a real SECRET_KEY in .env (generate: openssl rand -hex 32)"
    fi

    # Pull latest images
    log "Pulling latest base images..."
    docker compose -f deploy/docker-compose.yml pull --ignore-buildable

    # Build
    log "Building application images..."
    docker compose -f deploy/docker-compose.yml build --no-cache

    # Stop old containers
    log "Stopping old containers..."
    docker compose -f deploy/docker-compose.yml down --remove-orphans

    # Start
    log "Starting production containers..."
    docker compose -f deploy/docker-compose.yml up -d

    # Wait for health
    log "Waiting for services to be healthy..."
    sleep 10
    bash "$SCRIPT_DIR/healthcheck.sh"

    log "Production deployment complete!"
    log "  Frontend: http://localhost:3000"
    log "  Backend:  http://localhost:8000"
    log "  Qdrant:   http://localhost:6333"
    ;;

  *)
    err "Usage: bash deploy/deploy.sh [dev|prod]"
    ;;
esac
