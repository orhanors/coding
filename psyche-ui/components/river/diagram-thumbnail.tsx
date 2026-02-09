"use client"

import type { DiffStats } from "@/lib/types"
import { Network } from "lucide-react"

interface DiagramThumbnailProps {
  stats?: DiffStats
  className?: string
}

export function DiagramThumbnail({ stats, className }: DiagramThumbnailProps) {
  return (
    <div
      className={`flex h-[120px] w-[200px] flex-col items-center justify-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] ${className ?? ""}`}
    >
      <Network className="h-8 w-8 text-[var(--text-muted)]" />
      {stats && (
        <span className="text-xs text-[var(--text-muted)]">
          {stats.nodesAdded ? `+${stats.nodesAdded} nodes` : ""}
          {stats.nodesAdded && stats.edgesAdded ? ", " : ""}
          {stats.edgesAdded ? `+${stats.edgesAdded} edges` : ""}
        </span>
      )}
    </div>
  )
}
