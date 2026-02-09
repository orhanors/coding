# ADR-0003: Psyche — UI Specifications

## Status
Proposed (2026-02-09)

## Context
**Psyche** is a multi-agent orchestration workspace where human architects oversee autonomous coding agents through an introspective, canvas-based interface. It evolves from the mdiff platform (ADR-0002) — retaining its diff-centric philosophy, Linear-like board, and Excalidraw integration — but shifts the primary metaphor from "watching diffs" to **"inhabiting a living workspace where agents think, collaborate, and transform your architecture while you observe, guide, and approve."**

The name draws from Carl Jung's concept of the **psyche** — the totality of conscious and unconscious mental processes. Each agent is a function of the psyche: The Architect, The Guardian, The Explorer, The Alchemist. The human is the **Self** — the integrating center that holds it all together.

This is not a vibe-code toy. Psyche is **agentic-code with human in the loop** — recording every architectural change in plain English and Excalidraw diagrams, making the invisible visible, and giving the human final authority over their codebase's evolution.

**Key evolution from mdiff:**
- Canvas board where you create, position, and connect agents spatially
- Constellation view showing active agent collaboration flows
- Timeline River for architecture history (ADR/Vision/Reflection changes)
- Jungian archetype system for agent personality
- "Visions" (replacing PRDs) and "Reflections" (replacing ADRs) as first-class documents
- Full change chronicle in English + embedded Excalidraw snapshots

---

## Design Direction

### Aesthetic: "Deep Introspective"
Dark, warm tones — deep indigo fields with amber and soft gold accents. The interface feels like a calm observatory where you watch agents work. Inspired by Jung's Red Book: rich yet restrained, contemplative but functional. Every pixel breathes. The workspace invites you to stay, observe, and think — never to rush.

### Design Principles
1. **The Self Observes**: The human sees everything but is never overwhelmed. Information surfaces gently — ambient awareness, not notification bombardment.
2. **Agents Have Character**: Each agent carries a Jungian archetype — a subtle personality reflected in its icon, color, and behavior on the canvas. This isn't decoration; it helps you remember which agent does what.
3. **Less Is More (KISS)**: Every feature must earn its screen space. If it can be hidden until needed, hide it. If it can be merged into another view, merge it. Minimal surface, maximum depth.
4. **Record Everything**: Every change — code, architecture, decisions — is chronicled in plain English with timestamps, agent attribution, and Excalidraw snapshots. The history is the product.

### Color Palette
```css
/* ═══════════════════════════════════════════
   PSYCHE — Deep Introspective Palette
   ═══════════════════════════════════════════ */

:root[data-theme="dark"] {
  /* Base — deep indigo-black, warm undertone */
  --bg-primary: #0a0a12;        /* app background — near-black with blue warmth */
  --bg-secondary: #0f0f1a;      /* cards, panels */
  --bg-tertiary: #151520;       /* elevated surfaces, modals */
  --bg-hover: #1a1a2e;          /* hover states */
  --bg-active: #22223a;         /* active/selected */
  --bg-surface: #0d0d18;        /* inset surfaces, code blocks */
  --bg-canvas: #08080e;         /* the infinite canvas background */

  /* Borders — whisper-thin, barely there */
  --border-subtle: rgba(255, 220, 180, 0.04);
  --border-default: rgba(255, 220, 180, 0.08);
  --border-strong: rgba(255, 220, 180, 0.14);
  --border-glow: rgba(245, 195, 100, 0.20);

  /* Text */
  --text-primary: #e8e4df;      /* warm off-white */
  --text-secondary: #8a8698;    /* muted lavender-gray */
  --text-muted: #504c5e;        /* timestamps, placeholders */
  --text-inverse: #0a0a12;      /* text on accent backgrounds */

  /* Accent — Amber Gold (the Self's light) */
  --accent-primary: #f5c364;    /* primary actions, active states */
  --accent-hover: #e5a83d;      /* hover */
  --accent-muted: rgba(245, 195, 100, 0.12);  /* accent backgrounds */
  --accent-subtle: rgba(245, 195, 100, 0.06);  /* tints */
  --accent-glow: rgba(245, 195, 100, 0.25);    /* glowing states */

  /* Agent Archetype Colors */
  --archetype-architect: #a78bfa;   /* violet — The Architect */
  --archetype-guardian: #34d399;    /* emerald — The Guardian */
  --archetype-explorer: #60a5fa;    /* blue — The Explorer */
  --archetype-alchemist: #f59e0b;   /* amber — The Alchemist */
  --archetype-shadow: #f87171;      /* red — The Shadow (debugger) */
  --archetype-sage: #c084fc;        /* purple — The Sage (reviewer) */
  --archetype-herald: #22d3ee;      /* cyan — The Herald (communicator) */
  --archetype-trickster: #fb923c;   /* orange — The Trickster (refactorer) */

  /* Semantic */
  --success: #34d399;           /* completed, connected */
  --warning: #fbbf24;           /* in-progress, warnings */
  --error: #f87171;             /* failures, disconnected */
  --info: #60a5fa;              /* informational */

  /* Diff */
  --diff-added-bg: rgba(52, 211, 153, 0.08);
  --diff-added-border: rgba(52, 211, 153, 0.30);
  --diff-added-text: #6ee7b7;
  --diff-removed-bg: rgba(248, 113, 113, 0.08);
  --diff-removed-border: rgba(248, 113, 113, 0.30);
  --diff-removed-text: #fca5a5;

  /* Canvas */
  --canvas-grid: rgba(255, 220, 180, 0.03);
  --canvas-connection: rgba(245, 195, 100, 0.30);
  --canvas-connection-active: rgba(245, 195, 100, 0.70);

  /* Constellation */
  --constellation-line: rgba(255, 220, 180, 0.08);
  --constellation-line-active: rgba(245, 195, 100, 0.40);
  --constellation-glow: rgba(245, 195, 100, 0.15);
}

:root[data-theme="light"] {
  --bg-primary: #faf8f5;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f5f2ee;
  --bg-hover: #ece8e1;
  --bg-active: #e4dfd7;
  --bg-surface: #f0ede8;
  --bg-canvas: #fdfcfa;

  --border-subtle: rgba(60, 50, 40, 0.06);
  --border-default: rgba(60, 50, 40, 0.12);
  --border-strong: rgba(60, 50, 40, 0.20);

  --text-primary: #1a1818;
  --text-secondary: #6b6360;
  --text-muted: #a09890;
  --text-inverse: #faf8f5;

  --accent-primary: #c48a20;
  --accent-hover: #a87518;
  --accent-muted: rgba(196, 138, 32, 0.10);
  --accent-subtle: rgba(196, 138, 32, 0.05);
}
```

