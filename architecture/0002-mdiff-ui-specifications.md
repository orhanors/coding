# ADR-0002: UI Specifications — mdiff

## Status
Proposed (2026-02-08)

## Context
This document defines the UI specifications for **mdiff** — a diff-based development lifecycle manager. mdiff tracks and visualizes changes across the entire development cycle: ADR/PRD/PRD-log document diffs and Excalidraw architecture diagram diffs. It provides a unified, minimal interface where developers manage projects, add features, observe agents working in real-time, and trigger agents from Telegram, Discord, or Slack.

The name "mdiff" captures the essence: **managing development through diffs**. Every architectural decision, every product requirement, every diagram mutation is a diff — and mdiff makes those diffs visible, navigable, and actionable.

The core workflow: **create/import project → add feature → agent generates ADR/PRD/Excalidraw changes → watch diffs stream in real-time → review & approve → notify team via integrations**. Google's A2UI standard enables agents to push dynamic, declarative UI components directly into the interface without executing arbitrary code.

This is a **new** application. The existing `coding-ui` Next.js project (React 19, Tailwind, shadcn/ui primitives) provides the foundation. mdiff will replace the previous "Agentic Coding Platform" UI (ADR-0001) with a fundamentally different design philosophy: **top-nav, spacious, futuristic-minimal**.

---

## Design Direction

### Aesthetic: "Futuristic Minimal"
Clean geometry meets subtle depth. Inspired by Linear's restraint, Raycast's polish, and a touch of sci-fi data visualization — but never overdone. The interface breathes. Every element earns its place. Violet accents glow softly against muted surfaces, creating a sense of quiet intelligence. No noise, no clutter — just the diff, the diagram, and the stream.

### Design Principles
1. **Diff is the Atom**: Every view in mdiff centers on a diff — text diffs, diagram diffs, status diffs. If it changed, you see how.
2. **Breathe**: Spacious layouts with generous whitespace. One focus area per viewport. Scrolling is preferred over cramming.
3. **Ambient Awareness**: Real-time agent activity is always subtly visible — never intrusive, always accessible. A soft pulse, a streaming line, a count ticking up.
4. **Invisible Until Needed**: Navigation, controls, and metadata fade into the background until hovered or needed. The content is the interface.

### Color Palette

#### Dark Theme (Default)
```css
:root[data-theme="dark"] {
  /* Base — deep cool grays with violet undertone */
  --bg-primary: #09090b;          /* App background — near-black */
  --bg-secondary: #0f0f14;        /* Cards, panels */
  --bg-tertiary: #16161e;         /* Elevated surfaces, modals */
  --bg-hover: #1e1e2a;            /* Hover states */
  --bg-active: #262636;           /* Active/selected states */
  --bg-surface: #121218;          /* Inset surfaces, code blocks */

  /* Borders — barely there */
  --border-subtle: rgba(255, 255, 255, 0.04);
  --border-default: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.14);

  /* Text */
  --text-primary: #ededf0;
  --text-secondary: #8b8b9e;
  --text-muted: #4e4e64;
  --text-inverse: #09090b;

  /* Accent — Electric Violet */
  --accent-primary: #a855f7;      /* Primary actions, links */
  --accent-hover: #9333ea;        /* Hover on accent elements */
  --accent-muted: rgba(168, 85, 247, 0.12);  /* Accent backgrounds */
  --accent-subtle: rgba(168, 85, 247, 0.06); /* Accent tints */
  --accent-glow: rgba(168, 85, 247, 0.25);   /* Soft glow for active states */

  /* Semantic */
  --success: #34d399;
  --success-muted: rgba(52, 211, 153, 0.10);
  --warning: #fbbf24;
  --warning-muted: rgba(251, 191, 36, 0.10);
  --error: #f87171;
  --error-muted: rgba(248, 113, 113, 0.10);
  --info: #60a5fa;
  --info-muted: rgba(96, 165, 250, 0.10);

  /* Diff colors */
  --diff-added-bg: rgba(52, 211, 153, 0.08);
  --diff-added-border: rgba(52, 211, 153, 0.30);
  --diff-added-text: #6ee7b7;
  --diff-removed-bg: rgba(248, 113, 113, 0.08);
  --diff-removed-border: rgba(248, 113, 113, 0.30);
  --diff-removed-text: #fca5a5;
  --diff-modified-bg: rgba(168, 85, 247, 0.08);
  --diff-modified-border: rgba(168, 85, 247, 0.30);

  /* Pipeline stage colors */
  --stage-adr: #a78bfa;           /* Violet-300 */
  --stage-prd: #c084fc;           /* Purple-400 */
  --stage-excalidraw: #f9a8d4;    /* Pink-300 */
  --stage-implement: #34d399;     /* Emerald-400 */

  /* Agent activity */
  --agent-pulse: rgba(168, 85, 247, 0.40);
  --agent-stream: #a855f7;
}
```

