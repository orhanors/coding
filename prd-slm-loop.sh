#!/usr/bin/env bash
#
# prd-slm-loop.sh — Run prd-loop with a local SLM (Small Language Model)
#
# Connects to a local Ollama-served model via Claude Code CLI.
# All arguments are passed through to prd-loop.sh.
#
# Usage:
#   ./prd-slm-loop.sh <prd-number> [options]
#
# Examples:
#   ./prd-slm-loop.sh 0004
#   ./prd-slm-loop.sh 0004 --style task --max-cycles 3
#
set -euo pipefail

# ── Local Model Configuration ─────────────────────────────────────────────
SLM_MODEL="qwen3-coder-next:latest"
SLM_BASE_URL="http://siestais-mac-studio:11434"
SLM_AUTH_TOKEN="sk-1234"

# ── Colors ────────────────────────────────────────────────────────────────
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ── Log SLM info ──────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}${BOLD}  SLM Mode (Local Model)${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Model:    ${CYAN}${SLM_MODEL}${NC}"
echo -e "  Endpoint: ${CYAN}${SLM_BASE_URL}${NC}"
echo -e "  Auth:     ${CYAN}token set${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ── Export env vars and delegate to prd-loop.sh ───────────────────────────
export ANTHROPIC_AUTH_TOKEN="$SLM_AUTH_TOKEN"
export ANTHROPIC_BASE_URL="$SLM_BASE_URL"
export CLAUDE_MODEL="$SLM_MODEL"

exec "$SCRIPT_DIR/prd-loop.sh" "$@"