### Typography
```css
/* Primary — warm, humanist, readable */
--font-primary: 'Inter', 'SF Pro Display', -apple-system, sans-serif;

/* Monospace — for diffs, code, agent stream */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

/* Display — for the app name "Psyche" and hero elements */
--font-display: 'Newsreader', 'Georgia', serif;

/* Scale */
--text-xs: 0.75rem;      /* 12px — timestamps, badges, agent status */
--text-sm: 0.8125rem;    /* 13px — secondary labels, metadata */
--text-base: 0.9375rem;  /* 15px — body text, descriptions */
--text-lg: 1.125rem;     /* 18px — section headers, card titles */
--text-xl: 1.375rem;     /* 22px — page titles */
--text-2xl: 1.75rem;     /* 28px — project names, hero numbers */
--text-3xl: 2.25rem;     /* 36px — landing headings */

/* The word "Psyche" in the top bar uses --font-display at --text-lg, italic */
```

---

## Layout Structure

### Shell Layout
```
┌──────────────────────────────────────────────────────────────────────┐
│  ψ Psyche          Canvas  River  Visions  Reflections    ◑  ⌘K  ◧ │  ← Top Bar (52px)
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                                                                      │
│                          Main Content Area                           │
│                      (full viewport, scrollable)                     │
│                                                                      │
│                   Canvas / River / Documents / etc.                   │
│                                                                      │
│                                                                      │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  ● Agent: Architect refactoring auth module...    3 pending    v0.1  │  ← Status Strip (24px)
└──────────────────────────────────────────────────────────────────────┘
```

**Top Bar (52px fixed):**
- Left: "ψ" glyph + "Psyche" in `--font-display`, italic, `--accent-primary`
- Center: View tabs — Canvas, River, Visions, Reflections (text links, underline-on-active)
- Right: Theme toggle (◑), Command Palette trigger (⌘K), Agent Overlay toggle (◧)

**Main Content Area:**
- Full viewport minus top bar and status strip
- Each view (Canvas, River, Visions, Reflections) fills this space entirely
- No sidebars. No drawer navigation. Content breathes.

**Status Strip (24px fixed bottom):**
- Left: Pulsing dot (archetype color of active agent) + agent status message
- Right: Pending changes count + app version
- Fades to 30% opacity when idle. Full opacity when any agent is active.
- Click to open Agent Stream Overlay (slides in from right, 360px)

---

## Page Specifications

### 1. Canvas (`/canvas`) — The Primary Workspace

**Purpose**: The spatial multi-agent workspace. Create agents, position them freely, draw task connections, and watch them work in real-time. Hybrid between infinite canvas (placement freedom) and constellation map (active flow visualization).

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────┐
│  ψ Psyche          [Canvas]  River  Visions  Reflections   ◑  ⌘K ◧ │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│              ┌─────────┐                                             │
│              │ ψ₁      │          ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ │
│              │ Architect│─ ─ ─ ─ ─┐    Agent Config Panel (slide-in) │
│              │ ● active │         │    ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ │
│              └─────────┘         │    Name: [The Architect        ] │
│                   │              │    Archetype: Architect ▾         │
│                   │ (task flow)  │    Task: [Refactor auth module ] │
│                   ▼              │    Autonomy: ●●●○○ (supervised)  │
│              ┌─────────┐         │    Status: ● Working...          │
│              │ ψ₂      │◄─ ─ ─ ─┘    Depends on: —                 │
│              │ Guardian │              Output feeds: ψ₃ Guardian     │
│              │ ○ idle   │              ┌──────────────────────────┐ │
│              └─────────┘              │ [Pause] [Stop] [Approve] │  │
│                                       └──────────────────────────┘ │
│     ┌─────────┐                                                     │
│     │ ψ₃      │                                                     │
│     │ Explorer │      · · · · · (grid dots, very subtle)            │
│     │ ○ idle   │                                                     │
│     └─────────┘                                               [+]  │
│                                                          (add agent) │
├──────────────────────────────────────────────────────────────────────┤
│  ● Architect: analyzing auth patterns...          2 pending    v0.1 │
└──────────────────────────────────────────────────────────────────────┘
```

**Agent Node Anatomy:**
```
┌───────────────────────┐
│  ⬡  The Architect     │  ← archetype icon + name
│  ─────────────────    │
│  Refactoring auth...  │  ← current task (truncated)
│  ████████░░ 73%       │  ← progress bar (archetype color)
│  ● active  ·  2m ago  │  ← status dot + timestamp
└───────────────────────┘
   Size: 180×100px, rounded-xl
   Border: 1px --border-default, glows --archetype-color when active
   Background: --bg-secondary with 0.8 opacity (slight canvas bleed-through)