#### Light Theme
```css
:root[data-theme="light"] {
  /* Base */
  --bg-primary: #fafafa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f4f4f5;
  --bg-hover: #e4e4e7;
  --bg-active: #d4d4d8;
  --bg-surface: #f0f0f2;

  /* Borders */
  --border-subtle: rgba(0, 0, 0, 0.04);
  --border-default: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.16);

  /* Text */
  --text-primary: #18181b;
  --text-secondary: #71717a;
  --text-muted: #a1a1aa;
  --text-inverse: #fafafa;

  /* Accent — Electric Violet (darkened for contrast) */
  --accent-primary: #7c3aed;
  --accent-hover: #6d28d9;
  --accent-muted: rgba(124, 58, 237, 0.08);
  --accent-subtle: rgba(124, 58, 237, 0.04);
  --accent-glow: rgba(124, 58, 237, 0.15);

  /* Semantic */
  --success: #16a34a;
  --success-muted: rgba(22, 163, 74, 0.08);
  --warning: #d97706;
  --warning-muted: rgba(217, 119, 6, 0.08);
  --error: #dc2626;
  --error-muted: rgba(220, 38, 38, 0.08);
  --info: #2563eb;
  --info-muted: rgba(37, 99, 235, 0.08);

  /* Diff colors */
  --diff-added-bg: rgba(22, 163, 74, 0.06);
  --diff-added-border: rgba(22, 163, 74, 0.25);
  --diff-added-text: #166534;
  --diff-removed-bg: rgba(220, 38, 38, 0.06);
  --diff-removed-border: rgba(220, 38, 38, 0.25);
  --diff-removed-text: #991b1b;
  --diff-modified-bg: rgba(124, 58, 237, 0.06);
  --diff-modified-border: rgba(124, 58, 237, 0.25);

  /* Pipeline stage colors */
  --stage-adr: #7c3aed;
  --stage-prd: #9333ea;
  --stage-excalidraw: #db2777;
  --stage-implement: #16a34a;

  /* Agent activity */
  --agent-pulse: rgba(124, 58, 237, 0.25);
  --agent-stream: #7c3aed;
}
```

### Typography
```css
/* Primary font — Inter for geometric clarity */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace — for diffs, code, agent output */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

/* Scale — generous, spacious */
--text-xs: 0.75rem;     /* 12px — timestamps, badges, meta */
--text-sm: 0.8125rem;   /* 13px — secondary labels */
--text-base: 0.9375rem; /* 15px — body text */
--text-lg: 1.125rem;    /* 18px — section headers */
--text-xl: 1.375rem;    /* 22px — page titles */
--text-2xl: 1.75rem;    /* 28px — hero numbers, project names */
--text-3xl: 2.25rem;    /* 36px — landing-style headings */

/* Line heights */
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.7;

/* Weights */
--font-light: 300;      /* De-emphasized labels */
--font-normal: 400;     /* Body text */
--font-medium: 500;     /* Interactive elements */
--font-semibold: 600;   /* Headings */

/* Letter spacing */
--tracking-tight: -0.02em;  /* Headings */
--tracking-normal: 0;       /* Body */
--tracking-wide: 0.05em;    /* Uppercase labels, badges */
```

---

## Layout Structure

### Shell Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  mdiff        Projects ▾    Features    Timeline        ◐  ⌘K        ▲ 3   │
│                                                                              │
│  Top Bar (56px, fixed, transparent-blur backdrop)                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                                                                              │
│                                                                              │
│                           Main Content Area                                  │
│                           (flex-1, scrollable)                               │
│                                                                              │
│                           Max-width: 1200px                                  │
│                           Centered with generous padding                     │
│                                                                              │
│                                                                              │
│                                                                              │
│                                                                              │
│                                                                              │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  ● Agent active · 3 diffs pending                          mdiff v0.1       │
│  Status Strip (24px, minimal, fades when idle)                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Shell Regions:**
- **Top Bar** (56px, fixed): Logo wordmark "mdiff" on left. Navigation tabs: Projects, Features, Timeline. Right side: theme toggle (◐), command palette trigger (⌘K), notification bell with unread count (▲ 3). Uses `backdrop-filter: blur(12px)` for a frosted glass effect over scrolling content.
- **Main Content Area** (flex-1): Max-width 1200px, centered. Generous horizontal padding (48px on desktop). Content scrolls, top bar stays fixed. Each page owns its layout within this area.
- **Status Strip** (24px, fixed bottom): Minimal one-line status. Shows agent activity indicator (pulsing dot), pending diff count, app version. Fades to 0.3 opacity when idle, full opacity on hover or when agent is active.

**No sidebar.** Navigation lives in the top bar. Project/feature hierarchy is accessed via the Projects dropdown and feature list page. This maximizes the content area and enforces the spacious aesthetic.

---

## Page Specifications

### 1. Dashboard / Home (`/`)

**Purpose**: Project overview. See all your projects, recent diffs across all projects, and current agent activity. The landing page after login.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  mdiff        Projects ▾    Features    Timeline        ◐  ⌘K        ▲ 3   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                                                                              │
│     Your Projects                               [+ New Project] [↓ Import]  │
│                                                                              │
│     ┌─────────────────────────────┐  ┌─────────────────────────────┐        │
│     │                             │  │                             │        │
│     │   payments-api              │  │   auth-service              │        │
│     │                             │  │                             │        │
│     │   4 ADRs · 3 PRDs          │  │   7 ADRs · 5 PRDs          │        │
│     │   Last diff: 12m ago       │  │   Last diff: 2h ago        │        │
│     │                             │  │                             │        │
│     │   ● Agent working           │  │   ○ Idle                   │        │
│     │                             │  │                             │        │
│     └─────────────────────────────┘  └─────────────────────────────┘        │
│                                                                              │
│     ┌─────────────────────────────┐  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐        │
│     │                             │                               │        │
│     │   mobile-app                │  │   + Add project            │        │
│     │                             │                               │        │
│     │   2 ADRs · 1 PRD           │  │                             │        │
│     │   Last diff: 1d ago        │                               │        │
│     │                             │  │                             │        │
│     │   ○ Idle                    │                               │        │
│     │                             │  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘        │
│     └─────────────────────────────┘                                         │
│                                                                              │
│                                                                              │
│     ─────────────────────────────────────────────────────────────           │
│                                                                              │
│     Recent Diffs                                          [View all →]      │
│                                                                              │
│     ┌────────────────────────────────────────────────────────────────┐      │
│     │  ● payments-api / ADR-0004          12m ago       +23 −5      │      │
│     │    "Add Redis caching layer"                                   │      │
│     ├────────────────────────────────────────────────────────────────┤      │
│     │  ● payments-api / Excalidraw        14m ago       +3 nodes    │      │
│     │    Architecture diagram updated                                │      │
│     ├────────────────────────────────────────────────────────────────┤      │
│     │  ○ auth-service / PRD-0007          2h ago        +95 lines   │      │
│     │    "Rate limiting implementation"                              │      │
│     └────────────────────────────────────────────────────────────────┘      │
│                                                                              │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  ● Agent active · 3 diffs pending                          mdiff v0.1       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Components**:
- `ProjectCard`: Project name, document counts (ADRs, PRDs), last diff timestamp, agent status indicator. Click to enter project workspace.
- `AddProjectCard`: Dashed-border placeholder card. Click to create new project or import.
- `RecentDiffList`: Chronological list of recent diffs across all projects. Each row shows project, document, timestamp, and diff summary (+/- lines or +/- nodes).

