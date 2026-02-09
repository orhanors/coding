#!/usr/bin/env bash
#
# prd-loop.sh — Automated PRD implementation loop using Claude Code CLI
#
# Usage:
#   ./prd-loop.sh <prd-number> [options]
#
# Examples:
#   ./prd-loop.sh 0004                      # Default: phase style
#   ./prd-loop.sh 0004 --style task         # Task-by-task
#   ./prd-loop.sh 0007 --delay 30           # 30s between cycles
#   ./prd-loop.sh 0004 --max-cycles 5       # Stop after 5 cycles
#
set -euo pipefail

# ── Defaults ────────────────────────────────────────────────────────────────
STYLE="phase"
DELAY=10
MAX_CYCLES=0  # 0 = unlimited
PRD_NUMBER=""

# ── Colors ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ── jq Filters ────────────────────────────────────────────────────────────
# Extract streaming text from assistant messages for live display
JQ_STREAM='select(.type == "assistant").message.content[]? | select(.type == "text").text // empty | gsub("\n"; "\r\n") | . + "\r\n\n"'
# Extract the final result text
JQ_RESULT='select(.type == "result").result // empty'

# ── Helpers ─────────────────────────────────────────────────────────────────
usage() {
  cat <<EOF
${BOLD}prd-loop.sh${NC} — Automated PRD implementation loop

${BOLD}USAGE:${NC}
  ./prd-loop.sh <prd-number> [options]

${BOLD}ARGUMENTS:${NC}
  prd-number    PRD number prefix (e.g., 0004, 0007)

${BOLD}OPTIONS:${NC}
  --style <task|phase>   Implementation style (default: phase)
  --delay <seconds>      Delay between cycles (default: 10)
  --max-cycles <n>       Maximum cycles to run, 0=unlimited (default: 0)
  -h, --help             Show this help message

${BOLD}EXAMPLES:${NC}
  ./prd-loop.sh 0004                      # Phase-by-phase (default)
  ./prd-loop.sh 0004 --style task         # Task-by-task
  ./prd-loop.sh 0007 --delay 30           # 30s between cycles
  ./prd-loop.sh 0004 --max-cycles 5       # Stop after 5 cycles
EOF
  exit 0
}

log() {
  echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1" >&2
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

success() {
  echo -e "${GREEN}[OK]${NC} $1"
}

# ── Argument Parsing ────────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
  usage
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      usage
      ;;
    --style)
      STYLE="$2"
      shift 2
      ;;
    --delay)
      DELAY="$2"
      shift 2
      ;;
    --max-cycles)
      MAX_CYCLES="$2"
      shift 2
      ;;
    *)
      if [[ -z "$PRD_NUMBER" ]]; then
        PRD_NUMBER="$1"
      else
        error "Unknown argument: $1"
        exit 1
      fi
      shift
      ;;
  esac
done

# ── Validate Inputs ─────────────────────────────────────────────────────────
if [[ -z "$PRD_NUMBER" ]]; then
  error "PRD number is required"
  usage
fi

if [[ "$STYLE" != "task" && "$STYLE" != "phase" ]]; then
  error "Invalid style: $STYLE (must be 'task' or 'phase')"
  exit 1
fi

if ! [[ "$DELAY" =~ ^[0-9]+$ ]]; then
  error "Delay must be a positive integer"
  exit 1
fi

if ! [[ "$MAX_CYCLES" =~ ^[0-9]+$ ]]; then
  error "Max cycles must be a non-negative integer"
  exit 1
fi

# ── Pre-flight Checks ───────────────────────────────────────────────────────
log "Running pre-flight checks..."

# Check claude CLI exists
if ! command -v claude &>/dev/null; then
  error "claude CLI not found. Install it: npm install -g @anthropic-ai/claude-code"
  exit 1
fi
success "claude CLI found"

# Check jq exists
if ! command -v jq &>/dev/null; then
  error "jq not found. Install it: brew install jq"
  exit 1
fi
success "jq found"

# Resolve PRD file
PRD_DIR="architecture-prd"
PRD_FILE=$(find "$PRD_DIR" -maxdepth 1 -name "${PRD_NUMBER}-*-prd.md" -type f 2>/dev/null | head -1)

if [[ -z "$PRD_FILE" ]]; then
  error "No PRD file found matching pattern: ${PRD_DIR}/${PRD_NUMBER}-*-prd.md"
  echo "  Available PRDs:"
  find "$PRD_DIR" -maxdepth 1 -name "*-prd.md" -type f 2>/dev/null | sort | while read -r f; do
    echo "    $(basename "$f")"
  done
  exit 1
fi

