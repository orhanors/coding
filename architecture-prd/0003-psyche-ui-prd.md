# PRD-0003: Psyche — Multi-Agent Orchestration Workspace UI

**Source ADR:** [ADR-0003](../architecture/0003-psyche-ui-specifications.md)
**Status:** In Progress
**Created:** 2026-02-09

## Overview

IMPORTANT: Create the UI under a new `psyche-ui/` folder at the workspace root (`/Users/orhanors/Desktop/coding/psyche-ui/`). Use Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, Zustand 5, Vercel AI SDK v6 (`ai@^6.0.0`, `@ai-sdk/react@^3.0.0`), and AI Elements (`npx ai-elements@latest` for AI-native UI components). Reference mdiff-ui patterns for stores, hooks, theming, and component architecture — but this is a new project with its own identity. Note: mdiff-ui does NOT use AI SDK (it has custom SSE only), so AI SDK integration is new to Psyche.

Psyche is a multi-agent orchestration workspace where human architects oversee autonomous coding agents through an introspective, canvas-based interface. Named after Carl Jung's concept of the psyche — the totality of conscious and unconscious mental processes — each agent carries a Jungian archetype (The Architect, The Guardian, The Explorer, etc.) reflected in its visual identity on an infinite canvas.

The core user journey is: **open canvas → create agents by clicking to place → configure archetype, task, and autonomy level → connect agents into dependency flows → watch them work in real-time → review changes in the River timeline → approve or intervene → all changes chronicled in Visions (PRDs) and Reflections (ADRs) with Excalidraw snapshots**. The app has 4 primary views: Canvas (spatial agent workspace), River (timeline of all changes), Visions (Linear-like Kanban board for product plans), and Reflections (architecture decision browser with version history).

