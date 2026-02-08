# ADR-0001: UI Specifications — Agentic Coding Platform

## Status
Proposed (2026-02-08)

## Context
This document defines the UI specifications for the **Agentic Coding Platform** — an architecture-first agentic development platform that drives SPEC-driven development using the ADR → PRD → Implementation pipeline. The platform integrates with Excalidraw for live architecture visualization, streams every pipeline event to connected clients (Discord, Telegram, Slack, native web UI), and uses Vercel AI SDK 6 for all AI-powered components.

The platform's core loop is: **create-adr → update Excalidraw architecture → create-prd-from-adr → implement-prd**. Each step produces real-time events that the UI must visualize as a live stream. Users need to see architecture changes unfold in real-time, browse the full history of ADRs/PRDs/PRD-logs, track changes like a git-style changelog, and manage integrations with external messaging platforms.

The existing codebase is an Excalidraw monorepo (React 19 + Vite + TypeScript). The Agentic Coding Platform UI will be built as a **new Next.js 15 application** alongside the existing Excalidraw workspace, embedding the Excalidraw component for architecture diagram visualization.

---

## Design Direction

### Aesthetic: "Studio/Professional"
A dark, dense, information-rich interface inspired by professional developer tools. Every pixel serves a purpose. The UI feels like a mission control for your codebase architecture — panels show live data streams, documents render in real-time, and the Excalidraw canvas updates as architecture decisions are made. This aesthetic respects the developer's intelligence and avoids unnecessary decoration.

### Design Principles
1. **Architecture-First Visibility**: The current state of architecture (via Excalidraw) is always visible or one click away. Every ADR/PRD change is reflected in the diagram instantly.
2. **Stream Everything**: Every pipeline event is a first-class citizen. Users see what the agent is doing in real-time — no black boxes, no spinners without context.
3. **Document as Truth**: ADRs, PRDs, and PRD-logs are the source of truth. The UI treats them as living documents with full version history, inline editing, and diff views.
4. **Zero-Friction Integration**: Connecting Discord, Telegram, or Slack takes seconds. Events flow out automatically once configured.

### Color Palette

#### Dark Theme (Default)
```css
:root[data-theme="dark"] {
  /* Base */
  --bg-primary: #0a0a0f;          /* App background — near-black with blue undertone */
  --bg-secondary: #12121a;        /* Panel backgrounds, cards */
  --bg-tertiary: #1a1a26;         /* Elevated surfaces, modals */
  --bg-hover: #22223a;            /* Hover states on interactive elements */
  --bg-active: #2a2a45;           /* Active/selected states */
  --bg-surface: #16161f;          /* Inset surfaces, code blocks */

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);   /* Dividers, panel edges */
  --border-default: rgba(255, 255, 255, 0.10);  /* Input borders, card borders */
  --border-strong: rgba(255, 255, 255, 0.16);   /* Focus rings, active borders */

  /* Text */
  --text-primary: #e4e4ed;        /* Primary content */
  --text-secondary: #9a9ab0;      /* Labels, secondary info */
  --text-muted: #5e5e76;          /* Placeholders, disabled text */
  --text-inverse: #0a0a0f;        /* Text on accent backgrounds */

  /* Accent — Cyan/Teal */
  --accent-primary: #22d3ee;      /* Primary actions, links, active indicators */
  --accent-secondary: #06b6d4;    /* Hover states on accent elements */
  --accent-muted: rgba(34, 211, 238, 0.15);  /* Accent backgrounds, badges */
  --accent-subtle: rgba(34, 211, 238, 0.08); /* Accent tints */

  /* Semantic */
  --success: #34d399;             /* Pipeline step completed, connected integrations */
  --success-muted: rgba(52, 211, 153, 0.15);
  --warning: #fbbf24;             /* Pipeline warnings, slow steps */
  --warning-muted: rgba(251, 191, 36, 0.15);
  --error: #f87171;               /* Pipeline failures, disconnected integrations */
  --error-muted: rgba(248, 113, 113, 0.15);
  --info: #60a5fa;                /* Informational badges, tips */
  --info-muted: rgba(96, 165, 250, 0.15);

  /* Pipeline-specific */
  --pipeline-adr: #a78bfa;        /* ADR events — violet */
  --pipeline-excalidraw: #fb923c; /* Excalidraw events — orange */
  --pipeline-prd: #22d3ee;        /* PRD events — cyan (accent) */
  --pipeline-implement: #34d399;  /* Implementation events — green */

  /* Git-like change tracking */
  --diff-added: rgba(52, 211, 153, 0.20);     /* Added lines */
  --diff-removed: rgba(248, 113, 113, 0.20);  /* Removed lines */
  --diff-modified: rgba(251, 191, 36, 0.20);  /* Modified lines */
}
```

#### Light Theme
```css
:root[data-theme="light"] {
  /* Base */
  --bg-primary: #fafafa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f5f5f5;
  --bg-hover: #eeeeee;
  --bg-active: #e5e5e5;
  --bg-surface: #f0f0f0;

  /* Borders */
  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-default: rgba(0, 0, 0, 0.12);
  --border-strong: rgba(0, 0, 0, 0.20);

  /* Text */
  --text-primary: #171717;
  --text-secondary: #525252;
  --text-muted: #a3a3a3;
  --text-inverse: #fafafa;

  /* Accent — Cyan/Teal (darkened for contrast) */
  --accent-primary: #0891b2;
  --accent-secondary: #0e7490;
  --accent-muted: rgba(8, 145, 178, 0.12);
  --accent-subtle: rgba(8, 145, 178, 0.06);

  /* Semantic */
  --success: #16a34a;
  --success-muted: rgba(22, 163, 74, 0.12);
  --warning: #d97706;
  --warning-muted: rgba(217, 119, 6, 0.12);
  --error: #dc2626;
  --error-muted: rgba(220, 38, 38, 0.12);
  --info: #2563eb;
  --info-muted: rgba(37, 99, 235, 0.12);

  /* Pipeline-specific */
  --pipeline-adr: #7c3aed;
  --pipeline-excalidraw: #ea580c;
  --pipeline-prd: #0891b2;
  --pipeline-implement: #16a34a;

  /* Git-like change tracking */
  --diff-added: rgba(22, 163, 74, 0.15);
  --diff-removed: rgba(220, 38, 38, 0.15);
  --diff-modified: rgba(217, 119, 6, 0.15);
}
```

