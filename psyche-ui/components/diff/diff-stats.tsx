"use client"

import type { DiffStats } from "@/lib/types"

interface DiffStatsBadgeProps {
  stats: DiffStats
  className?: string
}

export function DiffStatsBadge({ stats, className }: DiffStatsBadgeProps) {
  const parts: React.ReactNode[] = []

  if (stats.linesAdded || stats.linesRemoved) {
    parts.push(
      <span key="lines" className="inline-flex gap-1.5">
        {stats.linesAdded ? (
          <span className="text-[var(--diff-added-text)]">+{stats.linesAdded}</span>
        ) : null}
        {stats.linesRemoved ? (
          <span className="text-[var(--diff-removed-text)]">−{stats.linesRemoved}</span>
        ) : null}
      </span>
    )
  }

  if (stats.nodesAdded || stats.nodesRemoved) {
    parts.push(
      <span key="nodes" className="inline-flex gap-1.5">
        {stats.nodesAdded ? (
          <span className="text-[var(--diff-added-text)]">+{stats.nodesAdded} nodes</span>
        ) : null}
        {stats.nodesRemoved ? (
          <span className="text-[var(--diff-removed-text)]">−{stats.nodesRemoved} nodes</span>
        ) : null}
      </span>
    )
  }

  if (stats.edgesAdded || stats.edgesRemoved) {
    parts.push(
      <span key="edges" className="inline-flex gap-1.5">
        {stats.edgesAdded ? (
          <span className="text-[var(--diff-added-text)]">+{stats.edgesAdded} edges</span>
        ) : null}
        {stats.edgesRemoved ? (
          <span className="text-[var(--diff-removed-text)]">−{stats.edgesRemoved} edges</span>
        ) : null}
      </span>
    )
  }

  if (parts.length === 0) return null

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-xs ${className ?? ""}`}
    >
      {parts}
    </span>
  )
}