The design aesthetic is "Deep Introspective" — dark indigo with warm amber-gold accents (#f5c364), 8 archetype colors for agent identity, warm typography (Inter + JetBrains Mono + Newsreader for display), and breathing animations that make the workspace feel calm and meditative. Fully responsive with touch-friendly canvas interactions on mobile.

## Implementation Tasks

The tasks below are organized by phase and priority. Each phase builds on the previous one. Tasks within the same phase can be worked on in parallel.

```json
[
  {
    "phase": 1,
    "category": "setup",
    "description": "Scaffold the psyche-ui Next.js 16 project with all dependencies — mirror mdiff-ui's proven stack but with Psyche-specific configuration",
    "steps": [
      "Run `npx create-next-app@16 psyche-ui --typescript --tailwind --eslint --app --src-dir=false` in the coding/ root directory",
      "Copy package.json dependencies from mdiff-ui (Radix UI primitives, zustand 5.0.3, date-fns 4.1.0, lucide-react 0.544, cmdk 1.1.1, sonner 1.7.1, recharts 2.15.0, class-variance-authority 0.7.1, clsx 2.1.1, tailwind-merge 2.5.5, react-resizable-panels 2.1.7, vaul 1.1.2, zod 3.24.1, react-hook-form 7.54.1, next-themes 0.4.6, tailwindcss-animate 1.0.7)",
      "Install Vercel AI SDK v6: `npm install ai@^6.0.0 @ai-sdk/react@^3.0.0 @ai-sdk/anthropic@^3.0.0 @ai-sdk/openai@^3.0.0` — these provide ToolLoopAgent, useChat, streamText, and needsApproval for human-in-the-loop agent patterns",
      "Install AI Elements for AI-native UI components: `npx ai-elements@latest` or `npx shadcn@latest add https://elements.ai-sdk.dev/api/registry/all.json` — provides message, conversation, code-block, agent, and sandbox components built on shadcn/ui",
      "Copy devDependencies: vitest 4.0.18, @testing-library/react 16.3.2, @testing-library/jest-dom 6.9.1, jsdom 28.0.0, @vitejs/plugin-react 5.1.3",
      "Run `npm install` to install all dependencies",
      "Copy the components.json from mdiff-ui (shadcn/ui configuration) and update paths to match psyche-ui structure",
      "Copy the full components/ui/ directory from mdiff-ui (all 48 shadcn/ui primitives) into psyche-ui/components/ui/",
      "Copy lib/utils.ts (cn() utility) from mdiff-ui",
      "Copy theme-provider.tsx from mdiff-ui/components/",
      "Create the full directory structure from ADR-0003: components/{layout,canvas,river,visions,reflections,agent,diff,ui}, lib/, hooks/, stores/, app/api/{agents,visions,reflections,river,events}",
      "Verify by running `npm run dev` — the default Next.js page should render at localhost:3000"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Create Psyche design tokens in globals.css — Deep Introspective palette with amber-gold accent, archetype colors, canvas tokens, diff colors, dark/light themes, animation keyframes",
    "steps": [
      "Create psyche-ui/app/globals.css with Tailwind directives (@tailwind base/components/utilities)",
      "Add :root[data-theme='dark'] block with all Psyche dark theme tokens from ADR-0003: --bg-primary: #0a0a12, --bg-secondary: #0f0f1a, --bg-tertiary: #151520, --bg-hover: #1a1a2e, --bg-active: #22223a, --bg-surface: #0d0d18, --bg-canvas: #08080e",
      "Add border tokens: --border-subtle: rgba(255,220,180,0.04), --border-default: rgba(255,220,180,0.08), --border-strong: rgba(255,220,180,0.14), --border-glow: rgba(245,195,100,0.20)",
      "Add text tokens: --text-primary: #e8e4df, --text-secondary: #8a8698, --text-muted: #504c5e, --text-inverse: #0a0a12",
      "Add accent tokens: --accent-primary: #f5c364, --accent-hover: #e5a83d, --accent-muted: rgba(245,195,100,0.12), --accent-subtle: rgba(245,195,100,0.06), --accent-glow: rgba(245,195,100,0.25)",
      "Add all 8 archetype color tokens: --archetype-architect: #a78bfa, --archetype-guardian: #34d399, --archetype-explorer: #60a5fa, --archetype-alchemist: #f59e0b, --archetype-shadow: #f87171, --archetype-sage: #c084fc, --archetype-herald: #22d3ee, --archetype-trickster: #fb923c",
      "Add semantic tokens (--success: #34d399, --warning: #fbbf24, --error: #f87171, --info: #60a5fa), diff tokens (--diff-added-bg/border/text, --diff-removed-bg/border/text), canvas tokens (--canvas-grid, --canvas-connection, --canvas-connection-active), constellation tokens (--constellation-line, --constellation-line-active, --constellation-glow)",
      "Add :root[data-theme='light'] block with light theme overrides from ADR-0003 (--bg-primary: #faf8f5, --accent-primary: #c48a20, etc.)",
      "Map Psyche tokens to shadcn/ui HSL variables: --background maps to --bg-primary, --primary maps to --accent-primary, --card maps to --bg-secondary, --muted maps to --bg-tertiary, --border maps to --border-default",
      "Add typography variables: --font-primary, --font-mono, --font-display; type scale from --text-xs (0.75rem) to --text-3xl (2.25rem)",
      "Add animation keyframes: @keyframes agent-pulse (0%/100% 0px box-shadow, 50% 12px shadow, 2s ease-in-out), @keyframes blink-cursor (opacity 1→0 at 530ms), @keyframes shimmer (gradient sweep 1.5s), @keyframes connection-flow (stroke-dashoffset animation 1.5s linear), @keyframes river-slide-in (translateX -8px→0, 150ms), @keyframes status-fade (opacity 1.0→0.3, 3s ease after 5s idle)",
      "Add @media (prefers-reduced-motion: reduce) overrides: disable all animations, replace glow with static borders, stop connection flow",
      "Verify by running dev server — dark background should be near-black (#0a0a12) with warm amber accent"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Configure tailwind.config.ts with Psyche-specific extensions — archetype colors, canvas utilities, custom animations, typography scale with Newsreader display font",
    "steps": [
      "Create psyche-ui/tailwind.config.ts extending Tailwind with Psyche's color system: accent (--accent-primary), each archetype color (architect, guardian, explorer, alchemist, shadow, sage, herald, trickster), semantic colors, diff colors, canvas colors",
      "Add fontFamily: sans (Inter), mono (JetBrains Mono), display (Newsreader, Georgia, serif)",
      "Add custom fontSize entries: text-2xs (0.6875rem), text-base (0.9375rem for 15px body)",
      "Add breakpoints matching ADR-0003: sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px",
      "Add animation keyframes: agent-pulse, shimmer, blink-cursor, connection-flow, slide-from-right, slide-from-bottom, fade-in, node-appear (fade + scale), river-slide",
      "Add corresponding animation utilities: animate-agent-pulse, animate-shimmer, animate-blink, animate-connection-flow, animate-slide-right, animate-slide-bottom, animate-fade-in, animate-node-appear, animate-river-slide",
      "Keep tailwindcss-animate plugin and accordion keyframes from mdiff-ui reference",
      "Verify with `className='text-accent-primary bg-archetype-architect'` rendering correct colors"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Define all Psyche TypeScript types in lib/types.ts — Agent, AgentArchetype, Vision, Reflection, RiverEntry, ChangeEntry, DiffStats, PsycheEvent, and all component prop interfaces from ADR-0003",
    "steps": [
      "Create psyche-ui/lib/types.ts",
      "Define AgentArchetype union type with all 8 archetypes: 'architect' | 'guardian' | 'explorer' | 'alchemist' | 'shadow' | 'sage' | 'herald' | 'trickster'",
      "Define Agent interface: id, name, archetype, task, status ('idle'|'active'|'completed'|'error'|'paused'), autonomy (1-5), progress?, position {x,y}, dependsOn[], outputFeeds[], createdAt, updatedAt, streamContent?, events[]",
      "Define AgentConfig interface: name, archetype, task, autonomy, dependsOn?, outputFeeds?",
      "Define AgentEvent interface: id, type (PsycheEventType), timestamp, message",
      "Define Vision interface: id, title, overview, stage ('backlog'|'in_progress'|'review'|'done'), priority ('low'|'medium'|'high'), assignedAgent?, tasks: VisionTask[], totalTasks, completedTasks, changeHistory: ChangeEntry[], createdAt, updatedAt",
      "Define VisionTask interface: id, phase, category ('setup'|'feature'|'integration'|'optimization'|'security'|'testing'|'documentation'), description, steps[], implemented",
      "Define Reflection interface: id, number, title, status ('proposed'|'accepted'|'superseded'|'deprecated'), content, author ('agent'|'human'), agentId?, versions: ReflectionVersion[], supersededBy?, createdAt, updatedAt",
      "Define ReflectionVersion interface: id, version, diff: DiffHunk[], author, agentId?, timestamp, description",
      "Define RiverEntry interface: id, type ('vision'|'reflection'|'diagram'|'code'|'status'|'agent'), title, description, agent?: {id, name, archetype}, timestamp, stats?: DiffStats, linkedDocumentId?, linkedDocumentType?, excalidrawSnapshot?, diffHunks?: DiffHunk[]",
      "Define ChangeEntry, DiffStats, DiffHunk, DiffLine interfaces matching ADR-0003 exactly",
      "Define PsycheEventType union type with all event types from ADR-0003 (agent:created, agent:started, agent:streaming, agent:step-completed, agent:completed, agent:failed, agent:paused, agent:resumed, vision:created, vision:updated, vision:task-completed, reflection:proposed, reflection:accepted, reflection:superseded, diagram:updated, code:changed, river:entry-added)",
      "Define PsycheEvent interface: id, type, timestamp, agentId?, payload: Record<string, unknown>",
      "Define Command interface: id, label, category ('navigation'|'agent'|'document'|'setting'), shortcut?, action: () => void",
      "Define all component prop interfaces from ADR-0003: AgentNodeProps, AgentConfigPanelProps, InfiniteCanvasProps, ConnectionLineProps, VisionCardProps, ReflectionReaderProps, RiverEntryProps, StatusStripProps, CommandPaletteProps",
      "Export all types"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Create archetype constants in lib/constants.ts — mapping each Jungian archetype to its color, icon, description, and all static configuration lookup tables",
    "steps": [
      "Create psyche-ui/lib/constants.ts",
      "Define ARCHETYPES constant object mapping each AgentArchetype to: { label (e.g., 'The Architect'), color (CSS variable reference e.g., 'var(--archetype-architect)'), colorClass (Tailwind class e.g., 'text-archetype-architect'), icon (Lucide icon component name), description (one-line role description) }",
      "Architect: Compass icon, violet, 'Designs systems, creates structure'; Guardian: Shield icon, emerald, 'Tests, validates, ensures quality'; Explorer: Telescope icon, blue, 'Researches, discovers, proposes'; Alchemist: FlaskConical icon, amber, 'Transforms, refactors, optimizes'; Shadow: Bug icon, red, 'Debugs, finds hidden issues'; Sage: BookOpen icon, purple, 'Reviews, advises, documents'; Herald: Radio icon, cyan, 'Communicates, integrates, notifies'; Trickster: Shuffle icon, orange, 'Challenges assumptions, unconventional solutions'",
      "Define AGENT_STATUSES constant mapping status to: { label, color, icon } — idle (gray, Circle), active (green, CircleDot), completed (emerald, CheckCircle), error (red, XCircle), paused (amber, PauseCircle)",
      "Define AUTONOMY_LEVELS constant: [{level:1, label:'Full Approval'}, {level:2, label:'Step Approval'}, {level:3, label:'Supervised'}, {level:4, label:'Light Touch'}, {level:5, label:'Autonomous'}]",
      "Define VISION_STAGES constant: [{id:'backlog', label:'Backlog'}, {id:'in_progress', label:'In Progress'}, {id:'review', label:'Review'}, {id:'done', label:'Done'}]",
      "Define REFLECTION_STATUSES constant: proposed (amber bg, amber text), accepted (green bg, green text), superseded (gray bg, gray text), deprecated (red-gray bg, strikethrough)",
      "Define RIVER_ENTRY_TYPES constant mapping type to: { icon (unicode: ◆◇◈●○★), color, label }",
      "Export all constants"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Create comprehensive mock data in lib/mock-data.ts — mock agents on canvas, visions on board, reflections with versions, and river entries for all views",
    "steps": [
      "Create psyche-ui/lib/mock-data.ts",
      "Create 4 mock agents: ψ₁ The Architect (active, position {x:200, y:150}, task 'Refactoring auth module', progress 73%, autonomy 3, archetype 'architect'), ψ₂ The Guardian (idle, position {x:200, y:350}, archetype 'guardian'), ψ₃ The Explorer (idle, position {x:80, y:500}, autonomy 4, archetype 'explorer'), ψ₄ The Alchemist (completed, position {x:400, y:250}, archetype 'alchemist')",
      "Set up agent connections: Architect → Guardian (outputFeeds), Explorer depends on Architect (dependsOn)",
      "Create 5 mock visions across all 4 board stages: 'Auth Redesign' (in_progress, high, assigned to Architect, 3/15 tasks with detailed VisionTask[] including 4 phases), 'API Gateway Layer' (in_progress, medium, assigned to Explorer, 5/12), 'Dashboard Metrics' (review, low, assigned to Guardian, 2/8), 'Onboarding Flow' (done, 8/8), 'Testing Strategy' (backlog, unassigned, 0/6)",
      "Create detailed VisionTask[] for Auth Redesign: Phase 1 Foundation (3 complete: JWT library, token service, auth middleware; 1 pending: refresh rotation), Phase 2 Core (0/6: OAuth2, session migration, etc.), Phase 3 Integration (0/3), Phase 4 Testing (0/2)",
      "Create 4 mock reflections: R-001 (superseded, 'Use cookie-based sessions', by human, 5d ago), R-002 (accepted, 'Use PostgreSQL for persistence', by human, 2d ago), R-003 (accepted, 'Choose JWT over sessions', by agent Architect, 28m ago, 3 versions), R-004 (proposed, 'Adopt event sourcing for audit log', by agent Explorer, 5m ago, awaiting approval)",
      "Create 3 mock ReflectionVersions for R-003: v1 (initial draft by Architect), v2 (modified rationale, 1h ago), v3 (added migration plan + rollback strategy, 28m ago) — each with realistic DiffHunk data",
      "Create 8-10 mock river entries spanning today and yesterday: Vision 'Auth Redesign' updated (12m ago), Reflection R-003 accepted (28m ago), Diagram auth-architecture.excalidraw updated (+4 nodes, +3 edges, 35m ago), Code src/auth/jwt.ts changed (+47 -12, 1h ago), Agent Architect started (2h ago), Agent Alchemist completed (yesterday), Vision 'Onboarding Flow' marked done (yesterday)",
      "Create mock agent events for Architect: [agent:started '12:34', diff:created 'auth.ts' '12:34', agent:streaming '12:35', document:saved 'R-003' '12:35', agent:step-completed 'Define auth middleware' '12:36']",
      "Create mock stream content for Architect: multi-paragraph markdown about analyzing existing auth patterns in src/auth/, finding 3 legacy cookie session files, proposing JWT migration with refresh rotation",
      "Export all mock data arrays and individual items"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "setup",
    "description": "Create all Zustand stores — agent-store, canvas-store, vision-store, reflection-store, river-store, and ui-store following mdiff-ui patterns, initialized with mock data",
    "steps": [
      "Create psyche-ui/stores/agent-store.ts: state { agents: Agent[], connections: {id, fromId, toId}[], configPanelOpen: boolean, configPanelAgentId: string|null }; actions: addAgent(config, position), removeAgent(id) (also removes all connections involving this agent), updateAgent(id, partial), setAgentStatus(id, status), addConnection(fromId, toId), removeConnection(id), openConfigPanel(agentId?), closeConfigPanel(), appendAgentStream(agentId, content), addAgentEvent(agentId, event) — initialize with mockAgents and mockConnections",
      "Create psyche-ui/stores/canvas-store.ts: state { zoom: 1, pan: {x:0, y:0}, mode: 'canvas'|'constellation', selectedNodeId: string|null, isDragging: boolean }; actions: setZoom(level) (clamp 0.25-3.0), setPan({x,y}), setMode(mode), setSelectedNode(id|null), setDragging(bool), resetView() (zoom=1, pan=0,0), zoomIn() (+0.25), zoomOut() (-0.25)",
      "Create psyche-ui/stores/vision-store.ts: state { visions: Vision[], selectedVisionId: string|null, viewMode: 'board'|'list' }; actions: addVision(data), updateVision(id, partial), removeVision(id), moveVisionToStage(id, newStage), toggleVisionTask(visionId, taskId) (toggles implemented), setSelectedVision(id|null), setViewMode(mode) — initialize with mockVisions",
      "Create psyche-ui/stores/reflection-store.ts: state { reflections: Reflection[], selectedReflectionId: string|null }; actions: addReflection(data), updateReflection(id, partial), acceptReflection(id) (status→accepted), supersedeReflection(id, replacedById) (status→superseded, sets supersededBy), setSelectedReflection(id|null) — initialize with mockReflections",
      "Create psyche-ui/stores/river-store.ts: state { entries: RiverEntry[], filters: {type?: string, agentId?: string, search?: string} }; actions: addEntry(entry) (prepend), setFilters(partial), clearFilters(); computed: filteredEntries (apply type, agentId, and search filters) — initialize with mockRiverEntries",
      "Create psyche-ui/stores/ui-store.ts: state { agentOverlayOpen: boolean, agentOverlayAgentId: string|null, commandPaletteOpen: boolean }; actions: toggleAgentOverlay(agentId?) (open with specific agent or toggle off), toggleCommandPalette(), closeAll() (closes everything)",
      "Create psyche-ui/hooks/use-canvas.ts — thin hook wrapping canvas-store with computed helpers: worldToScreen(point) and screenToWorld(point) coordinate transforms accounting for current zoom and pan, zoomToFit(agents) that calculates zoom/pan to show all agents in viewport, canvasRef for imperative access. Re-export all canvas-store actions for convenience",
      "Create psyche-ui/hooks/use-theme.ts — thin wrapper around next-themes useTheme(). Export { theme, isDark, toggleTheme }",
      "All stores must use the Zustand create() pattern: `export const useXStore = create<XStore>()((set, get) => ({...}))`",
      "Verify by importing stores and hooks in a test component and confirming state initializes correctly with mock data"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "feature",
    "description": "Build the root layout, PsycheShell, TopBar, StatusStrip, and view routing — the complete app shell with navigation, theme switching, and agent status awareness",
    "steps": [
      "Create psyche-ui/app/layout.tsx: metadata (title='Psyche', description='Multi-agent orchestration workspace'). Import Inter, JetBrains_Mono from next/font/google. Add Newsreader from Google Fonts for the display font. Apply font CSS variables to html element. Wrap children in ThemeProvider (attribute='class', defaultTheme='dark'). Set body className with font-sans, bg-[var(--bg-primary)], text-[var(--text-primary)], antialiased, min-h-screen",
      "Create psyche-ui/components/layout/psyche-shell.tsx: flex-col h-screen container. Contains PsycheTopBar (fixed top, 52px), main content area (flex-1, overflow-hidden), StatusStrip (fixed bottom, 24px). Also renders AgentStreamOverlay and CommandPalette at shell level so they persist across navigation",
      "Create psyche-ui/components/layout/psyche-top-bar.tsx (52px fixed): Left — 'ψ' glyph in amber + 'Psyche' in font-display italic text-lg text-accent-primary (spaced with gap-2). Center — nav links (Canvas, River, Visions, Reflections) using Next.js Link components; detect active route with usePathname(); active tab gets underline border-b-2 in accent-primary, inactive tabs in text-secondary with hover:text-primary. Right — theme toggle button (Moon/Sun icon swap), ⌘K trigger (small badge showing '⌘K'), agent overlay toggle button (PanelRight icon). All buttons have tooltips",
      "Create psyche-ui/components/layout/status-strip.tsx (24px fixed bottom): Left — pulsing dot (colored by active agent's archetype color from agent-store, or text-muted when idle) + status message text (e.g., 'Architect: analyzing auth patterns...' or 'idle'). Right — pending count badge + 'v0.1'. Implement idle fade: opacity transitions to 0.3 when no agent is active (check if any agent has status='active'), full opacity 1.0 when active. onClick opens agent overlay for the active agent via ui-store",
      "Create psyche-ui/app/page.tsx that redirects to /canvas using next/navigation redirect()",
      "Create stub page files: app/canvas/page.tsx, app/river/page.tsx, app/visions/page.tsx, app/reflections/page.tsx — each showing centered heading with the view name",
      "Verify: dev server shows top bar with 'ψ Psyche', navigation tabs work, active tab highlights, theme toggle switches dark/light, status strip shows at bottom, redirect from / to /canvas works"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 1,
    "category": "feature",
    "description": "Build the Command Palette (⌘K) — searchable command interface for navigation, agent control, and quick actions using cmdk library",
    "steps": [
      "Create psyche-ui/components/layout/command-palette.tsx using the cmdk CommandDialog from shadcn/ui",
      "Wire open/close to ui-store.commandPaletteOpen. Register keyboard shortcut in PsycheShell: ⌘K (Mac) / Ctrl+K (Windows) toggles palette",
      "Add command groups: Navigation (Canvas ⌘1, River ⌘2, Visions ⌘3, Reflections ⌘4 — each with shortcut hint), Agents (Create Agent, View All Agents, Pause All Agents, Resume All Agents), Documents (New Vision, New Reflection), Settings (Toggle Theme, Toggle Constellation Mode)",
      "Navigation commands use router.push() on select and close the palette",
      "Create Agent command navigates to /canvas and opens config panel",
      "Toggle Theme uses next-themes setTheme() to switch between dark/light",
      "Style the dialog with Psyche tokens: bg-tertiary background, border-default border, accent-primary for selected item highlight, text-secondary for group labels, text-primary for command labels",
      "Each command entry shows: icon (Lucide) + label + optional shortcut hint (right-aligned, text-muted)",
      "Verify by pressing ⌘K — palette opens, type 'river' → filters to River navigation command → Enter navigates to /river and closes palette"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the InfiniteCanvas component — pan/zoom container with subtle dot-grid background, the foundation for the spatial agent workspace",
    "steps": [
      "Create psyche-ui/components/canvas/infinite-canvas.tsx as a client component ('use client')",
      "Implement the canvas as a div container (100% width/height of main area) with an inner 'transform layer' div that receives CSS transform: scale(zoom) translate(panX, panY). Children render inside this transform layer so they move with pan/zoom",
      "Implement pan: middle-click drag or left-click drag on empty canvas space. Track mousedown position, calculate delta on mousemove, update canvas-store.pan. Use cursor:grab (default) and cursor:grabbing (during pan). Prevent text selection during pan",
      "Implement zoom: onWheel handler adjusts canvas-store.zoom by deltaY sign × 0.1. Clamp between 0.25 and 3.0. Zoom toward cursor position: adjust pan so the point under the cursor stays fixed. Formula: newPan = cursorWorldPos - (cursorScreenPos - containerOffset) / newZoom",
      "Implement touch support: two-finger pinch for zoom (calculate distance between touch points, map delta to zoom), single-finger drag for pan (track touch delta)",
      "Render dot-grid background using CSS background-image with radial-gradient: `radial-gradient(circle, var(--canvas-grid) 1px, transparent 1px)` at gridSize (24px) intervals. Background-size and background-position scale/offset with zoom and pan",
      "Accept onCanvasClick prop — fires only when clicking empty canvas space (not on child nodes). Calculate canvas-space (world) coordinates from screen click position: worldX = (screenX - containerLeft - panX) / zoom, worldY = (screenY - containerTop - panY) / zoom. Use a click-vs-drag threshold (5px movement cancels click)",
      "Implement empty canvas state: when no children, show centered message 'Click anywhere to create your first agent' with pulsing (+) icon. Center message follows canvas pan/zoom",
      "Verify by rendering the canvas — pan on drag, zoom on scroll (toward cursor), dot grid moves correctly, onCanvasClick reports correct world coordinates"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the AgentNode component — draggable card on canvas showing archetype icon, name, task, progress bar, and status with archetype-colored styling and glow effects",
    "steps": [
      "Create psyche-ui/components/canvas/agent-node.tsx as a client component",
      "Render the node at its position {x, y} using CSS absolute positioning (left, top) within the canvas transform container. Size: 180×100px, rounded-xl",
      "Node layout: Top row — archetype icon (dynamic Lucide icon from ARCHETYPES constant) + agent name text (text-sm font-medium). Thin separator. Task text truncated to 1 line (text-xs text-secondary). Progress bar (height 3px, width fills node, fill-width = progress%, background-color = archetype color from constants). Bottom row — status dot (colored circle 6px, colored per AGENT_STATUSES constant) + relative timestamp (text-2xs text-muted, formatDistanceToNow from date-fns)",
      "Implement drag: onMouseDown on the node starts drag mode (set canvas-store.isDragging). Track movement delta on mousemove, update agent position via onDrag callback (accounting for canvas zoom: delta / zoom). onMouseUp ends drag. stopPropagation to prevent canvas pan. Show cursor:grabbing during drag",
      "Distinguish click from drag: track total movement distance, if < 5px treat as click (fire onClick), otherwise it was a drag",
      "Implement connection handle: small circle (8px) at the bottom-center edge of the node. On mousedown on this handle, start connection drawing mode — show temporary SVG line from handle to cursor position. On mouseup over another agent node, fire onConnect(targetAgentId). On mouseup elsewhere, cancel",
      "Style by status — idle: opacity 0.7, border --border-default. active: full opacity, border in archetype color, box-shadow glow animation (animate-agent-pulse keyframe with archetype color). completed: border briefly flashes --success, then settles to emerald border. error: border pulses --error. paused: opacity 0.85, dashed border",
      "Hover effect: 150ms ease translateY(-2px), border brightens to archetype color, subtle shadow increase",
      "Background: --bg-secondary with 80% opacity (backdrop-blur-sm for canvas bleed-through effect)",
      "Add ARIA: role='button', aria-label='{name} - {archetype} - {status}', tabIndex=0, onKeyDown (Enter → onClick, Space → select)",
      "Verify by rendering 4 mock agents — correct archetype colors, drag independently, active agent glows, click opens config"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the ConnectionLine component — SVG paths between connected agents with animated flow dots when data is passing between them",
    "steps": [
      "Create psyche-ui/components/canvas/connection-line.tsx",
      "Render an SVG overlay inside the canvas transform layer that covers the full canvas area. Set pointer-events:none so it doesn't block interactions on nodes",
      "For each connection (from agent-store.connections), find source and target agent positions. Calculate path endpoints: source center-right (x + 180, y + 50) to target center-left (x, y + 50)",
      "Use a cubic bezier SVG path for smooth curves: `M sourceX,sourceY C sourceX+offset,sourceY targetX-offset,targetY targetX,targetY` where offset = Math.abs(targetX - sourceX) * 0.4",
      "Style idle connections: stroke --constellation-line color, strokeWidth 1.5, strokeDasharray '6 4', no animation",
      "Style active connections (when source agent has status 'active'): stroke with source archetype color, strokeWidth 2, animated stroke-dashoffset flowing from source to target (connection-flow keyframe), opacity 0.7→1.0 pulsing",
      "Style completed connections: solid stroke --success at 0.3 opacity, no animation",
      "Add SVG marker-end: small triangle arrowhead (6×4px) pointing at the target node, colored to match the line",
      "Render all connections from agent-store in a single SVG element. Connections re-render when agent positions change (position is read from agent-store)",
      "Verify: 2 connected agents show bezier curve between them, animate when source is active, arrow at target end"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the AgentConfigPanel — slide-in panel (320px from right) for creating new agents and editing existing ones with archetype selection, task input, autonomy dial, and agent controls",
    "steps": [
      "Create psyche-ui/components/canvas/agent-config-panel.tsx using shadcn/ui Sheet component (side='right'). Width 320px via className. Wire visibility to agent-store.configPanelOpen, wire agent data to agent-store.configPanelAgentId (null = creating new agent)",
      "Form fields: Name input (text, placeholder 'Name your agent', max 50 chars), Archetype selector (shadcn Select component — each option shows archetype icon + 'The {Name}' + color dot + 1-line description in text-muted), Task textarea (placeholder 'Describe the task...', max 500 chars, 4 rows), Autonomy slider (custom 5-step slider showing dots ●●●○○ with label below from AUTONOMY_LEVELS, default 3='Supervised')",
      "Dependency section: 'Depends on' — multi-select of other agents (exclude self). 'Outputs to' — multi-select of other agents (exclude self). Each option shows archetype dot + agent name",
      "For editing existing agents: pre-fill all fields. Show status section: archetype color dot + status label + relative timestamp. Show progress bar if agent has progress",
      "Agent control buttons (visible only when editing active/paused agent): [Pause] (amber icon button, toggles to [Resume]), [Stop] (red icon button with confirmation AlertDialog), [Approve] (green icon button, visible when agent completed a step awaiting approval)",
      "Action footer: [Create Agent] primary button (new) or [Save Changes] primary button (edit) — bg-accent-primary, text-inverse. [Delete] ghost button (edit only, error color, with confirmation AlertDialog). [Cancel] ghost button",
      "On create: call agent-store.addAgent with form data + position (from canvas click or center viewport). On save: call agent-store.updateAgent. On delete: call agent-store.removeAgent + close panel",
      "Panel animation: 250ms cubic-bezier(0.32, 0.72, 0, 1) slide from right. Close on Escape or clicking outside",
      "Verify: click empty canvas → panel opens for new agent → fill fields → create → agent appears. Click existing node → panel pre-fills → edit → save updates node"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Build the CanvasToolbar — minimal floating toolbar with zoom controls, canvas/constellation mode toggle, and add-agent button",
    "steps": [
      "Create psyche-ui/components/canvas/canvas-toolbar.tsx — absolutely positioned bottom-right of the canvas area (bottom-4 right-4), z-10",
      "Horizontal pill shape: bg-tertiary/80 with backdrop-blur-sm, border border-default, rounded-full, px-2 py-1",
      "Buttons (icon-only, 28px each, with shadcn Tooltip): ZoomOut (Minus icon, canvas-store.zoomOut), zoom level display (text showing e.g., '100%', clickable to resetView), ZoomIn (Plus icon, canvas-store.zoomIn), visual separator (1px border-default), mode toggle (LayoutGrid icon for canvas / Sparkles icon for constellation, toggles canvas-store.mode), separator, add agent (Plus icon in circle, opens agent-store.configPanel at viewport center)",
      "Zoom display: text-xs text-secondary, shows Math.round(zoom * 100) + '%'",
      "Button hover: bg-hover rounded-md. Active: bg-active. Current mode toggle has accent-primary color",
      "All buttons have tooltips: 'Zoom out', '100% (click to reset)', 'Zoom in', 'Canvas mode' / 'Constellation mode', 'Add agent'",
      "Verify toolbar renders floating above canvas, doesn't move with pan/zoom, zoom controls work, mode toggle switches state"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 2,
    "category": "feature",
    "description": "Assemble the Canvas page — compose InfiniteCanvas, AgentNodes, ConnectionLines, AgentConfigPanel, and CanvasToolbar into the complete /canvas route",
    "steps": [
      "Update psyche-ui/app/canvas/page.tsx as a client component ('use client')",
      "Render InfiniteCanvas as the full-viewport container (fills main content area between top bar and status strip)",
      "Inside InfiniteCanvas children: map over agent-store.agents to render AgentNode for each agent at its position. Render ConnectionLine SVG overlay with connections from agent-store. Both render inside the canvas transform layer",
      "Render CanvasToolbar floating above the canvas (outside transform layer, inside the page)",
      "Render AgentConfigPanel (always mounted, visibility controlled by agent-store.configPanelOpen)",
      "Wire onCanvasClick: convert screen coordinates to world coordinates, store position in agent-store, open config panel for new agent creation",
      "Wire AgentNode onClick: set configPanelAgentId in agent-store, open config panel for editing",
      "Wire AgentNode onDrag: call agent-store.updateAgent(id, {position}) — connection lines auto-update because they read positions from the same store",
      "Wire AgentNode onConnect: call agent-store.addConnection(fromId, toId), also update both agents' dependsOn/outputFeeds arrays",
      "Wire AgentNode double-click: call ui-store.toggleAgentOverlay(agentId) to open stream overlay",
      "Implement empty canvas state: when agent-store.agents.length === 0, InfiniteCanvas shows centered message + pulsing (+) icon",
      "Verify complete canvas workflow: empty state → click canvas → config panel opens → create 'Architect' agent → node appears → drag it → click again to create 'Guardian' → drag from Architect connection handle to Guardian → connection line appears → click Architect node → config panel shows edit mode"
    ],
    "implemented": true,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the River view components — vertical timeline with date groupings, typed entry icons, expandable inline previews, diff rendering, and diagram thumbnails",
    "steps": [
      "Create psyche-ui/components/river/river-view.tsx — scrollable vertical container. Group entries by date using date-fns (isToday, isYesterday, format). Render RiverDateGroup separators between groups. Entries connected by a vertical line (border-left 2px --border-subtle on a wrapper)",
      "Create psyche-ui/components/river/river-date-group.tsx — date separator: circle node (○, 10px, --border-strong) on the timeline + label text ('Today', 'Yesterday', or formatted date like 'Feb 7, 2026') in text-sm text-muted font-medium",
      "Create psyche-ui/components/river/river-entry.tsx — individual timeline entry. Left: continuation of vertical line + type icon (from RIVER_ENTRY_TYPES constant: ◆ amber for vision, ◇ violet for reflection, ◈ pink for diagram, ● emerald for code, ○ gray for status, ★ archetype-color for agent lifecycle). Right: title (text-sm font-medium), description (text-xs text-secondary), agent attribution row (archetype color dot + 'ψ₁ {name}' in text-xs), relative timestamp (text-xs text-muted, right-aligned). Optional DiffStats badge",
      "Expandable preview: click entry toggles isExpanded state. When expanded, show inline content with 200ms height animation: DiffPreview for code/vision/reflection entries (renders diffHunks), DiagramThumbnail for diagram entries, plain text for status/agent entries",
      "Create psyche-ui/components/diff/diff-preview.tsx — compact inline diff hunk viewer. Renders DiffHunk lines: added lines with --diff-added-bg background + --diff-added-text color + '+' prefix + underline (for colorblind), removed lines with --diff-removed-bg + --diff-removed-text + '-' prefix + strikethrough, context lines with gray bg. Monospace font (font-mono text-xs). Line numbers in text-muted",
      "Create psyche-ui/components/diff/diff-stats.tsx — inline badge: '+{added} −{removed}' where added is in --diff-added-text and removed is in --diff-removed-text. Also shows '+{nodes} nodes +{edges} edges' for diagram stats",
      "Create psyche-ui/components/river/diagram-thumbnail.tsx — placeholder card (bordered, bg-surface, 200×120px) showing diagram stats text ('+N nodes, +M edges') and a simple graph icon. Actual Excalidraw rendering is future work",
      "New entries slide in with river-slide animation: 150ms ease-out fade-in + translateX(-8px → 0)",
      "Verify all entry types render with correct icons and colors, click expands preview, diff hunks render correctly"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the River filters and assemble the /river page — filter bar with type/agent/search dropdowns, wire to river-store, handle empty states",
    "steps": [
      "Create psyche-ui/components/river/river-filters.tsx — horizontal filter bar. Type dropdown (shadcn Select: 'All types', Vision, Reflection, Diagram, Code, Status, Agent — each with the entry type icon), Agent dropdown (shadcn Select: 'All agents', list from agent-store with archetype dots + names), Search input (text input with Search icon, debounced 300ms using a useEffect + setTimeout pattern)",
      "Active filter display: when any filter is set, show filter chips below the dropdowns (small badges showing e.g., 'Type: Vision ×', 'Agent: Architect ×'). Each chip has × button to clear that filter. 'Clear all' link when multiple filters active",
      "Wire filters to river-store: setFilters on dropdown change, clearFilters on 'Clear all'",
      "Update psyche-ui/app/river/page.tsx as a client component: render RiverFilters at top (sticky), RiverView below filling remaining space with ScrollArea",
      "RiverView reads from a computed selector in river-store that applies current filters: type filter (exact match on entry.type), agent filter (exact match on entry.agent?.id), search filter (case-insensitive includes on title + description)",
      "Entry click handlers: clicking agent name navigates to /canvas (future: and selects that agent). Clicking linked document navigates to /visions or /reflections based on linkedDocumentType",
      "Empty state (no entries, no filters): 'No changes yet. Create an agent on the Canvas to begin.' with a Link to /canvas",
      "Filtered empty state (filters active but no results): 'No entries match your filters.' with 'Clear all' link",
      "Skeleton loading state: 5 skeleton entries pulsing gently (shimmer animation) — shown briefly on initial mount",
      "Verify: river page loads with grouped mock data, all 3 filters narrow results correctly, clear all resets, empty states appear appropriately"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the Vision board and cards — Linear-like Kanban with 4 columns, draggable VisionCards with archetype-colored borders, progress bars, priority indicators",
    "steps": [
      "Create psyche-ui/components/visions/vision-board.tsx — horizontal flex container with 4 columns (from VISION_STAGES constant). Each column: header (stage label + count badge in text-muted), scrollable card area (flex-col gap-3). Columns have equal flex width with overflow-y-auto",
      "Create psyche-ui/components/visions/vision-card.tsx — card component. Anatomy: title (text-sm font-medium, max 2 lines), agent row (archetype color dot + name or 'Unassigned' in text-muted), priority row (●●● for high in amber, ●●○ for medium in blue, ●○○ for low in gray — using filled/unfilled circles), progress bar (3px height, archetype color fill, percentage width) + task count text (text-2xs text-muted, e.g., '3/15'). Left border: 3px solid in assigned agent's archetype color (or --border-default if unassigned). Card bg: --bg-secondary, rounded-lg, border --border-subtle, padding-3",
      "Implement HTML5 drag-and-drop: onDragStart sets dataTransfer with vision ID + visual feedback (card scales to 0.95, opacity 0.85, drop shadow). Column onDragOver shows drop indicator (dashed border --accent-primary, bg-accent-subtle). onDrop calls vision-store.moveVisionToStage(visionId, newStage). onDragEnd cleans up",
      "Click handler with drag guard: use a didDrag ref — set to true during drag. onClick only fires when didDrag is false (distinguishes click from drag). Click sets selectedVisionId in vision-store",
      "Card hover: 150ms translateY(-1px) + border brightens to --border-strong",
      "Agent working indicator: when assigned agent has status 'active', card border pulses with archetype color (subtle animation)",
      "Empty column state: centered text 'No visions' in text-muted when column has no cards",
      "Verify: board renders with mock visions in correct columns, drag card from In Progress to Review → card moves, click card → selectedVisionId updates"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the Vision detail modal, list view, and editor — complete the Visions page with Board/List toggle, detail modal with phased tasks, and new vision creation",
    "steps": [
      "Create psyche-ui/components/visions/vision-detail-modal.tsx using shadcn/ui Dialog (max-w-2xl). Wire visibility to vision-store.selectedVisionId (open when non-null). Header: title (text-xl), metadata row (archetype dot + agent name, priority dots, stage Badge component, progress '8/15 tasks'). Separator. Overview section (vision.overview as plain text or simple markdown). Tasks section: grouped by phase number with collapsible sections (Disclosure/Accordion pattern) — 'Phase {N} — {category} ({done}/{total} complete)'. Each task: checkbox icon (CheckCircle if implemented, Circle if not), description text (text-sm), clicking toggles vision-store.toggleVisionTask. Change History section: reverse-chronological ChangeEntry list (text-xs: relative timestamp + agent dot + description). Footer: [View in River] button, [Assign Agent ▾] dropdown",
      "Create psyche-ui/components/visions/vision-list.tsx — table alternative to board. Columns: Title (sortable), Agent (archetype dot + name), Priority (dots), Progress (bar + count), Stage (badge), Updated (relative time). Click row → sets selectedVisionId. Sort by clicking column headers (toggle asc/desc)",
      "Create psyche-ui/components/visions/vision-editor.tsx — Dialog form for new visions. Fields: Title (Input, required), Overview (Textarea, 6 rows), Priority (RadioGroup: low/medium/high), Assign Agent (Select dropdown of agents from agent-store, optional). On submit: vision-store.addVision with stage='backlog', close dialog",
      "Update psyche-ui/app/visions/page.tsx: top bar with view toggle (Board | List tabs), '+ New Vision' button (opens vision-editor dialog). Render VisionBoard or VisionList based on vision-store.viewMode. Render VisionDetailModal (always mounted, visibility controlled by selectedVisionId)",
      "Empty state (both views): centered text 'No visions yet. Start by describing what you want to build.' with prominent '+ New Vision' button",
      "Verify: board/list toggle works, create new vision → appears in Backlog, click card → detail modal shows with tasks, toggle task checkbox → progress updates, drag on board → stage changes"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the Reflections browser — grouped list (Active/Proposed/Superseded), split-view markdown reader, version history with diffs, status management actions, and search",
    "steps": [
      "Create psyche-ui/components/reflections/reflection-list.tsx — grouped sections: Active (accepted/accepted reflections), Proposed (awaiting approval), Superseded, Deprecated. Each section: collapsible with header (section name + count badge). Each entry: R-{number} badge (monospace), title text, ReflectionStatusBadge, author row (archetype dot + agent name or 'human'), timestamp. Click selects reflection (reflection-store.setSelectedReflection). Proposed entries have amber glow border-left and inline [Approve] [Reject] quick-action buttons",
      "Create psyche-ui/components/reflections/reflection-status-badge.tsx — Badge component: proposed = amber bg + amber text, accepted = green bg + green text, superseded = gray bg + gray text, deprecated = gray bg + red text + line-through. text-xs uppercase font-medium",
      "Create psyche-ui/components/reflections/reflection-reader.tsx — left panel (60% width). Header: 'R-{number}: {title}' (text-lg) + status badge. Separator. Content: render reflection.content as styled markdown (h1-h6 with proper sizes, paragraphs, lists, code blocks with bg-surface + font-mono, bold/italic). Bottom action bar: [Edit] ghost button, [Accept] green button (only if status='proposed', calls reflection-store.acceptReflection), [Supersede] amber button (opens dialog to select replacement reflection), [Reject] red ghost button (only if status='proposed')",
      "Create psyche-ui/components/reflections/reflection-diff-history.tsx — right panel (40% width). Header: 'Diff History'. Version list: each version shows 'v{N}' badge, '({current})' label if latest, relative timestamp, author, short description. Click a version: show DiffPreview of that version's DiffHunk data inline below the version entry. Current/latest version highlighted with accent-subtle background",
      "Create psyche-ui/components/reflections/reflection-editor.tsx — Dialog form. Fields: Title (Input), Content (Textarea, 15 rows, font-mono). On submit: reflection-store.addReflection with status='proposed'. For editing existing: pre-fill fields, on save: reflection-store.updateReflection",
      "Update psyche-ui/app/reflections/page.tsx: top bar with '+ New Reflection' button + search Input (filters by title/content, debounced 300ms). When no reflection selected: ReflectionList full-width. When selected: split view using CSS grid or flex — ReflectionReader (60%) + ReflectionDiffHistory (40%). Use react-resizable-panels if available, or simple flex with fixed ratio",
      "Proposed reflection UX: entries with status='proposed' have amber glow left-border + 'Awaiting approval' badge. Accept action → status changes to 'accepted', entry moves from Proposed to Active section. Supersede action → dialog to select replacement, old entry moves to Superseded section",
      "Search: filter reflection list by title and content substring match. Show 'No reflections match your search' when filter returns empty",
      "Empty state: 'No reflections yet. Agents will propose reflections as they make architectural decisions.'",
      "Verify: list renders grouped mock reflections, click opens split reader with markdown, version history shows diffs, accept/supersede actions update store and list position"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 3,
    "category": "feature",
    "description": "Build the Agent Stream Overlay — 360px slide-in panel from right showing real-time agent output, event log, and control buttons accessible from any view",
    "steps": [
      "Create psyche-ui/components/agent/agent-stream-overlay.tsx using shadcn/ui Sheet (side='right'). Custom width: 360px via className 'w-[360px]'. Wire visibility to ui-store.agentOverlayOpen and data to ui-store.agentOverlayAgentId (look up agent from agent-store)",
      "Header section: archetype icon (from ARCHETYPES) + agent name (text-base font-medium) + archetype color dot. Below: status label + '·' + current task context (truncated). Minimize (—) and close (×) icon buttons",
      "Create psyche-ui/components/agent/agent-stream-content.tsx — main content area. Renders agent.streamContent as formatted text (whitespace-pre-wrap, font-mono text-sm). When agent status='active', append a blinking cursor character '▍' using animate-blink class (530ms interval). Wrap in ScrollArea with auto-scroll-to-bottom behavior (useEffect scrolls when content changes). Background: bg-surface",
      "Create psyche-ui/components/agent/agent-event-log.tsx — below stream content, separated by a thin labeled divider ('── Event Log ──'). Renders agent.events as timestamped list: HH:mm timestamp (text-xs text-muted, monospace) + event type label (text-xs, colored by type) + message (text-xs text-secondary). Newest events at bottom. Max height 200px with scroll. Background: bg-surface/50",
      "Create psyche-ui/components/agent/agent-controls.tsx — bottom action bar (sticky, bg-tertiary border-t border-default). Buttons: [Pause] (amber, PauseCircle icon — toggles to [Resume] with PlayCircle when agent.status='paused'), [Approve All] (accent-primary, CheckCheck icon — shown when agent has pending approvals), [Stop] (error, Square icon — with confirmation AlertDialog 'Stop this agent?'). All buttons call agent-store.setAgentStatus with appropriate status",
      "Render overlay in PsycheShell (not inside page routes) so it persists across view navigation",
      "Backdrop: Sheet's default overlay with bg-black/20",
      "Trigger sources: status-strip click → opens for active agent, agent node double-click → opens for that agent, command palette 'View Agent Stream' → opens for active agent",
      "Close: Escape key, click outside, × button. On close: ui-store.toggleAgentOverlay(null)",
      "Verify: click status strip → overlay opens showing Architect's stream content + events + controls. Navigate to /river → overlay stays open. Close → overlay slides away"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "feature",
    "description": "Implement constellation mode — force-directed auto-layout algorithm that arranges agents based on dependency graph with glowing arc connections",
    "steps": [
      "Create psyche-ui/components/canvas/constellation-layout.tsx — exports a function calculateConstellationLayout(agents, connections) that returns a Map<agentId, {x, y}> of target positions",
      "Algorithm: simple force-directed layout. Repulsion: each node repels all others (Coulomb force, strength 5000, falloff 1/d²). Attraction: connected nodes attract (spring force, rest length 200px, strength 0.1). Gravity: all nodes pull toward center (strength 0.05). Run 60 iterations. Input: agents with current positions, connections. Output: new positions",
      "Center the resulting layout in the viewport: calculate bounding box of all positions, offset so centroid is at viewport center",
      "When canvas-store.mode switches to 'constellation': calculate target positions, animate each agent node from current position to target using CSS transition (300ms ease-out on transform/left/top). Store original freeform positions so they can be restored",
      "When switching back to 'canvas' mode: animate back to stored freeform positions with same transition",
      "In constellation mode: connection lines use enhanced styling — thicker stroke (2.5px), --constellation-line-active color with glow effect (CSS filter: drop-shadow(0 0 4px archetype-color)), active connections pulse brighter. Add subtle radial gradient on canvas background centered on constellation centroid at --constellation-glow color",
      "In constellation mode: agents cannot be freely dragged (disable drag handlers). Clicking still works to open config panel",
      "Verify: toggle to constellation mode → agents smoothly animate to auto-arranged positions based on dependency graph. Toggle back → agents return to original positions"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "feature",
    "description": "Build SSE event streaming infrastructure with AI SDK v6 — use AI SDK streamText/useChat for agent streaming, custom SSE for global events, ToolLoopAgent pattern for agent execution",
    "steps": [
      "Create psyche-ui/lib/events/sse-manager.ts — singleton event manager (following mdiff-ui pattern). Uses a Set of subscriber callbacks. Methods: emit(event: PsycheEvent), subscribe(callback), unsubscribe(callback). Helper: createEvent(type, payload?) returns PsycheEvent with id (crypto.randomUUID), timestamp, and type/payload",
      "Create psyche-ui/app/api/events/stream/route.ts — GET handler returning ReadableStream with 'text/event-stream' content-type. Subscribe to sse-manager. Format events as SSE: `data: ${JSON.stringify(event)}\\n\\n`. Keep-alive comment every 15s. Unsubscribe on close",
      "Create psyche-ui/app/api/agents/[id]/stream/route.ts — agent-specific streaming route using AI SDK v6 streamText(). Import from 'ai' package. Use streamText({ model, system: agentArchetypePrompt, messages }) to stream LLM output. For MVP, use a mock provider or simple text generation. Return toDataStreamResponse() for AI SDK wire format",
      "Create psyche-ui/hooks/use-agent-chat.ts — client hook wrapping AI SDK v6 useChat() from '@ai-sdk/react'. Configure with api: '/api/agents/{id}/stream'. This replaces the raw EventSource for agent-specific streaming. Returns { messages, isLoading, append, stop } — maps to agent stream content in the overlay",
      "Create psyche-ui/hooks/use-event-stream.ts — global event hook (separate from agent chat). Uses native EventSource connected to '/api/events/stream' for system-wide events (vision changes, reflection updates, lifecycle events). Exponential backoff reconnection (1s→30s max). Returns { connected, lastEvent }",
      "Create psyche-ui/app/api/events/test/route.ts — POST handler for development testing. Accepts {type, payload}, creates PsycheEvent, emits via sse-manager",
      "Wire use-event-stream into PsycheShell: dispatch events to stores by type prefix. Wire use-agent-chat into AgentStreamOverlay: display streaming LLM output with blinking cursor",
      "Prepare ToolLoopAgent pattern: create psyche-ui/lib/agents/agent-factory.ts stub that defines agent configurations with AI SDK v6 ToolLoopAgent — each archetype gets a system prompt, tool set, and needsApproval flag matching its autonomy level (1-3 = needsApproval:true, 4-5 = needsApproval:false). This is a scaffold for future real agent execution",
      "Verify: POST test event → appears in river. Agent stream overlay shows useChat output (mock or real). Agent factory creates ToolLoopAgent configurations"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "feature",
    "description": "Implement responsive mobile layouts for all views — hamburger navigation, touch-friendly canvas, swipe-based vision board, full-screen overlays",
    "steps": [
      "Update psyche-top-bar.tsx: below md breakpoint (768px), hide center nav tabs and right action buttons. Show hamburger menu button (Menu icon). Hamburger opens a Sheet (side='left', full-height) with vertical nav links (Canvas, River, Visions, Reflections) + theme toggle + version info. Close sheet on navigation",
      "Update infinite-canvas.tsx: below md breakpoint, agent nodes render at 220×120px (scale up via CSS). Long-press (500ms) on empty space creates agent instead of click (to avoid conflict with pan gesture). Detect long-press with setTimeout on touchstart, clear on touchmove/touchend",
      "Update agent-config-panel: below md breakpoint, render as bottom Sheet (side='bottom') instead of right Sheet. Full-width, max-height 80vh, rounded-t-xl",
      "Update vision-board.tsx: below md breakpoint, show single column at a time. Render column name + swipe indicator (dots). Detect swipe left/right via touch events (touchstart → record startX, touchend → compare endX, threshold 50px) to navigate between columns. Cards are full-width",
      "Update reflections page: below md breakpoint, no split view. ReflectionList is full-width. Clicking a reflection navigates to full-screen reader view (can use a state flag to switch between list and reader). Version history accessible via a toggle/tab within the reader",
      "Update river-filters.tsx: below md breakpoint, collapse filter bar into a single 'Filter' button (Funnel icon + active filter count badge). Button opens a bottom Sheet with all filter options stacked vertically",
      "Update agent-stream-overlay: below md breakpoint, Sheet renders full-screen (side='bottom' or full-width side='right'). Close button prominent at top",
      "Update status-strip.tsx: below md breakpoint, show only pulsing dot + truncated agent name (max 20 chars). Hide pending count and version",
      "Tablet adaptations (768-1024px): canvas agent nodes at 200×110px (slightly larger than desktop 180×100). Config panel overlays at 360px (same as desktop). Visions board: show 2 columns visible at a time with horizontal scroll for remaining 2. Reflections: split-view at 40/60 ratio instead of 50/50",
      "Test at 375px (iPhone), 768px (iPad portrait), 1024px (iPad landscape), and 1280px+ (desktop)"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "feature",
    "description": "Implement keyboard shortcuts and full keyboard navigation — canvas arrow-key navigation, global shortcuts, view switching, focus management",
    "steps": [
      "Create psyche-ui/hooks/use-keyboard-shortcuts.ts — centralized keyboard handler. Registers shortcuts as {key, meta?, ctrl?, shift?, handler}. Handles platform (Cmd on Mac = meta, Ctrl on Windows = ctrl). Ignores shortcuts when focus is in an input/textarea/select element",
      "Register global shortcuts in PsycheShell: ⌘K (command palette), ⌘1/2/3/4 (navigate to Canvas/River/Visions/Reflections), Escape (close any open panel/modal/overlay — cascading: overlay first, then modal, then panel)",
      "Canvas shortcuts (active when /canvas is the current route): Tab cycles focus through agent nodes (in order of creation). Arrow keys move selected agent by 10px increments. Enter opens config panel for focused agent. Space opens stream overlay for focused agent. Delete/Backspace removes selected agent (with confirmation). N opens config panel for new agent. C toggles constellation mode. +/- zoom in/out. 0 resets zoom",
      "Document shortcuts: ⌘N creates new document (New Vision on /visions, New Reflection on /reflections)",
      "Add skip-to-content link: hidden anchor before top bar, becomes visible on first Tab keypress (position absolute, bg-accent-primary, text-inverse), jumps focus to main content area",
      "Focus rings: all interactive elements show 2px --accent-primary outline with 2px offset on :focus-visible",
      "Add shortcut hints to tooltips and command palette entries",
      "Verify: Tab through canvas nodes, arrow-key move, ⌘1-4 switch views, ⌘K opens palette, Escape cascading close, skip-to-content link works"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 4,
    "category": "feature",
    "description": "Implement view transition animations and loading skeleton states for all pages — crossfade between views, stagger-in for canvas nodes, shimmer skeletons",
    "steps": [
      "Add view switch animation: wrap main content area in a transition wrapper. On route change, apply 200ms ease crossfade (opacity 0→1) with subtle translateY (4px→0). Can use CSS transitions triggered by a key change based on pathname",
      "Canvas loading: dot-grid background appears immediately, then agent nodes fade-in with 50ms stagger (each node delayed by index × 50ms, using animate-node-appear: scale(0.95)→scale(1) + opacity 0→1). Connections appear after all nodes",
      "River loading skeleton: 5 skeleton entries (Skeleton component from shadcn/ui) with pulse animation (1.5s ease-in-out shimmer). Each skeleton: circle (icon placeholder) + 2 lines (title + description) + small rect (timestamp)",
      "Vision board loading skeleton: column headers appear first, then skeleton cards slide in (3 per column, staggered). Each skeleton card: rect (title) + small circle (agent) + bar (progress)",
      "Reflection list loading skeleton: 4 skeleton entries (badge + title + badge + timestamp), grouped into 2 sections",
      "All skeletons use Skeleton component with className 'animate-shimmer' and bg-hover color",
      "Modal/panel animations: modals open with 200ms ease fade-in backdrop + scale(0.96→1.0). Panels slide with 250ms cubic-bezier(0.32, 0.72, 0, 1)",
      "@media (prefers-reduced-motion: reduce): all slide/scale animations become instant opacity changes, glow pulses become static borders, connection animations stop (static dashed lines), skeleton shimmer stops (static bg)",
      "Verify: animations smooth at 60fps, reduced-motion settings respected, loading states appear briefly on initial mount"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 5,
    "category": "security",
    "description": "Security audit — validate all user inputs, sanitize markdown/HTML rendering, protect API routes, review dependencies, prevent XSS",
    "steps": [
      "Create Zod validation schemas for all user input forms: agentConfigSchema (name: z.string().max(50).regex(/^[a-zA-Z0-9 ]+$/), task: z.string().max(500), archetype: z.enum([...archetypes]), autonomy: z.number().int().min(1).max(5)), visionSchema (title: z.string().max(100), overview: z.string().max(5000), priority: z.enum(['low','medium','high'])), reflectionSchema (title: z.string().max(100), content: z.string().max(10000))",
      "Apply Zod validation in AgentConfigPanel, VisionEditor, and ReflectionEditor forms — show validation errors inline, prevent submission of invalid data",
      "Audit markdown rendering in reflection-reader.tsx and vision-detail-modal.tsx — ensure NO usage of dangerouslySetInnerHTML. Use safe rendering: either a whitelist-based HTML renderer (only p, h1-h6, ul, ol, li, code, pre, strong, em, a) or install react-markdown with rehype-sanitize. If using simple text rendering (no HTML), ensure no injection vectors",
      "Audit all API routes (agents, visions, reflections, river, events): add request body validation using Zod .safeParse(). Return 400 with {error: description} for invalid input. Do not expose internal error stack traces. Validate Content-Type headers",
      "Validate SSE event payloads in use-event-stream.ts: parse incoming data with try/catch, validate event type is a known PsycheEventType before dispatching to stores. Ignore/log malformed events",
      "Review all places where user input flows to the DOM: search inputs in filters, agent names on canvas nodes, vision/reflection titles. Ensure React's default escaping handles these (no raw HTML insertion)",
      "Run `npm audit` to check for known vulnerabilities in dependencies. Pin exact versions in package.json (remove ^ prefix). Document any known issues",
      "Verify .gitignore includes .env*, .env.local, credentials*, secrets*. Check no hardcoded secrets exist in codebase (search for 'password', 'secret', 'token', 'api_key' patterns)",
      "Test with XSS payloads: create an agent with name '<script>alert(1)</script>', create a reflection with content containing <img onerror=...>, verify all are safely escaped in rendering"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 6,
    "category": "testing",
    "description": "Unit tests for all Zustand stores — test initial state, actions, computed selectors, edge cases, and state isolation",
    "steps": [
      "Set up Vitest in psyche-ui/: create vitest.config.ts (environment: 'jsdom', path aliases matching tsconfig, globals: true, setupFiles: ['./vitest-setup.ts']). Create vitest-setup.ts importing @testing-library/jest-dom. Add 'test' script to package.json: 'vitest'",
      "Create __tests__/stores/agent-store.test.ts: test initial state has 4 mock agents. addAgent creates agent with generated id and defaults. removeAgent removes from agents[] and removes all connections involving that agent. updateAgent merges partial data. setAgentStatus transitions correctly. addConnection creates entry with fromId/toId. removeConnection cleans up. openConfigPanel/closeConfigPanel toggle state. appendAgentStream concatenates content. addAgentEvent pushes to events array",
      "Create __tests__/stores/canvas-store.test.ts: test initial zoom=1 pan={0,0} mode='canvas'. setZoom clamps to 0.25-3.0 (test 0.1→0.25, 5.0→3.0). zoomIn/zoomOut increment by 0.25. setPan updates coordinates. setMode toggles. resetView returns to defaults",
      "Create __tests__/stores/vision-store.test.ts: test initial state has 5 mock visions. addVision defaults stage to 'backlog'. moveVisionToStage updates correctly. toggleVisionTask flips implemented and updates completedTasks count. setViewMode toggles 'board'/'list'. removeVision removes from array",
      "Create __tests__/stores/reflection-store.test.ts: test initial state has 4 mock reflections. addReflection defaults status to 'proposed'. acceptReflection changes status to 'accepted'. supersedeReflection sets supersededBy and status to 'superseded'. Edge case: accepting already-accepted reflection is a no-op",
      "Create __tests__/stores/river-store.test.ts: test initial entries. addEntry prepends (newest first). setFilters({type:'vision'}) → filteredEntries returns only vision entries. setFilters({search:'auth'}) → case-insensitive match on title+description. Combined filters (type + agent) apply AND logic. clearFilters resets all. Empty filter returns all entries",
      "Create __tests__/stores/ui-store.test.ts: test toggleAgentOverlay opens with agentId, toggle again closes. toggleCommandPalette toggles boolean. closeAll closes everything",
      "Run `npm test` and verify all store tests pass"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 6,
    "category": "testing",
    "description": "Component tests for key UI components — test rendering, user interactions, accessibility attributes, and visual states",
    "steps": [
      "Create __tests__/components/agent-node.test.tsx: test renders agent name text. Renders correct archetype icon. Shows progress bar with correct width percentage. Status dot has correct color class for each status. Click fires onClick callback. Drag updates position (simulate mousedown → mousemove → mouseup). Has role='button' and aria-label with name+status. Active status applies glow animation class",
      "Create __tests__/components/vision-card.test.tsx: test renders title. Shows agent name with archetype color. Priority dots: 3 filled for high, 2 for medium, 1 for low. Progress bar width matches completedTasks/totalTasks ratio. Left border color matches archetype. Click fires onClick (not on drag). Drag fires onDragStart with vision ID",
      "Create __tests__/components/river-entry.test.tsx: test renders correct icon character for each entry type (◆ for vision, ◇ for reflection, etc.). Shows agent attribution text. Shows relative timestamp. Click toggles expanded state. Expanded state renders preview content (DiffPreview or DiagramThumbnail). DiffStats badge shows correct +/- numbers",
      "Create __tests__/components/reflection-list.test.tsx: test groups reflections by status section. Proposed reflections show [Approve] button inline. Search input filters entries by title. Click fires selection callback with reflection ID. Accept button calls acceptReflection action",
      "Create __tests__/components/command-palette.test.tsx: test renders when open. Filters commands based on input text. Enter key selects highlighted command. Escape closes palette. Navigation commands call router.push with correct paths",
      "Create __tests__/components/status-strip.test.tsx: test shows active agent name and message when agent is active. Shows reduced opacity class when no active agent. Pulsing dot uses correct archetype color class. Click fires overlay toggle",
      "All tests use @testing-library/react: render(), screen.getByText/getByRole(), fireEvent/userEvent for interactions",
      "Run `npm test` and verify all component tests pass"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 6,
    "category": "testing",
    "description": "Integration tests for page-level flows — Canvas agent lifecycle, Vision board drag-and-drop, Reflection approval, River filtering, cross-view consistency",
    "steps": [
      "Create __tests__/pages/canvas-flow.test.tsx: render Canvas page → verify empty state message visible → fire click on canvas → verify config panel opens → fill agent name + select archetype → click Create → verify agent node appears → verify empty state message gone. Render with 2 agents → simulate drag from agent 1 handle to agent 2 → verify connection line rendered",
      "Create __tests__/pages/vision-flow.test.tsx: render Visions page → verify 4 columns visible → verify cards in correct columns (check Auth Redesign in In Progress) → simulate drag of Auth Redesign card to Review column → verify card moves to Review → click card → verify detail modal opens with correct title and task count → toggle a task checkbox → verify progress updates",
      "Create __tests__/pages/reflection-flow.test.tsx: render Reflections page → verify 3 groups visible (Active, Proposed, Superseded) → verify R-004 is in Proposed section → click R-004 → verify reader opens with content → click Accept → verify R-004 moves to Active section → verify status badge changes to green 'accepted'",
      "Create __tests__/pages/river-flow.test.tsx: render River page → verify entries grouped by date → verify 'Today' and 'Yesterday' sections → select type filter 'vision' → verify only vision entries shown → clear filter → all entries restored → type 'auth' in search → verify matching entries shown",
      "Create __tests__/pages/cross-view.test.tsx: render app → verify status strip shows active Architect agent → navigate to /river → verify Architect activity in river entries → navigate to /visions → verify Auth Redesign card shows Architect assignment → verify status strip consistent across all views",
      "Run `npm test` and verify all integration tests pass"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 7,
    "category": "feature",
    "description": "Implement full ARIA accessibility — landmarks, live regions, focus management, screen reader support, reduced motion compliance",
    "steps": [
      "Add ARIA landmarks to PsycheShell: <nav> role on top bar, <main> role on content area, <aside> role (aria-label='Agent stream') on agent overlay, <footer> role on status strip",
      "Add aria-live='polite' on status strip text — screen readers announce agent status changes automatically",
      "Ensure all archetype information is text-based, not color-only: agent nodes show archetype name text label alongside icon, status badges include text labels",
      "Add aria-labels to all icon-only buttons: theme toggle ('Toggle theme'), command palette trigger ('Open command palette, ⌘K'), agent overlay toggle ('Toggle agent panel'), zoom buttons ('Zoom in', 'Zoom out'), mode toggle ('Switch to constellation mode'/'Switch to canvas mode')",
      "Implement focus trap in modals and overlays: Tab cycles within the modal when open, focus returns to trigger element on close. Use a simple focus-trap implementation (find focusable elements, wrap Tab at boundaries)",
      "Add role='dialog' aria-modal='true' aria-labelledby to all dialogs (VisionDetailModal, VisionEditor, ReflectionEditor, AgentConfigPanel, CommandPalette). Set aria-labelledby pointing to the dialog title element",
      "Ensure diff rendering uses underline (added) and strikethrough (removed) in addition to green/red color — use text-decoration-line CSS alongside color for colorblind accessibility",
      "Verify contrast ratios: --text-primary (#e8e4df) on --bg-primary (#0a0a12) = 15.2:1 (AAA). --text-secondary (#8a8698) on --bg-primary = 5.8:1 (AA). --accent-primary (#f5c364) on --bg-primary = 10.4:1 (AAA). All archetype colors on --bg-secondary minimum 4.5:1",
      "Test with VoiceOver on macOS: navigate all views via keyboard only, verify all content is announced, verify agent status changes announced via live region, verify modal focus trapping works"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  },
  {
    "phase": 7,
    "category": "documentation",
    "description": "Create developer README with project overview, setup instructions, architecture description, design token reference, and archetype system documentation",
    "steps": [
      "Create psyche-ui/README.md with: project name and tagline ('Psyche — Multi-agent orchestration workspace'), brief description (2-3 sentences: Jungian concept, Canvas/River/Visions/Reflections, human-in-the-loop oversight)",
      "Getting Started section: prerequisites (Node.js 20+), installation (`npm install`), development (`npm run dev`), build (`npm run build`), test (`npm test`)",
      "Architecture section: 4 views explained (Canvas = spatial agent workspace, River = timeline, Visions = PRD boards, Reflections = ADR browser). State management (6 Zustand stores). Component organization (components/ directory tree with brief descriptions). Event system (SSE-based PsycheEvent flow)",
      "Design Tokens section: aesthetic overview ('Deep Introspective' — dark indigo + amber gold), link to globals.css for complete token reference, note about dark/light theme support, archetype color system",
      "Archetype table: all 8 archetypes with: name, icon, color hex, CSS variable, 1-line description",
      "Vocabulary mapping: Vision = PRD, Reflection = ADR, River = Timeline, Canvas = Agent Workspace, The Self = Human user",
      "Add link to source ADR: [ADR-0003: Psyche UI Specifications](../architecture/0003-psyche-ui-specifications.md)"
    ],
    "implemented": false,
    "improvements": [],
    "improvements_done": false
  }
]
```

## Progress Tracking

- Total Tasks: 32
- Completed: 15
- In Progress: 0
- Not Started: 17

### Phase Breakdown

- **Phase 1 — Foundation & Scaffolding** (9 tasks): 9/9 completed — Project setup + AI SDK v6 + AI Elements, design tokens, Tailwind config, types, constants, mock data, Zustand stores + hooks, app shell, command palette
- **Phase 2 — Canvas Workspace** (6 tasks): 6/6 completed — Infinite canvas with pan/zoom, agent nodes with drag/glow, connection lines, config panel, toolbar, canvas page assembly
- **Phase 3 — River & Documents** (6 tasks): 0/6 completed — River timeline components, river filters + page, vision board, vision detail/list/editor, reflections browser, agent stream overlay
- **Phase 4 — Collaboration & Polish** (5 tasks): 0/5 completed — Constellation mode, AI SDK v6 streaming + ToolLoopAgent + SSE, responsive mobile + tablet, keyboard shortcuts, view transitions/loading states
- **Phase 5 — Security Review** (1 task): 0/1 completed — Zod input validation, markdown sanitization, API protection, dependency audit, XSS testing
- **Phase 6 — Testing & Quality** (3 tasks): 0/3 completed — Store unit tests, component tests, page-level integration tests
- **Phase 7 — Accessibility & Documentation** (2 tasks): 0/2 completed — Full ARIA compliance, developer README

## Implementation Notes

### Prerequisites
- Node.js (version matching mdiff-ui/.nvmrc)
- mdiff-ui project available as reference for patterns, shadcn/ui components, and proven dependency versions
- Familiarity with Next.js 16 App Router, React 19 Server/Client Components, Zustand 5, and shadcn/ui

### Key Decisions
- **New project, not a fork**: Psyche is `psyche-ui/`, not a modification of `mdiff-ui/`. This avoids mixing two different design systems while allowing copy-paste of proven patterns (shadcn components, stores, hooks)
- **Copy shadcn/ui components**: Rather than re-initializing shadcn from scratch, copy the full `components/ui/` directory from mdiff-ui. These are stable, framework-agnostic primitives
- **AI SDK v6 for agent streaming**: Use `ai@^6.0.0` with `streamText()` / `useChat()` for agent-specific streaming (replaces mdiff's raw EventSource for agent output). Use custom SSE (EventSource) for global system events (vision/reflection/lifecycle). AI SDK v6 `ToolLoopAgent` pattern maps naturally to Psyche's archetype agents, and `needsApproval` maps to the autonomy dial (levels 1-3 require approval, 4-5 are autonomous). AI Elements components (`npx ai-elements@latest`) provide shadcn-based message/conversation UI for the Agent Stream Overlay
- **Amber-gold accent (#f5c364)**: Replaces mdiff's electric violet. All component hover/active/focus states use this accent
- **Newsreader display font**: Only used for the "Psyche" wordmark in the top bar (italic). Everything else uses Inter (body) and JetBrains Mono (code/diff)
- **No sidebar**: Top-nav only with 4 view tabs. ⌘K command palette handles deep navigation
- **Canvas-first**: `/` redirects to `/canvas` — the canvas is the home view
- **data-theme attribute**: ThemeProvider uses `attribute='data-theme'` (not `class`) to match the CSS variable selectors `:root[data-theme='dark']`
- **Zod for validation**: All form inputs validated with Zod schemas in the security phase — prevents invalid data in stores and API routes

### Testing Strategy
- **Phase 6 store tests**: Vitest to test all Zustand store mutations and computed selectors in isolation
- **Phase 6 component tests**: @testing-library/react to test rendering, interactions, and accessibility of key components
- **Phase 6 integration tests**: Page-level flow tests verifying multi-component interactions and cross-view consistency
- **Manual testing per phase**: Each phase should be manually verified in the browser before proceeding to the next
- **Responsive testing**: Test at 375px, 768px, 1024px, and 1280px+ at the end of Phase 4
- **Accessibility testing**: VoiceOver on macOS for screen reader compatibility in Phase 7

### Deployment Considerations
- Development-only for now — no production deployment target specified
- Mock data drives most views; no real backend or database
- AI SDK v6 integration (Phase 4) provides real streaming infrastructure via streamText/useChat — but agent execution itself is mocked (no real LLM API keys required for MVP; ToolLoopAgent scaffold is ready for real keys later)
- SSE infrastructure (Phase 4) uses in-memory event emitter — not persistent, resets on server restart
- AI SDK requires environment variables for LLM providers (ANTHROPIC_API_KEY, OPENAI_API_KEY) — optional for MVP, required for real agent execution
- Future phases (beyond this PRD) would add: real ToolLoopAgent execution with LLM providers, full Excalidraw embedding, database persistence, multi-user collaboration, AI Elements conversation UI in agent overlay

### Risk Assessment
- **Canvas performance**: The infinite canvas with many nodes could become sluggish. Mitigated by using CSS transforms (GPU-accelerated) instead of re-rendering, and limiting state updates during drag (requestAnimationFrame throttle). If issues arise with 50+ agents, consider canvas virtualization
- **Drag-and-drop complexity**: Three distinct drag behaviors (canvas nodes, vision board cards, connection drawing) require careful event handling. Use stopPropagation, drag thresholds, and didDrag ref patterns to prevent conflicts
- **Mobile canvas**: Touch interaction on a spatial canvas is inherently harder than desktop. Long-press-to-create (500ms) may feel unintuitive — user testing will determine if adjustments are needed
- **Constellation layout**: Force-directed algorithms can produce unstable results with certain graph topologies (disconnected subgraphs, cycles). The algorithm should be tuned for 3-10 agents with 2-8 connections and fall back to grid layout for edge cases
- **Font loading**: Newsreader is a less common Google Font; slow loading could cause layout shift. Mitigated by `next/font/google` with `display: swap` and Georgia serif fallback

### ADR Phase 4 (Advanced) — Deferred
The following ADR-0003 Phase 4 items are intentionally **out of scope** for this PRD and deferred to a future iteration:
- Full Excalidraw canvas embedding for diagram editing (only thumbnails implemented here)
- Agent dependency graph validation (cycle detection)
- Export/import workspace state
- Integration hub (Discord, Telegram, Slack notifications)
- Full-text search across all documents and River entries
- Undo/redo for canvas operations
- Collaborative multi-user support (noted as "future consideration" in ADR)

## References
- [ADR-0003: Psyche UI Specifications](../architecture/0003-psyche-ui-specifications.md)
- [ADR-0002: mdiff UI Specifications](../architecture/0002-mdiff-ui-specifications.md) (reference for proven patterns)
- [PRD-0002: mdiff UI PRD](../architecture-prd/0002-mdiff-ui-prd.md) (reference for task structure)
- mdiff-ui/ codebase (reference implementation for Next.js 16 + shadcn/ui + Zustand patterns — note: does NOT use AI SDK)
- [Vercel AI SDK v6 Documentation](https://ai-sdk.dev/docs/introduction) — ToolLoopAgent, streamText, useChat, needsApproval
- [AI SDK v6 Migration Guide](https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0) — breaking changes from v5
- [AI Elements](https://github.com/vercel/ai-elements) — shadcn-based AI UI components (message, conversation, code-block, agent)
- [Vercel React Best Practices](../.agents/skills/vercel-react-best-practices/) — 57 performance rules for React/Next.js
- [Vercel Composition Patterns](../.agents/skills/vercel-composition-patterns/) — compound components, state providers, React 19 APIs
