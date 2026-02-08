# PRD-0001: SPEC Platform UI

**Source ADR:** [ADR-0001](../architecture/0001-spec-platform-ui-specifications.md)
**Status:** Not Started
**Created:** 2026-02-08

## Overview

The SPEC Platform is an architecture-first agentic development platform that drives SPEC-driven development through the pipeline: **create-adr → update Excalidraw architecture → create-prd-from-adr → implement-prd**. This PRD covers building the complete web UI — a Next.js 16 application with a Studio/Professional dark-first aesthetic, real-time event streaming (SSE), embedded Excalidraw diagrams, Vercel AI SDK 6 for AI-powered streaming panels, and multi-platform event delivery to Discord, Telegram, and Slack.

The UI consists of 5 pages: Dashboard, Pipeline View, Document Explorer, Integrations Hub, and Architecture History. The platform uses a dense/pro layout with a collapsible sidebar, top bar, and status bar. All pipeline events are streamed in real-time via Server-Sent Events to the web UI and forwarded to configured external integrations via webhooks.

The tech stack is: **Next.js 16 (App Router)**, **Tailwind CSS 4**, **Zustand** (state management), **Vercel AI SDK 6** (`ai` package with `@ai-sdk/anthropic`), **@excalidraw/excalidraw** (embedded from the existing monorepo), and **TypeScript 5.9+**.

## Implementation Tasks

The tasks below are organized by phase and priority. Each phase builds on the previous one. Tasks within the same phase can be worked on in parallel.