**States**:
- **Empty**: No projects — centered "Create your first project" CTA with illustration
- **With projects**: Grid of project cards (2-column on desktop, 1-column mobile)
- **Agent active**: Active project card shows pulsing violet dot, status strip at bottom pulses

---

### 2. Project Workspace (`/projects/[id]`)

**Purpose**: Single project deep-dive. This is where you work — view diffs, watch agents stream changes, browse ADRs/PRDs, and interact with Excalidraw diagrams. The heart of mdiff.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  mdiff        Projects ▾    Features    Timeline        ◐  ⌘K        ▲ 3   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ← Back     payments-api                    [+ Add Feature] [⚙ Settings]   │
│                                                                              │
│                                                                              │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐                  │
│  │  Diffs  │  │  Docs    │  │ Diagram   │  │  A2UI      │                  │
│  └─────────┘  └──────────┘  └───────────┘  └────────────┘                  │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                  │
│                                                                              │
│  [TAB: Diffs — active]                                                      │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │                                                                  │       │
│  │  ADR-0004: Add Redis Caching Layer                               │       │
│  │  12 minutes ago · by agent                                       │       │
│  │                                                                  │       │
│  │  ┌─ Context ────────────────────────────────────────────────┐    │       │
│  │  │                                                          │    │       │
│  │  │   @@ -12,6 +12,8 @@                                     │    │       │
│  │  │    The application currently makes direct                │    │       │
│  │  │    database queries for every API request.               │    │       │
│  │  │  + Under peak load (>1000 req/s), this causes            │    │       │
│  │  │  + p99 latency spikes exceeding 2 seconds.              │    │       │
│  │  │    We need a strategy to reduce database                 │    │       │
│  │  │    pressure while maintaining data freshness.            │    │       │
│  │  │                                                          │    │       │
│  │  └──────────────────────────────────────────────────────────┘    │       │
│  │                                                                  │       │
│  │  +23 added  −5 removed                      [View full] [Edit]  │       │
│  │                                                                  │       │
│  ├──────────────────────────────────────────────────────────────────┤       │
│  │                                                                  │       │
│  │  Excalidraw: Architecture Updated                                │       │
│  │  14 minutes ago · by agent                                       │       │
│  │                                                                  │       │
│  │  ┌──────────────────────────────────────────────────────────┐    │       │
│  │  │                                                          │    │       │
│  │  │    ┌─────┐   + ┌───────┐     ┌─────┐                    │    │       │
│  │  │    │ API │────▶│ Redis │────▶│ DB  │                    │    │       │
│  │  │    └─────┘     └───────┘     └─────┘                    │    │       │
│  │  │                (new node)                                │    │       │
│  │  │                                                          │    │       │
│  │  └──────────────────────────────────────────────────────────┘    │       │
│  │                                                                  │       │
│  │  +3 nodes  +2 edges                     [Open Excalidraw ↗]     │       │
│  │                                                                  │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│                                                                              │
│  [TAB: Docs — inactive]                                                     │
│  List of all ADRs, PRDs, PRD-logs for this project                          │
│                                                                              │
│  [TAB: Diagram — inactive]                                                  │
│  Full-screen Excalidraw embed for this project's architecture               │
│                                                                              │
│  [TAB: A2UI — inactive]                                                     │
│  Dynamic agent-generated UI via Google A2UI renderer                        │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  ● Agent active · generating PRD...                        mdiff v0.1       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Sub-tabs within Workspace:**

**Diffs tab** (default): Chronological feed of all diffs for this project. Each diff card shows the document/diagram that changed, a collapsed inline diff preview, and diff stats. Expand to see full diff. Inline editing available.

**Docs tab**: Flat list of all ADRs, PRDs, and PRD-logs. Click to open a document in a clean reader view with markdown rendering. Edit button toggles inline editing. Change history accessible per document.

**Diagram tab**: Full Excalidraw embed for this project's architecture diagram. Editable. Shows diff overlay when comparing versions (added nodes highlighted in green, removed in red).

**A2UI tab**: Renders dynamic UI generated by the agent via Google A2UI's JSON-to-component pipeline. A2UI payloads are received from the agent over SSE, resolved by the A2UI renderer, and displayed as native React components. This is where the agent can push forms, dashboards, progress views, or any declarative UI it needs to show.

**Components**:
- `DiffCard`: Expandable card showing a single diff — document name, timestamp, author, inline diff preview, stats.
- `DiffViewer`: Side-by-side or unified diff view. Syntax-highlighted for markdown and code. Hunk-level approve/reject for inline editing.
- `DocumentList`: Flat list of documents grouped by type (ADR/PRD/Log). Sortable by date, name, status.
- `DocumentReader`: Full markdown renderer with table of contents, anchor links. Edit toggle.
- `ExcalidrawCanvas`: Full Excalidraw embed with version comparison mode. Highlights structural diffs.
- `A2UIRenderer`: Google A2UI renderer component. Receives A2UI JSON payloads, resolves components from a registered catalog, renders native React elements.
- `WorkspaceTabs`: Tab switcher for Diffs / Docs / Diagram / A2UI.

