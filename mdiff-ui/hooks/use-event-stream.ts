"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { MDiffEvent } from "@/lib/types"

interface UseEventStreamReturn {
  events: MDiffEvent[]
  isConnected: boolean
  error: Error | null
}

export function useEventStream(): UseEventStreamReturn {
  const [events, setEvents] = useState<MDiffEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const eventSourceRef = useRef<EventSource | null>(null)

  const connect = useCallback(() => {
    try {
      const es = new EventSource("/api/events/stream")
      eventSourceRef.current = es

      es.onopen = () => {
        setIsConnected(true)
        setError(null)
        retryCountRef.current = 0
      }

      es.onmessage = (e) => {
        try {
          const event: MDiffEvent = JSON.parse(e.data)
          event.timestamp = new Date(event.timestamp)
          setEvents((prev) => [event, ...prev].slice(0, 100))
        } catch {
          // Ignore parse errors (e.g., keepalive comments)
        }
      }

      es.onerror = () => {
        es.close()
        setIsConnected(false)

        // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000)
        retryCountRef.current++

        retryTimeoutRef.current = setTimeout(connect, delay)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to connect"))
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      eventSourceRef.current?.close()
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    }
  }, [connect])

  return { events, isConnected, error }
}
