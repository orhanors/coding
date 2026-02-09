"use client"

import { useCallback, useRef } from "react"
import { InfiniteCanvas } from "@/components/canvas/infinite-canvas"
import { AgentNode } from "@/components/canvas/agent-node"
import { ConnectionLines } from "@/components/canvas/connection-line"
import { AgentConfigPanel } from "@/components/canvas/agent-config-panel"
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar"
import { useAgentStore } from "@/stores/agent-store"
import { useCanvasStore } from "@/stores/canvas-store"
import { useUIStore } from "@/stores/ui-store"

export default function CanvasPage() {
  const agents = useAgentStore((s) => s.agents)
  const connections = useAgentStore((s) => s.connections)
  const updateAgent = useAgentStore((s) => s.updateAgent)
  const openConfigPanel = useAgentStore((s) => s.openConfigPanel)
  const addConnection = useAgentStore((s) => s.addConnection)
  const zoom = useCanvasStore((s) => s.zoom)
  const toggleAgentOverlay = useUIStore((s) => s.toggleAgentOverlay)

  const newAgentPos = useRef<{ x: number; y: number }>({ x: 200, y: 200 })

  const handleCanvasClick = useCallback(
    (worldPos: { x: number; y: number }) => {
      newAgentPos.current = worldPos
      openConfigPanel()
    },
    [openConfigPanel]
  )

  const handleAgentClick = useCallback(
    (id: string) => {
      openConfigPanel(id)
    },
    [openConfigPanel]
  )

  const handleAgentDoubleClick = useCallback(
    (id: string) => {
      toggleAgentOverlay(id)
    },
    [toggleAgentOverlay]
  )

  const handleAgentDrag = useCallback(
    (id: string, position: { x: number; y: number }) => {
      updateAgent(id, { position })
    },
    [updateAgent]
  )

  const handleConnectStart = useCallback(
    (sourceId: string) => {
      // For now, a simple connection creation — connect to the next agent
      // A full implementation would track mouse to target node
      const sourceIdx = agents.findIndex((a) => a.id === sourceId)
      if (sourceIdx >= 0 && sourceIdx < agents.length - 1) {
        const targetId = agents[sourceIdx + 1].id
        addConnection(sourceId, targetId)
      }
    },
    [agents, addConnection]
  )

  return (
    <div className="relative h-full">
      <InfiniteCanvas
        onCanvasClick={handleCanvasClick}
        isEmpty={agents.length === 0}
      >
        {/* Connection lines (rendered first, below nodes) */}
        <ConnectionLines connections={connections} agents={agents} />

        {/* Agent nodes */}
        {agents.map((agent) => (
          <AgentNode
            key={agent.id}
            agent={agent}
            canvasZoom={zoom}
            onClick={handleAgentClick}
            onDoubleClick={handleAgentDoubleClick}
            onDrag={handleAgentDrag}
            onConnectStart={handleConnectStart}
          />
        ))}
      </InfiniteCanvas>

      {/* Floating toolbar */}
      <CanvasToolbar />

      {/* Config panel */}
      <AgentConfigPanel defaultPosition={newAgentPos.current} />
    </div>
  )
}