### Typography
```css
/* Primary font — Inter for clean, professional readability */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace font — for code, ADR/PRD content, pipeline logs */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

/* Scale */
--text-xs: 0.6875rem;  /* 11px — timestamps, badges, meta labels */
--text-sm: 0.8125rem;  /* 13px — secondary content, sidebar items, table cells */
--text-base: 0.875rem; /* 14px — body text (dense pro layout) */
--text-lg: 1rem;       /* 16px — section headers, page subtitles */
--text-xl: 1.125rem;   /* 18px — page titles */
--text-2xl: 1.375rem;  /* 22px — main headings, dashboard metrics */
--text-3xl: 1.75rem;   /* 28px — hero numbers, large counters */

/* Line heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.65;

/* Font weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## Layout Structure

### Shell Layout
```
┌──────────────────────────────────────────────────────────────────────────┐
│  ◉ Agentic Coding Platform    [Pipeline ▾]  [Search ⌘K]         🌓  👤  ⚙️      │
│  Top Bar (48px, fixed)                                                  │
├────────────┬─────────────────────────────────────────────────────────────┤
│            │                                                             │
│  Sidebar   │  Main Content Area                                          │
│  (240px)   │  (flex-1, scrollable)                                       │
│            │                                                             │
│  ┌────────┐│                                                             │
│  │📊 Dash ││                                                             │
│  │🔄 Pipe ││                                                             │
│  │📄 Docs ││                                                             │
│  │🔗 Integ││                                                             │
│  │📜 Hist ││                                                             │
│  ├────────┤│                                                             │
│  │ Tree   ││                                                             │
│  │ View   ││                                                             │
│  │        ││                                                             │
│  │ ADRs/  ││                                                             │
│  │ PRDs/  ││                                                             │
│  │ Logs   ││                                                             │
│  │        ││                                                             │
│  ├────────┤│                                                             │
│  │Recent  ││                                                             │
│  │Events  ││                                                             │
│  └────────┘│                                                             │
│            │                                                             │
├────────────┴─────────────────────────────────────────────────────────────┤
│  Status Bar: Pipeline: ● Running (Step 3/4)  |  Events: 42  |  v0.1.0  │
│  (28px, fixed)                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

**Shell Regions:**
- **Top Bar** (48px fixed): Logo, active pipeline selector, global search (⌘K command palette), theme toggle, user avatar, settings. Always visible.
- **Sidebar** (240px, collapsible to 56px icons): Navigation sections at top, document tree in the middle (ADRs/PRDs/PRD-logs as a file tree), recent events mini-feed at bottom.
- **Main Content Area** (flex-1): Renders the active page. Supports split-pane layouts for document + Excalidraw side-by-side.
- **Status Bar** (28px fixed): Current pipeline status, event counter, connection status for integrations, app version.

---

## Page Specifications

### 1. Dashboard (`/`)