```json
[
  {
    "phase": 1,
    "category": "setup",
    "description": "Scaffold Next.js 16 application with Tailwind CSS 4 and core dependencies",
    "steps": [
      "Create the spec-platform/ directory at the project root: /Users/orhanors/Desktop/coding/spec-platform/",
      "Initialize Next.js 16 app with App Router: npx create-next-app@latest spec-platform --ts --tailwind --app --src-dir=false --import-alias='@/*' --use-npm",
      "Install core dependencies: npm install zustand ai @ai-sdk/anthropic @ai-sdk/openai react-markdown remark-gfm remark-math rehype-highlight rehype-katex",
      "Install dev dependencies: npm install -D @types/node @types/react @types/react-dom",
      "Configure tailwind.config.ts: extend theme with all CSS custom properties from ADR (--bg-primary, --accent-primary, --pipeline-adr, etc.), add custom font families (Inter, JetBrains Mono), breakpoints (sm:640, md:768, lg:1024, xl:1280, 2xl:1536)",
      "Create app/globals.css with full dark and light theme CSS custom properties from ADR — both :root[data-theme='dark'] and :root[data-theme='light'] blocks, typography scale, and Tailwind directives",
      "Configure next.config.ts: set transpilePackages: ['@excalidraw/excalidraw'] for monorepo Excalidraw embedding, enable serverExternalPackages for Node-only modules",
      "Create tsconfig.json path aliases: '@/*' → './*' for clean imports",
      "Verify build compiles: npm run build should complete without errors"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Set up shared TypeScript types, event type definitions, and constants",
    "steps": [
      "Create lib/types/events.ts with PipelineEventType union type (all 20 event types from ADR: 'pipeline:start', 'pipeline:pause', etc.), PipelineEvent interface (id, timestamp, stage, type, message, metadata), PipelineStage type ('adr' | 'excalidraw' | 'prd' | 'implement' | 'system')",
      "Create lib/types/documents.ts with DocumentNode interface (id, name, type, status, children, lastModified), DocumentChange interface (id, timestamp, description, linesAdded, linesRemoved, author, pipelineRunId)",
      "Create lib/types/pipeline.ts with PipelineStep interface (id, name, status, duration, output), PipelineRun interface (id, steps, startedAt, completedAt, status)",
      "Create lib/types/integrations.ts with Integration interface (id, platform, status, channelName, webhookUrl, lastDelivery, subscriptions), DeliveryLogEntry interface (id, timestamp, platform, httpStatus, eventType, message, retryCount)",
      "Create lib/constants.ts with PIPELINE_STAGE_COLORS mapping (adr: '#a78bfa', excalidraw: '#fb923c', prd: '#22d3ee', implement: '#34d399'), EVENT_TYPE_LABELS, and NAV_ITEMS array",
      "Create lib/types/index.ts barrel export for all type modules"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Create Zustand stores for global state management",
    "steps": [
      "Create stores/ui-store.ts: useUIStore with state: sidebarCollapsed (boolean, default false), theme ('dark' | 'light', default 'dark'), commandPaletteOpen (boolean), and actions: toggleSidebar(), setTheme(), toggleCommandPalette(). Persist theme to localStorage.",
      "Create stores/event-store.ts: useEventStore with state: events (PipelineEvent[]), streaming (boolean), and actions: addEvent(), clearEvents(), setStreaming(). Limit events array to 500 entries (FIFO).",
      "Create stores/pipeline-store.ts: usePipelineStore with state: currentRun (PipelineRun | null), runs (PipelineRun[]), and actions: startRun(), updateStep(), completeRun(), failRun(), pauseRun(), resumeRun().",
      "Create stores/document-store.ts: useDocumentStore with state: documents (DocumentNode[]), selectedId (string | null), and actions: setDocuments(), selectDocument(), updateDocument().",
      "Verify all stores export correctly with named exports and proper TypeScript types"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the app shell layout: root layout, top bar, collapsible sidebar, and status bar",
    "steps": [
      "Create app/layout.tsx as root layout: import globals.css, wrap children with ThemeProvider (reads from useUIStore, sets data-theme attribute on <html>), render TopBar + Sidebar + main content + StatusBar in the shell grid layout from ADR",
      "Create components/layout/top-bar.tsx: fixed 48px height, contains: SPEC Platform logo (left), pipeline selector dropdown (center-left), search trigger button showing '⌘K' (center), theme toggle button (right), settings icon (right). Use flexbox with items-center justify-between.",
      "Create components/layout/sidebar.tsx: 240px width (56px when collapsed), contains 3 sections: (1) NavLinks at top — Dashboard, Pipeline, Documents, Integrations, History with icons and labels (labels hidden when collapsed), (2) DocumentTree placeholder in middle (scrollable), (3) mini EventFeed at bottom (last 5 events). Animate width transition with CSS transition (0.2s cubic-bezier).",
      "Create components/layout/status-bar.tsx: fixed 28px height at bottom, shows: pipeline status indicator (colored dot + text), event counter, integration connection dots, app version. Use flexbox with gap-4.",
      "Create components/shared/theme-toggle.tsx: button that toggles useUIStore theme between 'dark' and 'light', renders sun/moon icon accordingly",
      "Wire sidebar collapse toggle: clicking the collapse button in sidebar calls useUIStore.toggleSidebar(), sidebar reads sidebarCollapsed from store",
      "Test shell renders correctly at all breakpoints: verify sidebar collapses to icons on tablet (<1024px), converts to drawer overlay on mobile (<768px)"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build shared UI components: MetricCard, Badge, Button, Input, Modal, Skeleton, Tooltip",
    "steps": [
      "Create components/shared/button.tsx: variants — 'primary' (accent bg), 'secondary' (border only), 'ghost' (no border), 'danger' (error color). Sizes: 'sm', 'md', 'lg'. Props extend React.ButtonHTMLAttributes. Include focus ring styling (2px solid var(--accent-primary) outline with 2px offset).",
      "Create components/shared/metric-card.tsx: implements MetricCardProps from ADR. Renders value large (text-2xl font-bold), label below (text-sm text-secondary), optional delta badge (green up arrow or red down arrow), optional icon top-right. Background var(--bg-secondary) with border.",
      "Create components/shared/badge.tsx: variants — 'default', 'success', 'warning', 'error', 'info', 'adr', 'prd', 'excalidraw', 'implement'. Each maps to the appropriate semantic/pipeline color. Renders as inline-flex rounded-full px-2 py-0.5 text-xs.",
      "Create components/shared/modal.tsx: dialog overlay with backdrop (bg-black/50), modal card (bg-tertiary rounded-lg), close button, focus trap. Animate with scale 0.95→1.0 on open. Accept title, children, onClose props.",
      "Create components/shared/skeleton.tsx: pulsing placeholder with bg-surface and animate-pulse. Variants: 'line' (h-4 rounded), 'card' (h-32 rounded-lg), 'circle' (rounded-full). Accept className for custom sizing.",
      "Create components/shared/input.tsx: styled text input with bg-surface, border-default, focus:border-accent-primary. Include label prop, error state, and optional icon left/right.",
      "Create components/shared/tooltip.tsx: simple CSS tooltip using ::after pseudo-element on hover. Accept content (string) and position ('top' | 'bottom' | 'left' | 'right')."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the EventFeed component with real-time event rendering",
    "steps": [
      "Create components/shared/event-feed.tsx: implements EventFeedProps from ADR. Renders a scrollable list of PipelineEvent entries, each showing: timestamp (text-xs text-muted, formatted HH:mm:ss), stage badge (colored by PIPELINE_STAGE_COLORS), event type icon (checkmark for completed, spinner for running, X for failed), message text.",
      "New events should animate in from top: use CSS animation (translateY(-8px) + opacity 0 → translateY(0) + opacity 1, 0.15s ease-out).",
      "Auto-scroll to newest event when streaming is true. Use a useRef on the container and scrollTo({ top: 0, behavior: 'smooth' }) when events array changes.",
      "Support maxHeight prop to constrain the feed height with overflow-y-auto.",
      "Include empty state: when events array is empty, show muted text 'No events yet'.",
      "Support onEventClick callback — clicking an event calls the handler with the PipelineEvent object."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the PipelineProgress component with step visualization",
    "steps": [
      "Create components/pipeline/pipeline-steps.tsx: implements PipelineProgressProps from ADR. Renders 4 steps horizontally (ADR, Excalidraw, PRD, Implement) connected by arrow lines.",
      "Each step renders as a card (bg-secondary, border, rounded-lg, p-3): step name (text-sm font-medium), status badge below (pending=muted, running=accent with pulse animation, completed=success with checkmark, failed=error with X icon), optional duration below status (text-xs text-muted, formatted as m:ss).",
      "Connector lines between steps: use a horizontal line (h-0.5) with gradient from the left step's status color to the right step's status color. Completed connectors are solid, pending connectors are dashed.",
      "Running step should have a subtle glow effect: box-shadow with accent-primary at 0.15 opacity, pulsing with CSS animation (0.3s ease-out).",
      "Clicking a step calls onStepClick with the PipelineStep object (if provided).",
      "Responsive: on mobile (<768px), switch to vertical layout — steps stacked vertically with vertical connector lines."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the Dashboard page with metric cards, pipeline progress, changelog, and event feed",
    "steps": [
      "Create app/page.tsx (Dashboard): server component that reads ADR/PRD/log file counts from the filesystem (architecture/, architecture-prd/, architecture-prd-logs/ directories) and passes as props to client components.",
      "Dashboard layout: top row — 4 MetricCards in a grid (grid-cols-4 on desktop, grid-cols-2 on tablet, grid-cols-1 on mobile): ADR count, PRD count, PRD Log count, Integration status.",
      "Middle section: PipelineProgress component showing current pipeline run from usePipelineStore (or placeholder if no active run).",
      "Bottom section: two-column layout (lg:grid-cols-2). Left column — ChangeLog component showing recent document modifications (read from document store). Right column — EventFeed component showing live events from useEventStore.",
      "Create the 'Run Pipeline' button in the top-right of the dashboard header. Clicking it navigates to /pipeline with a query param to start a new run.",
      "Empty state: when no ADRs exist, show a full-width onboarding card with heading 'Start your first pipeline', description text, and a primary CTA button linking to /pipeline.",
      "Add loading state using Skeleton components for the metric cards and content areas."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the SSE event streaming infrastructure — server endpoint and client hook",
    "steps": [
      "Create lib/events/event-emitter.ts: server-side singleton EventEmitter class using Node.js EventEmitter. Methods: emit(event: PipelineEvent), subscribe(callback), unsubscribe(callback). Store subscribers in a Set. Export getEventEmitter() singleton accessor.",
      "Create lib/events/sse-manager.ts: manages active SSE connections. Tracks connected ReadableStreamControllers in a Set. Methods: addConnection(controller), removeConnection(controller), broadcast(event: PipelineEvent) which serializes the event as SSE data and writes to all controllers. Handle cleanup when controller closes.",
      "Create app/api/events/stream/route.ts: GET endpoint that returns a ReadableStream with SSE headers (Content-Type: text/event-stream, Cache-Control: no-cache, Connection: keep-alive). Register the stream controller with SSEManager. On close, unregister. Send a heartbeat comment every 30 seconds to keep the connection alive.",
      "Create hooks/use-event-stream.ts: custom hook that opens an EventSource to /api/events/stream. On message, parse JSON and call useEventStore.addEvent(). Handle reconnection on error (EventSource auto-reconnects). Clean up on unmount. Return { connected: boolean, error: string | null }.",
      "Wire the useEventStream hook into the root layout (app/layout.tsx) so SSE connection is established app-wide on mount.",
      "Test by creating a temporary POST endpoint /api/events/test that emits a test event through the EventEmitter and verify it arrives in the client EventFeed."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the AI streaming infrastructure with Vercel AI SDK 6",
    "steps": [
      "Install/verify AI SDK packages: npm install ai @ai-sdk/anthropic — ensure ai is version 6.x (latest).",
      "Create lib/ai/providers.ts: configure Anthropic provider using createAnthropic() from @ai-sdk/anthropic. Read ANTHROPIC_API_KEY from process.env. Export a default model helper: getModel(modelId?: string) that defaults to 'claude-sonnet-4-5-20250929'. Support override to 'claude-opus-4-6' for complex tasks.",
      "Create app/api/chat/route.ts: POST endpoint using Vercel AI SDK 6 streamText(). Accept messages array from request body. Use the configured Anthropic provider. Return result.toDataStreamResponse(). Include system prompt for SPEC-driven development context.",
      "Create app/api/pipeline/stream/route.ts: POST endpoint for pipeline-specific AI streaming. Accept { adrContent, step } in body. Use streamText() with step-specific system prompts (different prompt for PRD generation vs implementation). Emit pipeline events through EventEmitter as the stream progresses.",
      "Create components/ai/ai-stream-panel.tsx: client component using useChat() from 'ai/react'. Props: chatId, api endpoint URL, showToolCalls boolean, maxHeight. Render messages with react-markdown (remark-gfm, rehype-highlight for code blocks). Show blinking cursor (▍) during streaming. Auto-scroll to bottom on new content.",
      "Create components/ai/tool-call-card.tsx: renders AI tool calls as collapsible cards. Show tool name, arguments (syntax-highlighted JSON), and result. Collapsed by default, expandable on click."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the Pipeline View page with step visualization, AI streaming, and event log",
    "steps": [
      "Create app/pipeline/page.tsx: client component with three-section layout. Top: PipelineSteps component. Middle: split pane (AI stream left, Excalidraw preview right). Bottom: PipelineEventLog.",
      "Create components/pipeline/pipeline-controls.tsx: action bar with Pause, Stop, Retry buttons. Wire to usePipelineStore actions. Pause button toggles to Resume when paused. Buttons are disabled when no pipeline is running.",
      "Create components/pipeline/pipeline-event-log.tsx: specialized EventFeed filtered to show only events from the current pipeline run. Each entry is color-coded by stage. Show timestamp, stage tag, status icon, and message. Newest at top.",
      "Implement the split pane layout: use CSS grid with grid-cols-2 by default. On large desktop (>1536px), switch to grid-cols-3 (steps become a left column). On mobile (<768px), stack vertically.",
      "Empty state: when no pipeline is running, show centered card with 'Start a new pipeline' heading, a text input for describing the ADR topic, and a 'Start Pipeline' primary button.",
      "Wire the Start Pipeline button: on click, POST to /api/pipeline/start with the ADR description. Update usePipelineStore with a new run. The server endpoint should emit 'pipeline:start' through EventEmitter.",
      "Running state: PipelineSteps shows animated progress, AIStreamPanel connects to /api/pipeline/stream and displays streaming AI output, PipelineEventLog populates from SSE events filtered by current run ID."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the Document Explorer page with file tree, markdown viewer, and search",
    "steps": [
      "Create app/documents/page.tsx: two-column layout. Left: DocumentTree (280px fixed width). Right: document viewer area (flex-1). Use resizable split pane.",
      "Create components/documents/document-tree.tsx: collapsible tree showing 3 root folders — 'architecture/' (ADRs), 'architecture-prd/' (PRDs), 'architecture-prd-logs/' (Logs). Each folder expands to show its files. Files show: status dot (colored by document status), filename (truncated with ellipsis), last modified time (text-xs text-muted).",
      "Create app/api/documents/route.ts: GET endpoint that reads the filesystem (architecture/, architecture-prd/, architecture-prd-logs/ directories), lists all .md files, returns DocumentNode[] with file metadata (name, type, lastModified from fs.stat).",
      "Create app/api/documents/[id]/route.ts: GET endpoint that reads a specific document by path-encoded ID. Returns { content: string, metadata: DocumentNode }. POST endpoint to save updated content (write file back to disk).",
      "Create components/documents/markdown-viewer.tsx: renders markdown content using react-markdown with remark-gfm and rehype-highlight. Style code blocks with bg-surface and font-mono. Add copy button on code blocks. Support syntax highlighting for common languages (typescript, json, css, bash).",
      "Create components/documents/document-search.tsx: search input at top of file tree. On typing, filter the document tree to show only matching filenames. Debounce input by 200ms.",
      "Clicking a file in DocumentTree navigates to /documents/[id] (using router.push) and loads the document content in the viewer."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Embed Excalidraw component for architecture diagram visualization",
    "steps": [
      "Install @excalidraw/excalidraw from the existing monorepo. In spec-platform/package.json, add: '@excalidraw/excalidraw': 'file:../excalidraw/packages/excalidraw'. Run npm install.",
      "Create components/excalidraw/excalidraw-preview.tsx: dynamic import of Excalidraw with { ssr: false } (Excalidraw uses browser APIs). Wrap in a client component. Props: sceneData (ExcalidrawScene), readOnly (boolean), autoFit (boolean), showControls (boolean), onUpdate callback.",
      "Import Excalidraw CSS: import '@excalidraw/excalidraw/index.css' in the component.",
      "Configure read-only mode for Pipeline View: pass viewModeEnabled={true} to disable editing. Handle the onChange callback to emit scene updates when in editable mode.",
      "Add loading state: show Skeleton with shimmer effect while Excalidraw lazy-loads.",
      "Handle theme integration: pass the current theme from useUIStore to Excalidraw's theme prop ('dark' | 'light').",
      "Create app/api/excalidraw/route.ts: GET endpoint that reads the current architecture diagram file (e.g., architecture/diagrams/current.excalidraw or a default empty scene). POST to save scene updates. Store as JSON file on disk."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "feature",
    "description": "Build inline document editing with save and version tracking",
    "steps": [
      "Create components/documents/inline-editor.tsx: textarea-based markdown editor that replaces the MarkdownViewer when editing is activated. Split layout: editor on left (monospace font, line numbers via CSS counter), live preview on right using MarkdownViewer.",
      "Add Edit button to the document viewer header (pencil icon). Clicking toggles between view and edit mode. Cancel button discards changes. Save button POSTs to /api/documents/[id].",
      "On save: before writing the file, read the current content and compute a diff (added/removed line counts). Create a DocumentChange entry and append to the document's change history.",
      "Create lib/documents/differ.ts: function computeDiff(oldContent: string, newContent: string) that returns { linesAdded: number, linesRemoved: number, hunks: DiffHunk[] }. Use a simple line-by-line comparison algorithm (or import 'diff' npm package).",
      "Create app/api/documents/[id]/history/route.ts: GET endpoint that returns the change history for a document. Store history as a JSON file alongside the document (e.g., architecture/.history/0001-spec-platform-ui-specifications.history.json).",
      "Emit 'document:saved' event through EventEmitter when a document is saved, so connected clients and integrations receive the update."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "feature",
    "description": "Build git-style change history and diff viewer for documents",
    "steps": [
      "Create components/documents/change-history.tsx: vertical timeline below the document viewer. Each entry shows: timestamp, description, '+N -M lines' badge (green/red), author, and optional pipeline run link. Clicking an entry loads that version in the viewer.",
      "Create components/documents/diff-viewer.tsx: implements DiffViewerProps from ADR. Two modes: 'unified' (single column, added lines green bg, removed lines red bg) and 'side-by-side' (two columns). Toggle between modes with a button.",
      "Install diff package: npm install diff @types/diff. Use Diff.diffLines() in lib/documents/differ.ts to compute structured diffs.",
      "Store document versions: on each save, copy the previous content to a versioned file (e.g., architecture/.versions/0001-spec-platform-ui-specifications/v2.md). Keep a manifest.json mapping version numbers to timestamps and metadata.",
      "Wire the 'History' button in document viewer: clicking opens the ChangeHistory panel below the document. Clicking a version entry shows the DiffViewer comparing that version to the current version.",
      "Wire the 'Diff' button: opens DiffViewer in a modal or inline panel, comparing two selected versions."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "feature",
    "description": "Build the Architecture History page with timeline, filters, and stats",
    "steps": [
      "Create app/history/page.tsx: full-width timeline layout with filter bar at top and stats bar at bottom.",
      "Create components/history/history-timeline.tsx: vertical timeline grouped by date (Today, Yesterday, date headers). Each group contains ChangeEntry components. Use infinite scroll — load 20 entries at a time, fetch more on scroll.",
      "Create components/history/change-entry.tsx: renders a single history entry. Shows: colored dot (by document type — ADR violet, PRD cyan, Log green), timestamp, title (e.g., 'ADR-0012 Created'), description, diff summary (+N -M lines), related items (e.g., '→ PRD-0012 generated'), and a 'View Diff' button.",
      "Create components/history/history-filter.tsx: filter bar with: document type multi-select (ADR, PRD, Log), date range picker (Today, This Week, This Month, Custom), status filter (Proposed, Accepted, Deprecated), pipeline run filter. Show active filters as removable chips below the filter bar.",
      "Create components/history/history-stats.tsx: bottom bar showing aggregate stats: total changes, ADR count, PRD count, log count, active pipeline count.",
      "Create app/api/history/route.ts: GET endpoint that aggregates all change history from all documents, sorts by timestamp descending, and supports query params for filtering (type, dateRange, status). Pagination via cursor-based params."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "feature",
    "description": "Build the Command Palette (Cmd+K) with navigation and pipeline commands",
    "steps": [
      "Create components/layout/command-palette.tsx: modal overlay triggered by ⌘K (or Ctrl+K on Windows/Linux). Search input at top, command list below. Filter commands as user types. Navigate with arrow keys, select with Enter, close with Escape.",
      "Create hooks/use-command-palette.ts: manages command palette state and command registry. Default commands: Navigate to Dashboard, Navigate to Pipeline, Navigate to Documents, Navigate to Integrations, Navigate to History, Start Pipeline, Toggle Theme, Toggle Sidebar.",
      "Create hooks/use-keyboard-shortcuts.ts: global keyboard event listener. Register shortcuts: ⌘K (command palette), ⌘B (toggle sidebar), ⌘/ (keyboard shortcut overlay), ? (show help). Use useEffect with keydown listener, check for meta/ctrl key combos.",
      "Style the command palette: bg-tertiary backdrop, search input with auto-focus, command items with icon + label + shortcut badge (right-aligned, text-xs text-muted bg-surface px-1.5 rounded). Highlight matched characters in command labels.",
      "Add recent commands section: track last 5 used commands in localStorage, show at top of command list when search is empty.",
      "Focus trap: when command palette is open, tab key cycles through the command list. Clicking outside closes it."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 5,
    "category": "feature",
    "description": "Build the Integrations Hub page with connection cards and event subscription matrix",
    "steps": [
      "Create app/integrations/page.tsx: three sections — integration cards (top), event subscription matrix (middle), delivery log (bottom).",
      "Create components/integrations/integration-card.tsx: card for each platform (Discord, Telegram, Slack). Shows: platform icon/logo, connection status dot (green=connected, red=error, gray=disconnected), channel name (if connected), last delivery time, Configure button, Test button (sends a test webhook), Disconnect button (with confirmation).",
      "Create components/integrations/integration-config-modal.tsx: modal for configuring an integration. Discord: webhook URL input. Telegram: bot token + chat ID inputs. Slack: webhook URL input. Each has a 'Test Connection' button that POSTs to the platform's API and shows success/error inline.",
      "Create components/integrations/event-subscription-matrix.tsx: table with event types as rows and integrations as columns. Each cell is a checkbox. Toggling a checkbox enables/disables that event type for that integration. Disabled checkboxes for disconnected integrations.",
      "Create components/integrations/delivery-log.tsx: table showing recent webhook deliveries. Columns: timestamp, platform icon, HTTP status badge (green 2xx, red 4xx/5xx), event message, retry indicator. Failed deliveries show a retry button.",
      "Create app/api/integrations/route.ts: GET (list all integrations), POST (create new integration). Store integrations in a JSON file: spec-platform/data/integrations.json.",
      "Create app/api/integrations/[id]/route.ts: GET (single integration), PUT (update config/subscriptions), DELETE (remove integration)."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 5,
    "category": "feature",
    "description": "Build webhook delivery system for Discord, Telegram, and Slack",
    "steps": [
      "Create lib/integrations/discord.ts: Discord webhook client. Function sendDiscordWebhook(webhookUrl: string, event: PipelineEvent): POST to Discord webhook URL with formatted embed (title, description, color based on event stage, timestamp footer). Handle rate limiting (429 response) with exponential backoff.",
      "Create lib/integrations/telegram.ts: Telegram bot API client. Function sendTelegramMessage(botToken: string, chatId: string, event: PipelineEvent): POST to https://api.telegram.org/bot{token}/sendMessage with formatted HTML message. Handle API errors.",
      "Create lib/integrations/slack.ts: Slack webhook client. Function sendSlackWebhook(webhookUrl: string, event: PipelineEvent): POST to Slack webhook URL with Block Kit formatted message (section blocks with mrkdwn). Handle errors.",
      "Create lib/integrations/dispatcher.ts: EventDispatcher class. On pipeline event: (1) look up all integrations from integrations.json, (2) for each integration where the event type is in its subscriptions, (3) call the appropriate platform client, (4) log the delivery result (status, timestamp) to delivery-log.json, (5) on failure, schedule retry (max 3 retries with exponential backoff: 30s, 60s, 120s).",
      "Wire EventDispatcher to the EventEmitter: in the SSE manager or a startup hook, subscribe EventDispatcher.dispatch() to all events from the EventEmitter.",
      "Create app/api/integrations/webhook/route.ts: POST endpoint for manually testing a webhook delivery. Accept integrationId and a test event payload."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 5,
    "category": "feature",
    "description": "Build the Pipeline orchestrator — server-side pipeline runner that executes ADR → Excalidraw → PRD → Implement",
    "steps": [
      "Create lib/pipeline/runner.ts: PipelineRunner class. Methods: start(description: string), pause(), resume(), stop(), retry(stepId: string). The runner executes steps sequentially: (1) Create ADR, (2) Update Excalidraw, (3) Generate PRD, (4) Begin implementation. Each step emits events through EventEmitter.",
      "Create lib/pipeline/steps.ts: define each pipeline step as an async function. Step 1 (createADR): use AI SDK streamText() with a system prompt to generate an ADR from the user's description, write to architecture/ directory, emit 'adr:created'. Step 2 (updateExcalidraw): use AI to analyze the ADR and generate Excalidraw scene elements, update the diagram file, emit 'excalidraw:updated'. Step 3 (generatePRD): use AI SDK streamText() to generate a PRD from the ADR, write to architecture-prd/, emit 'prd:generating', 'prd:streaming', 'prd:completed'. Step 4 (implement): placeholder that emits 'implement:task:start' events.",
      "Create lib/pipeline/store.ts: in-memory store for pipeline run state. Track current run, step statuses, timing. Persist completed runs to spec-platform/data/pipeline-runs.json.",
      "Create app/api/pipeline/start/route.ts: POST endpoint that creates a new PipelineRunner, starts the pipeline with the provided description, and returns the run ID. The runner executes asynchronously — events are streamed via SSE.",
      "Create app/api/pipeline/[id]/route.ts: GET (pipeline run status), POST with action body (pause, resume, stop, retry). Delegates to PipelineRunner methods.",
      "Handle errors in each step: catch errors, emit 'pipeline:fail' with error details, set step status to 'failed'. Allow retry of individual failed steps."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 6,
    "category": "feature",
    "description": "Build fully responsive mobile layout with bottom sheet navigation and stacked panes",
    "steps": [
      "Create components/layout/mobile-nav.tsx: bottom sheet drawer for mobile navigation (<768px). Triggered by hamburger icon in top bar. Slides up from bottom with backdrop. Contains: nav links, document tree (scrollable), close button. Use CSS transform translateY for animation.",
      "Update top-bar.tsx: on mobile, replace sidebar toggle with hamburger menu icon that opens MobileNav. Hide search text (show icon only), collapse user actions into overflow menu (three dots).",
      "Update app/page.tsx (Dashboard): on mobile, MetricCards use grid-cols-1, pipeline progress switches to vertical stepper (PipelineSteps already handles this), ChangeLog and EventFeed stack vertically.",
      "Update app/pipeline/page.tsx: on mobile, split pane stacks vertically — AI stream panel on top (full width), Excalidraw preview below (full width, reduced height). Pipeline steps become vertical.",
      "Update app/documents/page.tsx: on mobile, DocumentTree becomes a full-screen drawer (slides in from left). When a document is selected, tree closes and viewer takes full width. Add a back button to return to tree.",
      "Update app/integrations/page.tsx: integration cards stack vertically (grid-cols-1). Event subscription matrix becomes horizontally scrollable (overflow-x-auto).",
      "Update status-bar.tsx: on mobile, show only pipeline status dot and event count number (hide text labels).",
      "Test all pages at 375px, 640px, 768px, 1024px, 1280px, and 1536px+ widths."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 6,
    "category": "feature",
    "description": "Implement drag-and-drop for document reordering and micro-animations",
    "steps": [
      "Install drag-and-drop library: npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities.",
      "Update components/documents/document-tree.tsx: wrap tree items with SortableContext from @dnd-kit/sortable. Enable drag handle on each tree item. On drag end, update document order in useDocumentStore. Dragged item lifts with shadow (box-shadow: 0 8px 24px rgba(0,0,0,0.3)), drop target highlights with accent-muted background.",
      "Add micro-animations using CSS transitions throughout: sidebar collapse (0.2s cubic-bezier), metric card number count-up (0.4s using CSS counters or requestAnimationFrame), document tree expand/collapse (chevron rotate 0.15s, children slide down 0.05s stagger).",
      "Add page transition animation: content area cross-fades on route change (0.15s ease). Use Next.js layout transitions or a simple CSS opacity transition on the main content wrapper.",
      "Support prefers-reduced-motion: wrap all animations in @media (prefers-reduced-motion: no-preference). When reduced motion is preferred, all transitions happen instantly.",
      "Add loading shimmer animations for skeleton components: linear gradient sweep (1.5s infinite) from bg-surface through bg-hover and back."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 7,
    "category": "security",
    "description": "Audit and validate all user inputs, API endpoints, and webhook configurations",
    "steps": [
      "Audit /api/documents/[id] endpoint: validate the id parameter to prevent path traversal attacks. Ensure the resolved file path stays within the allowed directories (architecture/, architecture-prd/, architecture-prd-logs/). Reject paths containing '..', absolute paths, or paths outside the allowed roots. Use path.resolve() and verify the result starts with the expected base directory.",
      "Audit /api/pipeline/start endpoint: validate and sanitize the description input. Enforce max length (5000 chars). Strip any HTML/script tags. Validate that it's a non-empty string.",
      "Audit /api/integrations endpoint: validate webhook URLs — must be valid HTTPS URLs. For Discord, verify it matches the Discord webhook URL pattern (https://discord.com/api/webhooks/...). For Slack, verify Slack webhook pattern (https://hooks.slack.com/services/...). For Telegram, validate bot token format and chat ID.",
      "Audit /api/chat endpoint: validate messages array structure. Each message must have role ('user' | 'assistant' | 'system') and content (string, max 50000 chars). Limit array length to 100 messages.",
      "Secrets management: ensure ANTHROPIC_API_KEY is only read from process.env, never logged or returned in API responses. Add ANTHROPIC_API_KEY to .env.example with a placeholder. Create .gitignore entry for .env* files.",
      "Rate limiting: add basic rate limiting to /api/pipeline/start (max 5 pipeline starts per minute), /api/chat (max 30 requests per minute), and /api/integrations/webhook (max 10 tests per minute). Use a simple in-memory Map<IP, timestamps[]> approach.",
      "CORS configuration: in next.config.ts, ensure API routes only accept requests from the same origin. Add appropriate Content-Security-Policy headers."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 7,
    "category": "security",
    "description": "Audit webhook delivery, SSE connections, and data privacy",
    "steps": [
      "Audit webhook delivery: ensure webhook URLs are not sent to the client in API responses (only the platform name and connection status). Telegram bot tokens must be stored encrypted or at minimum never returned in GET responses.",
      "Audit SSE endpoint: validate that SSE connections cannot be abused for DDoS. Limit max concurrent SSE connections to 50. Implement connection timeout after 30 minutes of inactivity (no events). Send heartbeat pings every 30 seconds.",
      "Audit EventDispatcher retry logic: ensure retry backoff has a maximum (3 retries, max wait 120s). Failed webhook deliveries should not leak sensitive data — only send event type and timestamp in error logs, not full event payload.",
      "Audit document write operations: ensure that the inline editor cannot write to files outside the allowed directories. Validate file content is valid UTF-8 markdown. Limit file size to 1MB.",
      "Review error messages: ensure no stack traces, file paths, or internal details are returned to the client in production. Use generic error messages in API responses. Log detailed errors server-side only.",
      "Dependency audit: run npm audit and fix any known vulnerabilities. Pin all dependency versions in package.json (use exact versions, not ranges)."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 8,
    "category": "testing",
    "description": "Unit tests for core libraries: event system, document differ, pipeline runner, integration clients",
    "steps": [
      "Install test dependencies: npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom",
      "Configure vitest.config.ts: environment jsdom, globals true, setupFiles pointing to a test setup file that imports @testing-library/jest-dom",
      "Test lib/events/event-emitter.ts: verify emit() notifies all subscribers, subscribe/unsubscribe works correctly, events have correct shape",
      "Test lib/documents/differ.ts: verify computeDiff() correctly counts added/removed lines for various scenarios (pure addition, pure deletion, mixed changes, no changes, empty files)",
      "Test lib/pipeline/runner.ts: mock AI SDK calls, verify pipeline runs through all 4 steps in order, verify pause/resume/stop works, verify error handling emits 'pipeline:fail'",
      "Test lib/integrations/discord.ts, telegram.ts, slack.ts: mock fetch calls, verify correct API payloads are constructed for each platform, verify error handling for 4xx/5xx responses, verify rate limiting backoff",
      "Test lib/integrations/dispatcher.ts: mock all platform clients, verify events are dispatched only to integrations with matching subscriptions, verify retry logic (3 attempts with exponential backoff)",
      "Test lib/events/sse-manager.ts: verify broadcast sends to all connected controllers, verify cleanup on disconnect, verify heartbeat timing"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 8,
    "category": "testing",
    "description": "Component tests for shared UI components and page-level components",
    "steps": [
      "Test components/shared/event-feed.tsx: render with mock events, verify timestamps and messages display correctly, verify empty state, verify auto-scroll behavior, verify click handler fires",
      "Test components/pipeline/pipeline-steps.tsx: render with various step statuses (all pending, mixed, all completed, one failed), verify correct icons and colors, verify click handler, verify responsive vertical layout",
      "Test components/documents/document-tree.tsx: render with mock DocumentNode tree, verify expand/collapse, verify selection, verify status indicators, verify search filtering",
      "Test components/documents/markdown-viewer.tsx: render with various markdown content (headings, code blocks, lists, tables), verify syntax highlighting, verify code block copy button",
      "Test components/documents/diff-viewer.tsx: render with mock old/new content, verify unified and side-by-side modes, verify added/removed line highlighting",
      "Test components/integrations/integration-card.tsx: render for each platform in each status, verify buttons display/hide correctly, verify click handlers",
      "Test components/layout/command-palette.tsx: verify opens on ⌘K, verify search filtering, verify keyboard navigation (arrow keys, enter, escape), verify recent commands",
      "Test components/ai/ai-stream-panel.tsx: mock useChat, verify streaming message rendering, verify blinking cursor during loading, verify tool call card rendering"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 8,
    "category": "testing",
    "description": "Integration tests for API routes and end-to-end SSE streaming",
    "steps": [
      "Test app/api/events/stream: verify SSE connection opens, verify events are received when emitted, verify reconnection after disconnect, verify heartbeat pings",
      "Test app/api/documents/route.ts: create temp test files, verify GET lists them correctly, verify response shape matches DocumentNode[]",
      "Test app/api/documents/[id]/route.ts: verify GET returns file content, verify POST saves updated content, verify path traversal is blocked (../../../etc/passwd should return 400), verify 404 for nonexistent files",
      "Test app/api/documents/[id]/history/route.ts: save a document multiple times, verify history accumulates correctly, verify diff line counts are accurate",
      "Test app/api/pipeline/start/route.ts: verify POST creates a pipeline run, verify events are emitted, verify rate limiting kicks in after 5 requests",
      "Test app/api/integrations/route.ts: CRUD lifecycle — create integration, read it back, update subscriptions, delete it. Verify validation (invalid webhook URLs rejected).",
      "Test app/api/chat/route.ts: mock Anthropic API, verify streaming response, verify message validation (reject messages without role/content)"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 9,
    "category": "feature",
    "description": "Build pipeline history — browse and replay past pipeline runs",
    "steps": [
      "Create app/pipeline/history/page.tsx: table listing all past pipeline runs. Columns: Run #, Started At, Duration, Status (badge), Steps Summary (e.g., '4/4 completed'), Actions (View button).",
      "Create app/pipeline/[id]/page.tsx: detail view for a specific past pipeline run. Show the same layout as the active Pipeline View but with all data loaded from the stored run (pipeline-runs.json). AI stream shows the recorded output. Events show the recorded event log.",
      "Update lib/pipeline/store.ts: on pipeline completion, persist the full run state (steps, events, AI output, timing) to data/pipeline-runs.json.",
      "Add pagination to the history table: show 20 runs per page, use cursor-based pagination."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 9,
    "category": "feature",
    "description": "Build export functionality for architecture history",
    "steps": [
      "Add Export button to the Architecture History page header.",
      "Create app/api/history/export/route.ts: GET endpoint that generates a markdown document summarizing all architecture changes. Accept query params for date range and document type filtering. Return as a downloadable file (Content-Disposition: attachment).",
      "Format the export as clean markdown: title, date range, then chronological entries with headings, descriptions, and diff summaries.",
      "Add PDF export option using the browser's window.print() with a print-optimized CSS stylesheet (@media print)."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 9,
    "category": "documentation",
    "description": "Create environment configuration documentation and .env.example",
    "steps": [
      "Create spec-platform/.env.example with all required environment variables: ANTHROPIC_API_KEY (required, for AI SDK), DISCORD_WEBHOOK_URL (optional), TELEGRAM_BOT_TOKEN (optional), TELEGRAM_CHAT_ID (optional), SLACK_WEBHOOK_URL (optional). Include descriptive comments for each variable.",
      "Create spec-platform/.gitignore: include .env*, node_modules/, .next/, data/*.json (runtime data files), *.log.",
      "Document the project setup in the ADR consequences section: add a note that the SPEC Platform requires Node.js 18+ and npm.",
      "Add npm scripts to package.json: 'dev' (next dev), 'build' (next build), 'start' (next start), 'test' (vitest), 'test:ui' (vitest --ui), 'lint' (next lint). Verify all scripts work."
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  }
]
```

