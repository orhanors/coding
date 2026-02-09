"use client"

import { useCallback, useRef } from "react"
import { useCanvasStore } from "@/stores/canvas-store"
import type { Agent } from "@/lib/types"
import { AGENT_NODE_SIZE, TOP_BAR_HEIGHT, STATUS_STRIP_HEIGHT } from "@/lib/constants"

export function useCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)

  const zoom = useCanvasStore((s) => s.zoom)
  const pan = useCanvasStore((s) => s.pan)
  const mode = useCanvasStore((s) => s.mode)
  const selectedNodeId = useCanvasStore((s) => s.selectedNodeId)
  const isDragging = useCanvasStore((s) => s.isDragging)

  const setZoom = useCanvasStore((s) => s.setZoom)
  const setPan = useCanvasStore((s) => s.setPan)
  const setMode = useCanvasStore((s) => s.setMode)
  const setSelectedNode = useCanvasStore((s) => s.setSelectedNode)
  const setDragging = useCanvasStore((s) => s.setDragging)
  const resetView = useCanvasStore((s) => s.resetView)
  const zoomIn = useCanvasStore((s) => s.zoomIn)
  const zoomOut = useCanvasStore((s) => s.zoomOut)

  const worldToScreen = useCallback(
    (point: { x: number; y: number }) => ({
      x: point.x * zoom + pan.x,
      y: point.y * zoom + pan.y,
    }),
    [zoom, pan]
  )

  const screenToWorld = useCallback(
    (point: { x: number; y: number }) => ({
      x: (point.x - pan.x) / zoom,
      y: (point.y - pan.y) / zoom,
    }),
    [zoom, pan]
  )

  const zoomToFit = useCallback(
    (agents: Agent[]) => {
      if (agents.length === 0 || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const viewportW = rect.width
      const viewportH = rect.height - TOP_BAR_HEIGHT - STATUS_STRIP_HEIGHT

      const minX = Math.min(...agents.map((a) => a.position.x))
      const maxX = Math.max(...agents.map((a) => a.position.x + AGENT_NODE_SIZE.width))
      const minY = Math.min(...agents.map((a) => a.position.y))
      const maxY = Math.max(...agents.map((a) => a.position.y + AGENT_NODE_SIZE.height))

      const contentW = maxX - minX + 100 // padding
      const contentH = maxY - minY + 100

      const fitZoom = Math.min(viewportW / contentW, viewportH / contentH, 2.0)
      const centerX = (viewportW - contentW * fitZoom) / 2 - minX * fitZoom
      const centerY = (viewportH - contentH * fitZoom) / 2 - minY * fitZoom

      setZoom(fitZoom)
      setPan({ x: centerX, y: centerY })
    },
    [setZoom, setPan]
  )

  return {
    canvasRef,
    zoom,
    pan,
    mode,
    selectedNodeId,
    isDragging,
    setZoom,
    setPan,
    setMode,
    setSelectedNode,
    setDragging,
    resetView,
    zoomIn,
    zoomOut,
    worldToScreen,
    screenToWorld,
    zoomToFit,
  }
}