**Purpose**: High-level overview of the entire Agentic Coding Platform — active pipelines, recent architecture changes, document counts, integration health, and key metrics.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────┐
│  Dashboard                                            [▶ Run Pipeline] │
├──────────────┬──────────────┬──────────────┬──────────────────────┤
│  ┌──────────┐│  ┌──────────┐│  ┌──────────┐│  ┌────────────────┐ │
│  │    12    ││  │     8    ││  │    34    ││  │   3 Connected  │ │
│  │   ADRs   ││  │   PRDs   ││  │PRD Logs  ││  │ Integrations   │ │
│  │  +2 new  ││  │  +1 new  ││  │ +5 today ││  │ ● ● ○         │ │
│  └──────────┘│  └──────────┘│  └──────────┘│  └────────────────┘ │
├──────────────┴──────────────┴──────────────┴──────────────────────┤
│                                                                    │
│  Active Pipeline                                                   │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  [✓ ADR-0012] ──▶ [✓ Excalidraw] ──▶ [● PRD] ──▶ [○ Impl]│    │
│  │   Created        Updated diagram      Generating...  Waiting│    │
│  │   2m ago         1m ago               Streaming...          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                    │
├────────────────────────────────┬───────────────────────────────────┤
│  Recent Architecture Changes   │  Live Event Feed                  │
│  ┌────────────────────────────┐│  ┌───────────────────────────────┐│
│  │ ● ADR-0012 modified       ││  │ 14:32:01  PRD task 7/15 done ││
│  │   +23 -5 lines            ││  │ 14:31:58  AI generating...   ││
│  │   "Add caching layer"     ││  │ 14:31:45  Excalidraw updated ││
│  │   3 min ago               ││  │ 14:31:30  ADR-0012 created   ││
│  │                            ││  │ 14:30:12  Pipeline started   ││
│  │ ● PRD-0011 created        ││  │ 14:28:55  Slack notified     ││
│  │   "API rate limiting"     ││  │ ...                           ││
│  │   15 min ago              ││  │                               ││
│  │                            ││  │                               ││
│  │ ● ADR-0011 approved       ││  │                               ││
│  │   Status: Accepted        ││  │                               ││
│  │   1 hour ago              ││  │                               ││
│  └────────────────────────────┘│  └───────────────────────────────┘│
└────────────────────────────────┴───────────────────────────────────┘
```

**Components**:
- `MetricCard`: Displays a single KPI (count, delta, trend indicator)
- `PipelineProgress`: Horizontal step indicator showing ADR → Excalidraw → PRD → Implement with status per step
- `ChangeLog`: Git-style list of recent ADR/PRD/log changes with diff summaries
- `EventFeed`: Real-time scrolling event stream (SSE-powered)

**States**:
- **Empty**: No ADRs yet — show onboarding prompt with "Run your first pipeline" CTA
- **Active pipeline**: Pipeline progress bar animates, event feed streams live
- **Idle**: All metrics static, event feed shows historical entries
- **Error**: Pipeline step failed — red indicator with error detail expandable

---

### 2. Pipeline View (`/pipeline`)

**Purpose**: Real-time visualization of the ADR → Excalidraw → PRD → Implement pipeline. This is the "mission control" — users watch the agent work in real-time with AI streaming output.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────────┐
│  Pipeline — Run #47                         [⏸ Pause] [⏹ Stop] [↻ Retry]│
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────────┐   │
│  │  ✓ ADR   │───▶│ ✓ Excalidraw │───▶│  ● PRD   │───▶│  ○ Implement │   │
│  │ Created  │    │   Updated    │    │Streaming │    │   Pending    │   │
│  │  0:42    │    │    0:18      │    │  1:23... │    │              │   │
│  └──────────┘    └──────────────┘    └──────────┘    └──────────────┘   │
│                                                                          │
├──────────────────────────────────┬───────────────────────────────────────┤
│  AI Stream Output                │  Excalidraw Preview                   │
│  ┌──────────────────────────────┐│  ┌───────────────────────────────────┐│
│  │ ▍ Generating PRD from       ││  │                                   ││
│  │   ADR-0012...               ││  │    ┌─────┐     ┌─────┐           ││
│  │                              ││  │    │ API │────▶│Cache│           ││
│  │ ## Phase 1: Core Setup       ││  │    └──┬──┘     └─────┘           ││
│  │                              ││  │       │                          ││
│  │ ### Task 1: Initialize       ││  │    ┌──▼──┐                       ││
│  │ project structure            ││  │    │ DB  │                        ││
│  │                              ││  │    └─────┘                        ││
│  │ - Create Next.js app with    ││  │                                   ││
│  │   TypeScript configuration   ││  │  Architecture: ADR-0012           ││
│  │ - Set up Tailwind CSS 4      ││  │  "Add caching layer"              ││
│  │ - Configure path aliases     ││  │  Last updated: 30s ago            ││
│  │                              ││  │                                   ││
│  │ ### Task 2: Database schema  ││  │  [Open in Excalidraw ↗]           ││
│  │ █                            ││  │                                   ││
│  │                              ││  │                                   ││
│  └──────────────────────────────┘│  └───────────────────────────────────┘│
├──────────────────────────────────┴───────────────────────────────────────┤
│  Pipeline Events                                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │ 14:33:12 [PRD]    ● Task 3/15: "Set up API routes" — generating... ││
│  │ 14:33:01 [PRD]    ✓ Task 2/15: "Database schema" — completed       ││
│  │ 14:32:45 [PRD]    ✓ Task 1/15: "Initialize project" — completed    ││
│  │ 14:32:30 [EXCL]   ✓ Diagram updated — 3 nodes added, 2 edges      ││
│  │ 14:32:15 [ADR]    ✓ ADR-0012 created — "Add caching layer"        ││
│  │ 14:32:10 [SYS]    ▶ Pipeline #47 started                           ││
│  └──────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

**Components**:
- `PipelineSteps`: Horizontal step progression with animated connectors, timing, and status badges
- `AIStreamPanel`: Vercel AI SDK 6 streaming text component — renders markdown as it arrives, shows cursor/typing indicator
- `ExcalidrawPreview`: Embedded read-only Excalidraw canvas (from existing monorepo) with live updates
- `PipelineEventLog`: Timestamped, color-coded event log (each pipeline stage has its own color)

**States**:
- **No pipeline**: Empty state with "Start a new pipeline" form (describe the ADR)
- **Running**: Steps animate, AI stream panel shows live output, events append in real-time
- **Paused**: Steps freeze, AI stream shows "Paused" indicator
- **Completed**: All steps checked green, summary statistics shown
- **Failed**: Failed step turns red with expandable error details, retry button per step

**AI SDK 6 Integration**:
- Uses `useChat` from `ai/react` for the AI stream panel
- Uses `streamText` on the server for pipeline step execution
- AI elements render streaming markdown with `<AIStream>` component
- Tool calls visualized as collapsible cards within the stream

---

### 3. Document Explorer (`/documents`)

**Purpose**: Browse, search, read, and inline-edit all ADRs, PRDs, and PRD-logs. Git-style change tracking shows the full history of every architecture decision.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────────┐
│  Documents    [ADR ▾] [PRD ▾] [Logs ▾]   [Search... ⌘F]    [+ New ADR] │
├─────────────────────┬────────────────────────────────────────────────────┤
│  File Tree          │  Document Viewer                                   │
│  ┌─────────────────┐│  ┌──────────────────────────────────────────────┐  │
│  │ ▼ architecture/ ││  │  ADR-0012: Add Caching Layer                │  │
│  │   ● 0012-cachi…││  │  Status: Proposed (2026-02-08)               │  │
│  │   ○ 0011-api-r…││  │  ──────────────────────────────────          │  │
│  │   ○ 0010-auth-…││  │                                              │  │
│  │   ○ 0009-datab…││  │  ## Context                                  │  │
│  │   ○ 0008-event…││  │  The application currently makes direct      │  │
│  │                  ││  │  database queries for every API request.    │  │
│  │ ▼ architecture- ││  │  Under load, this causes...                 │  │
│  │   prd/          ││  │                                              │  │
│  │   ○ 0012-cachi…││  │  ## Decision                                 │  │
│  │   ○ 0011-api-r…││  │  We will implement a Redis-based caching    │  │
│  │                  ││  │  layer with the following strategy:         │  │
│  │ ▼ architecture- ││  │  ...                                        │  │
│  │   prd-logs/     ││  │                                              │  │
│  │   ○ 0012-run-1 ││  │  [Edit ✎]  [History 🕐]  [Diff 📊]         │  │
│  │   ○ 0012-run-2 ││  │                                              │  │
│  └─────────────────┘│  └──────────────────────────────────────────────┘  │
│                      │                                                    │
│  Change Summary      │  ┌──────────────────────────────────────────────┐  │
│  ┌─────────────────┐│  │  Change History (git-style)                  │  │
│  │ Today: 3 changes││  │  ┌────────────────────────────────────────┐  │  │
│  │ This week: 12   ││  │  │ ● 14:32  "Add caching layer"          │  │  │
│  │ Total: 47       ││  │  │          +45 -3 lines  (current)      │  │  │
│  └─────────────────┘│  │  │ ● 14:28  "Initial draft"              │  │  │
│                      │  │  │          +120 lines  (created)        │  │  │
│                      │  │  └────────────────────────────────────────┘  │  │
│                      │  └──────────────────────────────────────────────┘  │
└─────────────────────┴────────────────────────────────────────────────────┘
```