## Progress Tracking

- Total Tasks: 28
- Completed: 0
- In Progress: 0
- Not Started: 28

### Phase Breakdown

- **Phase 1 — Foundation & Scaffolding** (Tasks 1-3): 0/3 completed
- **Phase 2 — Shell Layout & Shared Components** (Tasks 4-8): 0/5 completed
- **Phase 3 — Core Features: SSE, AI Streaming, Pipeline View, Documents, Excalidraw** (Tasks 9-13): 0/5 completed
- **Phase 4 — Document Editing, History, Diff Viewer, Command Palette** (Tasks 14-17): 0/4 completed
- **Phase 5 — Integrations Hub, Webhooks, Pipeline Orchestrator** (Tasks 18-20): 0/3 completed
- **Phase 6 — Responsive Mobile Layout & Animations** (Tasks 21-22): 0/2 completed
- **Phase 7 — Security Review** (Tasks 23-24): 0/2 completed
- **Phase 8 — Testing** (Tasks 25-27): 0/3 completed
- **Phase 9 — Advanced Features & Documentation** (Tasks 28-30... err 26-28): 0/3 completed

## Implementation Notes

### Prerequisites
- Node.js 18+ and npm installed
- Existing Excalidraw monorepo at `../excalidraw/` (for embedding the component)
- Anthropic API key for AI SDK integration
- Optional: Discord webhook URL, Telegram bot token + chat ID, Slack webhook URL for integration testing

