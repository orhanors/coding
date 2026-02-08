"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface StatusStripProps {
  agentActive?: boolean
  agentMessage?: string
  pendingDiffs?: number
  onAgentClick?: () => void
}

export function StatusStrip({
  agentActive = false,
  agentMessage,
  pendingDiffs = 0,
  onAgentClick,
}: StatusStripProps) {
  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 h-6 flex items-center justify-between px-4 text-2xs transition-opacity duration-500",
        "bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]",
        agentActive ? "opacity-100" : "opacity-30 hover:opacity-100"
      )}
      aria-live="polite"
    >
      <button
        onClick={onAgentClick}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <span
          className={cn(
            "w-2 h-2 rounded-full",
            agentActive
              ? "bg-[var(--accent-primary)] animate-agent-pulse"
              : "bg-[var(--text-muted)]"
          )}
        />
        <span>
          {agentActive
            ? agentMessage || "Agent active"
            : "Idle"}
          {pendingDiffs > 0 && ` · ${pendingDiffs} diff${pendingDiffs > 1 ? "s" : ""} pending`}
        </span>
      </button>

      <span className="text-[var(--text-muted)]">mdiff v0.1</span>
    </footer>
  )
}
