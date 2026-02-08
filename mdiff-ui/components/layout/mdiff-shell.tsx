"use client"

import React, { useState, useEffect, useCallback } from "react"
import { MdiffTopBar } from "./mdiff-top-bar"
import { StatusStrip } from "./status-strip"
import { CommandPalette } from "./command-palette"
import { AgentStreamOverlay } from "@/components/agent/agent-stream-overlay"
import { mockAgentState } from "@/lib/mock-data"

export function MdiffShell({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [agentOverlayOpen, setAgentOverlayOpen] = useState(false)
  const [agentOverlayMinimized, setAgentOverlayMinimized] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
    },
    []
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <MdiffTopBar
        notificationCount={mockAgentState.events.length}
        onCommandPalette={() => setCommandPaletteOpen(true)}
        onNotificationClick={() => {
          setAgentOverlayOpen(true)
          setAgentOverlayMinimized(false)
        }}
      />

      <main className="pt-14 pb-6">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          {children}
        </div>
      </main>

      <StatusStrip
        agentActive={mockAgentState.active}
        agentMessage={mockAgentState.currentTask ?? undefined}
        pendingDiffs={3}
        onAgentClick={() => {
          setAgentOverlayOpen(true)
          setAgentOverlayMinimized(false)
        }}
      />

      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      <AgentStreamOverlay
        open={agentOverlayOpen}
        minimized={agentOverlayMinimized}
        onClose={() => setAgentOverlayOpen(false)}
        onMinimize={() => setAgentOverlayMinimized((prev) => !prev)}
      />
    </div>
  )
}