PRD_BASENAME=$(basename "$PRD_FILE")
success "Found PRD: $PRD_BASENAME"

# Check for incomplete tasks
INCOMPLETE_COUNT=$(grep -c '"implemented": false' "$PRD_FILE" 2>/dev/null || true)
TOTAL_COUNT=$(grep -c '"implemented":' "$PRD_FILE" 2>/dev/null || true)
COMPLETE_COUNT=$((TOTAL_COUNT - INCOMPLETE_COUNT))

if [[ "$INCOMPLETE_COUNT" -eq 0 ]]; then
  success "All $TOTAL_COUNT tasks are already complete. Nothing to do."
  exit 0
fi

log "Tasks: ${COMPLETE_COUNT}/${TOTAL_COUNT} complete, ${INCOMPLETE_COUNT} remaining"

# Create log directory
LOG_DIR="architecture-prd-logs"
mkdir -p "$LOG_DIR"
SESSION_ID=$(date '+%Y%m%d_%H%M%S')
SESSION_LOG="${LOG_DIR}/${PRD_NUMBER}_${SESSION_ID}.log"

# ── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}  PRD Implementation Loop${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  PRD:        ${CYAN}${PRD_BASENAME}${NC}"
echo -e "  Style:      ${CYAN}${STYLE}${NC}"
echo -e "  Delay:      ${CYAN}${DELAY}s${NC} between cycles"
echo -e "  Max cycles: ${CYAN}$([ "$MAX_CYCLES" -eq 0 ] && echo "unlimited" || echo "$MAX_CYCLES")${NC}"
echo -e "  Log:        ${CYAN}${SESSION_LOG}${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ── Build Prompt ─────────────────────────────────────────────────────────────
PROMPT="/implement-prd
PRD_FILE=${PRD_BASENAME}
METHOD=loop
STYLE=${STYLE}"

# ── Main Loop ────────────────────────────────────────────────────────────────
CYCLE=0