### Key Decisions
- **Next.js 16 with App Router**: Chosen for API routes (SSE, webhooks, AI streaming), server components (initial data loading), and the mature ecosystem. The existing codebase uses Vite, but the SPEC Platform's server-side requirements justify Next.js.
- **Vercel AI SDK 6**: Using `ai` package v6 with `@ai-sdk/anthropic` for all AI features. Default model: `claude-sonnet-4-5-20250929`. Complex reasoning tasks use `claude-opus-4-6`.
- **Zustand over Jotai**: The SPEC Platform uses Zustand for simpler store patterns. The embedded Excalidraw component manages its own Jotai state independently.
- **SSE over WebSocket**: Server-Sent Events for the predominantly server→client event flow. Simpler, auto-reconnects, works through proxies.
- **File-based storage**: For MVP, documents and configuration are stored as JSON/markdown files on disk. This aligns with the architecture-first approach where ADRs/PRDs are files. A database can be added later if needed.

### Testing Strategy
- **Phase 8 (Unit)**: Vitest with jsdom for component tests, plain Vitest for library tests. Mock AI SDK calls and fetch for integration clients.
- **Phase 8 (Integration)**: Test API routes with real file I/O (temp directories). Test SSE streaming end-to-end.
- Coverage targets: 70% lines, 75% branches for core libraries; 60% for UI components.

