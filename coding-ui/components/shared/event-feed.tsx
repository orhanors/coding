"use client"

import React from "react"

import { Circle, Check, X, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PipelineEvent } from "@/lib/types"

interface EventFeedProps {
  events: PipelineEvent[]
  maxHeight?: string
  compact?: boolean
}

const stageLabels: Record<string, string> = {
  adr: "ADR",
  excalidraw: "EXCL",
  prd: "PRD",
  implement: "IMPL",
  system: "SYS",
}

const stageColors: Record<string, string> = {
  adr: "var(--ac-pipeline-adr)",
  excalidraw: "var(--ac-pipeline-excalidraw)",
  prd: "var(--ac-pipeline-prd)",
  implement: "var(--ac-pipeline-implement)",
  system: "var(--ac-text-muted)",
}

const typeIcons: Record<string, React.ReactNode> = {
  completed: <Check className="h-3 w-3" />,
  failed: <X className="h-3 w-3" />,
  created: <Circle className="h-3 w-3" />,
  updated: <Info className="h-3 w-3" />,
  info: <Info className="h-3 w-3" />,
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

export function EventFeed({ events, maxHeight = "300px", compact = false }: EventFeedProps) {
  return (
    <div
      className="flex flex-col overflow-y-auto scrollbar-thin"
      style={{ maxHeight }}
      role="log"
      aria-label="Pipeline events"
    >
      {events.map((event) => (
        <div
          key={event.id}
          className={cn(
            "flex items-start gap-2 border-b border-[var(--ac-border-subtle)] animate-slide-in",
            compact ? "px-2 py-1" : "px-3 py-2"
          )}
        >
          <span className="shrink-0 font-mono text-2xs text-[var(--ac-text-muted)] pt-0.5">
            {formatTime(event.timestamp)}
          </span>
          <span
            className="shrink-0 rounded px-1.5 py-0.5 text-2xs font-medium"
            style={{
              color: stageColors[event.stage],
              backgroundColor: `color-mix(in srgb, ${stageColors[event.stage]} 15%, transparent)`,
            }}
          >
            [{stageLabels[event.stage]}]
          </span>
          <span
            className="shrink-0 pt-0.5"
            style={{ color: event.type === "failed" ? "var(--ac-error)" : stageColors[event.stage] }}
          >
            {typeIcons[event.type]}
          </span>
          <span className="text-xs text-[var(--ac-text-secondary)] leading-relaxed">
            {event.message}
          </span>
        </div>
      ))}
    </div>
  )
}
