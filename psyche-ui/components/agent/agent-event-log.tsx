"use client"

import { format } from "date-fns"
import type { AgentEvent } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AgentEventLogProps {
  events: AgentEvent[]
}

const EVENT_COLORS: Record<string, string> = {
  "agent:started": "var(--success)",
  "agent:streaming": "var(--info)",
  "agent:step-completed": "var(--accent-primary)",
  "agent:completed": "var(--success)",
  "agent:failed": "var(--error)",
  "agent:paused": "var(--warning)",
  "agent:resumed": "var(--info)",
}

export function AgentEventLog({ events }: AgentEventLogProps) {
  if (events.length === 0) {
    return (
      <div className="px-4 py-4 text-center text-xs text-[var(--text-muted)]">
        No events yet
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="h-px flex-1 bg-[var(--border-subtle)]" />
        <span className="text-[0.625rem] uppercase tracking-wider text-[var(--text-muted)]">
          Event Log
        </span>
        <div className="h-px flex-1 bg-[var(--border-subtle)]" />
      </div>
      <ScrollArea className="max-h-[200px]">
        <div className="space-y-1 px-4 pb-3">
          {events.map((event) => {
            const eventLabel = event.type.split(":")[1] ?? event.type
            const color = EVENT_COLORS[event.type] ?? "var(--text-muted)"

            return (
              <div key={event.id} className="flex items-start gap-2 text-xs">
                <span className="shrink-0 font-mono text-[var(--text-muted)]">
                  {format(event.timestamp, "HH:mm")}
                </span>
                <span
                  className="shrink-0 font-medium"
                  style={{ color }}
                >
                  {eventLabel}
                </span>
                <span className="text-[var(--text-secondary)]">{event.message}</span>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