```

**Canvas Interactions:**
- **Click empty space** → spawns agent creation node at click position
- **Click agent node** → opens Config Panel (slide-in from right, 320px)
- **Drag agent node** → repositions freely on infinite canvas
- **Drag from agent edge** → creates a connection line to another agent (task dependency)
- **Scroll/pinch** → zoom in/out (0.25x to 3x)
- **Middle-click drag** → pan canvas
- **Double-click agent** → opens agent's stream output in overlay
- **Connection lines** → animate (flowing dots) when data is passing between agents
- **[+] button** (bottom-right) → quick-add agent at default position

**Constellation Mode (toggle):**
- A toggle in the top-right of the canvas switches between "Canvas" (freeform) and "Constellation" (auto-arranged)
- In Constellation mode, agents auto-arrange based on their dependency graph
- Connection lines become glowing arcs
- Active flows pulse with archetype color
- The overall shape forms an organic constellation — not a rigid graph

**Components:**
- `InfiniteCanvas`: Pan/zoom container with dot-grid background
- `AgentNode`: Draggable agent card with archetype styling
- `ConnectionLine`: SVG path between agents, animated when active
- `AgentConfigPanel`: Slide-in panel for creating/editing agents
- `ConstellationLayout`: Auto-arrangement algorithm for dependency graph
- `CanvasToolbar`: Minimal floating toolbar (zoom controls, mode toggle, add agent)

**States:**
- **Empty canvas**: Centered message — *"Click anywhere to create your first agent"* with pulsing (+) icon
- **Agents idle**: Nodes at low opacity, connection lines dim, canvas feels restful
- **Agents working**: Active nodes glow with archetype color, connection lines animate, status strip active
- **Agent completed**: Node border briefly flashes `--success`, task text updates, awaiting approval badge appears
- **Agent error**: Node border pulses `--error`, error summary appears inline

---

### 2. River (`/river`) — The Timeline of Changes

**Purpose**: A flowing chronological view of every architectural change — ADRs, Visions, code diffs, Excalidraw snapshots, agent actions. The "river" flows downward. Each change is a stone in the riverbed. You can scroll upstream to any point in history.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────┐
│  ψ Psyche          Canvas  [River]  Visions  Reflections   ◑  ⌘K ◧ │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Filters: [All types ▾]  [All agents ▾]  [All projects ▾]  [Search] │
│  ─────────────────────────────────────────────────────────────────── │
│                                                                      │
│     ○ Today                                                         │
│     │                                                                │
│     ├── ◆ Vision: "Auth Module Redesign"            12m ago         │
│     │   ψ₁ Architect · 15 tasks defined                             │
│     │   ┌──────────────────────────────────────────┐                │
│     │   │ + Added OAuth2 flow specification         │                │
│     │   │ + Added session management requirements   │                │
│     │   │ - Removed legacy cookie-based auth        │                │
│     │   └──────────────────────────────────────────┘                │
│     │                                                                │
│     ├── ◇ Reflection: "Choose JWT over sessions"    28m ago         │
│     │   ψ₁ Architect · Decision recorded                            │
│     │   Status: proposed → accepted                                  │
│     │                                                                │
│     ├── ◈ Diagram: auth-architecture.excalidraw     35m ago         │
│     │   ψ₁ Architect · +4 nodes, +3 edges                           │
│     │   ┌──────────────────────────────────────────┐                │
│     │   │  ┌────┐    ┌────┐    ┌────┐             │                │
│     │   │  │Auth│───▶│JWT │───▶│API │  (snapshot) │                │
│     │   │  └────┘    └────┘    └────┘             │                │
│     │   └──────────────────────────────────────────┘                │
│     │                                                                │
│     ├── ● Code: src/auth/jwt.ts                     1h ago          │
│     │   ψ₁ Architect · +47 −12 lines                                │
│     │                                                                │
│     ○ Yesterday                                                      │
│     │                                                                │
│     ├── ...                                                          │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  ○ idle                                               0 pending v0.1│
└──────────────────────────────────────────────────────────────────────┘
```

**Entry Types & Icons:**
- `◆` Vision (PRD) changes — amber
- `◇` Reflection (ADR) changes — violet
- `◈` Excalidraw diagram changes — pink
- `●` Code diff — emerald
- `○` Status change — gray
- `★` Agent lifecycle (created, completed, failed) — archetype color

**Entry anatomy:**
```
├── ◆ Vision: "Auth Module Redesign"                  12m ago
│   ψ₁ Architect · 15 tasks defined
│   ┌──────────────────────────────────────────┐
│   │ (expandable preview — diff hunks,        │
│   │  diagram thumbnail, or status change)    │
│   └──────────────────────────────────────────┘
```

**Interactions:**
- **Click entry** → expands inline preview (diff hunks, diagram snapshot, full status change)
- **Click document link** → navigates to that Vision/Reflection in its dedicated view
- **Click agent name (ψ₁)** → navigates to that agent on Canvas
- **Scroll** → infinite scroll through history, grouped by date
- **Filters** → dropdown filters for type, agent, project; text search across descriptions

**Components:**
- `RiverView`: Vertical timeline container with date groupings
- `RiverEntry`: Individual change entry with icon, metadata, expandable preview
- `RiverFilters`: Filter bar (type, agent, project, search)
- `DiffPreview`: Inline diff hunk viewer (reused from mdiff)
- `DiagramThumbnail`: Small Excalidraw snapshot preview
- `RiverDateGroup`: Date separator with relative label

**States:**
- **Empty**: *"No changes yet. Create an agent on the Canvas to begin."*
- **Loading**: Skeleton entries pulsing gently
- **Live update**: New entries slide in from top with subtle fade animation
- **Filtered**: Active filter chips shown, "Clear all" link

---

### 3. Visions (`/visions`) — Product Visions (formerly PRDs)

