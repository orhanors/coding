# mdiff — Component API Reference

## Layout

### `MdiffTopBar`
**File:** `components/layout/mdiff-top-bar.tsx`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `notificationCount` | `number` | `0` | Badge count on bell icon |
| `onCommandPalette` | `() => void` | — | Opens command palette |
| `onNotificationClick` | `() => void` | — | Bell click handler |

Fixed 56px header with scroll-aware frosted glass. Desktop: centered nav (Projects, Timeline, Integrations). Mobile: hamburger menu.

### `StatusStrip`
**File:** `components/layout/status-strip.tsx`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `agentActive` | `boolean` | `false` | Shows active pulse dot |
| `agentMessage` | `string` | — | Current agent task text |
| `pendingDiffs` | `number` | `0` | Pending diff count |
| `onAgentClick` | `() => void` | — | Opens agent overlay |

Fixed 24px bottom strip. Fades to 30% opacity when idle.

### `MdiffShell`
**File:** `components/layout/mdiff-shell.tsx`

Wraps the application with TopBar, StatusStrip, CommandPalette, and AgentStreamOverlay. Manages keyboard shortcut (⌘K).

### `CommandPalette`
**File:** `components/layout/command-palette.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Visibility state |
| `onOpenChange` | `(open: boolean) => void` | Toggle handler |

Uses shadcn Command Dialog. Groups: Navigation, Projects, Actions.

---

## Diff

### `DiffCard`
**File:** `components/diff/diff-card.tsx`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `diff` | `Diff` | — | Diff data object |
| `defaultExpanded` | `boolean` | `false` | Start expanded |

Expandable card showing document name, author, timestamp, stats. Renders `DiffHunkView` for each hunk when expanded.

### `DiffViewer`
**File:** `components/diff/diff-viewer.tsx`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `oldContent` | `string` | — | Original content |
| `newContent` | `string` | — | Modified content |
| `oldLabel` | `string` | `"Before"` | Left label |
| `newLabel` | `string` | `"After"` | Right label |
| `mode` | `"unified" \| "split"` | `"unified"` | Initial view mode |
| `onApproveHunk` | `(index: number) => void` | — | Hunk approval callback |
| `onRejectHunk` | `(index: number) => void` | — | Hunk rejection callback |

Full diff viewer with unified/split toggle and hunk-level approve/reject.

### `DiffStats`
**File:** `components/diff/diff-stats.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `stats` | `DiffStats` | Stats object (lines or nodes/edges) |

Renders `+N -M` for text diffs, `+N nodes` for Excalidraw diffs.

### `DiffHunkView`
**File:** `components/diff/diff-hunk.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `hunk` | `DiffHunk` | Hunk data with lines |
| `hunkIndex` | `number` | Index for approve/reject |
| `onApprove` | `(index: number) => void` | Approve callback |
| `onReject` | `(index: number) => void` | Reject callback |

---

## Project

### `ProjectCard`
**File:** `components/project/project-card.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `project` | `Project` | Project data |

Clickable card linking to `/projects/{id}`. Shows name, ADR/PRD counts, agent status dot, last diff time.

### `AddProjectCard`
**File:** `components/project/add-project-card.tsx`

Dashed-border card that navigates to create project flow.

---

## Document

### `MdiffDocumentList`
**File:** `components/document/mdiff-document-list.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `documents` | `MDiffDocument[]` | List of documents |
| `selectedId` | `string \| null` | Currently selected |
| `onSelect` | `(id: string) => void` | Selection handler |

Groups documents by type (ADR, PRD, PRD-log). Sort controls for date/name/type.

### `MdiffDocumentReader`
**File:** `components/document/mdiff-document-reader.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `document` | `MDiffDocument \| null` | Document to display |

Simple markdown renderer with edit toggle (switches to textarea).

---

## Agent

### `AgentStreamOverlay`
**File:** `components/agent/agent-stream-overlay.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Visibility |
| `minimized` | `boolean` | Minimized (header-only) |
| `onClose` | `() => void` | Close handler |
| `onMinimize` | `() => void` | Minimize toggle |

360px right panel with slide-in animation. Contains AIStreamView and AgentEventLog.

### `AIStreamView`
**File:** `components/agent/ai-stream-view.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `content` | `string` | Streaming text content |
| `active` | `boolean` | Shows blinking cursor |

### `AgentEventLog`
**File:** `components/agent/agent-event-log.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `events` | `MDiffEvent[]` | Event list |

Compact event list with timestamps and status icons.

---

## A2UI

### `A2UIRenderer`
**File:** `components/a2ui/a2ui-renderer.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `payload` | `A2UIPayload` | Array of A2UI components |
| `onAction` | `(id: string, data: unknown) => void` | Action handler |

Renders A2UI declarative components: `text`, `progress`, `list`, `button`, `card`, `code`. Unknown types render a dashed-border fallback.

---

## Integrations

### `MdiffIntegrationCard`
**File:** `components/integrations/mdiff-integration-card.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `integration` | `Integration` | Integration data |
| `onConfigure` | `() => void` | Configure handler |
| `onTest` | `() => void` | Test handler |

Connected: solid border, capabilities, Configure/Test buttons. Disconnected: dashed border, Connect link.

### `MdiffDeliveryLog`
**File:** `components/integrations/mdiff-delivery-log.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `entries` | `DeliveryEntry[]` | Delivery log entries |

Timestamped rows with platform badges and success/fail indicators.

### `IntegrationConfigSheet`
**File:** `components/integrations/integration-config-sheet.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `integration` | `Integration \| null` | Integration to configure |
| `open` | `boolean` | Sheet visibility |
| `onOpenChange` | `(open: boolean) => void` | Toggle |

Bottom slide-in sheet with token/webhook URL fields, channel name, event subscriptions.
