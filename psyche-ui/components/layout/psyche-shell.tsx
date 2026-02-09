"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PsycheTopBar } from "./psyche-top-bar"
import { StatusStrip } from "./status-strip"
import { CommandPalette } from "./command-palette"
import { AgentStreamOverlay } from "@/components/agent/agent-stream-overlay"
import { ViewTransition } from "./view-transition"
import { useEventStream } from "@/hooks/use-event-stream"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useAgentStore } from "@/stores/agent-store"
import { useCanvasStore } from "@/stores/canvas-store"
import { useUIStore } from "@/stores/ui-store"
import { useRiverStore } from "@/stores/river-store"

export function PsycheShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { lastEvent } = useEventStream()
  const addAgentEvent = useAgentStore((s) => s.addAgentEvent)
  const setAgentStatus = useAgentStore((s) => s.setAgentStatus)
  const addRiverEntry = useRiverStore((s) => s.addEntry)

  // --- Global keyboard shortcuts ---
  const agentOverlayOpen = useUIStore((s) => s.agentOverlayOpen)
  const commandPaletteOpen = useUIStore((s) => s.commandPaletteOpen)
  const toggleAgentOverlay = useUIStore((s) => s.toggleAgentOverlay)
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette)
  const configPanelOpen = useAgentStore((s) => s.configPanelOpen)
  const closeConfigPanel = useAgentStore((s) => s.closeConfigPanel)

  const globalShortcuts = useMemo(
    () => [
      // Escape: cascading close — agent overlay > command palette > config panel
      {
        key: "Escape",
        handler: () => {
          if (agentOverlayOpen) {
            toggleAgentOverlay()
          } else if (commandPaletteOpen) {
            toggleCommandPalette()
          } else if (configPanelOpen) {
            closeConfigPanel()
          }
        },
      },
      // Cmd/Ctrl+1–4: navigate between main views
      { key: "1", meta: true, handler: () => router.push("/canvas") },
      { key: "2", meta: true, handler: () => router.push("/river") },
      { key: "3", meta: true, handler: () => router.push("/visions") },
      { key: "4", meta: true, handler: () => router.push("/reflections") },
    ],
    [
      agentOverlayOpen,
      commandPaletteOpen,
      configPanelOpen,
      toggleAgentOverlay,
      toggleCommandPalette,
      closeConfigPanel,
      router,
    ]
  )

  useKeyboardShortcuts(globalShortcuts)

  // Dispatch SSE events to stores by type prefix
  useEffect(() => {
    if (!lastEvent) return

    const { type, agentId, payload } = lastEvent

    if (type.startsWith("agent:") && agentId) {
      addAgentEvent(agentId, {
        id: lastEvent.id,
        type,
        timestamp: new Date(lastEvent.timestamp),
        message: (payload.message as string) ?? type,
      })

      if (type === "agent:completed") setAgentStatus(agentId, "completed")
      if (type === "agent:failed") setAgentStatus(agentId, "error")
      if (type === "agent:paused") setAgentStatus(agentId, "paused")
      if (type === "agent:resumed") setAgentStatus(agentId, "active")
      if (type === "agent:started") setAgentStatus(agentId, "active")
    }

    if (type === "river:entry-added" && payload.entry) {
      addRiverEntry(payload.entry as Parameters<typeof addRiverEntry>[0])
    }
  }, [lastEvent, addAgentEvent, setAgentStatus, addRiverEntry])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <PsycheTopBar />
      <main id="main-content" role="main" className="flex-1 overflow-hidden">
          <ViewTransition>{children}</ViewTransition>
        </main>
      <StatusStrip />
      <CommandPalette />
      <AgentStreamOverlay />
    </div>
  )
}