**States**:
- **Empty project**: "Add your first feature to get started" CTA
- **Diffs loading**: Skeleton cards with pulsing violet accent
- **Agent streaming**: Live diff card at top with typing indicator, partially rendered diff content streaming in
- **A2UI active**: Agent-generated UI renders in the A2UI tab. Tab badge shows "Live" indicator when new content arrives.

---

### 3. Diff Timeline (`/timeline`)

**Purpose**: Cross-project chronological timeline of all diffs. A global history view — see everything that changed, when, and in which project. The "git log" of your entire architecture.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  mdiff        Projects ▾    Features    Timeline        ◐  ⌘K        ▲ 3   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                                                                              │
│     Timeline                                                                │
│                                                                              │
│     ┌──────────────────────────────────────────────────────────────┐        │
│     │  All Projects ▾    All Types ▾    This Week ▾    🔍 Search  │        │
│     └──────────────────────────────────────────────────────────────┘        │
│                                                                              │
│                                                                              │
│     Today                                                                   │
│     ──────                                                                  │
│                                                                              │
│     │                                                                       │
│     ●  14:32    payments-api                                                │
│     │           ADR-0004 created · "Add Redis caching layer"                │
│     │           +120 lines · Pipeline #47                                   │
│     │           → PRD generated (15 tasks)                                  │
│     │           → Excalidraw: +3 nodes, +2 edges                            │
│     │                                              [View Diff →]            │
│     │                                                                       │
│     ●  14:28    payments-api                                                │
│     │           Excalidraw updated                                          │
│     │           +3 nodes, +2 edges                                          │
│     │                                              [View Diff →]            │
│     │                                                                       │
│     ●  11:15    auth-service                                                │
│     │           ADR-0007 status: Proposed → Accepted                        │
│     │           Approved by agent                                           │
│     │                                              [View Diff →]            │
│     │                                                                       │
│                                                                              │
│     Yesterday                                                               │
│     ──────────                                                              │
│                                                                              │
│     │                                                                       │
│     ●  17:45    auth-service                                                │
│     │           PRD-0007 created · "Rate limiting"                          │
│     │           +95 lines · Pipeline #46                                    │
│     │                                              [View Diff →]            │
│     │                                                                       │
│     ●  14:00    mobile-app                                                  │
│     │           PRD-0002 completed                                          │
│     │           All 18 tasks implemented · Duration: 4h 23m                 │
│     │                                              [View Log →]             │
│     │                                                                       │
│                                                                              │
│                                                                              │
│     ┌──────────────────────────────────────────────────────────────┐        │
│     │  47 total diffs · 12 ADRs · 8 PRDs · 34 logs · 5 diagrams  │        │
│     └──────────────────────────────────────────────────────────────┘        │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  ○ Idle                                                    mdiff v0.1       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Components**:
- `TimelineView`: Vertical timeline with date group headers. Each entry is a `TimelineEntry`.
- `TimelineEntry`: Dot on the timeline line, timestamp, project badge, diff type, description, stats, action link.
- `TimelineFilters`: Dropdown filters for project, diff type (ADR/PRD/Log/Excalidraw), date range. Search input for text search across descriptions.
- `TimelineStats`: Summary bar at bottom showing aggregate counts.

**States**:
- **Empty**: "No diffs yet — create a project and add a feature to get started"
- **Populated**: Timeline entries grouped by date, infinite scroll for history
- **Filtered**: Active filter chips shown below the filter bar, timeline filtered accordingly
- **Live**: New entries animate in at the top when agent produces diffs in real-time

---

### 4. Integrations Hub (`/integrations`)

**Purpose**: Connect Telegram, Discord, and Slack to trigger agents and receive notifications. Minimal configuration — paste a token/webhook, pick events, done.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  mdiff        Projects ▾    Features    Timeline        ◐  ⌘K        ▲ 3   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                                                                              │
│     Integrations                                                            │
│                                                                              │
│     Connect your team's messaging platforms to trigger agents                │
│     and receive diff notifications.                                          │
│                                                                              │
│                                                                              │
│     ┌───────────────────────┐                                               │
│     │                       │                                               │
│     │   Telegram            │                                               │
│     │                       │                                               │
│     │   ● Connected         │                                               │
│     │   @mdiff_bot          │                                               │
│     │                       │                                               │
│     │   Trigger: ✓          │                                               │
│     │   Notify:  ✓          │                                               │
│     │                       │                                               │
│     │   Last: 5m ago        │                                               │
│     │                       │                                               │
│     │   [Configure]  [Test] │                                               │
│     │                       │                                               │
│     └───────────────────────┘                                               │
│                                                                              │
│     ┌───────────────────────┐                                               │
│     │                       │                                               │
│     │   Discord             │                                               │
│     │                       │                                               │
│     │   ● Connected         │                                               │
│     │   #arch-updates       │                                               │
│     │                       │                                               │
│     │   Trigger: ✓          │                                               │
│     │   Notify:  ✓          │                                               │
│     │                       │                                               │
│     │   Last: 12m ago       │                                               │
│     │                       │                                               │
│     │   [Configure]  [Test] │                                               │
│     │                       │                                               │
│     └───────────────────────┘                                               │
│                                                                              │
│     ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐                                               │
│                              │                                               │
│     │   Slack                                                               │
│                              │                                               │
│     │   ○ Not connected                                                     │
│                              │                                               │
│     │   [Connect →]          │                                               │
│                              │                                               │
│     └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘                                               │
│                                                                              │
│                                                                              │
│     ─────────────────────────────────────────────────────────────           │
│                                                                              │
│     Delivery Log                                         [Clear log]       │
│                                                                              │
│     ┌────────────────────────────────────────────────────────────────┐      │
│     │  14:33  Telegram  ✓  "ADR-0004 created: Add Redis caching"   │      │
│     │  14:33  Discord   ✓  "ADR-0004 created: Add Redis caching"   │      │
│     │  14:28  Telegram  ✓  "Excalidraw updated: +3 nodes"          │      │
│     │  14:15  Discord   ✗  "Pipeline started" — retrying...        │      │
│     └────────────────────────────────────────────────────────────────┘      │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  ○ Idle                                                    mdiff v0.1       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Components**:
- `IntegrationCard`: Vertical card per platform. Shows connection status, channel/bot name, capabilities (trigger agent / receive notifications), last activity, configure/test buttons.
- `DeliveryLog`: Timestamped log of outbound notifications. Shows platform, status (✓/✗), message preview. Failed deliveries show retry status.
- `IntegrationConfigSheet`: Slide-up sheet for configuring an integration. Fields: token/webhook URL, channel selection, event subscriptions (checkboxes), trigger commands.