**Purpose**: The board and document view for product visions — what you want to build. Combines the Linear-like Kanban board from mdiff with a document reader. Each Vision is a plan of intent.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────┐
│  ψ Psyche          Canvas  River  [Visions]  Reflections   ◑  ⌘K ◧ │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  View: [Board]  List  ·  + New Vision                                │
│  ─────────────────────────────────────────────────────────────────── │
│                                                                      │
│  Backlog          In Progress       Review           Done            │
│  ──────────       ──────────        ──────           ────            │
│                                                                      │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐  ┌────────────┐  │
│  │ Auth       │   │ API Gate   │   │ Dashboard  │  │ Onboarding │  │
│  │ Redesign   │   │ way Layer  │   │ Metrics    │  │ Flow       │  │
│  │            │   │            │   │            │  │            │  │
│  │ ψ₁ Archit.│   │ ψ₃ Explor.│   │ ψ₂ Guard. │  │ ψ₁ Archit.│  │
│  │ ●●● high  │   │ ●●○ med   │   │ ●○○ low   │  │ ✓ done     │  │
│  │ ███░░ 3/15│   │ ██░░ 5/12 │   │ █░░░ 2/8  │  │ ████ 8/8  │  │
│  └────────────┘   └────────────┘   └────────────┘  └────────────┘  │
│                                                                      │
│  ┌────────────┐                                                     │
│  │ Testing    │                                                     │
│  │ Strategy   │                                                     │
│  │            │                                                     │
│  │ unassigned │                                                     │
│  │ ●○○ low   │                                                     │
│  │ ░░░░ 0/6  │                                                     │
│  └────────────┘                                                     │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  ● Architect: implementing auth token refresh...     2 pending v0.1 │
└──────────────────────────────────────────────────────────────────────┘
```

**Vision Card Anatomy:**
```
┌──────────────────────┐
│  Auth Redesign       │  ← title
│                      │
│  ψ₁ Architect        │  ← assigned agent (archetype color dot)
│  ●●● high            │  ← priority (3 dots, colored)
│  ████░░  8/15        │  ← progress bar + task count
└──────────────────────┘
   Border-left: 3px in archetype color of assigned agent
   Drag-and-drop between columns
```

**Board view**: Kanban with 4 columns (Backlog, In Progress, Review, Done). Drag cards between columns.

**List view**: Flat list with sortable columns (name, agent, priority, progress, updated).

**Click a card** → opens Vision Detail Modal:
```
┌──────────────────────────────────────────────────────────┐
│  Auth Redesign                                     [×]   │
│  ψ₁ Architect · ●●● high · In Progress                  │
│  ─────────────────────────────────────────────────────── │
│                                                          │
│  ## Overview                                             │
│  Redesign the authentication module to use JWT tokens    │
│  with OAuth2 flow support...                             │
│                                                          │
│  ## Tasks                                                │
│  ▸ Phase 1 — Foundation (3/4 complete)                   │
│    ✓ Set up JWT library                                  │
│    ✓ Create token service                                │
│    ✓ Define auth middleware                               │
│    ○ Add refresh token rotation                          │
│                                                          │
│  ▸ Phase 2 — Core Implementation (0/6)                   │
│    ○ OAuth2 provider integration                         │
│    ○ Session migration script                            │
│    ...                                                   │
│                                                          │
│  ## Change History                                       │
│  12m ago — ψ₁ completed "Define auth middleware"         │
│  28m ago — ψ₁ added 3 tasks to Phase 2                   │
│  1h ago  — Created by human                              │
│                                                          │
│  [View in River]  [Open Reflection]  [Assign Agent ▾]    │
└──────────────────────────────────────────────────────────┘
```

**Components:**
- `VisionBoard`: Kanban container with 4 columns, drag-and-drop
- `VisionCard`: Draggable card with agent, priority, progress
- `VisionList`: Table/list alternative view
- `VisionDetailModal`: Full detail with tasks, phases, change history
- `VisionEditor`: Inline markdown editor for creating/editing visions

**States:**
- **Empty board**: *"No visions yet. Start by describing what you want to build."* with a prominent "New Vision" button
- **Dragging**: Card lifts with shadow, column highlights as drop targets
- **Agent working on vision**: Card subtly pulses, progress bar animates

---

### 4. Reflections (`/reflections`) — Architecture Decisions (formerly ADRs)

**Purpose**: Browse, read, and track architecture decision records. Each Reflection captures the reasoning behind a decision — proposed by agents or humans, reviewed, accepted or superseded.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────┐
│  ψ Psyche          Canvas  River  Visions  [Reflections]   ◑  ⌘K ◧ │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  + New Reflection  ·  [Search reflections...]                        │
│  ─────────────────────────────────────────────────────────────────── │
│                                                                      │
│  ┌─ Active ──────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  R-003  Choose JWT over sessions              accepted         │  │
│  │         ψ₁ Architect · 28m ago                                 │  │
│  │                                                                │  │
│  │  R-002  Use PostgreSQL for persistence        accepted         │  │
│  │         human · 2d ago                                         │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─ Proposed ────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  R-004  Adopt event sourcing for audit log    proposed         │  │
│  │         ψ₃ Explorer · 5m ago · awaiting approval              │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─ Superseded ──────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  R-001  Use cookie-based sessions             superseded       │  │
│  │         human · 5d ago · replaced by R-003                     │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  ○ idle                                               0 pending v0.1│
└──────────────────────────────────────────────────────────────────────┘
```