**Components**:
- `DocumentTree`: Collapsible file tree showing ADRs, PRDs, and PRD-logs with status indicators (● active, ○ historical)
- `MarkdownViewer`: Rich markdown renderer with syntax highlighting, mermaid diagram support, and inline editing toggle
- `InlineEditor`: Switches the markdown viewer to an editor (textarea with markdown preview) — saves trigger a new change entry
- `ChangeHistory`: Git-log-style timeline showing every modification to a document with line-count deltas
- `DiffViewer`: Side-by-side or unified diff view comparing two versions of a document
- `DocumentSearch`: Full-text search across all ADRs, PRDs, and logs with result highlighting

**States**:
- **Empty tree**: No documents — show "Start your first ADR pipeline" prompt
- **Viewing**: Document rendered in markdown, change history visible below
- **Editing**: Inline editor active with live markdown preview, save/cancel buttons
- **Diff mode**: Two-pane diff viewer showing changes between versions
- **Search active**: File tree filtered by search query, matching lines highlighted in viewer

---

### 4. Integrations Hub (`/integrations`)

**Purpose**: Configure, monitor, and test connections to Discord, Telegram, and Slack. Manage webhook URLs, select which events to forward, and view delivery logs.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────────┐
│  Integrations                                          [+ Add Integration]│
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │  Discord          │  │  Telegram         │  │  Slack            │       │
│  │  ● Connected      │  │  ● Connected      │  │  ○ Not Connected  │       │
│  │                    │  │                    │  │                    │       │
│  │  #arch-updates    │  │  @spec_bot         │  │  Click to connect  │       │
│  │  Last: 2m ago     │  │  Last: 5m ago      │  │                    │       │
│  │                    │  │                    │  │                    │       │
│  │  [Configure]      │  │  [Configure]       │  │  [Connect]         │       │
│  │  [Test ▶]         │  │  [Test ▶]          │  │                    │       │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│  Event Subscriptions                                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │  Event Type              │ Discord │ Telegram │ Slack │              ││
│  │  ─────────────────────── │─────────│──────────│───────│              ││
│  │  Pipeline started        │  [✓]    │   [✓]    │  [ ]  │              ││
│  │  ADR created             │  [✓]    │   [✓]    │  [ ]  │              ││
│  │  Excalidraw updated      │  [✓]    │   [ ]    │  [ ]  │              ││
│  │  PRD generated           │  [✓]    │   [✓]    │  [ ]  │              ││
│  │  Task completed          │  [ ]    │   [ ]    │  [ ]  │              ││
│  │  Pipeline completed      │  [✓]    │   [✓]    │  [ ]  │              ││
│  │  Pipeline failed         │  [✓]    │   [✓]    │  [ ]  │              ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│  Delivery Log                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │  14:33:12  Discord  ✓ 200  "PRD generated for ADR-0012"            ││
│  │  14:32:30  Telegram ✓ 200  "Excalidraw updated: 3 nodes added"     ││
│  │  14:32:15  Discord  ✓ 200  "ADR-0012 created: Add caching layer"   ││
│  │  14:32:15  Telegram ✓ 200  "ADR-0012 created: Add caching layer"   ││
│  │  14:30:00  Discord  ✗ 500  "Pipeline started" — retry in 30s       ││
│  └──────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

**Components**:
- `IntegrationCard`: Card for each platform (Discord/Telegram/Slack) showing connection status, channel info, last delivery time
- `EventSubscriptionMatrix`: Checkbox matrix mapping event types to integrations
- `DeliveryLog`: Timestamped log of webhook deliveries with HTTP status, payload preview, and retry indicators
- `IntegrationConfigModal`: Modal for entering webhook URLs, bot tokens, channel IDs, and testing the connection

**States**:
- **No integrations**: All cards show "Connect" CTAs, subscription matrix disabled
- **Partial**: Some connected, others not — connected ones show status, disconnected show setup prompts
- **All connected**: Full matrix active, delivery log populated
- **Delivery failure**: Failed deliveries highlighted in red with retry button, auto-retry countdown

---

### 5. Architecture History (`/history`)

**Purpose**: Git-style changelog of all architecture decisions. A timeline view showing every ADR, PRD, and PRD-log change across the project's lifetime. This is the "version control" for architecture.

