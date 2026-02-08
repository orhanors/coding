# Implement PRD

Guide the user through implementing tasks from a Product Requirements Document (PRD). Supports interactive single-cycle mode and automated loop mode driven by `prd-loop.sh`.

## Usage

```
/implement-prd
```

Or called by `prd-loop.sh` with structured parameters:
```
/implement-prd
PRD_FILE=0004-tts-performance-optimization-prd.md
METHOD=loop
STYLE=phase
```

## Instructions for Claude

When this command is invoked, first check whether structured parameters are present in the prompt (lines matching `PRD_FILE=`, `METHOD=`, `STYLE=`). This determines the execution path.

---

### Path A: Loop Mode (structured parameters detected)

If the prompt contains `PRD_FILE=<filename>`, `METHOD=loop`, and `STYLE=<task|phase>`:

1. Skip all interactive selection — go straight to execution
2. Read the PRD file from `architecture-prd/<PRD_FILE>`
3. Detect phases (see Phase Detection Algorithm below)
4. Find the next incomplete work unit based on STYLE:
   - `STYLE=task`: next single incomplete task (lowest phase first)
   - `STYLE=phase`: all incomplete tasks in the current phase (with sub-phase splitting if >4 tasks)
5. Execute: create a unified plan, implement, mark tasks done, update PRD file
6. At the very end of your response, print one of these completion signals on its own line:
   - `ALL_TASKS_COMPLETE` — every task in the PRD has `implemented: true`
   - `CYCLE_COMPLETE` — this cycle's work is done, more tasks remain

**Important:** The completion signal MUST be the last line of your response. Do not add anything after it.

---

### Path B: Interactive Mode (no structured parameters)

Follow the 3-step selection flow below.

#### Step 1: PRD Selection

- Read all `.md` files from `architecture-prd/` directory
- For each PRD, parse the JSON task array and detect phases
- Use `AskUserQuestion` to present the selection:

Each option should show:
```
PRD-XXXX: Title (X/Y tasks done — Z%) | Phase N of M | Phases remaining: P
```

Example:
```
PRD-0004: TTS Performance (12/14 — 86%) | Phase 5 of 5 | 1 phase remaining
PRD-0007: Desktop App (0/18 — 0%) | Phase 1 of 4 | 4 phases remaining
```

#### Step 2: Method + Style Selection

Use `AskUserQuestion` with **two questions** in a single call:

**Question 1 — Method:**
- `single` — Run one cycle, then stop and return control to you
- `loop` — Run continuously (auto-suggest pairing with `phase` style)

**Question 2 — Style:**
- `task` — One task per cycle
- `phase` — All tasks in the current phase per cycle (sub-split if >4)

#### Step 3: Execute

Based on the selected method + style combination:

| Method | Style | Behavior |
|--------|-------|----------|
| single | task | Implement 1 task, mark done, show updated progress, stop |
| single | phase | Implement all tasks in current phase (sub-split if >4), mark done, stop |
| loop | task | Implement 1 task, mark done, print `CYCLE_COMPLETE` or `ALL_TASKS_COMPLETE`, stop |
| loop | phase | Implement current phase/sub-phase, mark done, print signal, stop |

For **single** method: after completion, show updated progress summary and ask if the user wants to continue.

For **loop** method: after completion, print the completion signal as the last line. The `prd-loop.sh` script will call you again for the next cycle.

---

## Phase Detection Algorithm

PRDs may store phase information in different ways. Use this priority order:

1. **Explicit `"phase"` key** — If the task JSON has `"phase": N`, use it directly
2. **Description prefix** — Parse `"Phase N:"`, `"Phase NA:"`, `"Phase NB:"` patterns from the task description via regex (e.g., `Phase 1A:`, `Phase 2:`, `Phase 4:`)
   - Map letter suffixes to sub-phases: `1A` → phase 1, `1B` → phase 1, `2` → phase 2
3. **Progress Tracking section** — Parse the PRD's `## Progress Tracking` / `### Phase Breakdown` section which maps phase names to task ranges (e.g., "Phase 1 — Quick Wins (Tasks 1-3)")
4. **Fallback** — Tasks with no detectable phase info → assign to `max_detected_phase + 1` and label as "Cross-cutting"

Always process tasks in phase order: complete all tasks in phase N before moving to phase N+1.

---

## Sub-Phase Splitting

When `style=phase` and the current phase has **more than 4 incomplete tasks**:

1. Split into sub-phases of 3-4 tasks each
2. Name them: Phase 4a, Phase 4b, Phase 4c, etc.
3. Each sub-phase = one cycle
4. Process sub-phases in order (4a before 4b, etc.)

Example: Phase 4 has 9 incomplete tasks → split into Phase 4a (3 tasks), Phase 4b (3 tasks), Phase 4c (3 tasks).

---

## Unified Planning (phase style)

