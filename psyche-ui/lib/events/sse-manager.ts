import type { PsycheEvent, PsycheEventType } from "@/lib/types"

type Subscriber = (event: PsycheEvent) => void

class SSEManager {
  private subscribers = new Set<Subscriber>()

  emit(event: PsycheEvent) {
    this.subscribers.forEach((cb) => cb(event))
  }

  subscribe(callback: Subscriber) {
    this.subscribers.add(callback)
  }

  unsubscribe(callback: Subscriber) {
    this.subscribers.delete(callback)
  }
}

// Singleton instance
export const sseManager = new SSEManager()

export function createEvent(
  type: PsycheEventType,
  payload: Record<string, unknown> = {},
  agentId?: string
): PsycheEvent {
  return {
    id: crypto.randomUUID(),
    type,
    timestamp: new Date(),
    agentId,
    payload,
  }
}