### Deployment Considerations
- Deploy as a standard Next.js application (Vercel, Docker, or self-hosted)
- SSE connections require a server that supports long-lived HTTP connections (not serverless functions with short timeouts) — use Vercel Streaming Functions or a traditional Node.js server
- Webhook delivery should be resilient to temporary platform outages (retry with backoff is built in)
- Environment variables must be configured for each deployment environment

### Risk Assessment
- **Excalidraw embedding complexity**: Excalidraw uses many browser APIs and must be dynamically imported with `ssr: false`. The existing Next.js example in the monorepo proves this is feasible but may require debugging.
- **SSE scalability**: In-memory SSE connection management works for single-server deployments. For multi-server, would need Redis pub/sub for event broadcasting.
- **AI SDK rate limits**: Pipeline runs involve multiple AI calls. Anthropic rate limits may throttle pipeline execution. The pipeline runner should handle 429 responses with backoff.
- **File locking**: Concurrent document edits or pipeline runs writing to the same files could cause conflicts. For MVP, we accept single-writer semantics. Later, add file locks or a database.

## References
- [ADR-0001: SPEC Platform UI Specifications](../architecture/0001-spec-platform-ui-specifications.md)
- [Vercel AI SDK 6 Documentation](https://sdk.vercel.ai/docs)
- [Next.js 16 App Router Documentation](https://nextjs.org/docs)
- [Excalidraw Integration Guide](../excalidraw/examples/with-nextjs/)
- [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
