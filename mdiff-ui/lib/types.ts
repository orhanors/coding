// ── mdiff core types ──

export interface Project {
  id: string
  name: string
  adrCount: number
  prdCount: number
  lastDiffAt: Date
  agentStatus: "active" | "idle"
  description?: string
  createdAt: Date
}

export interface Diff {
  id: string
  projectId: string
  type: "adr" | "prd" | "prd-log" | "excalidraw"
  documentName: string
  description: string
  timestamp: Date
  author: "agent" | "user"
  stats: DiffStats
  hunks?: DiffHunk[]
}

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

export interface MDiffDocument {
  id: string
  name: string
  type: "adr" | "prd" | "prd-log"
  status: "proposed" | "accepted" | "deprecated" | "active" | "completed"
  lastModified: Date
  diffCount: number
  content?: string
  projectId: string
}

export type MDiffEventType =
  | "diff:created"
  | "diff:updated"
  | "agent:started"
  | "agent:streaming"
  | "agent:step-completed"
  | "agent:completed"
  | "agent:failed"
  | "a2ui:update"
  | "a2ui:clear"
  | "excalidraw:diff"
  | "document:saved"
  | "document:status-changed"
  | "integration:sent"
  | "integration:failed"
  | "project:created"
  | "feature:added"

export interface MDiffEvent {
  id: string
  type: MDiffEventType
  timestamp: Date
  payload: Record<string, unknown>
}

export interface TimelineEntry {
  id: string
  timestamp: Date
  projectName: string
  type: "adr" | "prd" | "prd-log" | "excalidraw" | "status-change"
  description: string
  stats?: DiffStats
  linkedEntries?: string[]
}

export interface Integration {
  id: string
  platform: "discord" | "telegram" | "slack"
  status: "connected" | "disconnected" | "error"
  channelName?: string
  capabilities: {
    trigger: boolean
    notify: boolean
  }
  lastActivity?: Date
}

export interface DeliveryEntry {
  id: string
  timestamp: Date
  platform: "discord" | "telegram" | "slack"
  success: boolean
  message: string
  retrying?: boolean
}

export interface AgentState {
  active: boolean
  projectId: string | null
  currentTask: string | null
  streamContent: string
  events: MDiffEvent[]
}

// ── A2UI types ──

export interface A2UIComponent {
  id: string
  type: string
  props: Record<string, unknown>
  children?: string[]
}

export type A2UIPayload = A2UIComponent[]

// ── PRD Board types ──

export type PrdStage = "backlog" | "in_progress" | "review" | "done"

export type PrdTaskCategory =
  | "setup"
  | "feature"
  | "integration"
  | "optimization"
  | "security"
  | "testing"
  | "documentation"

export interface PrdTask {
  phase: number
  category: PrdTaskCategory
  description: string
  steps: string[]
  implemented: boolean
  improvements: string[]
  improvements_done: boolean
}

export interface PrdBoardItem {
  id: string
  projectId: string
  name: string
  description: string
  stage: PrdStage
  priority: "low" | "medium" | "high"
  totalTasks: number
  completedTasks: number
  author: "agent" | "user"
  createdAt: Date
  updatedAt: Date
  sourceAdr?: string
  overview?: string
  tasks: PrdTask[]
}

// ── Legacy types (kept for backwards compat during migration) ──

export interface PipelineEvent {
  id: string
  timestamp: Date
  stage: "adr" | "excalidraw" | "prd" | "implement" | "system"
  type: "created" | "updated" | "completed" | "failed" | "info"
  message: string
  metadata?: Record<string, unknown>
}

export interface PipelineStep {
  id: string
  name: string
  status: "pending" | "running" | "completed" | "failed"
  duration?: number
  output?: string
}

export interface PipelineRun {
  id: string
  number: number
  status: "running" | "paused" | "completed" | "failed" | "idle"
  steps: PipelineStep[]
  currentStep: number
  startedAt: Date
  events: PipelineEvent[]
}

export interface DocumentNode {
  id: string
  name: string
  type: "adr" | "prd" | "prd-log"
  status: "proposed" | "accepted" | "deprecated" | "active" | "completed"
  children?: DocumentNode[]
  lastModified: Date
  content?: string
}

export interface DocumentChange {
  id: string
  timestamp: Date
  description: string
  linesAdded: number
  linesRemoved: number
  author: string
  pipelineRunId?: string
}

export type EventSubscriptions = Record<string, Record<string, boolean>>

export interface ArchitectureNode {
  id: string
  label: string
  type: "service" | "database" | "cache" | "queue" | "gateway"
  x: number
  y: number
  width: number
  height: number
}

export interface ArchitectureEdge {
  id: string
  from: string
  to: string
  label?: string
  style: "solid" | "dashed"
}

export interface ArchitectureSnapshot {
  nodes: ArchitectureNode[]
  edges: ArchitectureEdge[]
}

export interface ArchitectureCommit {
  id: string
  hash: string
  message: string
  author: string
  timestamp: Date
  adrRef: string
  snapshot: ArchitectureSnapshot
  stats: { nodes: number; edges: number }
}

export interface NodeDiff {
  node: ArchitectureNode
  status: "added" | "removed" | "modified" | "unchanged"
}

export interface EdgeDiff {
  edge: ArchitectureEdge
  status: "added" | "removed" | "modified" | "unchanged"
}

export interface ArchitectureDiff {
  nodes: NodeDiff[]
  edges: EdgeDiff[]
  stats: {
    nodesAdded: number
    nodesRemoved: number
    nodesModified: number
    edgesAdded: number
    edgesRemoved: number
    edgesModified: number
  }
}
