# mdiff — Frontend Architecture

## App Shell

mdiff uses a top-nav-only layout (no sidebar). The shell structure:

```
┌─────────────────────────────────────┐
│  MdiffTopBar (56px, fixed)          │
│  ┌─────────────┐                    │
│  │ wordmark    nav    actions      │
│  └─────────────┘                    │
├─────────────────────────────────────┤
│                                     │
│  <main> (max-w-1200px, centered)    │
│  Page content here                  │
│                                     │
│                  ┌─────────────────┐│
│                  │ AgentOverlay    ││
│                  │ (360px right)   ││
│                  └─────────────────┘│
├─────────────────────────────────────┤
│  StatusStrip (24px, fixed)          │
└─────────────────────────────────────┘
```

The `MdiffShell` component (`components/layout/mdiff-shell.tsx`) manages the overall layout, keyboard shortcuts, and overlay state.

## Routing

Next.js 16 App Router with the following routes:

| Route | Page | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Dashboard — project grid + recent diffs |
| `/projects/[id]` | `app/projects/[id]/page.tsx` | Project workspace with tabs (Diffs, Docs, Diagram, A2UI) |
| `/timeline` | `app/timeline/page.tsx` | Cross-project timeline with filters |
| `/integrations` | `app/integrations/page.tsx` | Integration hub |

### API Routes

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/projects` | GET, POST | List/create projects |
| `/api/projects/[id]` | GET, PUT, DELETE | Project CRUD |
| `/api/projects/[id]/diffs` | GET | List diffs (filter, paginate) |
| `/api/projects/[id]/documents` | GET, POST | Project documents |
| `/api/projects/[id]/features` | GET, POST | Project features |
| `/api/integrations` | GET, POST | List/create integrations |
| `/api/integrations/[id]` | GET, PUT, DELETE | Integration CRUD |
| `/api/integrations/[id]/test` | POST | Test connection |
| `/api/integrations/webhook` | POST | Incoming webhook handler |
| `/api/events/stream` | GET | SSE event stream |
| `/api/events/test` | POST | Emit test event |

## State Management

Four Zustand stores manage client state:

### `useProjectStore` (`stores/project-store.ts`)
- `projects: Project[]` — All projects
- `selectedProjectId: string | null`
- Actions: `addProject`, `removeProject`, `updateProject`, `setSelectedProject`

### `useDiffStore` (`stores/diff-store.ts`)
- `diffs: Diff[]` — All diffs
- `loading: boolean`
- Actions: `addDiff`, `setDiffs`, `setLoading`

### `useAgentStore` (`stores/agent-store.ts`)
- `active`, `projectId`, `currentTask`, `streamContent`, `events`
- Actions: `setActive`, `appendStream`, `addEvent` (capped at 100), `clear`

### `useUIStore` (`stores/ui-store.ts`)
- `agentOverlayOpen`, `agentOverlayMinimized`, `commandPaletteOpen`, `theme`
- Actions: toggle/set methods

## Real-Time Event Flow (SSE)

```
Server                          Client
──────                          ──────
sseManager.emitEvent() ──→ /api/events/stream (ReadableStream)
                               │
                               ↓
                         useEventStream() hook
                               │
                               ↓
                         Zustand stores update
                               │
                               ↓
                         UI re-renders
```

- `lib/events/sse-manager.ts` — Node EventEmitter singleton, `emitEvent()` and `subscribe()`
- `app/api/events/stream/route.ts` — GET handler returning `text/event-stream` with 30s keepalive
- `hooks/use-event-stream.ts` — Client-side EventSource with exponential backoff reconnection (1s → 30s max), stores last 100 events

## A2UI Integration

Google's A2UI (Agent-to-UI) protocol for declarative UI from agents:

```
Agent produces A2UIPayload → SSE → A2UIRenderer → Component map → React
```

Supported component types: `text`, `progress`, `list`, `button`, `card`, `code`. Unknown types render a fallback. The component registry (`components/a2ui/component-registry.ts`) allows extending the map.

## Integration Dispatch Flow

```
Event occurs (diff created, agent completed, etc.)
       │
       ↓
lib/integrations/dispatcher.ts
       │
       ├──→ Telegram (bot API)
       ├──→ Discord (webhook)
       └──→ Slack (webhook)
```

The dispatcher checks which integrations are connected and have matching event subscriptions, then delivers to each platform. Delivery results are logged in the delivery log.

## Technology Stack

- **Framework:** Next.js 16.1.6 (App Router, React 19)
- **Styling:** Tailwind CSS 3.4 with CSS custom properties
- **UI Primitives:** shadcn/ui (52 components via Radix UI)
- **State:** Zustand 5
- **Testing:** Vitest + React Testing Library
- **Fonts:** Inter (sans), JetBrains Mono (mono)