**Key Feature — Agent Triggering**:
Each integration supports two modes:
1. **Notify**: mdiff sends diff notifications to the channel/chat
2. **Trigger**: Users in the channel can trigger agents by sending commands (e.g., `/mdiff add-feature "Add caching"` in Telegram)

**States**:
- **No integrations**: All cards show dashed border with "Connect" CTA
- **Partial**: Mix of connected (solid border, status info) and disconnected (dashed)
- **All connected**: All solid, delivery log populated
- **Config open**: Sheet slides up with form fields, test button sends a test message

---

### 5. Agent Stream Overlay (Global)

**Purpose**: A persistent, dismissible overlay panel that shows the agent's real-time activity. Accessible from any page. This is how you "watch the agent work" — every diff, every decision, streamed live.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  mdiff        Projects ▾    Features    Timeline        ◐  ⌘K        ▲ 3   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [Current page content...]                                                  │
│                                                                              │
│                                           ┌─────────────────────────────┐   │
│                                           │  Agent Stream        [— ×] │   │
│                                           │                             │   │
│                                           │  ● Working on:              │   │
│                                           │  payments-api / ADR-0004    │   │
│                                           │                             │   │
│                                           │  ▍ Generating PRD...        │   │
│                                           │                             │   │
│                                           │  ## Phase 1: Core Setup     │   │
│                                           │                             │   │
│                                           │  ### Task 1: Initialize     │   │
│                                           │  Redis connection pool      │   │
│                                           │  with connection timeout    │   │
│                                           │  of 5 seconds...            │   │
│                                           │                             │   │
│                                           │  ─────────────────────────  │   │
│                                           │                             │   │
│                                           │  14:33:12  PRD task 3/15 ✓  │   │
│                                           │  14:33:01  PRD task 2/15 ✓  │   │
│                                           │  14:32:45  Excalidraw upd.  │   │
│                                           │  14:32:30  ADR created      │   │
│                                           │                             │   │
│                                           └─────────────────────────────┘   │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  ● Agent active · generating PRD...                        mdiff v0.1       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Behavior**:
- Triggered by clicking the pulsing dot in the status strip or the notification bell
- Slides in from the right (360px width)
- Stays open while navigating between pages
- Shows AI streaming output (markdown rendered in real-time) at top
- Event log below the stream, scrolling
- Minimize (—) collapses to just the header bar. Close (×) dismisses entirely.
- When agent is idle, shows "No active agent" with recent history

**Components**:
- `AgentStreamOverlay`: The overlay container with slide-in animation
- `AIStreamView`: Vercel AI SDK streaming component, renders markdown as it arrives
- `AgentEventLog`: Compact event feed showing timestamped pipeline events

---

## Shared Components

### Navigation Components

#### `TopBar`
```typescript
interface TopBarProps {
  currentRoute: string;
  projectName?: string;
  notificationCount: number;
  onThemeToggle: () => void;
  onCommandPalette: () => void;
  onNotificationClick: () => void;
}
```

#### `CommandPalette`
```typescript
interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  onSelect: (command: Command) => void;
}

interface Command {
  id: string;
  label: string;
  category: 'navigation' | 'project' | 'feature' | 'agent';
  shortcut?: string;
  icon?: React.ReactNode;
}
```

#### `StatusStrip`
```typescript
interface StatusStripProps {
  agentActive: boolean;
  agentMessage?: string;
  pendingDiffs: number;
  version: string;
  onAgentClick: () => void;
}
```

### Diff Components

#### `DiffCard`
```typescript
interface DiffCardProps {
  diff: Diff;
  expanded?: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onViewFull?: () => void;
}

interface Diff {
  id: string;
  projectId: string;
  type: 'adr' | 'prd' | 'prd-log' | 'excalidraw';
  documentName: string;
  description: string;
  timestamp: Date;
  author: 'agent' | 'user';
  stats: DiffStats;
  hunks?: DiffHunk[];
}

interface DiffStats {
  linesAdded?: number;
  linesRemoved?: number;
  nodesAdded?: number;
  nodesRemoved?: number;
  edgesAdded?: number;
  edgesRemoved?: number;
}
```

#### `DiffViewer`
```typescript
interface DiffViewerProps {
  oldContent: string;
  newContent: string;
  oldLabel: string;
  newLabel: string;
  mode: 'unified' | 'split';
  language: 'markdown' | 'json' | 'excalidraw';
  onApproveHunk?: (hunkIndex: number) => void;
  onRejectHunk?: (hunkIndex: number) => void;
}
```

### Project Components

#### `ProjectCard`
```typescript
interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

interface Project {
  id: string;
  name: string;
  adrCount: number;
  prdCount: number;
  lastDiffAt: Date;
  agentStatus: 'active' | 'idle';
}
```

### Document Components

#### `DocumentReader`
```typescript
interface DocumentReaderProps {
  content: string;
  editable: boolean;
  onSave?: (content: string) => void;
  onCancel?: () => void;
}
```

#### `DocumentList`
```typescript
interface DocumentListProps {
  documents: Document[];
  selectedId?: string;
  onSelect: (doc: Document) => void;
  sortBy: 'date' | 'name' | 'type';
  onSortChange: (sort: 'date' | 'name' | 'type') => void;
}

interface Document {
  id: string;
  name: string;
  type: 'adr' | 'prd' | 'prd-log';
  status: 'proposed' | 'accepted' | 'deprecated' | 'active' | 'completed';
  lastModified: Date;
  diffCount: number;
}
```

