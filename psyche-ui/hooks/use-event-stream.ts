"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { PsycheEvent, PsycheEventType } from "@/lib/types"

const VALID_EVENT_TYPES: PsycheEventType[] = [
  "agent:created", "agent:started", "agent:streaming", "agent:step-completed",
  "agent:completed", "agent:failed", "agent:paused", "agent:resumed",
  "vision:created", "vision:updated", "vision:task-completed",
  "reflection:proposed", "reflection:accepted", "reflection:superseded",
  "diagram:updated", "code:changed", "river:entry-added",
]

export function useEventStream() {
  const [connected, setConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<PsycheEvent | null>(null)
  const sourceRef = useRef<EventSource | null>(null)
  const retryDelay = useRef(1000)

  const connect = useCallback(() => {
    if (sourceRef.current) return

    const source = new EventSource("/api/events/stream")
    sourceRef.current = source

    source.onopen = () => {
      setConnected(true)
      retryDelay.current = 1000 // Reset backoff on successful connect
    }

    source.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as PsycheEvent
        // Validate event type before dispatching
        if (VALID_EVENT_TYPES.includes(event.type)) {
          setLastEvent(event)
        }
      } catch {
        // Ignore malformed events
      }
    }

    source.onerror = () => {
      setConnected(false)
      source.close()
      sourceRef.current = null

      // Exponential backoff reconnection (1s → 30s max)
      const delay = retryDelay.current
      retryDelay.current = Math.min(delay * 2, 30000)
      setTimeout(connect, delay)
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      sourceRef.current?.close()
      sourceRef.current = null
    }
  }, [connect])

  return { connected, lastEvent }
}
