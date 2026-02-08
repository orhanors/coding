import { EventEmitter } from "events"
import type { MDiffEvent } from "./types"

class SSEManager extends EventEmitter {
  emit(eventName: string | symbol, ...args: unknown[]): boolean {
    return super.emit(eventName, ...args)
  }

  emitEvent(event: MDiffEvent): void {
    this.emit("mdiff-event", event)
  }

  subscribe(callback: (event: MDiffEvent) => void): () => void {
    this.on("mdiff-event", callback)
    return () => this.off("mdiff-event", callback)
  }
}

// Module-level singleton
export const sseManager = new SSEManager()
