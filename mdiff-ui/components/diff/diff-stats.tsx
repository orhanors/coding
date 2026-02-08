import React from "react"
import type { DiffStats as DiffStatsType } from "@/lib/types"

interface DiffStatsProps {
  stats: DiffStatsType
}

export function DiffStats({ stats }: DiffStatsProps) {
  const isExcalidraw = stats.nodesAdded != null || stats.nodesRemoved != null

  if (isExcalidraw) {
    return (
      <span className="inline-flex items-center gap-2 text-xs font-mono">
        {(stats.nodesAdded ?? 0) > 0 && (
          <span className="text-[var(--diff-added-text)]">
            +{stats.nodesAdded} node{stats.nodesAdded !== 1 ? "s" : ""}
          </span>
        )}
        {(stats.edgesAdded ?? 0) > 0 && (
          <span className="text-[var(--diff-added-text)]">
            +{stats.edgesAdded} edge{stats.edgesAdded !== 1 ? "s" : ""}
          </span>
        )}
        {(stats.nodesRemoved ?? 0) > 0 && (
          <span className="text-[var(--diff-removed-text)]">
            −{stats.nodesRemoved} node{stats.nodesRemoved !== 1 ? "s" : ""}
          </span>
        )}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono">
      {(stats.linesAdded ?? 0) > 0 && (
        <span className="text-[var(--diff-added-text)]">+{stats.linesAdded}</span>
      )}
      {(stats.linesRemoved ?? 0) > 0 && (
        <span className="text-[var(--diff-removed-text)]">−{stats.linesRemoved}</span>
      )}
      {(stats.linesAdded ?? 0) === 0 && (stats.linesRemoved ?? 0) === 0 && (
        <span className="text-[var(--text-muted)]">no changes</span>
      )}
    </span>
  )
}