### Agent & AI Components

#### `AgentStreamOverlay`
```typescript
interface AgentStreamOverlayProps {
  open: boolean;
  onClose: () => void;
  onMinimize: () => void;
  minimized: boolean;
}
```

#### `AIStreamView`
```typescript
interface AIStreamViewProps {
  chatId: string;
  api: string;
  onFinish?: (message: Message) => void;
  maxHeight?: string;
}
// Uses useChat() from 'ai/react' (Vercel AI SDK)
// Renders streaming markdown with blinking cursor
```

#### `A2UIRenderer`
```typescript
interface A2UIRendererProps {
  payload: A2UIPayload;
  componentRegistry: ComponentRegistry;
  onAction?: (actionId: string, data: unknown) => void;
}

// A2UIPayload is the JSON structure from Google A2UI
// ComponentRegistry maps abstract A2UI component types to React components
// onAction handles user interactions within agent-generated UI
```

### Integration Components

#### `IntegrationCard`
```typescript
interface IntegrationCardProps {
  platform: 'telegram' | 'discord' | 'slack';
  status: 'connected' | 'disconnected' | 'error';
  channelName?: string;
  capabilities: {
    trigger: boolean;
    notify: boolean;
  };
  lastActivity?: Date;
  onConfigure: () => void;
  onTest: () => void;
}
```

#### `DeliveryLog`
```typescript
interface DeliveryLogProps {
  entries: DeliveryEntry[];
  onClear: () => void;
}

interface DeliveryEntry {
  id: string;
  timestamp: Date;
  platform: 'telegram' | 'discord' | 'slack';
  success: boolean;
  message: string;
  retrying?: boolean;
}
```

### Timeline Components

#### `TimelineView`
```typescript
interface TimelineViewProps {
  entries: TimelineEntry[];
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

interface TimelineEntry {
  id: string;
  timestamp: Date;
  projectName: string;
  type: 'adr' | 'prd' | 'prd-log' | 'excalidraw' | 'status-change';
  description: string;
  stats?: DiffStats;
  linkedEntries?: string[];
}
```

#### `TimelineFilters`
```typescript
interface TimelineFiltersProps {
  projects: Project[];
  selectedProject?: string;
  selectedType?: string;
  dateRange: { from: Date; to: Date };
  searchQuery: string;
  onChange: (filters: Partial<TimelineFiltersProps>) => void;
}
```

### Excalidraw Components

#### `ExcalidrawCanvas`
```typescript
interface ExcalidrawCanvasProps {
  sceneData: ExcalidrawScene;
  readOnly?: boolean;
  onUpdate?: (scene: ExcalidrawScene) => void;
  diffOverlay?: {
    addedNodeIds: string[];
    removedNodeIds: string[];
    addedEdgeIds: string[];
    removedEdgeIds: string[];
  };
}
```

---

## Animation & Interaction

### Micro-interactions
- **Agent pulse**: Status strip dot pulses with `--agent-pulse` color using radial gradient animation, 2s cycle, ease-in-out. Subtle — not distracting.
- **Diff card expand**: Content height animates from 0 with `cubic-bezier(0.32, 0.72, 0, 1)` at 200ms. Chevron rotates 180°.
- **Project card hover**: Card lifts 2px with `box-shadow: 0 4px 24px rgba(0,0,0,0.12)` and border transitions to `--border-strong`. 150ms ease.
- **Tab switch**: Active tab underline slides horizontally (transform: translateX) with 200ms spring easing. Content cross-fades 150ms.
- **Diff stats badge**: Numbers count up from 0 on first render, 300ms ease-out.
- **Timeline entry appear**: Entries fade-slide in from left (translateX: -8px → 0, opacity: 0 → 1), 150ms, staggered 30ms per entry.

### Page Transitions
- **Route change**: Content area cross-fades at 120ms. No layout shift — the top bar and status strip never move.
- **Overlay slide**: Agent stream overlay slides from right (translateX: 100% → 0), 250ms, `cubic-bezier(0.32, 0.72, 0, 1)`.
- **Sheet open**: Config sheets slide up from bottom, backdrop fades in, 200ms.

### Loading States
- **Project cards**: Ghost cards with shimmer gradient sweep (left to right, 1.5s cycle)
- **Diff cards**: Skeleton lines mimicking diff content — gray bars at diff-line heights
- **Timeline**: Ghost dots and lines with pulsing opacity
- **AI stream**: Blinking cursor (▍) at 800ms interval, violet color
- **Excalidraw embed**: Shimmer rectangle matching canvas aspect ratio with faint grid lines

### Drag & Drop
- **Feature reordering**: Dragged items lift with scale(1.02) and shadow, drop zones highlight with `--accent-muted` background and 2px dashed `--accent-primary` border

---

## Responsive Behavior

### Breakpoints
```css
--breakpoint-sm: 640px;    /* Mobile phones */
--breakpoint-md: 768px;    /* Tablets */
--breakpoint-lg: 1024px;   /* Small laptops */
--breakpoint-xl: 1280px;   /* Desktops */
```

### Mobile Adaptations (< 768px)
- **Top bar**: Logo only, nav tabs collapse into a hamburger menu (sheet from top). ⌘K becomes a search icon.
- **Dashboard**: Project cards stack to single column. Recent diffs list becomes full-width.
- **Project workspace**: Tabs become a scrollable horizontal row. Diff cards are full-width. Agent stream overlay becomes a full-screen sheet from bottom.
- **Timeline**: Full-width entries, timeline dot-line on left edge. Filters collapse into a single "Filter" button that opens a sheet.
- **Integrations**: Cards stack vertically. Delivery log scrolls horizontally for timestamps.

