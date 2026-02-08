"use client"

import React from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { MDiffEvent } from "@/lib/types"

interface AgentEventLogProps {
  events: MDiffEvent[]
}

const eventIcons: Record<string, string> = {
  "agent:started": "●",
  "agent:streaming": "●",
  "agent:step-completed": "✓",
  "agent:completed": "✓",
  "agent:failed": "✗",
  "diff:created": "✓",
  "excalidraw:diff": "✓",
}

export function AgentEventLog({ events }: AgentEventLogProps) {
  return (
    <div className="p-3 space-y-1.5">
      {events.map((event) => (
        <div key={event.id} className="flex items-start gap-2 text-xs">
          <span className="text-[var(--text-muted)] font-mono flex-shrink-0 w-16">
            {format(event.timestamp, "HH:mm:ss")}
          </span>
          <span
            className={cn(
              "flex-shrink-0",
              event.type.includes("completed") || event.type.includes("created")
                ? "text-[var(--success)]"
                : event.type.includes("failed")
                  ? "text-[var(--error)]"
                  : "text-[var(--accent-primary)]"
            )}
          >
            {eventIcons[event.type] || "●"}
          </span>
          <span className="text-[var(--text-secondary)]">
            {(event.payload.message as string) || event.type}
          </span>
        </div>
      ))}
    </div>
  )
}