**Click a Reflection** → opens a split-view reader:
```
┌────────────────────────────────────┬─────────────────────────────────┐
│  R-003: Choose JWT over sessions   │  Diff History                   │
│  ──────────────────────────────    │  ──────────────                 │
│                                    │                                 │
│  ## Status                         │  v3 (current) — 28m ago         │
│  Accepted (2026-02-09)             │  + Added migration plan         │
│                                    │  + Added rollback strategy      │
│  ## Context                        │                                 │
│  The auth module currently uses    │  v2 — 1h ago                    │
│  cookie-based sessions which...    │  ~ Modified decision rationale  │
│                                    │                                 │
│  ## Decision                       │  v1 — 2h ago                    │
│  We will adopt JWT tokens with     │  Initial draft by ψ₁ Architect  │
│  refresh rotation because...       │                                 │
│                                    │                                 │
│  ## Consequences                   │                                 │
│  ### Positive                      │                                 │
│  - Stateless authentication...     │                                 │
│                                    │                                 │
│  [Edit] [Accept] [Supersede]       │  [View in River]               │
└────────────────────────────────────┴─────────────────────────────────┘
```

**Components:**
- `ReflectionList`: Grouped list (Active, Proposed, Superseded) with search
- `ReflectionReader`: Markdown renderer with status badge and actions
- `ReflectionDiffHistory`: Right panel showing version history with inline diffs
- `ReflectionEditor`: Markdown editor for creating/editing reflections
- `ReflectionStatusBadge`: Colored badge (proposed=amber, accepted=green, superseded=gray)

**States:**
- **Empty**: *"No reflections yet. Agents will propose reflections as they make architectural decisions."*
- **Proposed awaiting approval**: Amber glow on the entry, "Approve" / "Reject" buttons visible
- **Reading**: Split view with document left, version history right

---

### 5. Agent Stream Overlay (Global, slides from right)

**Purpose**: See any agent's real-time output — what it's thinking, generating, deciding. Accessible from anywhere by clicking the status strip or an agent node.

**Layout**:
```
                                    ┌──────────────────────────────────┐
                                    │  ψ₁ Architect              — ×  │
                                    │  ● Working · auth module         │
                                    │  ──────────────────────────────  │
                                    │                                  │
                                    │  Analyzing existing auth         │
                                    │  patterns in src/auth/...        │
                                    │                                  │
                                    │  Found 3 files using legacy      │
                                    │  cookie sessions:                │
                                    │  - src/auth/session.ts           │
                                    │  - src/middleware/auth.ts         │
                                    │  - src/routes/login.ts           │
                                    │                                  │
                                    │  Proposing JWT migration with    │
                                    │  refresh token rotation...▍      │
                                    │                                  │
                                    │  ── Event Log ─────────────────  │
                                    │  12:34 agent:started             │
                                    │  12:34 diff:created auth.ts      │
                                    │  12:35 document:saved R-003      │
                                    │                                  │
                                    │  [Pause]  [Approve All]  [Stop]  │
                                    └──────────────────────────────────┘
   Width: 360px, slides from right
   Persists across page navigation
   Backdrop: subtle dark overlay on main content
```

**Components:**
- `AgentStreamOverlay`: Container panel with slide animation
- `AgentStreamContent`: Markdown-rendered streaming text with blinking cursor
- `AgentEventLog`: Timestamped event feed
- `AgentControls`: Pause/Resume, Approve All, Stop buttons

---

## Shared Components

### Agent Components

#### `AgentNode`
```typescript
interface AgentNodeProps {
  id: string;
  name: string;
  archetype: AgentArchetype;
  task?: string;
  status: "idle" | "active" | "completed" | "error" | "paused";
  progress?: number;
  position: { x: number; y: number };
  onDrag?: (position: { x: number; y: number }) => void;
  onClick?: () => void;
  onConnect?: (targetAgentId: string) => void;
}

type AgentArchetype =
  | "architect"    // The Architect — designs systems, creates structure
  | "guardian"     // The Guardian — tests, validates, ensures quality
  | "explorer"     // The Explorer — researches, discovers, proposes
  | "alchemist"    // The Alchemist — transforms, refactors, optimizes
  | "shadow"       // The Shadow — debugs, finds hidden issues
  | "sage"         // The Sage — reviews, advises, documents
  | "herald"       // The Herald — communicates, integrates, notifies
  | "trickster";   // The Trickster — refactors unconventionally, challenges assumptions
```

#### `AgentConfigPanel`
```typescript
interface AgentConfigPanelProps {
  agent?: Agent;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AgentConfig) => void;
  onDelete?: () => void;
}

interface AgentConfig {
  name: string;
  archetype: AgentArchetype;
  task: string;
  autonomy: 1 | 2 | 3 | 4 | 5;  // 1=full approval, 5=autonomous
  dependsOn?: string[];           // agent IDs this agent waits for
  outputFeeds?: string[];         // agent IDs that receive this agent's output
}
```

### Canvas Components

#### `InfiniteCanvas`
```typescript
interface InfiniteCanvasProps {
  children: React.ReactNode;
  gridSize?: number;
  minZoom?: number;
  maxZoom?: number;
  onCanvasClick?: (position: { x: number; y: number }) => void;
  mode: "canvas" | "constellation";
}
```

#### `ConnectionLine`
```typescript
interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  status: "idle" | "active" | "completed";
  archetypeColor: string;
}
```

### Document Components

#### `VisionCard`
```typescript
interface VisionCardProps {
  id: string;
  title: string;
  agent?: { name: string; archetype: AgentArchetype };
  priority: "low" | "medium" | "high";
  totalTasks: number;
  completedTasks: number;
  stage: "backlog" | "in_progress" | "review" | "done";
  onDragStart?: () => void;
  onDragEnd?: (newStage: string) => void;
  onClick?: () => void;
}
```

#### `ReflectionReader`
```typescript
interface ReflectionReaderProps {
  reflection: Reflection;
  versions: ReflectionVersion[];
  onAccept?: () => void;
  onReject?: () => void;
  onSupersede?: (replacedById: string) => void;
  onEdit?: () => void;
}
```

### River Components