### Tablet Adaptations (768px–1024px)
- **Dashboard**: Project cards in 2-column grid (narrower cards)
- **Workspace**: Diff viewer defaults to unified mode (no split)
- **Agent overlay**: 300px width instead of 360px

---

## Accessibility

### Requirements
- Full keyboard navigation with visible focus rings (2px solid `--accent-primary`, 2px offset)
- ⌘K command palette accessible from anywhere — all navigation, all actions
- Tab key navigates between sections, Arrow keys navigate within lists
- All interactive elements have ARIA labels
- Screen reader announcements for: new diffs arriving, agent status changes, integration connection status
- Focus trapping in overlays and sheets
- `prefers-reduced-motion`: All animations become instant, no transitions
- `prefers-color-scheme`: Auto-detect on first visit, respect user preference

### Color Contrast
- **Text on dark bg**: `#ededf0` on `#09090b` = 18.3:1 (AAA)
- **Secondary text on dark bg**: `#8b8b9e` on `#09090b` = 6.2:1 (AA+)
- **Accent on dark bg**: `#a855f7` on `#09090b` = 5.8:1 (AA)
- **Diff added text**: `#6ee7b7` on `#09090b` = 11.4:1 (AAA)
- **Diff removed text**: `#fca5a5` on `#09090b` = 9.1:1 (AAA)
- All interactive elements maintain 3:1 minimum contrast ratio
- Focus rings are high contrast in both themes

---

## A2UI Integration

### How A2UI Works in mdiff

Google A2UI enables the agent to push declarative UI to mdiff without executing code. The flow:

```
Agent (LLM)
    │
    │ Generates A2UI JSON payload
    ▼
SSE Event: { type: "a2ui:update", payload: A2UIPayload }
    │
    │ Transported via Server-Sent Events
    ▼
A2UI Renderer (Client)
    │
    │ Resolves component types from registry
    ▼
Native React Components
    │
    │ Rendered in Project Workspace → A2UI tab
    ▼
User sees dynamic, agent-generated interface
```

### A2UI Component Registry
mdiff registers these component mappings:

| A2UI Type       | mdiff Component         | Usage                              |
|-----------------|-------------------------|------------------------------------|
| `text`          | `<p>`, `<h1>`–`<h6>`   | Labels, headings                   |
| `button`        | `<Button>`              | Agent-suggested actions            |
| `progress`      | `<ProgressBar>`         | Task/pipeline progress             |
| `list`          | `<DiffList>`            | Lists of changes or tasks          |
| `card`          | `<Card>`                | Grouped information panels         |
| `form`          | `<Form>`                | Agent-requested user input         |
| `chart`         | `<SimpleChart>`         | Metrics visualization              |
| `code`          | `<CodeBlock>`           | Code snippets or diff previews     |

### Security
- A2UI payloads are data (JSON), not code — no arbitrary script execution
- All component types must exist in the pre-registered catalog
- Unknown component types render as a fallback "unsupported component" card
- User actions within A2UI components (button clicks, form submissions) are routed through `onAction` callback with sanitized data

---

## Real-Time Architecture

### Event Streaming
```
Client ◄──── SSE ────── Server
  │                       │
  │  EventSource('/api/   │
  │    events/stream')    │
  │                       │
  │  ◄── diff:created     │   (new diff appeared)
  │  ◄── diff:updated     │   (diff content changed)
  │  ◄── agent:started    │   (agent began working)
  │  ◄── agent:streaming  │   (AI output chunk)
  │  ◄── agent:completed  │   (agent finished)
  │  ◄── a2ui:update      │   (new A2UI payload)
  │  ◄── excalidraw:diff  │   (diagram changed)
  │  ◄── integration:sent │   (notification delivered)
  │                       │
  └────── REST ──────────▶│   (CRUD, triggers)
```

### Event Types
```typescript
type MDiffEventType =
  | 'diff:created'
  | 'diff:updated'
  | 'agent:started'
  | 'agent:streaming'
  | 'agent:step-completed'
  | 'agent:completed'
  | 'agent:failed'
  | 'a2ui:update'
  | 'a2ui:clear'
  | 'excalidraw:diff'
  | 'document:saved'
  | 'document:status-changed'
  | 'integration:sent'
  | 'integration:failed'
  | 'project:created'
  | 'feature:added';
```

---

## Implementation Priority

### Phase 1 (MVP)
1. Next.js app scaffolding with App Router, Tailwind CSS, dark/light theme with violet accent
2. Shell layout: frosted top bar, centered content area, status strip
3. Dashboard page with project cards (create new, import)
4. Project workspace with Diffs tab — static diff cards with inline diff preview
5. Diff viewer component (unified mode) with markdown syntax highlighting
6. Basic ⌘K command palette for navigation

### Phase 2 (Core)
1. SSE event streaming infrastructure
2. Agent stream overlay with AI SDK streaming (useChat)
3. Project workspace: Docs tab with document reader/editor
4. Project workspace: Diagram tab with Excalidraw embed
5. Diff Timeline page with filters and infinite scroll
6. Inline editing with hunk-level approve/reject
7. Real-time diff streaming — watch diffs appear as agent works

### Phase 3 (Advanced)
1. A2UI integration — renderer, component registry, SSE transport
2. Integrations hub: Telegram, Discord, Slack connection
3. Agent triggering from messaging platforms
4. Notification delivery with retry logic and delivery log
5. Excalidraw diff overlay (highlight added/removed nodes)
6. Drag-and-drop feature reordering
7. Full responsive mobile layout
8. Export timeline as PDF/markdown

---

## File Structure

