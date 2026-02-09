# Psyche — Multi-Agent Orchestration Workspace

Psyche is a canvas-based workspace where human architects oversee autonomous coding agents through an introspective, spatial interface. Named after Carl Jung's concept of the psyche, each agent carries a Jungian archetype reflected in its visual identity on an infinite canvas. Agents work in real-time while humans observe, guide, and approve through a meditative "Deep Introspective" interface.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/canvas` by default.

### Build

```bash
npm run build
```

### Test

```bash
npm test           # run once
npm run test:watch # watch mode
```

## Architecture

### Four Views

| View | Route | Purpose |
|------|-------|---------|
| **Canvas** | `/canvas` | Spatial agent workspace — infinite pan/zoom canvas where agents are placed, connected, and monitored |
| **River** | `/river` | Timeline of all changes — chronological feed of agent actions, code diffs, document updates |
| **Visions** | `/visions` | Product planning — Linear-like Kanban board (Backlog → In Progress → Review → Done) |
| **Reflections** | `/reflections` | Architecture decisions — browseable ADR list with version history and inline diffs |

### State Management

Six Zustand stores manage application state:

- **agent-store** — Agents, connections, config panel state
- **canvas-store** — Zoom, pan, canvas/constellation mode, selection
- **vision-store** — Visions (PRDs), board/list view mode
- **reflection-store** — Reflections (ADRs), selection
- **river-store** — Timeline entries, filters
- **ui-store** — Agent overlay, command palette state

### Component Organization

```
components/
├── layout/          # Shell, top bar, status strip, command palette, view transition
├── canvas/          # Infinite canvas, agent nodes, connection lines, config panel, toolbar, constellation layout
├── agent/           # Stream overlay, stream content, event log, controls
├── river/           # Timeline view, entries, filters, date groups, skeleton
├── visions/         # Board, cards, list, detail modal, editor, skeleton
├── reflections/     # List, reader, diff history, status badge, editor, skeleton
├── diff/            # Diff preview, diff stats
└── ui/              # 48 shadcn/ui primitives
```

### Event System

- **Global events**: SSE-based `PsycheEvent` flow via `/api/events/stream`
- **Agent streaming**: Per-agent streaming via `/api/agents/[id]/stream` (AI SDK v6 wire format)
- Events are dispatched to stores by type prefix (`agent:*`, `vision:*`, `reflection:*`, `river:*`)

## Design Tokens

The aesthetic is **"Deep Introspective"** — dark indigo with warm amber-gold accents.

- **Dark theme**: Near-black backgrounds (`#0a0a12`), warm cream text (`#e8e4df`), amber-gold accent (`#f5c364`)
- **Light theme**: Warm paper backgrounds (`#faf8f5`), dark text, deeper gold accent (`#c48a20`)
- **Typography**: Inter (body), JetBrains Mono (code/diffs), Newsreader (display — used for the "Psyche" wordmark)

See `app/globals.css` for the complete token reference.

## Archetype System

Each agent carries one of 8 Jungian archetypes:

| Archetype | Icon | Color | CSS Variable | Description |
|-----------|------|-------|-------------|-------------|
| The Architect | Compass | `#a78bfa` | `--archetype-architect` | Designs systems, creates structure |
| The Guardian | Shield | `#34d399` | `--archetype-guardian` | Tests, validates, ensures quality |
| The Explorer | Telescope | `#60a5fa` | `--archetype-explorer` | Researches, discovers, proposes |
| The Alchemist | FlaskConical | `#f59e0b` | `--archetype-alchemist` | Transforms, refactors, optimizes |
| The Shadow | Bug | `#f87171` | `--archetype-shadow` | Debugs, finds hidden issues |
| The Sage | BookOpen | `#c084fc` | `--archetype-sage` | Reviews, advises, documents |
| The Herald | Radio | `#22d3ee` | `--archetype-herald` | Communicates, integrates, notifies |
| The Trickster | Shuffle | `#fb923c` | `--archetype-trickster` | Challenges assumptions, unconventional solutions |

## Vocabulary

| Psyche Term | Traditional Equivalent |
|-------------|----------------------|
| Vision | PRD (Product Requirements Document) |
| Reflection | ADR (Architecture Decision Record) |
| River | Timeline / Activity Feed |
| Canvas | Agent Workspace |
| The Self | Human user / architect |
| Archetype | Agent personality / role |

## Tech Stack

- **Framework**: Next.js 16, React 19
- **Styling**: Tailwind CSS 4, shadcn/ui
- **State**: Zustand 5
- **Streaming**: AI SDK v6 wire format, Server-Sent Events
- **Testing**: Vitest, @testing-library/react
- **Validation**: Zod

## References

- [ADR-0003: Psyche UI Specifications](../architecture/0003-psyche-ui-specifications.md)