#### `RiverEntry`
```typescript
interface RiverEntryProps {
  id: string;
  type: "vision" | "reflection" | "diagram" | "code" | "status" | "agent";
  title: string;
  description: string;
  agent?: { name: string; archetype: AgentArchetype };
  timestamp: Date;
  stats?: DiffStats;
  preview?: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}
```

### Feedback Components

#### `StatusStrip`
```typescript
interface StatusStripProps {
  activeAgent?: { name: string; archetype: AgentArchetype; message: string };
  pendingCount: number;
  version: string;
  onClick?: () => void;
}
```

#### `CommandPalette`
```typescript
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
  onSelect: (command: Command) => void;
}

interface Command {
  id: string;
  label: string;
  category: "navigation" | "agent" | "document" | "setting";
  shortcut?: string;
  action: () => void;
}
```

---

## Core Data Types

```typescript
/* ═══════════════════════════════════════════
   PSYCHE — Core Type System
   ═══════════════════════════════════════════ */

// Agent
interface Agent {
  id: string;
  name: string;
  archetype: AgentArchetype;
  task: string;
  status: "idle" | "active" | "completed" | "error" | "paused";
  autonomy: 1 | 2 | 3 | 4 | 5;
  progress?: number;
  position: { x: number; y: number };
  dependsOn: string[];
  outputFeeds: string[];
  createdAt: Date;
  updatedAt: Date;
  streamContent?: string;
  events: AgentEvent[];
}

// Vision (formerly PRD)
interface Vision {
  id: string;
  title: string;
  overview: string;
  stage: "backlog" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignedAgent?: string;
  tasks: VisionTask[];
  totalTasks: number;
  completedTasks: number;
  changeHistory: ChangeEntry[];
  createdAt: Date;
  updatedAt: Date;
}

interface VisionTask {
  id: string;
  phase: number;
  category: "setup" | "feature" | "integration" | "optimization" | "security" | "testing" | "documentation";
  description: string;
  steps: string[];
  implemented: boolean;
}

// Reflection (formerly ADR)
interface Reflection {
  id: string;
  number: number;
  title: string;
  status: "proposed" | "accepted" | "superseded" | "deprecated";
  content: string;          // full markdown
  author: "agent" | "human";
  agentId?: string;
  versions: ReflectionVersion[];
  supersededBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReflectionVersion {
  id: string;
  version: number;
  diff: DiffHunk[];
  author: "agent" | "human";
  agentId?: string;
  timestamp: Date;
  description: string;
}

// River Entry
interface RiverEntry {
  id: string;
  type: "vision" | "reflection" | "diagram" | "code" | "status" | "agent";
  title: string;
  description: string;
  agent?: { id: string; name: string; archetype: AgentArchetype };
  timestamp: Date;
  stats?: DiffStats;
  linkedDocumentId?: string;
  linkedDocumentType?: "vision" | "reflection";
  excalidrawSnapshot?: string;  // base64 or URL
  diffHunks?: DiffHunk[];
}

// Change Entry (for document history)
interface ChangeEntry {
  id: string;
  timestamp: Date;
  description: string;       // plain English
  author: "agent" | "human";
  agentId?: string;
  agentName?: string;
}

// Reused from mdiff
interface DiffStats {
  linesAdded?: number;
  linesRemoved?: number;
  nodesAdded?: number;
  nodesRemoved?: number;
  edgesAdded?: number;
  edgesRemoved?: number;
}

interface DiffHunk {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: DiffLine[];
}

interface DiffLine {
  type: "context" | "added" | "removed";
  content: string;
  lineNumber: number;
}

// Event system
type PsycheEventType =
  | "agent:created" | "agent:started" | "agent:streaming"
  | "agent:step-completed" | "agent:completed" | "agent:failed"
  | "agent:paused" | "agent:resumed"
  | "vision:created" | "vision:updated" | "vision:task-completed"
  | "reflection:proposed" | "reflection:accepted" | "reflection:superseded"
  | "diagram:updated"
  | "code:changed"
  | "river:entry-added";

interface PsycheEvent {
  id: string;
  type: PsycheEventType;
  timestamp: Date;
  agentId?: string;
  payload: Record<string, unknown>;
}

interface AgentEvent {
  id: string;
  type: PsycheEventType;
  timestamp: Date;
  message: string;
}
```

---

## Animation & Interaction

### Micro-interactions
- **Agent node hover**: 150ms ease — subtle lift (translateY -2px), border brightens to archetype color
- **Agent node active glow**: 2s ease-in-out infinite — soft radial glow pulse in archetype color (keyframes: 0% 0px shadow, 50% 12px shadow, 100% 0px shadow)
- **Connection line flow**: 1.5s linear infinite — dashed stroke animation (stroke-dashoffset) flowing from source to target
- **Vision card drag**: 200ms — lifts with 8px shadow, 0.95 scale, 0.85 opacity on original position
- **Status strip idle fade**: 3s ease — opacity 1.0 → 0.3 after 5s of no agent activity
- **River entry appear**: 150ms ease-out — fade in + slide from left (translateX -8px → 0)

### Page Transitions
- **View switch (Canvas ↔ River ↔ Visions ↔ Reflections)**: 200ms ease — crossfade with subtle translateY (4px → 0)
- **Panel slide-in (Agent config, Stream overlay)**: 250ms cubic-bezier(0.32, 0.72, 0, 1) — slide from right
- **Modal open**: 200ms ease — fade in backdrop + scale(0.96 → 1.0) on modal

### Loading States
- **Canvas loading**: Grid background appears first, then agent nodes fade in one by one (50ms stagger)
- **River loading**: Skeleton entries with gentle pulse animation (1.5s ease-in-out)
- **Vision board loading**: Column headers appear, then skeleton cards slide in
- **Agent stream**: Blinking cursor (▍) at 530ms interval until content arrives

### Reduced Motion
- All animations respect `prefers-reduced-motion: reduce`
- Glow pulses become static borders
- Slide transitions become instant opacity changes
- Connection flow animations stop (static dashed lines)

