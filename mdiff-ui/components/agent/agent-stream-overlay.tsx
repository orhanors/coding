"use client"

import React from "react"
import { X, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIStreamView } from "./ai-stream-view"
import { AgentEventLog } from "./agent-event-log"
import { mockAgentState } from "@/lib/mock-data"

interface AgentStreamOverlayProps {
  open: boolean
  minimized: boolean
  onClose: () => void
  onMinimize: () => void
}

export function AgentStreamOverlay({
  open,
  minimized,
  onClose,
  onMinimize,
}: AgentStreamOverlayProps) {
  if (!open) return null

  if (minimized) {
    return (
      <div
        className="fixed right-0 top-14 z-40 w-[360px] h-8 flex items-center justify-between px-3 bg-[var(--bg-secondary)] border-l border-b border-[var(--border-default)] cursor-pointer"
        onClick={onMinimize}
      >
        <span className="text-xs text-[var(--text-secondary)]">Agent Stream</span>
        <span className="text-xs text-[var(--accent-primary)]">●</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed right-0 top-14 bottom-6 z-40 w-[360px]",
        "bg-[var(--bg-secondary)] border-l border-[var(--border-default)]",
        "flex flex-col animate-slide-right"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <span className="text-sm font-medium text-[var(--text-primary)]">Agent Stream</span>
        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Working indicator */}
      {mockAgentState.active && (
        <div className="px-4 py-2 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-agent-pulse" />
            <span className="text-xs text-[var(--text-secondary)]">Working on:</span>
          </div>
          <p className="text-sm text-[var(--text-primary)] mt-0.5">
            {mockAgentState.projectId} — {mockAgentState.currentTask}
          </p>
        </div>
      )}

      {/* Stream content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {mockAgentState.active ? (
          <AIStreamView content={mockAgentState.streamContent} />
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--text-muted)] text-sm">
            No active agent
          </div>
        )}
      </div>

      {/* Divider */}
      <hr className="border-[var(--border-subtle)]" />

      {/* Event log */}
      <div className="h-48 overflow-y-auto scrollbar-thin">
        <AgentEventLog events={mockAgentState.events} />
      </div>
    </div>
  )
}
