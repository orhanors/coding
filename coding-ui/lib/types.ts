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

export interface Integration {
  id: string
  platform: "discord" | "telegram" | "slack"
  status: "connected" | "disconnected" | "error"
  channelName?: string
  lastDelivery?: Date
}

export interface DeliveryEntry {
  id: string
  timestamp: Date
  platform: "discord" | "telegram" | "slack"
  statusCode: number
  message: string
  success: boolean
}

export interface HistoryEntry {
  id: string
  timestamp: Date
  type: "adr" | "prd" | "prd-log" | "pipeline"
  action: string
  title: string
  description: string
  linesAdded?: number
  linesRemoved?: number
  relatedItems?: string[]
  pipelineRunId?: string
}

export type EventSubscriptions = Record<string, Record<string, boolean>>