---

## Responsive Behavior

### Breakpoints
```css
--breakpoint-sm: 640px;    /* mobile phones */
--breakpoint-md: 768px;    /* tablets portrait */
--breakpoint-lg: 1024px;   /* tablets landscape, small laptops */
--breakpoint-xl: 1280px;   /* desktops */
--breakpoint-2xl: 1536px;  /* large desktops */
```

### Mobile Adaptations (< 768px)
- **Top bar**: Logo + hamburger menu. View tabs move into hamburger dropdown.
- **Canvas**: Touch-friendly — pinch to zoom, drag to pan, long-press to create agent. Agent nodes enlarge to 220×120px for tap targets. Config panel becomes full-screen sheet (slides from bottom).
- **River**: Full-width entries. Filter bar becomes a single "Filter" button opening a bottom sheet.
- **Visions board**: Single-column view. Swipe left/right to switch columns. Cards are full-width.
- **Reflections**: List only (no split view). Click opens full-screen reader. Version history accessible via tab.
- **Agent overlay**: Full-screen takeover instead of 360px side panel.
- **Status strip**: Simplified — just the pulsing dot and agent name, tap for full overlay.

### Tablet Adaptations (768px – 1024px)
- **Canvas**: Full canvas with slightly larger nodes (200×110px). Config panel overlays at 360px.
- **Visions board**: 2 columns visible at a time, horizontal scroll for remaining.
- **Reflections**: Split view with 40/60 ratio instead of 50/50.

---

## Accessibility

### Requirements
- Full keyboard navigation across all views (Tab, Shift+Tab, Enter, Escape, Arrow keys)
- Canvas: Arrow keys to move between agent nodes, Enter to open config, Space to toggle selection
- ARIA labels on all interactive elements (`role="button"`, `aria-label`, `aria-expanded`)
- Screen reader announcements for agent status changes (`aria-live="polite"`)
- Focus rings visible on all interactive elements (2px `--accent-primary` outline, 2px offset)
- Skip-to-content link hidden until focused
- All agent archetype information conveyed through text labels, not just color
- Escape key closes all overlays, modals, and panels

### Color Contrast
- Primary text on primary background: `#e8e4df` on `#0a0a12` = **15.2:1** (AAA)
- Secondary text on primary background: `#8a8698` on `#0a0a12` = **5.8:1** (AA)
- Accent on primary background: `#f5c364` on `#0a0a12` = **10.4:1** (AAA)
- All archetype colors tested against `--bg-secondary` for minimum 4.5:1 contrast
- Diff added/removed colors include underline/strikethrough in addition to color for colorblind users

---

## Implementation Priority

### Phase 1 (MVP) — The Canvas & Foundation
1. Project scaffolding (Next.js 16, Tailwind, shadcn/ui, Zustand)
2. Design tokens (all CSS variables from this spec) and theme toggle
3. App shell — top bar, status strip, view routing
4. Infinite canvas with pan/zoom (empty state)
5. Agent node creation — click to place, basic config panel
6. Agent node display — archetype icon, name, status, progress
7. Connection lines between agents (static, no animation yet)
8. Command palette (⌘K) with basic navigation commands
9. Mock data layer for agents, visions, reflections

### Phase 2 (Core) — River & Documents
1. River view — timeline entries with date grouping
2. River entry types (vision, reflection, diagram, code, agent)
3. River inline preview (diff hunks, diagram thumbnails)
4. River filters (type, agent, search)
5. Visions board — Kanban with drag-and-drop
6. Vision card with agent, priority, progress
7. Vision detail modal with tasks and phases
8. Reflections list — grouped by status
9. Reflection reader with markdown rendering
10. Reflection version history (right panel)

### Phase 3 (Collaboration & Polish)
1. Agent-to-agent connections — animated flow lines
2. Constellation mode (auto-layout toggle)
3. Agent stream overlay with real-time markdown
4. Agent autonomy dial (1–5 levels)
5. SSE event streaming infrastructure
6. Excalidraw diagram thumbnails in River
7. Vision/Reflection change history (plain English entries)
8. Responsive mobile layouts
9. Agent lifecycle events (create, complete, fail, pause)
10. Keyboard shortcuts for all major actions

### Phase 4 (Advanced)
1. Vercel AI SDK integration for real agent streaming
2. Full Excalidraw canvas embedding for diagram editing
3. Agent dependency graph validation (cycle detection)
4. Export/import workspace state
5. Integration hub (Discord, Telegram, Slack notifications)
6. Full-text search across all documents and River entries
7. Undo/redo for canvas operations
8. Collaborative multi-user support (future consideration)

---

## File Structure

