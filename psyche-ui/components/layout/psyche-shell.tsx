"use client"

import { PsycheTopBar } from "./psyche-top-bar"
import { StatusStrip } from "./status-strip"
import { CommandPalette } from "./command-palette"
import { AgentStreamOverlay } from "@/components/agent/agent-stream-overlay"

export function PsycheShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <PsycheTopBar />
      <main className="flex-1 overflow-hidden">{children}</main>
      <StatusStrip />
      <CommandPalette />
      <AgentStreamOverlay />
    </div>
  )
}