while true; do
  CYCLE=$((CYCLE + 1))

  # Check max cycles
  if [[ "$MAX_CYCLES" -gt 0 && "$CYCLE" -gt "$MAX_CYCLES" ]]; then
    warn "Reached max cycles ($MAX_CYCLES). Stopping."
    break
  fi

  echo ""
  log "${BOLD}━━━ Cycle $CYCLE ━━━${NC}"
  CYCLE_LOG="${LOG_DIR}/${PRD_NUMBER}_${SESSION_ID}_cycle${CYCLE}.log"

  # Run claude CLI with streaming JSON output
  log "Running claude with ${STYLE} style..."
  CYCLE_START=$(date +%s)
  CYCLE_JSON="${CYCLE_LOG}.json"

  set +e
  claude -p --verbose --dangerously-skip-permissions \
    --output-format stream-json \
    "$PROMPT" 2>"${CYCLE_LOG}.stderr" \
    | grep --line-buffered '^{' \
    | tee "$CYCLE_JSON" \
    | jq --unbuffered -rj "$JQ_STREAM"
  EXIT_CODE=${PIPESTATUS[0]}
  set -e

  # Extract final result text from the stream JSON
  OUTPUT=$(jq -r "$JQ_RESULT" "$CYCLE_JSON")

  CYCLE_END=$(date +%s)
  CYCLE_DURATION=$((CYCLE_END - CYCLE_START))

  # Save cycle output to log
  {
    echo "=== Cycle $CYCLE ==="
    echo "Start: $(date -r "$CYCLE_START" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || date '+%Y-%m-%d %H:%M:%S')"
    echo "Duration: ${CYCLE_DURATION}s"
    echo "Exit code: $EXIT_CODE"
    echo "---"
    echo "$OUTPUT"
    echo ""
  } >> "$SESSION_LOG"

  # Save raw JSON stream as cycle log
  cp "$CYCLE_JSON" "$CYCLE_LOG"

  if [[ $EXIT_CODE -ne 0 ]]; then
    error "Claude CLI exited with code $EXIT_CODE"
    error "Check log: $CYCLE_LOG"

    # Snapshot PRD state even on error
    PRD_SNAPSHOT="${LOG_DIR}/${PRD_NUMBER}_${SESSION_ID}_cycle${CYCLE}_prd.md"
    cp "$PRD_FILE" "$PRD_SNAPSHOT"
    {
      echo "=== PRD State After Cycle $CYCLE (ERROR exit=$EXIT_CODE) ==="
      cat "$PRD_FILE"
      echo ""
      echo "=== End PRD State ==="
    } >> "$SESSION_LOG"

    # Ask user whether to continue
    echo ""
    read -rp "Continue to next cycle? (y/n): " ANSWER
    if [[ "$ANSWER" != "y" && "$ANSWER" != "Y" ]]; then
      log "Aborted by user."
      break
    fi
    continue
  fi

  log "Cycle $CYCLE completed in ${CYCLE_DURATION}s"

  # Check for completion signals (look at the last few lines)
  LAST_LINES=$(echo "$OUTPUT" | tail -5)

  if echo "$LAST_LINES" | grep -q "ALL_TASKS_COMPLETE"; then
    echo ""
    success "${BOLD}All tasks complete!${NC}"
    log "PRD $PRD_BASENAME is fully implemented."

    # Snapshot final PRD state
    PRD_SNAPSHOT="${LOG_DIR}/${PRD_NUMBER}_${SESSION_ID}_cycle${CYCLE}_prd.md"
    cp "$PRD_FILE" "$PRD_SNAPSHOT"
    log "Final PRD snapshot saved: $PRD_SNAPSHOT"
    {
      echo "=== PRD State After Cycle $CYCLE (FINAL) ==="
      cat "$PRD_FILE"
      echo ""
      echo "=== End PRD State ==="
    } >> "$SESSION_LOG"

    break
  elif echo "$LAST_LINES" | grep -q "CYCLE_COMPLETE"; then
    success "Cycle $CYCLE done. More tasks remain."

    # Update remaining count
    INCOMPLETE_COUNT=$(grep -c '"implemented": false' "$PRD_FILE" 2>/dev/null || true)
    TOTAL_COUNT=$(grep -c '"implemented":' "$PRD_FILE" 2>/dev/null || true)
    COMPLETE_COUNT=$((TOTAL_COUNT - INCOMPLETE_COUNT))
    log "Progress: ${COMPLETE_COUNT}/${TOTAL_COUNT} tasks complete"

    # Snapshot PRD state after this cycle
    PRD_SNAPSHOT="${LOG_DIR}/${PRD_NUMBER}_${SESSION_ID}_cycle${CYCLE}_prd.md"
    cp "$PRD_FILE" "$PRD_SNAPSHOT"
    log "PRD snapshot saved: $PRD_SNAPSHOT"

    # Append PRD state summary to session log
    {
      echo "=== PRD State After Cycle $CYCLE ==="
      echo "Progress: ${COMPLETE_COUNT}/${TOTAL_COUNT} tasks complete"
      echo "--- PRD Content ---"
      cat "$PRD_FILE"
      echo ""
      echo "=== End PRD State ==="
      echo ""
    } >> "$SESSION_LOG"

    if [[ "$INCOMPLETE_COUNT" -eq 0 ]]; then
      success "${BOLD}All tasks complete!${NC}"
      break
    fi

    # Delay before next cycle
    if [[ "$DELAY" -gt 0 ]]; then
      log "Waiting ${DELAY}s before next cycle... (Ctrl+C to stop)"
      sleep "$DELAY"
    fi
  else
    warn "No completion signal detected in output."
    warn "Expected CYCLE_COMPLETE or ALL_TASKS_COMPLETE at end of response."
    echo ""
    echo "Last 5 lines of output:"
    echo "$LAST_LINES"
    echo ""

    # Snapshot PRD state even with no signal
    PRD_SNAPSHOT="${LOG_DIR}/${PRD_NUMBER}_${SESSION_ID}_cycle${CYCLE}_prd.md"
    cp "$PRD_FILE" "$PRD_SNAPSHOT"
    {
      echo "=== PRD State After Cycle $CYCLE (NO SIGNAL) ==="
      cat "$PRD_FILE"
      echo ""
      echo "=== End PRD State ==="
    } >> "$SESSION_LOG"

    read -rp "Continue to next cycle? (y/n): " ANSWER
    if [[ "$ANSWER" != "y" && "$ANSWER" != "Y" ]]; then
      log "Aborted by user."
      break
    fi
  fi
done

# ── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}  Session Summary${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  PRD:           ${CYAN}${PRD_BASENAME}${NC}"
echo -e "  Cycles run:    ${CYAN}${CYCLE}${NC}"
echo -e "  Style:         ${CYAN}${STYLE}${NC}"
echo -e "  Session log:   ${CYAN}${SESSION_LOG}${NC}"

# Final progress
INCOMPLETE_COUNT=$(grep -c '"implemented": false' "$PRD_FILE" 2>/dev/null || true)
TOTAL_COUNT=$(grep -c '"implemented":' "$PRD_FILE" 2>/dev/null || true)
COMPLETE_COUNT=$((TOTAL_COUNT - INCOMPLETE_COUNT))
echo -e "  Final status:  ${CYAN}${COMPLETE_COUNT}/${TOTAL_COUNT} tasks complete${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
