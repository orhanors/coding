"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { InfiniteCanvas } from "@/components/canvas/infinite-canvas"
import { AgentNode } from "@/components/canvas/agent-node"
import { ConnectionLines } from "@/components/canvas/connection-line"
import { AgentConfigPanel } from "@/components/canvas/agent-config-panel"
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar"
import { calculateConstellationLayout } from "@/components/canvas/constellation-layout"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useAgentStore } from "@/stores/agent-store"
import { useCanvasStore } from "@/stores/canvas-store"
import { useUIStore } from "@/stores/ui-store"

export default function CanvasPage() {
  const agents = useAgentStore((s) => s.agents)
  const connections = useAgentStore((s) => s.connections)
  const updateAgent = useAgentStore((s) => s.updateAgent)
  const removeAgent = useAgentStore((s) => s.removeAgent)
  const openConfigPanel = useAgentStore((s) => s.openConfigPanel)
  const addConnection = useAgentStore((s) => s.addConnection)
  const zoom = useCanvasStore((s) => s.zoom)
  const mode = useCanvasStore((s) => s.mode)
  const selectedNodeId = useCanvasStore((s) => s.selectedNodeId)
  const setSelectedNode = useCanvasStore((s) => s.setSelectedNode)
  const setMode = useCanvasStore((s) => s.setMode)
  const zoomIn = useCanvasStore((s) => s.zoomIn)
  const zoomOut = useCanvasStore((s) => s.zoomOut)
  const resetView = useCanvasStore((s) => s.resetView)
  const saveFreeformPositions = useCanvasStore((s) => s.saveFreeformPositions)
  const freeformPositions = useCanvasStore((s) => s.freeformPositions)
  const toggleAgentOverlay = useUIStore((s) => s.toggleAgentOverlay)

  // --- Canvas-specific keyboard shortcuts ---
  const canvasShortcuts = useMemo(
    () => [
      // Tab: cycle selected node through agents (forward)
      {
        key: "Tab",
        handler: () => {
          if (agents.length === 0) return
          const currentIdx = agents.findIndex((a) => a.id === selectedNodeId)
          const nextIdx = currentIdx < 0 ? 0 : (currentIdx + 1) % agents.length
          setSelectedNode(agents[nextIdx].id)
        },
      },
      // Arrow keys: move selected agent by 10px
      {
        key: "ArrowUp",
        handler: () => {
          if (!selectedNodeId) return
          const agent = agents.find((a) => a.id === selectedNodeId)
          if (agent) updateAgent(selectedNodeId, { position: { x: agent.position.x, y: agent.position.y - 10 } })
        },
      },
      {
        key: "ArrowDown",
        handler: () => {
          if (!selectedNodeId) return
          const agent = agents.find((a) => a.id === selectedNodeId)
          if (agent) updateAgent(selectedNodeId, { position: { x: agent.position.x, y: agent.position.y + 10 } })
        },
      },
      {
        key: "ArrowLeft",
        handler: () => {
          if (!selectedNodeId) return
          const agent = agents.find((a) => a.id === selectedNodeId)
          if (agent) updateAgent(selectedNodeId, { position: { x: agent.position.x - 10, y: agent.position.y } })
        },
      },
      {
        key: "ArrowRight",
        handler: () => {
          if (!selectedNodeId) return
          const agent = agents.find((a) => a.id === selectedNodeId)
          if (agent) updateAgent(selectedNodeId, { position: { x: agent.position.x + 10, y: agent.position.y } })
        },
      },
      // N: open config panel for new agent
      {
        key: "n",
        handler: () => {
          openConfigPanel()
        },
      },
      // C: toggle constellation mode
      {
        key: "c",
        handler: () => {
          setMode(mode === "constellation" ? "canvas" : "constellation")
        },
      },
      // +/= zoom in
      {
        key: "+",
        handler: () => zoomIn(),
      },
      {
        key: "=",
        handler: () => zoomIn(),
      },
      // - zoom out
      {
        key: "-",
        handler: () => zoomOut(),
      },
      // 0 reset view
      {
        key: "0",
        handler: () => resetView(),
      },
      // Delete / Backspace: remove selected agent
      {
        key: "Delete",
        handler: () => {
          if (selectedNodeId) {
            removeAgent(selectedNodeId)
            setSelectedNode(null)
          }
        },
      },
      {
        key: "Backspace",
        handler: () => {
          if (selectedNodeId) {
            removeAgent(selectedNodeId)
            setSelectedNode(null)
          }
        },
      },
    ],
    [agents, selectedNodeId, mode, setSelectedNode, updateAgent, removeAgent, openConfigPanel, setMode, zoomIn, zoomOut, resetView]
  )

  useKeyboardShortcuts(canvasShortcuts)

  const newAgentPos = useRef<{ x: number; y: number }>({ x: 200, y: 200 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevMode = useRef(mode)

  // Handle constellation mode transitions
  useEffect(() => {
    if (prevMode.current === mode) return
    prevMode.current = mode

    if (agents.length === 0) return

    if (mode === "constellation") {
      // Save current freeform positions before moving to constellation
      const saved = new Map<string, { x: number; y: number }>()
      agents.forEach((a) => saved.set(a.id, { ...a.position }))
      saveFreeformPositions(saved)

      // Calculate constellation layout
      const container = containerRef.current
      const width = container?.clientWidth ?? 800
      const height = container?.clientHeight ?? 600
      const targetPositions = calculateConstellationLayout(agents, connections, width, height)

      // Animate to constellation positions
      setIsTransitioning(true)
      targetPositions.forEach((pos, id) => {
        updateAgent(id, { position: pos })
      })
      setTimeout(() => setIsTransitioning(false), 300)
    } else {
      // Restore freeform positions
      setIsTransitioning(true)
      freeformPositions.forEach((pos, id) => {
        updateAgent(id, { position: pos })
      })
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }, [mode, agents, connections, saveFreeformPositions, freeformPositions, updateAgent])

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
      const sourceIdx = agents.findIndex((a) => a.id === sourceId)
      if (sourceIdx >= 0 && sourceIdx < agents.length - 1) {
        const targetId = agents[sourceIdx + 1].id
        addConnection(sourceId, targetId)
      }
    },
    [agents, addConnection]
  )

  return (
    <div ref={containerRef} className="relative h-full">
      {/* Constellation mode radial glow background */}
      {mode === "constellation" && agents.length > 0 && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at 50% 50%, var(--constellation-glow) 0%, transparent 60%)",
            opacity: isTransitioning ? 0 : 0.5,
          }}
        />
      )}

      <InfiniteCanvas
        onCanvasClick={handleCanvasClick}
        isEmpty={agents.length === 0}
      >
        {/* Connection lines */}
        <ConnectionLines
          connections={connections}
          agents={agents}
          enhanced={mode === "constellation"}
        />

        {/* Agent nodes */}
        {agents.map((agent) => (
          <AgentNode
            key={agent.id}
            agent={agent}
            canvasZoom={zoom}
            onClick={handleAgentClick}
            onDoubleClick={handleAgentDoubleClick}
            onDrag={mode === "canvas" ? handleAgentDrag : undefined}
            onConnectStart={mode === "canvas" ? handleConnectStart : undefined}
            isTransitioning={isTransitioning}
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
