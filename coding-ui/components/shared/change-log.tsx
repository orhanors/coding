"use client"

import { Circle } from "lucide-react"
import type { HistoryEntry } from "@/lib/types"

interface ChangeLogProps {
  entries: HistoryEntry[]
  maxItems?: number
}

const typeColors: Record<string, string> = {
  adr: "var(--spec-pipeline-adr)",
  prd: "var(--spec-pipeline-prd)",
  "prd-log": "var(--spec-pipeline-prd)",
  pipeline: "var(--spec-pipeline-implement)",
}

function timeAgo(date: Date) {
  const now = new Date("2026-02-08T14:35:00")
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function ChangeLog({ entries, maxItems = 5 }: ChangeLogProps) {
  return (
    <div className="flex flex-col">
      {entries.slice(0, maxItems).map((entry, index) => (
        <div
          key={entry.id}
          className="flex gap-3 border-b border-[var(--spec-border-subtle)] px-3 py-3 last:border-b-0"
        >
          <div className="flex flex-col items-center">
            <Circle
              className="h-2.5 w-2.5 mt-1 shrink-0"
              style={{
                color: typeColors[entry.type],
                fill: typeColors[entry.type],
              }}
            />
            {index < Math.min(entries.length, maxItems) - 1 && (
              <div className="w-px flex-1 bg-[var(--spec-border-subtle)] mt-1" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--spec-text-primary)]">
                {entry.title} {entry.action}
              </span>
            </div>
            <p className="text-xs text-[var(--spec-text-secondary)] mt-0.5">
              {entry.description}
            </p>
            {(entry.linesAdded || entry.linesRemoved) && (
              <div className="flex gap-2 mt-1">
                {entry.linesAdded !== undefined && entry.linesAdded > 0 && (
                  <span className="text-2xs text-[var(--spec-success)]">+{entry.linesAdded}</span>
                )}
                {entry.linesRemoved !== undefined && entry.linesRemoved > 0 && (
                  <span className="text-2xs text-[var(--spec-error)]">-{entry.linesRemoved}</span>
                )}
              </div>
            )}
            <span className="text-2xs text-[var(--spec-text-muted)] mt-1 block">
              {timeAgo(entry.timestamp)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