```
psyche-ui/
├── app/
│   ├── layout.tsx                              # Root layout: ThemeProvider, PsycheShell
│   ├── page.tsx                                # Redirects to /canvas
│   ├── canvas/
│   │   └── page.tsx                            # Canvas workspace
│   ├── river/
│   │   └── page.tsx                            # Timeline river
│   ├── visions/
│   │   └── page.tsx                            # Vision board + list
│   ├── reflections/
│   │   └── page.tsx                            # Reflections browser
│   ├── globals.css                             # All design tokens + theme variables
│   └── api/
│       ├── agents/
│       │   ├── route.ts                        # CRUD agents
│       │   └── [id]/
│       │       ├── route.ts                    # Single agent ops
│       │       └── stream/route.ts             # SSE stream per agent
│       ├── visions/
│       │   ├── route.ts                        # CRUD visions
│       │   └── [id]/route.ts                   # Single vision ops
│       ├── reflections/
│       │   ├── route.ts                        # CRUD reflections
│       │   └── [id]/route.ts                   # Single reflection ops
│       ├── river/route.ts                      # River entries (paginated)
│       └── events/stream/route.ts              # Global SSE endpoint
├── components/
│   ├── layout/
│   │   ├── psyche-shell.tsx                    # App shell (top bar + main + status strip)
│   │   ├── psyche-top-bar.tsx                  # 52px header with nav tabs
│   │   ├── status-strip.tsx                    # 24px footer with agent status
│   │   └── command-palette.tsx                 # ⌘K search/command interface
│   ├── canvas/
│   │   ├── infinite-canvas.tsx                 # Pan/zoom container with dot grid
│   │   ├── agent-node.tsx                      # Draggable agent card on canvas
│   │   ├── connection-line.tsx                 # SVG connection between agents
│   │   ├── agent-config-panel.tsx              # Slide-in agent editor
│   │   ├── constellation-layout.tsx            # Auto-arrange algorithm
│   │   └── canvas-toolbar.tsx                  # Zoom, mode toggle, add button
│   ├── river/
│   │   ├── river-view.tsx                      # Timeline container
│   │   ├── river-entry.tsx                     # Single timeline entry
│   │   ├── river-filters.tsx                   # Type/agent/search filters
│   │   ├── river-date-group.tsx                # Date separator
│   │   └── diagram-thumbnail.tsx               # Excalidraw mini preview
│   ├── visions/
│   │   ├── vision-board.tsx                    # Kanban container
│   │   ├── vision-card.tsx                     # Draggable board card
│   │   ├── vision-list.tsx                     # Table/list view
│   │   ├── vision-detail-modal.tsx             # Full vision detail
│   │   └── vision-editor.tsx                   # Create/edit markdown form
│   ├── reflections/
│   │   ├── reflection-list.tsx                 # Grouped reflection list
│   │   ├── reflection-reader.tsx               # Markdown reader + actions
│   │   ├── reflection-diff-history.tsx         # Version history panel
│   │   ├── reflection-editor.tsx               # Create/edit form
│   │   └── reflection-status-badge.tsx         # Status indicator
│   ├── agent/
│   │   ├── agent-stream-overlay.tsx            # 360px slide-in panel
│   │   ├── agent-stream-content.tsx            # Streaming markdown renderer
│   │   ├── agent-event-log.tsx                 # Timestamped event feed
│   │   └── agent-controls.tsx                  # Pause/Approve/Stop buttons
│   ├── diff/
│   │   ├── diff-hunk.tsx                       # Line-by-line diff rendering
│   │   ├── diff-stats.tsx                      # +N −M badge
│   │   └── diff-preview.tsx                    # Expandable inline diff
│   ├── ui/                                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── scroll-area.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── tabs.tsx
│   │   ├── tooltip.tsx
│   │   └── ...                                 # (remaining shadcn components)
│   └── theme-provider.tsx                      # next-themes wrapper
├── lib/
│   ├── types.ts                                # All TypeScript interfaces
│   ├── utils.ts                                # cn() utility, helpers
│   ├── mock-data.ts                            # Mock agents, visions, reflections, river
│   └── constants.ts                            # Archetype definitions, colors, icons
├── hooks/
│   ├── use-canvas.ts                           # Canvas pan/zoom/interaction state
│   ├── use-agents.ts                           # Agent CRUD + streaming
│   ├── use-visions.ts                          # Vision CRUD
│   ├── use-reflections.ts                      # Reflection CRUD
│   ├── use-river.ts                            # River entries + filtering
│   ├── use-event-stream.ts                     # SSE client hook
│   └── use-theme.ts                            # Dark/light toggle
├── stores/
│   ├── agent-store.ts                          # Zustand: agents, positions, connections
│   ├── canvas-store.ts                         # Zustand: zoom, pan, mode, selection
│   ├── vision-store.ts                         # Zustand: visions, board state
│   ├── reflection-store.ts                     # Zustand: reflections, versions
│   ├── river-store.ts                          # Zustand: river entries, filters
│   └── ui-store.ts                             # Zustand: theme, overlays, command palette
├── tailwind.config.ts                          # Extended with Psyche tokens
├── tsconfig.json
├── next.config.ts
├── package.json
├── components.json                             # shadcn/ui config
└── .gitignore
```

---

## Consequences

### Positive
- **Spatial agent management** — placing agents on a canvas makes complex multi-agent workflows tangible and intuitive
- **Complete change chronicle** — every architectural decision, every code change, every agent action recorded in plain English with Excalidraw snapshots
- **Jungian archetype system** — subtle personality makes agents memorable and distinguishable without being gimmicky
- **Human-in-the-loop by design** — autonomy dial, approval gates, and the River ensure the human always knows what happened and why
- **Builds on mdiff foundation** — reuses proven patterns (diff rendering, board, Excalidraw integration) while adding the multi-agent canvas layer

### Negative
- **Canvas complexity** — infinite canvas with drag, zoom, connections is the most complex UI pattern to implement well; performance at scale (50+ agents) needs care
- **New project, not a fork** — Psyche is a new codebase rather than extending mdiff-ui, meaning some component reimplementation
- **Learning curve** — the Jungian naming (Visions, Reflections, archetypes) adds personality but requires users to learn the vocabulary

### Trade-offs
- **Warm amber accent over electric violet** — amber feels more introspective and Jungian than violet; trades "tech-cool" for "human-warm." The archetype system provides color variety through individual agent colors.
- **Top-nav only (no sidebar)** — maximizes canvas and content space but means deeper navigation for power users. Mitigated by ⌘K command palette and keyboard shortcuts.
- **Constellation mode as toggle, not default** — freeform canvas is the primary mode because spatial freedom matters for creative workflows. Auto-layout is one click away for those who prefer structure.
- **Fully responsive over desktop-first** — more implementation work upfront but ensures the tool is accessible everywhere. Canvas on mobile is simplified but functional.