**Layout**:
```
┌──────────────────────────────────────────────────────────────────────────┐
│  Architecture History            [Filter ▾]  [Date Range ▾]  [Export ↓] │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─ Today ──────────────────────────────────────────────────────────────┐│
│  │                                                                      ││
│  │  ● 14:32  ADR-0012 Created                              [View Diff] ││
│  │  │        "Add caching layer"                                        ││
│  │  │        +120 lines | Pipeline #47                                  ││
│  │  │        → PRD-0012 generated (15 tasks)                            ││
│  │  │        → Excalidraw: +3 nodes, +2 edges                           ││
│  │  │                                                                    ││
│  │  ● 11:15  ADR-0011 Status Changed                       [View Diff] ││
│  │  │        Proposed → Accepted                                        ││
│  │  │        Approved by: @user                                         ││
│  │  │                                                                    ││
│  │  ● 09:30  PRD-0011 Updated                              [View Diff] ││
│  │           Task 12/15 marked complete                                  ││
│  │           Implementation progress: 80%                                ││
│  │                                                                      ││
│  ├─ Yesterday ──────────────────────────────────────────────────────────┤│
│  │                                                                      ││
│  │  ● 17:45  ADR-0011 Created                              [View Diff] ││
│  │  │        "API rate limiting"                                        ││
│  │  │        +95 lines | Pipeline #46                                   ││
│  │  │        → PRD-0011 generated (12 tasks)                            ││
│  │  │                                                                    ││
│  │  ● 14:00  PRD-0010 Completed                            [View Log]  ││
│  │           All 18 tasks implemented                                    ││
│  │           Duration: 4h 23m                                            ││
│  │                                                                      ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │  Stats: 47 total changes | 12 ADRs | 8 PRDs | 34 logs | 5 pipelines│ │
│  └──────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

**Components**:
- `HistoryTimeline`: Vertical timeline grouped by date, showing all architecture events
- `ChangeEntry`: Individual change entry with type badge, description, diff summary, and links to related documents
- `HistoryFilter`: Filter by document type (ADR/PRD/Log), date range, status, and pipeline run
- `HistoryStats`: Summary bar showing total changes, document counts, and activity metrics

**States**:
- **Empty**: No history — prompt to start first pipeline
- **Populated**: Timeline with entries grouped by date, infinite scroll for older entries
- **Filtered**: Timeline filtered by selected criteria, filter chips shown above
- **Diff expanded**: Inline diff viewer opens below the change entry

---

## Shared Components

### Navigation Components

#### `Sidebar`
```typescript
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeRoute: string;
  recentEvents: PipelineEvent[];
}
```

#### `CommandPalette`
```typescript
interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  onSelect: (command: Command) => void;
  recentCommands: Command[];
}

interface Command {
  id: string;
  label: string;
  category: 'navigation' | 'pipeline' | 'document' | 'integration';
  shortcut?: string;
  action: () => void;
}
```

#### `StatusBar`
```typescript
interface StatusBarProps {
  pipelineStatus: 'idle' | 'running' | 'paused' | 'failed';
  currentStep?: PipelineStep;
  eventCount: number;
  integrationStatuses: IntegrationStatus[];
  version: string;
}
```

### Data Display Components

#### `EventFeed`
```typescript
interface EventFeedProps {
  events: PipelineEvent[];
  streaming: boolean;
  maxHeight?: string;
  onEventClick?: (event: PipelineEvent) => void;
  colorMap: Record<PipelineStage, string>;
}

interface PipelineEvent {
  id: string;
  timestamp: Date;
  stage: 'adr' | 'excalidraw' | 'prd' | 'implement' | 'system';
  type: 'created' | 'updated' | 'completed' | 'failed' | 'info';
  message: string;
  metadata?: Record<string, unknown>;
}
```

#### `MetricCard`
```typescript
interface MetricCardProps {
  label: string;
  value: number | string;
  delta?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}
```

#### `PipelineProgress`
```typescript
interface PipelineProgressProps {
  steps: PipelineStep[];
  currentStep: number;
  onStepClick?: (step: PipelineStep) => void;
}

interface PipelineStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  output?: string;
}
```

#### `DiffViewer`
```typescript
interface DiffViewerProps {
  oldContent: string;
  newContent: string;
  oldLabel: string;
  newLabel: string;
  mode: 'unified' | 'side-by-side';
  language?: string;
}
```

#### `ChangeHistory`
```typescript
interface ChangeHistoryProps {
  documentId: string;
  changes: DocumentChange[];
  onVersionSelect: (change: DocumentChange) => void;
  selectedVersion?: string;
}

interface DocumentChange {
  id: string;
  timestamp: Date;
  description: string;
  linesAdded: number;
  linesRemoved: number;
  author: string;
  pipelineRunId?: string;
}
```

### Document Components

#### `MarkdownViewer`
```typescript
interface MarkdownViewerProps {
  content: string;
  editable: boolean;
  onSave?: (content: string) => void;
  onCancel?: () => void;
  highlightRanges?: TextRange[];
}
```

#### `DocumentTree`
```typescript
interface DocumentTreeProps {
  documents: DocumentNode[];
  selectedId?: string;
  onSelect: (document: DocumentNode) => void;
  onDragEnd?: (result: DragResult) => void;
}

