#!/bin/bash
# HotRadar AI - Health Check Script
# Verifies all services are running and responding

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

check() {
    local name="$1"
    local url="$2"
    local expected_code="${3:-200}"

    response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$url" 2>/dev/null || echo "000")

    if [ "$response" = "$expected_code" ]; then
        echo -e "  ${GREEN}✓${NC} $name (HTTP $response)"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}✗${NC} $name (HTTP $response, expected $expected_code)"
        FAILED=$((FAILED + 1))
    fi
}

check_port() {
    local name="$1"
    local host="$2"
    local port="$3"

    if nc -z -w 5 "$host" "$port" 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} $name (port $port open)"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}✗${NC} $name (port $port closed)"
        FAILED=$((FAILED + 1))
    fi
}

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║         HotRadar AI - Health Check               ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ─── Docker containers ───
echo "Docker Containers:"
for svc in hotradar-frontend hotradar-backend hotradar-db hotradar-redis hotradar-qdrant; do
    status=$(docker inspect --format='{{.State.Status}}' "$svc" 2>/dev/null || echo "not found")
    if [ "$status" = "running" ]; then
        echo -e "  ${GREEN}✓${NC} $svc ($status)"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}✗${NC} $svc ($status)"
        FAILED=$((FAILED + 1))
    fi
done
echo ""

# ─── HTTP endpoints ───
echo "HTTP Endpoints:"
check "Frontend" "http://localhost:3000" 200
check "Backend Health" "http://localhost:8000/health" 200
check "Backend API Docs" "http://localhost:8000/docs" 200
echo ""

# ─── Database ports ───
echo "Database Ports:"
check_port "PostgreSQL" "localhost" 5432
check_port "Redis" "localhost" 6379
check_port "Qdrant" "localhost" 6333
echo ""

# ─── Summary ───
TOTAL=$((PASSED + FAILED))
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$FAILED" -eq 0 ]; then
    echo -e "${GREEN}All checks passed!${NC} ($PASSED/$TOTAL)"
else
    echo -e "${YELLOW}Some checks failed.${NC} (passed: $PASSED, failed: $FAILED, total: $TOTAL)"
fi
echo ""

exit $FAILED
