"use client"

import { Circle, Wifi, WifiOff } from "lucide-react"
import type { PipelineRun, Integration } from "@/lib/types"

interface StatusBarProps {
  pipeline: PipelineRun
  integrations: Integration[]
  eventCount: number
}

const statusLabels: Record<string, string> = {
  running: "Running",
  paused: "Paused",
  completed: "Completed",
  failed: "Failed",
  idle: "Idle",
}

const statusColors: Record<string, string> = {
  running: "var(--spec-accent)",
  paused: "var(--spec-warning)",
  completed: "var(--spec-success)",
  failed: "var(--spec-error)",
  idle: "var(--spec-text-muted)",
}

export function StatusBar({ pipeline, integrations, eventCount }: StatusBarProps) {
  const connectedCount = integrations.filter((i) => i.status === "connected").length

  return (
    <footer className="flex h-7 shrink-0 items-center border-t border-[var(--spec-border-subtle)] bg-[var(--spec-bg-secondary)] px-4 text-2xs text-[var(--spec-text-muted)]">
      <div className="flex items-center gap-1.5">
        <Circle
          className="h-2 w-2"
          style={{ color: statusColors[pipeline.status], fill: statusColors[pipeline.status] }}
        />
        <span>
          Pipeline: {statusLabels[pipeline.status]}
          {pipeline.status === "running" && ` (Step ${pipeline.currentStep + 1}/${pipeline.steps.length})`}
        </span>
      </div>

      <span className="mx-3 text-[var(--spec-border-default)]">|</span>

      <span>Events: {eventCount}</span>

      <span className="mx-3 text-[var(--spec-border-default)]">|</span>

      <div className="flex items-center gap-1.5">
        {connectedCount > 0 ? (
          <Wifi className="h-3 w-3 text-[var(--spec-success)]" />
        ) : (
          <WifiOff className="h-3 w-3 text-[var(--spec-text-muted)]" />
        )}
        <span>{connectedCount}/{integrations.length} integrations</span>
      </div>

      <div className="flex-1" />

      <span className="font-mono">v0.1.0</span>
    </footer>
  )
}