interface DocumentNode {
  id: string;
  name: string;
  type: 'adr' | 'prd' | 'prd-log';
  status: 'proposed' | 'accepted' | 'deprecated' | 'active' | 'completed';
  children?: DocumentNode[];
  lastModified: Date;
}
```

### AI Components (Vercel AI SDK 6)

#### `AIStreamPanel`
```typescript
interface AIStreamPanelProps {
  chatId: string;
  initialMessages?: Message[];
  api: string;
  onFinish?: (message: Message) => void;
  showToolCalls: boolean;
  maxHeight?: string;
}
// Internally uses useChat() from 'ai/react' (Vercel AI SDK 6)
// Renders streaming markdown via <AIStream> component
// Tool calls rendered as collapsible cards with status indicators
```

#### `AIChat`
```typescript
interface AIChatProps {
  endpoint: string;
  systemPrompt?: string;
  placeholder?: string;
  onMessage?: (message: Message) => void;
  tools?: ToolDefinition[];
}
// Full chat interface for interacting with the coding agent
// Uses useChat() with streaming enabled
// Supports tool call visualization and approval
```

### Integration Components

#### `IntegrationCard`
```typescript
interface IntegrationCardProps {
  platform: 'discord' | 'telegram' | 'slack';
  status: 'connected' | 'disconnected' | 'error';
  channelName?: string;
  lastDelivery?: Date;
  onConfigure: () => void;
  onTest: () => void;
  onDisconnect: () => void;
}
```

#### `EventSubscriptionMatrix`
```typescript
interface EventSubscriptionMatrixProps {
  eventTypes: EventType[];
  integrations: Integration[];
  subscriptions: Record<string, Record<string, boolean>>;
  onToggle: (eventType: string, integrationId: string) => void;
}
```

### Excalidraw Components

#### `ExcalidrawPreview`
```typescript
interface ExcalidrawPreviewProps {
  sceneData: ExcalidrawScene;
  readOnly: boolean;
  onUpdate?: (scene: ExcalidrawScene) => void;
  autoFit: boolean;
  showControls: boolean;
}
// Embeds the Excalidraw component from the existing monorepo
// In Pipeline View: read-only with live updates via SSE
// In Document Explorer: optionally editable
```

---

## Animation & Interaction

### Micro-interactions
- **Pipeline step transition**: Steps glow with accent color pulse (0.3s ease-out) when transitioning from pending to running, then solid check animation (0.2s) on completion
- **Event feed entry**: New events slide in from top with opacity fade (0.15s ease-out), push existing events down
- **Sidebar collapse**: Width animates from 240px to 56px (0.2s cubic-bezier(0.4, 0, 0.2, 1)), labels fade out at 0.1s, icons remain
- **Theme toggle**: Cross-fade between dark/light themes (0.3s), background color transitions smoothly
- **Metric card delta**: Numbers count up/down with easing (0.4s), delta badge slides in from left (0.2s)
- **Document tree expand**: Chevron rotates 90° (0.15s), children slide down with stagger (0.05s per item)

### Page Transitions
- **Route change**: Content area cross-fades (0.15s ease), no layout shift
- **Modal open**: Backdrop fades in (0.15s), modal scales from 0.95 to 1.0 with opacity (0.2s cubic-bezier(0.4, 0, 0.2, 1))
- **Panel split**: Divider appears, panels resize with spring animation (0.3s)

### Loading States
- **Pipeline view**: Skeleton loader matching the step layout, pulsing with accent-subtle color
- **Document viewer**: Skeleton lines mimicking markdown headings and paragraphs
- **Event feed**: Ghost event entries with pulsing background
- **AI stream**: Blinking cursor (▍) at the end of the last streamed line, 0.8s blink interval
- **Excalidraw embed**: Shimmer placeholder matching the canvas aspect ratio

### Drag and Drop
- **Document tree reorder**: Dragged item lifts with shadow (box-shadow: 0 8px 24px rgba(0,0,0,0.3)), drop target highlights with accent-muted background
- **Integration cards**: Cards can be reordered on the integrations page with smooth position transitions

---

## Responsive Behavior

### Breakpoints
```css
--breakpoint-sm: 640px;    /* Mobile phones */
--breakpoint-md: 768px;    /* Tablets portrait */
--breakpoint-lg: 1024px;   /* Tablets landscape, small laptops */
--breakpoint-xl: 1280px;   /* Desktops */
--breakpoint-2xl: 1536px;  /* Large desktops */
```

### Mobile Adaptations (< 768px)
- **Sidebar**: Converts to a bottom sheet / drawer overlay, triggered by hamburger menu icon in top bar
- **Top bar**: Logo shrinks, search moves behind icon, user actions collapse into overflow menu
- **Dashboard**: Metric cards stack vertically (1 column), pipeline progress becomes vertical stepper
- **Pipeline view**: Split pane stacks vertically — AI stream on top, Excalidraw below. Pipeline steps become vertical
- **Document explorer**: File tree becomes a full-screen drawer, document viewer takes full width when a document is selected. Back button to return to tree
- **Integrations**: Cards stack vertically, subscription matrix scrolls horizontally
- **History**: Timeline remains vertical, entries take full width
- **Status bar**: Collapses to show only pipeline status icon and event count

### Tablet Adaptations (768px–1024px)
- **Sidebar**: Collapses to icon-only mode (56px) by default, expandable on tap
- **Split panes**: Side-by-side at reduced widths, user can toggle to stacked layout
- **Dashboard**: Metric cards in 2-column grid

### Large Desktop Adaptations (> 1536px)
- **Pipeline view**: Three-column layout — steps left, AI stream center, Excalidraw right
- **Document explorer**: File tree, document viewer, and change history side-by-side in three columns
- **Dashboard**: All sections visible without scrolling

---

## Accessibility

### Requirements
- Full keyboard navigation with visible focus indicators (2px solid var(--accent-primary) outline with 2px offset)
- ⌘K command palette accessible from anywhere, all actions available through keyboard
- All interactive elements have ARIA labels and roles
- Screen reader announcements for: pipeline step changes, new events in feed, document save confirmations
- Skip navigation link at top of page to jump to main content
- Focus trapping in modals and drawers
- `prefers-reduced-motion`: Disable all animations, transitions reduce to instant state changes
- `prefers-color-scheme`: Auto-detect and apply matching theme on first visit
- Keyboard shortcut overlay (press `?` to show all available shortcuts)

### Color Contrast
- **Text on backgrounds**: Minimum 4.5:1 contrast ratio (WCAG AA) for all text sizes
- **Interactive elements**: Minimum 3:1 contrast ratio for buttons, links, and form controls against their backgrounds
- **Pipeline status colors**: Each status color (success, warning, error) passes 4.5:1 against both dark and light backgrounds
- **Accent on bg-primary**: Cyan #22d3ee on #0a0a0f = 11.2:1 (passes AAA)
- **Focus indicators**: High contrast focus rings visible in both themes

---

## Real-Time Architecture

### Event Streaming (SSE)
```
Client ◄──── SSE ────── Server
  │                       │
  │  EventSource('/api/   │
  │    events/stream')    │
  │                       │
  │  ◄── pipeline:start   │
  │  ◄── adr:created      │
  │  ◄── excalidraw:update│
  │  ◄── prd:streaming    │
  │  ◄── prd:task:done    │
  │  ◄── impl:progress    │
  │  ◄── pipeline:done    │
  │                       │
  ├──── Webhook ──────────┤──── Discord API
  │                       ├──── Telegram API
  │                       └──── Slack API
```

### Event Types
```typescript
type PipelineEventType =
  | 'pipeline:start'
  | 'pipeline:pause'
  | 'pipeline:resume'
  | 'pipeline:complete'
  | 'pipeline:fail'
  | 'adr:created'
  | 'adr:updated'
  | 'adr:status-changed'
  | 'excalidraw:updating'
  | 'excalidraw:updated'
  | 'prd:generating'
  | 'prd:streaming'        // AI SDK streaming chunk
  | 'prd:task:completed'
  | 'prd:completed'
  | 'implement:task:start'
  | 'implement:task:complete'
  | 'implement:complete'
  | 'document:saved'
  | 'integration:delivered'
  | 'integration:failed';
```

### Vercel AI SDK 6 Integration

The platform uses Vercel AI SDK 6 for all AI-powered features:

```typescript
// Server: API route for pipeline AI streaming
// app/api/pipeline/stream/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { adrContent, step } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-5-20250929'),
    system: `You are a SPEC-driven development agent...`,
    prompt: adrContent,
  });

  return result.toDataStreamResponse();
}

