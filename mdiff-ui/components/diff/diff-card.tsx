"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { DiffStats } from "./diff-stats"
import { DiffHunkView } from "./diff-hunk"
import type { Diff } from "@/lib/types"

interface DiffCardProps {
  diff: Diff
  defaultExpanded?: boolean
}

export function DiffCard({ diff, defaultExpanded = false }: DiffCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-hover)] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-[var(--text-primary)]">{diff.documentName}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
              by {diff.author}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {formatDistanceToNow(diff.timestamp, { addSuffix: true })}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <DiffStats stats={diff.stats} />
          <ChevronDown
            className={cn(
              "w-4 h-4 text-[var(--text-muted)] transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Expanded content */}
      {expanded && diff.hunks && diff.hunks.length > 0 && (
        <div
          className="px-4 pb-4 space-y-3 border-t border-[var(--border-subtle)]"
          style={{
            animation: "fade-in 0.2s cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        >
          <div className="pt-3" />
          {diff.hunks.map((hunk, i) => (
            <DiffHunkView key={i} hunk={hunk} hunkIndex={i} />
          ))}
        </div>
      )}
    </div>
  )
}
