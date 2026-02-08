# PRD-0002: mdiff — Diff-Based Development Lifecycle UI

**Source ADR:** [ADR-0002](../architecture/0002-mdiff-ui-specifications.md)
**Status:** Not Started
**Created:** 2026-02-08

## Overview

IMPORTANT: use Nextjs 16 and latest ai-sdk 6 and vercel ai-elements, create ui under mdiff-ui folder, keep the existing coding-ui folder for reference.

mdiff is a diff-based development lifecycle manager that visualizes changes across ADR/PRD/PRD-log documents and Excalidraw architecture diagrams. The application replaces the previous "Agentic Coding Platform" UI (ADR-0001) with a fundamentally different design philosophy: top-nav only, spacious, futuristic-minimal with Electric Violet (#a855f7) accent.

The core user journey is: **create/import project → add feature → agent generates ADR/PRD/Excalidraw changes → watch diffs stream in real-time → review & approve → notify team via integrations**. The UI is built on the existing `coding-ui` Next.js project (React 19, Tailwind CSS, shadcn/ui primitives) but requires a complete visual overhaul — removing the sidebar layout and replacing it with a centered top-nav shell. Key integrations include Google A2UI for agent-generated declarative UI, Vercel AI SDK for real-time streaming, SSE for event transport, and Telegram/Discord/Slack for agent triggering and notifications.

The existing codebase provides shadcn/ui components (button, card, dialog, sheet, tabs, command, skeleton, tooltip, etc.), the `next-themes` provider, Inter + JetBrains Mono fonts, and mock data structures for pipelines/documents/integrations. The mdiff rebuild will restructure the layout, rewrite the design tokens (violet accent replacing cyan), introduce project-centric routing, and build new diff-focused components from scratch.

## Implementation Tasks

The tasks below are organized by phase and priority. Each phase builds on the previous one. Tasks within the same phase can be worked on in parallel.

```json
[
  {
    "phase": 1,
    "category": "setup",
    "description": "Rewrite design tokens and globals.css for mdiff's Futuristic Minimal aesthetic — Electric Violet accent, dark/light themes, diff colors, agent activity colors",
    "steps": [
      "Open coding-ui/app/globals.css and replace all CSS custom properties in :root with the dark theme palette from ADR-0002 (--bg-primary: #09090b, --accent-primary: #a855f7, etc.)",
      "Replace the .light class block with the light theme palette from ADR-0002 (--bg-primary: #fafafa, --accent-primary: #7c3aed, etc.)",
      "Map mdiff tokens to shadcn/ui HSL variables: --background maps to --bg-primary, --primary maps to --accent-primary, --card maps to --bg-secondary, --muted maps to --bg-tertiary, --border maps to --border-default, --ring maps to --accent-primary",
      "Add diff-specific tokens: --diff-added-bg, --diff-added-border, --diff-added-text, --diff-removed-bg, --diff-removed-border, --diff-removed-text, --diff-modified-bg, --diff-modified-border",
      "Add agent activity tokens: --agent-pulse, --agent-stream, --stage-adr, --stage-prd, --stage-excalidraw, --stage-implement",
      "Add animation keyframes: @keyframes agent-pulse (radial gradient pulse, 2s ease-in-out), @keyframes shimmer (gradient sweep left-to-right, 1.5s), @keyframes blink-cursor (opacity toggle, 800ms)",
      "Add the frosted-glass utility class: .backdrop-blur-bar { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }",
      "Verify by running `npm run dev` in coding-ui/ and confirming the app renders with near-black background and violet accents"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Update tailwind.config.ts to extend mdiff design tokens — violet accent colors, diff colors, agent colors, custom animations, typography scale",
    "steps": [
      "Open coding-ui/tailwind.config.ts and replace the existing `ac` color block with mdiff-specific colors: accent (--accent-primary), diff-added, diff-removed, diff-modified, stage-adr, stage-prd, stage-excalidraw, stage-implement, agent-pulse, agent-stream",
      "Update the fontFamily.sans to use ['var(--font-inter)', 'system-ui', 'sans-serif'] and fontFamily.mono to use ['var(--font-jetbrains)', 'monospace']",
      "Add custom fontSize entries matching ADR-0002 typography scale: text-2xs (0.6875rem), text-base (0.9375rem for mdiff's 15px body)",
      "Add animation keyframes for agent-pulse, shimmer, slide-from-right (for overlay), slide-from-bottom (for sheets), fade-in, count-up",
      "Add corresponding animation utilities: animate-agent-pulse, animate-shimmer, animate-slide-right, animate-slide-bottom, animate-fade-in",
      "Keep existing accordion keyframes and tailwindcss-animate plugin",
      "Verify by checking that `className='text-accent'` renders Electric Violet in both themes"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Update root layout.tsx — rename app to mdiff, update metadata, set viewport theme color to #09090b",
    "steps": [
      "Open coding-ui/app/layout.tsx and change metadata.title from 'agentic' to 'mdiff'",
      "Change metadata.description to 'mdiff — manage development through diffs. Track ADR, PRD, and architecture changes across your projects.'",
      "Change viewport.themeColor to '#09090b' (mdiff dark bg-primary)",
      "Keep the Inter and JetBrains Mono font setup (already correct)",
      "Keep ThemeProvider with attribute='class' defaultTheme='dark' (already correct)",
      "The AppShell wrapper will be replaced in the next task — leave it for now"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Define mdiff TypeScript types in lib/types.ts — Project, Diff, DiffStats, Document, TimelineEntry, Integration, DeliveryEntry, MDiffEventType",
    "steps": [
      "Open coding-ui/lib/types.ts and add the new mdiff-specific interfaces alongside existing ones (keep existing types for backwards compat during migration)",
      "Add Project interface: { id, name, adrCount, prdCount, lastDiffAt: Date, agentStatus: 'active' | 'idle', description?: string, createdAt: Date }",
      "Add Diff interface: { id, projectId, type: 'adr' | 'prd' | 'prd-log' | 'excalidraw', documentName, description, timestamp: Date, author: 'agent' | 'user', stats: DiffStats, hunks?: DiffHunk[] }",
      "Add DiffStats interface: { linesAdded?, linesRemoved?, nodesAdded?, nodesRemoved?, edgesAdded?, edgesRemoved? }",
      "Add DiffHunk interface: { oldStart, oldCount, newStart, newCount, lines: DiffLine[] }",
      "Add DiffLine interface: { type: 'context' | 'added' | 'removed', content: string, lineNumber: number }",
      "Add MDiffDocument interface: { id, name, type: 'adr' | 'prd' | 'prd-log', status, lastModified: Date, diffCount, content?: string, projectId: string }",
      "Add MDiffEventType union type matching all event types from ADR-0002 (diff:created, agent:started, a2ui:update, etc.)",
      "Add MDiffEvent interface: { id, type: MDiffEventType, timestamp: Date, payload: Record<string, unknown> }"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Create mdiff mock data in lib/mock-data.ts — projects, diffs, documents, timeline entries for rendering static pages",
    "steps": [
      "Add mockProjects array with 3 projects: payments-api (4 ADRs, 3 PRDs, agent active), auth-service (7 ADRs, 5 PRDs, idle), mobile-app (2 ADRs, 1 PRD, idle)",
      "Add mockDiffs array with 5-6 diffs across projects: ADR text diffs with hunks, Excalidraw diagram diffs with node/edge stats, PRD diffs",
      "Add mockMDiffDocuments array with ADRs, PRDs, PRD-logs for the payments-api project — include realistic markdown content for at least one ADR",
      "Add mockTimelineEntries array with 8-10 entries grouped across 'Today' and 'Yesterday' matching the ADR-0002 timeline layout",
      "Add mockAgentState object: { active: true, projectId: 'payments-api', currentTask: 'Generating PRD...', streamContent: '## Phase 1: Core Setup\\n\\n### Task 1: Initialize Redis...', events: [...] }",
      "Keep existing mock data (mockPipelineEvents, mockIntegrations, etc.) for backwards compat — the integrations mock data can be reused directly"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the mdiff shell layout — TopBar (56px, frosted glass), centered content area (max-w-5xl), StatusStrip (24px, fades when idle). Remove sidebar.",
    "steps": [
      "Create coding-ui/components/layout/mdiff-shell.tsx as the new app shell. It replaces AppShell. Structure: fixed TopBar at top, scrollable main content area in the middle (max-w-[1200px] mx-auto px-6 md:px-12), fixed StatusStrip at bottom.",
      "Build TopBar component in coding-ui/components/layout/mdiff-top-bar.tsx: 56px height, fixed position, full-width, backdrop-blur-bar class for frosted glass. Left: 'mdiff' wordmark in text-lg font-semibold tracking-tight. Center: nav links (Projects, Features, Timeline) as text buttons with active underline indicator. Right: theme toggle button (◐ icon using lucide Moon/Sun), ⌘K trigger button, notification bell with badge count.",
      "Build StatusStrip component in coding-ui/components/layout/status-strip.tsx: 24px height, fixed bottom, full-width. Left: pulsing violet dot (animate-agent-pulse) + agent status text + pending diff count. Right: 'mdiff v0.1'. Entire strip fades to opacity-30 when agent is idle, full opacity on hover or when agentActive=true. Use transition-opacity duration-500.",
      "Update coding-ui/app/layout.tsx to use MdiffShell instead of AppShell. Remove the AppShell import.",
      "Add the top-bar scroll behavior: the TopBar has bg-transparent when at scroll position 0, and gains bg-bg-primary/80 backdrop-blur when scrolled (use an IntersectionObserver or scroll listener).",
      "Ensure the main content area has padding-top of 56px (TopBar height) and padding-bottom of 24px (StatusStrip height) so content doesn't hide behind fixed elements.",
      "Verify by running dev server — app should show mdiff wordmark, centered content area with generous whitespace, and a subtle status strip at the bottom. No sidebar."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the CommandPalette component — ⌘K activated, searches across projects, pages, features, and actions",
    "steps": [
      "The existing coding-ui/components/layout/command-palette.tsx can be repurposed. Update it to use mdiff navigation items: pages (Dashboard, Timeline, Integrations), projects (from mock data), actions (New Project, Import Project, Add Feature).",
      "Update the command categories to match mdiff: 'navigation', 'project', 'feature', 'agent'.",
      "Wire the ⌘K keyboard shortcut globally in the MdiffShell component using useEffect with keydown listener (metaKey + 'k' or ctrlKey + 'k').",
      "Style the command palette dialog with mdiff design tokens: bg-bg-tertiary, border-border-default, input-text uses text-primary, search results use text-secondary with accent highlight on match.",
      "Add navigation actions: selecting a project navigates to /projects/[id], selecting a page navigates to the route, selecting 'New Project' opens a dialog.",
      "Verify by pressing ⌘K — palette opens with frosted backdrop, typing filters results, selecting navigates."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the Dashboard page (/) — project card grid, add/import project CTAs, recent diffs list",
    "steps": [
      "Rewrite coding-ui/app/page.tsx as the mdiff Dashboard. Structure: section header 'Your Projects' with [+ New Project] and [Import] buttons on the right, then a 2-column grid of ProjectCards, then a divider, then 'Recent Diffs' section with RecentDiffList.",
      "Create coding-ui/components/project/project-card.tsx: card with bg-bg-secondary, border-border-subtle, rounded-lg. Shows project name (text-xl font-semibold), document counts ('4 ADRs · 3 PRDs' in text-secondary text-sm), relative time since last diff (text-muted text-xs), agent status indicator (pulsing violet dot for active, gray dot for idle). Hover: border-border-strong, subtle lift (translate-y -0.5px), transition 150ms. onClick navigates to /projects/[id].",
      "Create coding-ui/components/project/add-project-card.tsx: dashed border card with '+ Add project' text in text-muted. Same dimensions as ProjectCard. Click opens a simple dialog with 'New Project' name input and 'Import' file picker (placeholder for now).",
      "Create coding-ui/components/diff/recent-diff-list.tsx: flat list of recent diffs across all projects. Each row: left dot (colored by diff type — violet for ADR, pink for Excalidraw, purple for PRD), project name + document name, relative timestamp on the right, diff stats badge (+23 −5 or +3 nodes). Rows separated by border-border-subtle dividers. 'View all →' link at top right navigates to /timeline.",
      "Use mockProjects and mockDiffs to populate the page with realistic data.",
      "Empty state: when no projects exist, show centered illustration placeholder (just a text block for now) with 'Create your first project' CTA button.",
      "Verify the dashboard renders with 3 project cards + 1 add card in 2-column grid, recent diffs below."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the Project Workspace page (/projects/[id]) — tabbed view with Diffs, Docs, Diagram, A2UI tabs. Implement the Diffs tab with DiffCard components.",
    "steps": [
      "Create coding-ui/app/projects/[id]/page.tsx. Uses Next.js dynamic route params to get project ID. Header: back arrow link to /, project name (text-2xl), [+ Add Feature] and [Settings] buttons.",
      "Create coding-ui/components/project/workspace-tabs.tsx: horizontal tab row using Radix Tabs. Four tabs: Diffs (default), Docs, Diagram, A2UI. Active tab has violet underline that slides horizontally on tab change (use transform translateX with transition 200ms). Tab content renders below.",
      "Create coding-ui/components/diff/diff-card.tsx: expandable card showing a single diff. Collapsed state: document name (font-medium), relative timestamp, author badge ('by agent' / 'by you'), diff stats (+23 −5). Expanded state (on click): reveals inline diff preview using DiffHunk rendering. Chevron icon rotates 180° on expand. Card uses bg-bg-secondary, border-border-subtle. Expand/collapse animates height with cubic-bezier(0.32, 0.72, 0, 1) at 200ms.",
      "Create coding-ui/components/diff/diff-stats.tsx: small inline component showing +N added / −M removed in diff-added-text / diff-removed-text colors. For Excalidraw diffs, shows +N nodes +M edges instead.",
      "Create coding-ui/components/diff/diff-hunk.tsx: renders a single diff hunk with line numbers, context lines (text-secondary), added lines (bg-diff-added-bg, text-diff-added-text, left border diff-added-border), removed lines (bg-diff-removed-bg, text-diff-removed-text, left border diff-removed-border). Uses font-mono text-sm.",
      "Wire the Diffs tab to render a list of DiffCards from mock data, sorted by timestamp descending. Each card expands on click to show hunks.",
      "The Docs, Diagram, and A2UI tabs render placeholder content for now ('Coming soon' text).",
      "Verify by navigating to /projects/payments-api — see project name, 4 tabs, diff cards that expand on click with colored diff lines."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the DiffViewer component — unified and split modes with syntax highlighting for markdown, hunk-level navigation",
    "steps": [
      "Create coding-ui/components/diff/diff-viewer.tsx implementing the DiffViewerProps interface from ADR-0002. Accepts oldContent, newContent, oldLabel, newLabel, mode ('unified' | 'split'), language.",
      "Unified mode: single column, line-by-line rendering. Context lines show with gray line numbers. Added lines show with green bg (--diff-added-bg) and + prefix. Removed lines show with red bg (--diff-removed-bg) and - prefix. Hunk headers (@@ -12,6 +12,8 @@) show in text-muted with bg-bg-surface.",
      "Split mode: two columns side by side using CSS grid (grid-cols-2). Left column shows old content with removed lines highlighted. Right column shows new content with added lines highlighted. Synchronized scrolling between columns.",
      "Implement a simple diff algorithm using the existing content: split both strings by newline, compare lines, generate hunk objects. For MVP, use a basic line-by-line comparison (longest common subsequence not required yet — can use a library later).",
      "Add line number gutter on the left of each column: text-xs text-muted font-mono, fixed width 48px.",
      "Add mode toggle button in the top-right corner of the viewer: 'Unified' / 'Split' toggle.",
      "Style uses font-mono for all diff content, bg-bg-surface for the viewer container, rounded-lg border-border-default.",
      "Verify by rendering the DiffViewer in a DiffCard's expanded state with mock ADR content — shows colored added/removed lines."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the Diff Timeline page (/timeline) — cross-project chronological timeline with date grouping, filters, and stats bar",
    "steps": [
      "Create coding-ui/app/timeline/page.tsx. Header: 'Timeline' in text-2xl. Below: filter bar, then timeline entries grouped by date, then stats bar at bottom.",
      "Create coding-ui/components/timeline/timeline-filters.tsx: horizontal bar with 3 dropdown selects (All Projects, All Types, This Week) and a search input. Dropdowns use shadcn Select component styled with mdiff tokens. Search input has a magnifying glass icon.",
      "Create coding-ui/components/timeline/timeline-view.tsx: vertical timeline layout. Date group headers ('Today', 'Yesterday', specific dates) as text-sm font-semibold text-muted with a thin horizontal line. Between headers, timeline entries connected by a thin vertical line (1px border-border-subtle) on the left.",
      "Create coding-ui/components/timeline/timeline-entry.tsx: a dot (8px circle, colored by diff type) on the vertical line, timestamp (text-xs text-muted), project name badge (text-xs bg-bg-tertiary rounded px-2), description, diff stats, optional linked entries (→ PRD generated, → Excalidraw updated). 'View Diff →' link on the right navigates to the project workspace with the diff expanded.",
      "Create coding-ui/components/timeline/timeline-stats.tsx: bottom bar showing aggregate counts: 'N total diffs · X ADRs · Y PRDs · Z logs · W diagrams'. Styled as bg-bg-secondary rounded-lg p-3 text-sm text-secondary.",
      "Populate with mockTimelineEntries. Support filtering by project (dropdown), type (dropdown), and text search (filters entries by description).",
      "Add entry appear animation: entries fade-slide in from left (translateX: -8px → 0, opacity: 0 → 1) with 150ms timing, staggered 30ms per entry. Use CSS animation with animation-delay.",
      "Verify the timeline page shows grouped entries with colored dots, a vertical connector line, and working filters."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the Integrations Hub page (/integrations) — integration cards for Telegram/Discord/Slack, delivery log, configuration sheet",
    "steps": [
      "Rewrite coding-ui/app/integrations/page.tsx for mdiff. Header: 'Integrations' in text-2xl, subtitle in text-secondary. Below: vertical stack of IntegrationCards, then divider, then DeliveryLog.",
      "Create coding-ui/components/integrations/mdiff-integration-card.tsx: vertical card per platform. Connected state: solid border (border-border-default), platform name, ● Connected badge in success color, channel/bot name, capabilities checkmarks (Trigger: ✓, Notify: ✓), last activity relative time, [Configure] and [Test] buttons. Disconnected state: dashed border (border-dashed border-border-subtle), platform name, ○ Not connected in text-muted, [Connect →] button.",
      "Create coding-ui/components/integrations/mdiff-delivery-log.tsx: timestamped log rows. Each row: time (text-xs text-muted font-mono), platform badge (colored by platform), success indicator (✓ in success / ✗ in error), message preview (text-sm text-secondary). Failed deliveries show 'retrying...' text in warning color. [Clear log] button at top right.",
      "Create coding-ui/components/integrations/integration-config-sheet.tsx: uses shadcn Sheet (slide from bottom). Form fields: platform name (read-only), bot token / webhook URL input, channel name input, event subscription checkboxes (diff:created, agent:completed, etc.), trigger enabled toggle. [Test Connection] button sends a test (placeholder). [Save] button closes sheet.",
      "Wire Configure button on cards to open the config sheet. Wire Test button to show a toast notification (placeholder).",
      "Use existing mockIntegrations and mockDeliveries data.",
      "Verify the integrations page shows 3 cards (2 connected, 1 disconnected), a delivery log below, and clicking Configure opens the sheet."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the Project Workspace Docs tab — document list grouped by type, document reader with markdown rendering, edit toggle",
    "steps": [
      "Create coding-ui/components/document/mdiff-document-list.tsx: flat list of documents grouped by type (ADR, PRD, PRD-log). Each group header: type label in uppercase text-xs tracking-wide text-muted. Each item: document name, status badge (proposed/accepted/deprecated as colored badges), last modified relative time, diff count badge. Sort controls: date / name / type. Click selects document.",
      "Create coding-ui/components/document/mdiff-document-reader.tsx: renders markdown content as styled HTML. Use a simple markdown-to-HTML approach (can use dangerouslySetInnerHTML with basic regex transforms for headers, lists, code blocks, bold, italic — or integrate a lightweight markdown library if available). Style: prose-like formatting with text-primary, h1-h3 headers with proper sizing, code blocks with bg-bg-surface font-mono rounded, blockquotes with left border-accent-primary.",
      "Add an Edit toggle button at the top right of the reader. When editing, swap the reader for a textarea with font-mono, full height, with Save and Cancel buttons. Save updates the mock data (in-memory only for now).",
      "Wire the Docs tab in workspace-tabs.tsx to render DocumentList on the left (40% width on desktop) and DocumentReader on the right (60%). On mobile, list is full-width, clicking a document pushes to reader view with a back button.",
      "Use mockMDiffDocuments to populate the list and reader.",
      "Verify by navigating to a project workspace, clicking the Docs tab — see grouped document list on left, selecting a document renders markdown on right, Edit toggle works."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the Agent Stream Overlay — global slide-in panel showing real-time agent activity, AI stream output, and event log",
    "steps": [
      "Create coding-ui/components/agent/agent-stream-overlay.tsx: 360px wide panel fixed to the right edge of the viewport. Slides in from right with translateX(100%) → translateX(0) at 250ms using cubic-bezier(0.32, 0.72, 0, 1). Background bg-bg-secondary, left border border-border-default. Header: 'Agent Stream' text with minimize (—) and close (×) buttons.",
      "Create coding-ui/components/agent/ai-stream-view.tsx: renders streaming AI output as markdown. For MVP, display static mock content that simulates a stream (the mockAgentState.streamContent). Add a blinking cursor (▍) at the end of content using animate-blink-cursor in violet color. Content area is scrollable.",
      "Create coding-ui/components/agent/agent-event-log.tsx: compact event list below the stream. Each entry: timestamp (text-xs font-mono text-muted), event description (text-sm), status icon (✓ for completed, ● for in-progress). Scrollable, most recent at top.",
      "Wire the overlay to be triggered from: (1) clicking the pulsing dot in StatusStrip, (2) clicking the notification bell in TopBar. Store overlay state (open, minimized) in a React context or Zustand store so it persists across page navigation.",
      "Minimized state: only the header bar is visible (24px height strip at the right edge).",
      "The overlay renders on top of all page content with a semi-transparent backdrop (optional — can be no backdrop since the panel is side-mounted).",
      "When agent is idle (mockAgentState.active === false), show 'No active agent' with the last few events from history.",
      "Verify by clicking the status strip dot — overlay slides in from right, shows streaming content with blinking cursor, event log scrolls below."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the Excalidraw Diagram tab in Project Workspace — embed Excalidraw canvas with read-only mode and placeholder for diff overlay",
    "steps": [
      "Create coding-ui/components/excalidraw/mdiff-excalidraw-canvas.tsx: wrapper component that lazy-loads the Excalidraw library using next/dynamic with ssr: false (Excalidraw is client-only). Props: sceneData (ExcalidrawScene), readOnly (boolean), diffOverlay (optional — addedNodeIds, removedNodeIds arrays).",
      "The existing coding-ui/components/pipeline/excalidraw-preview.tsx and the Excalidraw monorepo at /Users/orhanors/Desktop/coding/excalidraw/ provide reference. Use @excalidraw/excalidraw package. If not already in package.json, note it as a dependency to add.",
      "Wire the Diagram tab in workspace-tabs.tsx to render the ExcalidrawCanvas with mock architecture data (convert mockArchitectureCommits[latest].snapshot to Excalidraw scene format).",
      "Implement basic diff overlay: if diffOverlay prop is provided, render added nodes with a green border/glow and removed nodes with a red border/glow. This can be done by manipulating Excalidraw element styles (strokeColor, backgroundColor) before passing to the canvas.",
      "Add an 'Open in Excalidraw ↗' external link button that opens the diagram in a new tab (placeholder URL for now).",
      "Verify by navigating to a project workspace, clicking the Diagram tab — Excalidraw renders with the project's architecture diagram."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "integration",
    "description": "Build SSE event streaming infrastructure — server-side event emitter, client-side useEventStream hook, event type system",
    "steps": [
      "Create coding-ui/lib/events/types.ts: define MDiffEvent interface and MDiffEventType union from ADR-0002. Export all event types.",
      "Create coding-ui/lib/events/sse-manager.ts: server-side EventEmitter singleton. Methods: emit(event: MDiffEvent), subscribe(callback): unsubscribe function. Uses Node.js EventEmitter internally. Exported as a module-level singleton.",
      "Create coding-ui/app/api/events/stream/route.ts: GET handler that returns a ReadableStream response with Content-Type 'text/event-stream'. On connection, subscribes to the sse-manager. Each emitted event is serialized as `data: ${JSON.stringify(event)}\\n\\n`. Handles client disconnect by unsubscribing.",
      "Create coding-ui/hooks/use-event-stream.ts: client-side hook that connects to /api/events/stream using EventSource. Returns { events: MDiffEvent[], isConnected: boolean, error: Error | null }. Auto-reconnects on disconnect with exponential backoff (1s, 2s, 4s, max 30s). Parses incoming SSE data as MDiffEvent objects. Stores events in state (last 100 events max).",
      "Create coding-ui/app/api/events/test/route.ts: POST handler for testing — accepts an event payload and emits it through sse-manager. This allows manually triggering events during development.",
      "Verify by: (1) start dev server, (2) open browser to app, (3) POST a test event to /api/events/test, (4) confirm the useEventStream hook receives it and the StatusStrip or Agent overlay updates."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "integration",
    "description": "Wire real-time updates into the UI — StatusStrip reacts to agent events, Dashboard updates project card status, Timeline receives live entries",
    "steps": [
      "Update StatusStrip to consume useEventStream hook. When an 'agent:started' event arrives, set agentActive=true and show the event message. When 'agent:completed' or 'agent:failed', set agentActive=false. Pending diff count increments on 'diff:created' events.",
      "Update the Dashboard page to subscribe to events. On 'diff:created' events, prepend the new diff to the Recent Diffs list with the slide-in animation. On 'agent:started'/'agent:completed', update the corresponding project card's agentStatus.",
      "Update the Timeline page to subscribe to events. On 'diff:created' events, prepend a new TimelineEntry at the top of 'Today' group with the fade-slide animation.",
      "Update the Agent Stream Overlay to subscribe to events. On 'agent:streaming' events, append the payload content to the AI stream view. On any event, append to the event log.",
      "Update the Project Workspace Diffs tab to subscribe to events filtered by the current project ID. New diffs appear at the top of the list with animation.",
      "Verify by triggering test events via /api/events/test and confirming all UI components update in real-time across pages."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "integration",
    "description": "Build Zustand stores for mdiff state management — project store, diff store, agent store, UI store",
    "steps": [
      "Install zustand: add 'zustand' to package.json dependencies in coding-ui/.",
      "Create coding-ui/stores/project-store.ts: Zustand store with state { projects: Project[], selectedProjectId: string | null } and actions { addProject, removeProject, updateProject, setSelectedProject }. Initialize with mockProjects.",
      "Create coding-ui/stores/diff-store.ts: Zustand store with state { diffs: Diff[], loading: boolean } and actions { addDiff, setDiffs, setLoading }. Initialize with mockDiffs.",
      "Create coding-ui/stores/agent-store.ts: Zustand store with state { active: boolean, projectId: string | null, currentTask: string | null, streamContent: string, events: MDiffEvent[] } and actions { setActive, appendStream, addEvent, clear }.",
      "Create coding-ui/stores/ui-store.ts: Zustand store with state { agentOverlayOpen: boolean, agentOverlayMinimized: boolean, commandPaletteOpen: boolean, theme: 'dark' | 'light' } and actions { toggleAgentOverlay, minimizeAgentOverlay, toggleCommandPalette, setTheme }.",
      "Wire all components to use Zustand stores instead of local state: TopBar reads notificationCount from agent-store events.length, StatusStrip reads from agent-store, ProjectCards read from project-store, etc.",
      "Verify by interacting with the UI — adding a project updates the store and re-renders the dashboard, opening agent overlay reads from ui-store."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "feature",
    "description": "Build the Project Workspace A2UI tab — A2UI renderer component, component registry, fallback for unknown types",
    "steps": [
      "Create coding-ui/lib/a2ui/types.ts: define A2UIPayload interface (flat array of component descriptors, each with id, type, props, children references), A2UIComponent interface, ComponentRegistry type.",
      "Create coding-ui/components/a2ui/component-registry.ts: maps A2UI component type strings to React components. Register: 'text' → styled <p>/<h1>-<h6> based on level prop, 'button' → shadcn Button, 'progress' → shadcn Progress, 'list' → styled <ul>, 'card' → shadcn Card, 'form' → basic form with inputs, 'code' → code block with bg-bg-surface font-mono. Export getComponent(type: string) function.",
      "Create coding-ui/components/a2ui/a2ui-renderer.tsx: recursive component that takes an A2UIPayload, iterates over component descriptors, resolves each type from the registry, passes props, and renders. Unknown types render a fallback card: 'Unsupported component: {type}' in text-muted with dashed border.",
      "Wire the A2UI tab in workspace-tabs.tsx to render the A2UIRenderer. For now, pass a mock A2UI payload that demonstrates several component types (a heading, a progress bar, a list of tasks, a button).",
      "Add a 'Live' badge indicator on the A2UI tab when new A2UI payloads arrive via SSE (listen for 'a2ui:update' events).",
      "Verify by navigating to a project workspace, clicking A2UI tab — see rendered components from the mock payload. Unknown types show the fallback card."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "feature",
    "description": "Implement inline editing in DiffViewer — hunk-level approve/reject buttons for reviewing agent-generated diffs",
    "steps": [
      "Update coding-ui/components/diff/diff-viewer.tsx to accept optional onApproveHunk and onRejectHunk callback props.",
      "When these callbacks are provided, render approve (✓ green) and reject (✗ red) icon buttons next to each hunk header (@@ line). Buttons appear on hover, positioned at the right end of the hunk header row.",
      "Approving a hunk visually marks it with a subtle green left border and a ✓ checkmark badge. Rejecting marks it with a red left border and ✗ badge. Both disable the buttons for that hunk.",
      "Track hunk approval state locally: { [hunkIndex]: 'approved' | 'rejected' | 'pending' }. Show a summary at the bottom of the viewer: 'N/M hunks approved'.",
      "Add an 'Approve All' button at the top of the viewer that approves all pending hunks at once.",
      "Wire the DiffCard's expanded view to pass approve/reject callbacks. For now, callbacks just update local state (no backend persistence).",
      "Verify by expanding a diff card, hovering over a hunk header to see approve/reject buttons, clicking them changes the hunk styling."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 5,
    "category": "security",
    "description": "Security audit — validate all user inputs, secure API routes, sanitize A2UI payloads, protect integration credentials",
    "steps": [
      "Audit the integration config sheet form: validate webhook URLs against a URL regex, enforce HTTPS-only for webhook URLs, sanitize bot token inputs (trim whitespace, reject empty), set maxLength on all text inputs to prevent oversized payloads.",
      "Audit A2UI renderer: ensure all component type lookups go through the registry — never render arbitrary React components. Validate that A2UI payloads match the expected schema before rendering. Strip any HTML from text content to prevent XSS. Ensure onAction callback data is sanitized (no prototype pollution, no __proto__ keys).",
      "Audit SSE event stream endpoint: add rate limiting logic (max 5 connections per IP, or per session). Ensure event data is JSON.stringify-safe (no circular references, no Buffers). Add Content-Security-Policy headers to the SSE response.",
      "Audit project creation/import: validate project name (alphanumeric + hyphens only, max 64 chars). For import, validate file content is valid JSON/markdown before processing. Reject files over 10MB.",
      "Audit inline editing: ensure saved document content is sanitized before storage. Strip script tags and event handlers from any HTML content. Validate markdown content length (max 500KB per document).",
      "Ensure no secrets (integration tokens, webhook URLs) are exposed in client-side JavaScript bundles. These should only exist in server-side API routes, never in Zustand stores or component props.",
      "Test with malformed inputs: empty strings, very long strings (100K chars), special characters (< > \" ' & / \\), unicode edge cases, null bytes."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 6,
    "category": "feature",
    "description": "Build REST API routes for project CRUD — create, list, get, update, delete projects with file-system-backed storage",
    "steps": [
      "Create coding-ui/app/api/projects/route.ts: GET handler returns all projects as JSON. POST handler creates a new project — accepts { name, description? } in body, generates an ID (nanoid), creates a project directory on disk (architecture/ subdirectory), returns the new Project object. Validate name: alphanumeric + hyphens, 1-64 chars.",
      "Create coding-ui/app/api/projects/[id]/route.ts: GET returns a single project with its documents and recent diffs. PUT updates project metadata (name, description). DELETE removes the project (with confirmation — require a 'confirm' field in body matching project name).",
      "Create coding-ui/app/api/projects/[id]/diffs/route.ts: GET returns all diffs for a project, sorted by timestamp desc. Supports query params: ?type=adr|prd|excalidraw, ?limit=N, ?offset=N for pagination.",
      "Create coding-ui/app/api/projects/[id]/documents/route.ts: GET returns all documents for a project. POST creates a new document. Each document is backed by a markdown file on disk.",
      "Create coding-ui/app/api/projects/[id]/features/route.ts: GET returns features (feature = a grouping of ADR + PRD + implementation). POST creates a new feature, which triggers the agent pipeline (placeholder — just creates the ADR file for now).",
      "Wire the Dashboard page to fetch projects from GET /api/projects instead of mock data. Wire project creation dialog to POST /api/projects.",
      "Verify by creating a project via the UI, refreshing the page, and seeing it persist."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 6,
    "category": "feature",
    "description": "Build REST API routes for integrations — CRUD operations, webhook handling for inbound triggers from Telegram/Discord/Slack",
    "steps": [
      "Create coding-ui/app/api/integrations/route.ts: GET returns all integrations. POST creates a new integration — accepts { platform, token, channelName, capabilities: { trigger, notify } }. Token is stored server-side only (environment variable reference or encrypted storage placeholder).",
      "Create coding-ui/app/api/integrations/[id]/route.ts: GET returns integration details (without token — only status, channelName, capabilities, lastActivity). PUT updates integration config. DELETE removes integration.",
      "Create coding-ui/app/api/integrations/[id]/test/route.ts: POST sends a test message to the configured channel. For Telegram: POST to https://api.telegram.org/bot{token}/sendMessage. For Discord: POST to webhook URL. For Slack: POST to webhook URL. Return success/failure.",
      "Create coding-ui/app/api/integrations/webhook/route.ts: POST handler for inbound webhooks. Receives messages from Telegram/Discord/Slack. Parses the platform-specific payload. If the message matches a trigger command (e.g., '/mdiff add-feature \"Add caching\"'), extracts the action and triggers the agent pipeline. Return 200 OK.",
      "Create coding-ui/lib/integrations/dispatcher.ts: function that receives an MDiffEvent and dispatches it to all connected integrations that subscribe to that event type. Calls the platform-specific API to send the notification. Logs delivery success/failure.",
      "Wire the integrations page to fetch from API routes instead of mock data.",
      "Verify by configuring a test integration, clicking Test, and seeing a delivery log entry."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 6,
    "category": "testing",
    "description": "Write component tests for core mdiff components — TopBar, ProjectCard, DiffCard, DiffViewer, TimelineEntry, IntegrationCard",
    "steps": [
      "Set up testing if not already configured: ensure vitest or jest is available with React Testing Library. Check if coding-ui/package.json has test dependencies, add if missing.",
      "Create coding-ui/__tests__/components/top-bar.test.tsx: test that TopBar renders mdiff wordmark, nav links (Projects, Features, Timeline), theme toggle, ⌘K button. Test that clicking ⌘K button calls onCommandPalette.",
      "Create coding-ui/__tests__/components/project-card.test.tsx: test rendering with project data (name, counts, agent status). Test that clicking calls onClick. Test that agent active state shows pulsing dot.",
      "Create coding-ui/__tests__/components/diff-card.test.tsx: test collapsed state shows summary, test expand/collapse toggle, test that expanded state renders diff hunks. Test diff stats display for both text and Excalidraw diffs.",
      "Create coding-ui/__tests__/components/diff-viewer.test.tsx: test unified mode rendering with added/removed/context lines. Test split mode rendering. Test mode toggle. Test hunk approve/reject callbacks when provided.",
      "Create coding-ui/__tests__/components/timeline-entry.test.tsx: test rendering with different diff types (ADR, PRD, Excalidraw). Test that the colored dot matches the diff type. Test linked entries rendering.",
      "Create coding-ui/__tests__/components/integration-card.test.tsx: test connected vs disconnected states. Test that Configure and Test buttons trigger callbacks.",
      "Run all tests and verify they pass."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 6,
    "category": "testing",
    "description": "Write integration tests for SSE event streaming and API routes",
    "steps": [
      "Create coding-ui/__tests__/api/events-stream.test.ts: test that GET /api/events/stream returns Content-Type 'text/event-stream'. Test that emitting an event via sse-manager results in the event being received on the stream.",
      "Create coding-ui/__tests__/api/projects.test.ts: test GET /api/projects returns project list. Test POST /api/projects creates a project and returns it. Test validation: reject empty name, reject name with special characters, reject duplicate names.",
      "Create coding-ui/__tests__/api/integrations.test.ts: test CRUD operations on integrations. Test that token is never returned in GET responses. Test the test endpoint sends a message (mock external API).",
      "Create coding-ui/__tests__/hooks/use-event-stream.test.ts: test that the hook connects to SSE, receives events, and reconnects on disconnect. Mock EventSource for testing.",
      "Create coding-ui/__tests__/stores/agent-store.test.ts: test Zustand store actions — setActive, appendStream, addEvent, clear. Verify state transitions are correct.",
      "Run all integration tests and verify they pass."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 7,
    "category": "feature",
    "description": "Implement responsive mobile layout — hamburger menu, stacked layouts, bottom sheet overlays",
    "steps": [
      "Update TopBar: below md breakpoint, hide nav links and show a hamburger menu icon. Clicking it opens a sheet from top with nav links stacked vertically. ⌘K button becomes a search icon. Theme toggle and notification bell stay visible.",
      "Update Dashboard: project cards switch to single column (grid-cols-1) below md. Recent diffs list goes full width.",
      "Update Project Workspace: tabs become a horizontally scrollable row on mobile. Diff cards are full-width. When agent overlay is triggered on mobile, it becomes a full-screen sheet from bottom instead of a side panel.",
      "Update Timeline: entries go full width, the timeline dot-line sticks to the left edge. Filters collapse into a single 'Filter' button that opens a bottom sheet.",
      "Update Integrations: cards stack vertically (already likely the case). Delivery log allows horizontal scroll for the timestamp column.",
      "Update Agent Stream Overlay: on screens below md, use a full-screen vaul Drawer (bottom sheet) instead of the side panel. Same content, different container.",
      "Test at 375px, 768px, and 1280px widths. Verify no horizontal overflow, all interactive elements are tappable (min 44px touch target), and content is readable."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 7,
    "category": "feature",
    "description": "Implement accessibility requirements — keyboard navigation, focus management, ARIA labels, reduced motion, screen reader announcements",
    "steps": [
      "Add visible focus rings to all interactive elements: focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary. Apply globally via Tailwind's @layer base on button, a, input, select, [tabindex].",
      "Add ARIA labels to all icon-only buttons: theme toggle (aria-label='Toggle theme'), ⌘K button (aria-label='Open command palette'), notification bell (aria-label='Notifications, N unread'), hamburger menu (aria-label='Open navigation menu').",
      "Implement focus trapping in the Agent Stream Overlay and Config Sheet using the existing Radix dialog focus management (already provided by shadcn Sheet/Dialog).",
      "Add keyboard navigation to the timeline: Tab moves between entries, Enter/Space opens 'View Diff' link. Arrow keys navigate within the diff card list.",
      "Add @media (prefers-reduced-motion: reduce) styles: set all transition-duration to 0ms, animation-duration to 0ms, disable the agent-pulse animation. Add this as a Tailwind utility via the motion-reduce: prefix.",
      "Add @media (prefers-color-scheme: dark/light) detection: on first visit (no stored preference), use system preference. The next-themes provider already handles this with enableSystem.",
      "Add live region announcements: wrap the StatusStrip agent message in an aria-live='polite' region so screen readers announce agent status changes. Wrap the recent diffs section in an aria-live='polite' region (announce new diffs).",
      "Test with keyboard only (no mouse) — verify all pages are fully navigable. Test with VoiceOver on macOS."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 7,
    "category": "documentation",
    "description": "Create developer documentation — component API reference, design token reference, development setup guide",
    "steps": [
      "Create coding-ui/docs/SETUP.md: development setup guide — prerequisites (Node.js 20+, npm), install steps, environment variables (.env.local template), running dev server, running tests.",
      "Create coding-ui/docs/DESIGN-TOKENS.md: reference for all CSS custom properties — grouped by category (base colors, borders, text, accent, semantic, diff, stage, agent). Include dark and light values side by side. Include Tailwind utility mappings.",
      "Create coding-ui/docs/COMPONENTS.md: brief API reference for each mdiff component — props interface, usage example, notes on states and variants. Group by category (layout, diff, project, document, agent, a2ui, integrations, timeline).",
      "Create coding-ui/docs/ARCHITECTURE.md: overview of mdiff's frontend architecture — app shell structure, routing, state management (Zustand stores), real-time event flow (SSE), A2UI integration, integration dispatch flow.",
      "Update the top-level README or add a note pointing to coding-ui/docs/ for mdiff documentation."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  }
]
```

## Progress Tracking

- Total Tasks: 25
- Completed: 0
- In Progress: 0
- Not Started: 25

### Phase Breakdown

- **Phase 1 — Foundation** (Tasks 1-5): 0/5 completed — Design tokens, Tailwind config, layout metadata, TypeScript types, mock data
- **Phase 2 — Shell & Core Pages** (Tasks 6-10): 0/5 completed — App shell, command palette, dashboard, project workspace with diffs tab, diff viewer
- **Phase 3 — Secondary Pages & Features** (Tasks 11-15): 0/5 completed — Timeline page, integrations hub, docs tab, agent stream overlay, Excalidraw diagram tab
- **Phase 4 — Integration & Wiring** (Tasks 16-20): 0/5 completed — SSE infrastructure, real-time UI updates, Zustand stores, A2UI renderer, inline editing
- **Phase 5 — Security Review** (Task 21): 0/1 completed — Input validation, A2UI sanitization, credential protection, rate limiting
- **Phase 6 — API Routes & Testing** (Tasks 22-24): 0/3 completed — Project CRUD API, integrations API, component + integration tests
- **Phase 7 — Polish & Documentation** (Tasks 25-27): 0/3 completed — Responsive mobile layout, accessibility, developer documentation

## Implementation Notes

### Prerequisites
- Existing `coding-ui/` Next.js project with React 19, Tailwind CSS, shadcn/ui components
- Inter and JetBrains Mono fonts (already configured in layout.tsx)
- `next-themes` for dark/light theme toggling (already configured)
- shadcn/ui component library (button, card, dialog, sheet, tabs, command, skeleton, tooltip, etc. — already installed)
- Excalidraw monorepo available at `/Users/orhanors/Desktop/coding/excalidraw/`

### Key Decisions
- **No sidebar**: The entire navigation model shifts to top-nav + ⌘K command palette. The existing AppShell with sidebar will be replaced by MdiffShell.
- **Zustand for client state**: UI state (overlay, command palette, theme), agent state (streaming content, events), and entity caches (projects, diffs). Server data is fetched via API routes.
- **SSE for real-time**: Server-Sent Events for all real-time updates (diffs, agent streaming, integration delivery). No WebSocket needed for the current scope.
- **A2UI as data-only rendering**: Agent-generated UI goes through a strict component registry. No arbitrary code execution, no dangerouslySetInnerHTML in A2UI components.
- **File-system-backed storage (MVP)**: Projects and documents are stored as files on disk via API routes. No database required for Phase 1-3.

### Testing Strategy
- **Phase 6 testing**: Component tests with React Testing Library, API route tests with fetch + assertions, hook tests with mock EventSource
- **Manual testing**: Each phase should be manually verified in the browser at desktop (1280px+), tablet (768px), and mobile (375px) widths
- **Accessibility testing**: Keyboard-only navigation test, VoiceOver test on macOS after Phase 7

### Deployment Considerations
- The app runs as a standard Next.js application — `npm run build && npm start`
- Environment variables for integration tokens (TELEGRAM_BOT_TOKEN, DISCORD_WEBHOOK_URL, SLACK_WEBHOOK_URL) should be in .env.local
- SSE connections may need Keep-Alive configuration behind reverse proxies
- Excalidraw is a large client-side dependency — ensure it's code-split and lazy-loaded

### Risk Assessment
- **Excalidraw bundle size**: The Excalidraw library is large (~2MB). Must be lazy-loaded with next/dynamic ssr: false to avoid SSR issues and reduce initial bundle.
- **A2UI maturity**: Google A2UI is a new standard. The renderer implementation should be decoupled enough that changes to the A2UI spec require only registry updates, not component rewrites.
- **SSE connection limits**: Browsers limit SSE connections per domain (~6). If the user has multiple tabs, connections may be exhausted. Consider SharedWorker or BroadcastChannel for sharing a single SSE connection.
- **Three messaging platforms**: Each platform (Telegram, Discord, Slack) has different API conventions, rate limits, and authentication mechanisms. Abstracting via a dispatcher pattern reduces per-platform complexity.

## References
- [ADR-0002: mdiff UI Specifications](../architecture/0002-mdiff-ui-specifications.md)
- [Google A2UI Repository](https://github.com/google/A2UI/)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Excalidraw Package](https://www.npmjs.com/package/@excalidraw/excalidraw)
