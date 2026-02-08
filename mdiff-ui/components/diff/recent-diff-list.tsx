"use client"

import React from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { DiffStats } from "./diff-stats"
import type { Diff } from "@/lib/types"
import { cn } from "@/lib/utils"

const typeColors: Record<string, string> = {
  adr: "bg-[var(--stage-adr)]",
  prd: "bg-[var(--stage-prd)]",
  "prd-log": "bg-[var(--stage-prd)]",
  excalidraw: "bg-[var(--stage-excalidraw)]",
}

interface RecentDiffListProps {
  diffs: Diff[]
}

export function RecentDiffList({ diffs }: RecentDiffListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Diffs</h2>
        <Link
          href="/timeline"
          className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden">
        {diffs.map((diff, i) => (
          <Link
            key={diff.id}
            href={`/projects/${diff.projectId}`}
            className={cn(
              "flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors",
              i !== diffs.length - 1 && "border-b border-[var(--border-subtle)]"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full flex-shrink-0", typeColors[diff.type])} />

            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text-primary)] truncate">
                <span className="text-[var(--text-secondary)]">{diff.projectId}</span>
                {" / "}
                {diff.documentName}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">{diff.description}</p>
            </div>

            <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
              {formatDistanceToNow(diff.timestamp, { addSuffix: true })}
            </span>

            <DiffStats stats={diff.stats} />
          </Link>
        ))}
      </div>
    </div>
  )
}