// Client: AI Stream Panel component
// Uses useChat from 'ai/react'
import { useChat } from 'ai/react';

function AIStreamPanel({ chatId, api }: AIStreamPanelProps) {
  const { messages, isLoading } = useChat({
    id: chatId,
    api,
  });
  // Render streaming messages with markdown
}
```

**AI Elements used:**
- `useChat` — Real-time chat streaming for pipeline AI output and agent interaction
- `useCompletion` — Single-turn completions for document summarization
- `streamText` — Server-side streaming for pipeline step execution
- `<AIStream>` — Component for rendering streamed AI responses with markdown

---

## Implementation Priority

### Phase 1 (MVP)
1. Next.js 15 app scaffolding with App Router, Tailwind CSS 4, dark/light theme system
2. Shell layout: top bar, collapsible sidebar, status bar, main content area
3. Dashboard page with static metric cards and placeholder pipeline progress
4. Document Explorer with file tree, basic markdown viewer (read-only)
5. SSE event streaming infrastructure (`/api/events/stream`)
6. Basic event feed component rendering live pipeline events
7. Vercel AI SDK 6 integration — `useChat` for AI stream panel

### Phase 2 (Core)
1. Pipeline View with full step visualization and AI streaming panel
2. Excalidraw embed (read-only) in pipeline view with live updates
3. Inline document editing with save/version tracking
4. Git-style change history for ADR/PRD/logs (diff viewer)
5. Architecture History page with timeline and filters
6. ⌘K command palette with navigation and pipeline commands
7. Integration cards for Discord, Telegram, Slack (connection UI)

### Phase 3 (Advanced)
1. Webhook delivery system — event → Discord/Telegram/Slack forwarding
2. Event subscription matrix (per-integration event filtering)
3. Delivery log with retry logic and status tracking
4. Drag-and-drop document reordering
5. Full responsive mobile layout (bottom sheet nav, stacked panes)
6. Advanced AI features: tool call visualization, agent reasoning display
7. Pipeline history — browse and replay past pipeline runs
8. Export functionality — export history as PDF/markdown

---

## File Structure

```
spec-platform/
├── app/
│   ├── layout.tsx                    # Root layout with theme provider, sidebar, top bar
│   ├── page.tsx                      # Dashboard (/)
│   ├── pipeline/
│   │   └── page.tsx                  # Pipeline View (/pipeline)
│   ├── documents/
│   │   ├── page.tsx                  # Document Explorer (/documents)
│   │   └── [id]/
│   │       └── page.tsx              # Single document view (/documents/:id)
│   ├── integrations/
│   │   └── page.tsx                  # Integrations Hub (/integrations)
│   ├── history/
│   │   └── page.tsx                  # Architecture History (/history)
│   └── api/
│       ├── events/
│       │   └── stream/
│       │       └── route.ts          # SSE event stream endpoint
│       ├── pipeline/
│       │   ├── start/
│       │   │   └── route.ts          # Start pipeline
│       │   ├── stream/
│       │   │   └── route.ts          # AI SDK streaming (useChat API)
│       │   └── [id]/
│       │       └── route.ts          # Pipeline status/control
│       ├── documents/
│       │   ├── route.ts              # List/create documents
│       │   └── [id]/
│       │       ├── route.ts          # CRUD for single document
│       │       └── history/
│       │           └── route.ts      # Document change history
│       ├── integrations/
│       │   ├── route.ts              # List/create integrations
│       │   ├── [id]/
│       │   │   └── route.ts          # Configure/delete integration
│       │   └── webhook/
│       │       └── route.ts          # Outbound webhook delivery
│       └── chat/
│           └── route.ts              # AI chat endpoint (Vercel AI SDK)
├── components/
│   ├── layout/
│   │   ├── top-bar.tsx
│   │   ├── sidebar.tsx
│   │   ├── status-bar.tsx
│   │   └── command-palette.tsx
│   ├── pipeline/
│   │   ├── pipeline-steps.tsx
│   │   ├── pipeline-event-log.tsx
│   │   └── pipeline-controls.tsx
│   ├── documents/
│   │   ├── document-tree.tsx
│   │   ├── markdown-viewer.tsx
│   │   ├── inline-editor.tsx
│   │   ├── diff-viewer.tsx
│   │   └── change-history.tsx
│   ├── ai/
│   │   ├── ai-stream-panel.tsx       # Vercel AI SDK useChat streaming
│   │   ├── ai-chat.tsx               # Full chat interface
│   │   └── tool-call-card.tsx        # Render AI tool calls
│   ├── integrations/
│   │   ├── integration-card.tsx
│   │   ├── event-subscription-matrix.tsx
│   │   ├── delivery-log.tsx
│   │   └── integration-config-modal.tsx
│   ├── excalidraw/
│   │   └── excalidraw-preview.tsx    # Excalidraw embed wrapper
│   ├── history/
│   │   ├── history-timeline.tsx
│   │   ├── change-entry.tsx
│   │   └── history-filter.tsx
│   └── shared/
│       ├── metric-card.tsx
│       ├── event-feed.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── modal.tsx
│       ├── skeleton.tsx
│       ├── tooltip.tsx
│       └── theme-toggle.tsx
├── hooks/
│   ├── use-event-stream.ts           # SSE connection hook
│   ├── use-pipeline.ts               # Pipeline state management
│   ├── use-documents.ts              # Document CRUD operations
│   ├── use-integrations.ts           # Integration management
│   ├── use-change-history.ts         # Document version history
│   ├── use-theme.ts                  # Dark/light theme toggle
│   ├── use-keyboard-shortcuts.ts     # Global keyboard shortcut handler
│   └── use-command-palette.ts        # Command palette state
├── lib/
│   ├── events/
│   │   ├── event-emitter.ts          # Server-side event emitter
│   │   ├── sse-manager.ts            # SSE connection manager
│   │   └── types.ts                  # Event type definitions
│   ├── integrations/
│   │   ├── discord.ts                # Discord webhook client
│   │   ├── telegram.ts               # Telegram bot API client
│   │   ├── slack.ts                  # Slack webhook client
│   │   └── dispatcher.ts            # Routes events to integrations
│   ├── documents/
│   │   ├── parser.ts                 # ADR/PRD markdown parser
│   │   ├── differ.ts                 # Diff computation
│   │   └── watcher.ts               # File system watcher for doc changes
│   ├── pipeline/
│   │   ├── runner.ts                 # Pipeline orchestrator
│   │   ├── steps.ts                  # Step definitions (ADR, Excalidraw, PRD, Impl)
│   │   └── store.ts                  # Pipeline run state
│   └── ai/
│       └── providers.ts              # AI SDK provider configuration
├── stores/
│   ├── pipeline-store.ts             # Zustand store for pipeline state
│   ├── document-store.ts             # Zustand store for documents
│   ├── event-store.ts                # Zustand store for event feed
│   └── ui-store.ts                   # Zustand store for UI state (sidebar, theme)
├── styles/
│   └── globals.css                   # CSS custom properties, theme definitions, base styles
├── public/
│   └── fonts/                        # Inter + JetBrains Mono font files
├── tailwind.config.ts                # Tailwind config with custom theme tokens
├── next.config.ts                    # Next.js 15 configuration
├── tsconfig.json
├── package.json
└── README.md
```

---

## Consequences

### Positive
- Architecture decisions are visible and traceable — every change has a history, every diagram stays in sync
- Real-time streaming gives developers confidence in what the agent is doing — no black boxes
- Multi-platform event delivery (Discord/Telegram/Slack) keeps the entire team informed without requiring them to use the web UI
- Vercel AI SDK 6 provides a production-grade streaming foundation with minimal custom code
- The Excalidraw integration leverages the existing monorepo — no need to build a diagramming tool from scratch
- Git-style change tracking for architecture documents fills a gap that traditional git doesn't serve well (semantic architecture changes vs. raw file diffs)

### Negative
- SSE + multiple integrations add operational complexity — webhook failures need retry logic and monitoring
- Excalidraw embedding in a Next.js app requires careful handling of client-side-only rendering (dynamic imports with `ssr: false`)
- Dense/pro UI may have a steeper learning curve for non-developer users
- Supporting both dark and light themes doubles the design token maintenance surface

### Trade-offs
- **Zustand over Jotai**: While the existing Excalidraw codebase uses Jotai, the Agentic Coding Platform uses Zustand for simpler store patterns that align better with the pipeline/document/event state model. The Excalidraw embed manages its own internal Jotai state independently.
- **SSE over WebSocket**: Server-Sent Events chosen over WebSocket because the data flow is predominantly server→client (pipeline events). SSE is simpler to implement, works through proxies, and auto-reconnects. WebSocket would be needed only if we add collaborative editing later.
- **Next.js 15 App Router over Vite SPA**: Despite the existing Vite setup in the monorepo, the Agentic Coding Platform benefits from Next.js API routes (for SSE endpoints, webhook handlers, AI SDK integration) and server components (for initial document loading).