```
mdiff/
├── app/
│   ├── layout.tsx                        # Root layout: theme provider, top bar, status strip
│   ├── page.tsx                          # Dashboard (/)
│   ├── projects/
│   │   └── [id]/
│   │       └── page.tsx                  # Project Workspace (/projects/:id)
│   ├── timeline/
│   │   └── page.tsx                      # Diff Timeline (/timeline)
│   ├── integrations/
│   │   └── page.tsx                      # Integrations Hub (/integrations)
│   └── api/
│       ├── events/
│       │   └── stream/
│       │       └── route.ts              # SSE event stream
│       ├── projects/
│       │   ├── route.ts                  # List/create projects
│       │   └── [id]/
│       │       ├── route.ts              # Project CRUD
│       │       ├── diffs/
│       │       │   └── route.ts          # Project diffs
│       │       ├── documents/
│       │       │   └── route.ts          # Project documents
│       │       └── features/
│       │           └── route.ts          # Project features
│       ├── agent/
│       │   ├── stream/
│       │   │   └── route.ts              # AI SDK streaming (useChat API)
│       │   └── trigger/
│       │       └── route.ts              # Trigger agent from integration
│       ├── integrations/
│       │   ├── route.ts                  # List/create integrations
│       │   ├── [id]/
│       │   │   └── route.ts              # Configure integration
│       │   └── webhook/
│       │       └── route.ts              # Inbound webhooks (Telegram/Discord/Slack)
│       └── a2ui/
│           └── route.ts                  # A2UI payload endpoint
├── components/
│   ├── layout/
│   │   ├── top-bar.tsx
│   │   ├── status-strip.tsx
│   │   └── command-palette.tsx
│   ├── diff/
│   │   ├── diff-card.tsx
│   │   ├── diff-viewer.tsx
│   │   └── diff-stats.tsx
│   ├── project/
│   │   ├── project-card.tsx
│   │   ├── workspace-tabs.tsx
│   │   └── feature-list.tsx
│   ├── document/
│   │   ├── document-list.tsx
│   │   ├── document-reader.tsx
│   │   └── inline-editor.tsx
│   ├── agent/
│   │   ├── agent-stream-overlay.tsx
│   │   ├── ai-stream-view.tsx
│   │   └── agent-event-log.tsx
│   ├── a2ui/
│   │   ├── a2ui-renderer.tsx
│   │   └── component-registry.ts
│   ├── integrations/
│   │   ├── integration-card.tsx
│   │   ├── delivery-log.tsx
│   │   └── integration-config-sheet.tsx
│   ├── excalidraw/
│   │   └── excalidraw-canvas.tsx
│   ├── timeline/
│   │   ├── timeline-view.tsx
│   │   ├── timeline-entry.tsx
│   │   ├── timeline-filters.tsx
│   │   └── timeline-stats.tsx
│   └── shared/
│       ├── button.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       ├── tooltip.tsx
│       └── theme-toggle.tsx
├── hooks/
│   ├── use-event-stream.ts               # SSE connection hook
│   ├── use-agent.ts                      # Agent state and streaming
│   ├── use-diffs.ts                      # Diff fetching and real-time updates
│   ├── use-projects.ts                   # Project CRUD
│   ├── use-documents.ts                  # Document CRUD
│   ├── use-integrations.ts               # Integration management
│   ├── use-theme.ts                      # Dark/light toggle
│   └── use-command-palette.ts            # Command palette state
├── lib/
│   ├── events/
│   │   ├── sse-manager.ts
│   │   └── types.ts
│   ├── diff/
│   │   ├── compute.ts                    # Diff computation (text + excalidraw)
│   │   └── types.ts
│   ├── a2ui/
│   │   ├── resolver.ts                   # A2UI JSON → React component resolution
│   │   └── types.ts
│   ├── integrations/
│   │   ├── telegram.ts
│   │   ├── discord.ts
│   │   ├── slack.ts
│   │   └── dispatcher.ts
│   └── ai/
│       └── providers.ts                  # Vercel AI SDK provider config
├── stores/
│   ├── agent-store.ts                    # Zustand: agent state
│   ├── diff-store.ts                     # Zustand: diffs
│   ├── project-store.ts                  # Zustand: projects
│   └── ui-store.ts                       # Zustand: theme, overlays, command palette
├── styles/
│   └── globals.css                       # CSS custom properties, themes, base
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Consequences

### Positive
- **Diff-centric design** makes architectural changes tangible and reviewable — not hidden in git logs
- **Spacious, minimal UI** reduces cognitive load — developers focus on what changed, not on navigating chrome
- **A2UI integration** lets agents present rich, dynamic interfaces without security risks of arbitrary code execution
- **Top-nav-only layout** maximizes content area — diffs and diagrams get the full viewport
- **Real-time streaming** gives full transparency into agent activity — no black boxes
- **Messaging platform integration** meets teams where they already are — Telegram, Discord, Slack become agent triggers and notification channels

### Negative
- **No sidebar** means project/feature navigation requires more clicks (dropdown → select) vs. always-visible tree
- **A2UI is a new standard** — limited ecosystem, potential for breaking changes as it matures
- **Spacious layout** trades information density for clarity — power users may want a "dense mode" later
- **Supporting three messaging platforms** increases integration surface area and maintenance burden

### Trade-offs
- **Top nav over sidebar**: Chosen for maximizing content space and enforcing the "less is more" philosophy. The trade-off is deeper navigation (2 clicks to switch projects vs. 1 in a sidebar tree). Mitigated by ⌘K command palette for instant navigation.
- **Zustand over server state**: Client-side Zustand stores for UI state, real-time events, and agent state. Server state (projects, documents) fetched via API routes with SWR/React Query for caching. This separation keeps the UI responsive during streaming.
- **SSE over WebSocket**: Server-Sent Events for the predominantly server→client data flow (diffs, agent output). Simpler to implement, works through proxies, auto-reconnects. WebSocket only needed if collaborative editing is added later.
- **A2UI over custom agent UI**: Using Google's A2UI standard instead of building a custom agent-UI protocol. The standard provides security (data not code), cross-platform compatibility, and a growing ecosystem — at the cost of being limited to pre-registered component types.