When implementing multiple tasks together in a single cycle, create a **unified implementation plan**:

1. List all tasks in the work unit with their descriptions
2. Identify shared dependencies and common setup steps
3. **Order by file** — group changes so each file is modified once, not revisited multiple times
4. Create a single implementation section that flows naturally across tasks
5. Single test/verification section covering all tasks in the work unit

This is more efficient than planning each task independently — it avoids redundant file reads/writes and catches cross-task dependencies.

---

## Implementation Plan Format

For each work unit (single task or phase group), generate an actionable plan:

```markdown
## Implementation Plan: [Task/Phase Description]

### Prerequisites
- Task dependencies and required setup
- External resources needed

### Step-by-Step Implementation

#### Step 1: [Description]
**Files to create/modify:**
- `path/to/file.py` — description of changes

**Implementation:**
[Code snippets — actual code, not pseudocode]

**Verification:**
[Commands to test this step]

---

### Testing the Complete Implementation
[Integration tests and manual verification]

### Success Criteria
- Checklist of what "done" looks like

### Common Issues and Solutions
[Anticipated problems and fixes]
```

### Guidelines for Plans

- **Be specific:** include exact file paths, class names, function signatures
- **Include code snippets:** actual implementation code, not pseudocode
- **Add verification steps:** every step should have a way to confirm it works
- **Note dependencies:** clearly state what must exist/be done first
- **Anticipate issues:** include a "Common Issues" section

---

## After Implementation: Marking Tasks Complete

When marking a task as complete:

1. **Read the PRD file** and parse the JSON task array
2. **Find the task** by matching its description
3. **Analyze for improvements** — identify potential optimizations to track for later:
   - Performance optimizations that depend on other tasks
   - Code quality improvements that aren't critical for MVP
   - Testing enhancements to add later
   - UX improvements that are nice-to-have
4. **Update the task JSON:**
   ```json
   {
     "description": "...",
     "implemented": true,
     "improvements": ["improvement 1", "improvement 2"],
     "improvements_done": false
   }
   ```
5. **Update the Progress Tracking section** with new counts
6. **Validate JSON** before writing back
7. **Run tests** to ensure no regressions: `uv run pytest` (backend) or `npm test` (frontend)

---

## Improvements Workflow

### When marking a task complete, ALWAYS analyze for improvements

**Categories:**
1. **Performance** — caching, pooling, lazy loading
2. **Code Quality** — extract constants, add error handling, reduce duplication
3. **Monitoring** — logging, metrics, health checks
4. **Testing** — integration tests, benchmarks, load tests
5. **UX** — loading states, retry mechanisms, progress indicators

**Add improvements when:**
- Core functionality works and is tested
- Optimization depends on other tasks completing first
- Enhancement is nice-to-have, not critical for MVP
- Technical debt should be tracked for later

**Do NOT add as improvement (implement immediately instead):**
- Critical functionality gaps
- Security concerns
- Breaking bugs

### Implementing improvements (interactive mode only)

When user chooses to implement improvements:
1. Show tasks with pending improvements (`improvements_done: false` and non-empty `improvements`)
2. Ask which task to improve
3. Create implementation plan for the improvements
4. After completing, set `improvements_done: true`

---

## Edge Cases

### All Tasks Completed

If all tasks have `implemented: true`:

**Interactive mode:** Show congratulations summary with completion stats, suggest next steps (review, test suite, deploy, new PRD).

**Loop mode:** Print `ALL_TASKS_COMPLETE` as the last line.

### No PRDs Found

If `architecture-prd/` is empty or doesn't exist:
```
No PRDs found in architecture-prd/ directory.
Use /create-prd-from-adr to create one from an ADR.
```

### Invalid PRD Format

If JSON parsing fails:
- Show the parsing error
- Offer to fix the JSON automatically
- Show error details for manual fixing

### Task JSON Structure

Each task should follow this structure:

```json
{
  "phase": 1,
  "category": "feature",
  "description": "Task description",
  "steps": ["Step 1", "Step 2"],
  "implemented": false,
  "improvements": [],
  "improvements_done": false
}
```

**Required fields:** `category`, `description`, `steps`, `implemented`
**Recommended fields:** `phase`, `improvements`, `improvements_done`

---

## Implementation Notes

- **Preserve user edits:** when updating tasks, preserve all other fields and formatting
- **Validate JSON:** always validate before writing back to file
- **Track session:** remember which PRD the user is working on across multiple invocations
- **Progress tracking:** update the Progress Tracking section when marking tasks complete
- **Improvements tracking:** initialize `improvements: []` and `improvements_done: false` if not present
- **Phase ordering:** always complete lower phases before higher ones
- **Completion signals:** in loop mode, ALWAYS end response with `CYCLE_COMPLETE` or `ALL_TASKS_COMPLETE`

## Related Commands

- `/create-prd-from-adr` — Create a new PRD from an ADR
