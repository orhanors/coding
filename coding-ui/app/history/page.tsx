"use client"

import { useState } from "react"
import { Circle, GitBranch, Clock, Filter, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { mockHistory } from "@/lib/mock-data"
import type { HistoryEntry } from "@/lib/types"

const typeColors: Record<string, string> = {
  adr: "var(--spec-pipeline-adr)",
  prd: "var(--spec-pipeline-prd)",
  "prd-log": "var(--spec-pipeline-prd)",
  pipeline: "var(--spec-pipeline-implement)",
}

const typeLabels: Record<string, string> = {
  adr: "ADR",
  prd: "PRD",
  "prd-log": "PRD Log",
  pipeline: "Pipeline",
}

function formatDateTime(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function HistoryCard({ entry }: { entry: HistoryEntry }) {
  const color = typeColors[entry.type]

  return (
    <div className="flex gap-4 px-6 py-4">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center pt-1">
        <Circle
          className="h-3 w-3 shrink-0"
          style={{ color, fill: color }}
        />
        <div className="w-px flex-1 bg-[var(--spec-border-subtle)] mt-1" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className="rounded px-1.5 py-0.5 text-2xs font-medium"
            style={{
              color,
              backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
            }}
          >
            {typeLabels[entry.type]}
          </span>
          <span className="text-sm font-medium text-[var(--spec-text-primary)]">
            {entry.title}
          </span>
          <span className="text-xs text-[var(--spec-text-secondary)]">{entry.action}</span>
        </div>

        <p className="text-xs text-[var(--spec-text-secondary)] mb-2">{entry.description}</p>

        {/* Line changes */}
        {(entry.linesAdded !== undefined || entry.linesRemoved !== undefined) && (
          <div className="flex gap-3 mb-2">
            {entry.linesAdded !== undefined && entry.linesAdded > 0 && (
              <span className="flex items-center gap-0.5 text-2xs text-[var(--spec-success)]">
                <Plus className="h-3 w-3" />
                {entry.linesAdded} lines
              </span>
            )}
            {entry.linesRemoved !== undefined && entry.linesRemoved > 0 && (
              <span className="flex items-center gap-0.5 text-2xs text-[var(--spec-error)]">
                <Minus className="h-3 w-3" />
                {entry.linesRemoved} lines
              </span>
            )}
          </div>
        )}

        {/* Related items */}
        {entry.relatedItems && entry.relatedItems.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {entry.relatedItems.map((item, i) => (
              <span key={i} className="text-2xs text-[var(--spec-text-muted)]">
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mt-2 text-2xs text-[var(--spec-text-muted)]">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDateTime(entry.timestamp)}
          </span>
          {entry.pipelineRunId && (
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {entry.pipelineRunId}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<string | null>(null)

  const filteredHistory = filter
    ? mockHistory.filter((e) => e.type === filter)
    : mockHistory

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--spec-border-subtle)] px-6 py-3">
        <h1 className="text-lg font-semibold text-[var(--spec-text-primary)]">History</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-7 text-2xs border-[var(--spec-border-default)] bg-transparent hover:bg-[var(--spec-bg-hover)]",
              filter === null
                ? "text-[var(--spec-accent)] border-[var(--spec-accent)]"
                : "text-[var(--spec-text-secondary)] hover:text-[var(--spec-text-primary)]"
            )}
            onClick={() => setFilter(null)}
          >
            All
          </Button>
          {(["adr", "prd", "prd-log"] as const).map((type) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              className={cn(
                "h-7 text-2xs border-[var(--spec-border-default)] bg-transparent hover:bg-[var(--spec-bg-hover)]",
                filter === type
                  ? "border-[var(--spec-accent)]"
                  : "text-[var(--spec-text-secondary)] hover:text-[var(--spec-text-primary)]"
              )}
              style={filter === type ? { color: typeColors[type], borderColor: typeColors[type] } : undefined}
              onClick={() => setFilter(type)}
            >
              {typeLabels[type]}
            </Button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredHistory.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-[var(--spec-text-muted)]">No history entries found</p>
          </div>
        ) : (
          filteredHistory.map((entry) => (
            <HistoryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  )
}
