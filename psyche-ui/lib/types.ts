/* ═══════════════════════════════════════════
   PSYCHE — Core Type System
   ═══════════════════════════════════════════ */

// Agent Archetypes — Jungian personality system
export type AgentArchetype =
  | "architect"
  | "guardian"
  | "explorer"
  | "alchemist"
  | "shadow"
  | "sage"
  | "herald"
  | "trickster"

// Agent Status
export type AgentStatus = "idle" | "active" | "completed" | "error" | "paused"

// Agent
export interface Agent {
  id: string
  name: string
  archetype: AgentArchetype
  task: string
  status: AgentStatus
  autonomy: 1 | 2 | 3 | 4 | 5
  progress?: number
  position: { x: number; y: number }
  dependsOn: string[]
  outputFeeds: string[]
  createdAt: Date
  updatedAt: Date
  streamContent?: string
  events: AgentEvent[]
}

// Agent Configuration (for creation/editing)
export interface AgentConfig {
  name: string
  archetype: AgentArchetype
  task: string
  autonomy: 1 | 2 | 3 | 4 | 5
  dependsOn?: string[]
  outputFeeds?: string[]
}

// Vision (formerly PRD)
export interface Vision {
  id: string
  title: string
  overview: string
  stage: "backlog" | "in_progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  assignedAgent?: string
  tasks: VisionTask[]
  totalTasks: number
  completedTasks: number
  changeHistory: ChangeEntry[]
  createdAt: Date
  updatedAt: Date
}

export interface VisionTask {
  id: string
  phase: number
  category:
    | "setup"
    | "feature"
    | "integration"
    | "optimization"
    | "security"
    | "testing"
    | "documentation"
  description: string
  steps: string[]
  implemented: boolean
}

// Reflection (formerly ADR)
export interface Reflection {
  id: string
  number: number
  title: string
  status: "proposed" | "accepted" | "superseded" | "deprecated"
  content: string
  author: "agent" | "human"
  agentId?: string
  versions: ReflectionVersion[]
  supersededBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface ReflectionVersion {
  id: string
  version: number
  diff: DiffHunk[]
  author: "agent" | "human"
  agentId?: string
  timestamp: Date
  description: string
}

// River Entry
export interface RiverEntry {
  id: string
  type: "vision" | "reflection" | "diagram" | "code" | "status" | "agent"
  title: string
  description: string
  agent?: { id: string; name: string; archetype: AgentArchetype }
  timestamp: Date
  stats?: DiffStats
  linkedDocumentId?: string
  linkedDocumentType?: "vision" | "reflection"
  excalidrawSnapshot?: string
  diffHunks?: DiffHunk[]
}

// Change Entry (for document history)
export interface ChangeEntry {
  id: string
  timestamp: Date
  description: string
  author: "agent" | "human"
  agentId?: string
  agentName?: string
}

// Diff types (reused from mdiff)
export interface DiffStats {
  linesAdded?: number
  linesRemoved?: number
  nodesAdded?: number
  nodesRemoved?: number
  edgesAdded?: number
  edgesRemoved?: number
}

export interface DiffHunk {
  oldStart: number
  oldCount: number
  newStart: number
  newCount: number
  lines: DiffLine[]
}

export interface DiffLine {
  type: "context" | "added" | "removed"
  content: string
  lineNumber: number
}

// Event system
export type PsycheEventType =
  | "agent:created"
  | "agent:started"
  | "agent:streaming"
  | "agent:step-completed"
  | "agent:completed"
  | "agent:failed"
  | "agent:paused"
  | "agent:resumed"
  | "vision:created"
  | "vision:updated"
  | "vision:task-completed"
  | "reflection:proposed"
  | "reflection:accepted"
  | "reflection:superseded"
  | "diagram:updated"
  | "code:changed"
  | "river:entry-added"

export interface PsycheEvent {
  id: string
  type: PsycheEventType
  timestamp: Date
  agentId?: string
  payload: Record<string, unknown>
}

export interface AgentEvent {
  id: string
  type: PsycheEventType
  timestamp: Date
  message: string
}

// Command palette
export interface Command {
  id: string
  label: string
  category: "navigation" | "agent" | "document" | "setting"
  shortcut?: string
  action: () => void
}

// ═══════════════════════════════════════════
// Component Prop Interfaces
// ═══════════════════════════════════════════

export interface AgentNodeProps {
  agent: Agent
  isSelected?: boolean
  onSelect?: (id: string) => void
  onDragEnd?: (id: string, position: { x: number; y: number }) => void
  onOpenConfig?: (id: string) => void
}

export interface AgentConfigPanelProps {
  agent?: Agent
  isOpen: boolean
  onClose: () => void
  onSave: (config: AgentConfig) => void
  onDelete?: (id: string) => void
  availableAgents: Agent[]
}

export interface InfiniteCanvasProps {
  agents: Agent[]
  connections: ConnectionData[]
  zoom: number
  pan: { x: number; y: number }
  onZoomChange: (zoom: number) => void
  onPanChange: (pan: { x: number; y: number }) => void
  onAgentSelect: (id: string) => void
  onCanvasClick: (position: { x: number; y: number }) => void
}

export interface ConnectionData {
  id: string
  sourceId: string
  targetId: string
  isActive?: boolean
}

export interface ConnectionLineProps {
  source: { x: number; y: number }
  target: { x: number; y: number }
  isActive?: boolean
  archetypeColor?: string
}

export interface VisionCardProps {
  vision: Vision
  isDragging?: boolean
  onOpen?: (id: string) => void
  onDragStart?: () => void
}

export interface ReflectionReaderProps {
  reflection: Reflection
  onAccept?: (id: string) => void
  onSupersede?: (id: string) => void
  onEdit?: (id: string) => void
  showVersionHistory?: boolean
}

export interface RiverEntryProps {
  id: string
  type: "vision" | "reflection" | "diagram" | "code" | "status" | "agent"
  title: string
  description: string
  agent?: { name: string; archetype: AgentArchetype }
  timestamp: Date
  stats?: DiffStats
  preview?: React.ReactNode
  isExpanded?: boolean
  onToggle?: () => void
  onNavigate?: () => void
}

export interface StatusStripProps {
  activeAgent?: { name: string; archetype: AgentArchetype; message: string }
  pendingCount: number
  version: string
  onClick?: () => void
}

export interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  commands: Command[]
  onSelect: (command: Command) => void
}
