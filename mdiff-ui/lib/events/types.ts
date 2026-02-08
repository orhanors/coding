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
