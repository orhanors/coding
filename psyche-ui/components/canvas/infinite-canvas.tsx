"use client"

import { useCallback, useRef, useState, type MouseEvent, type WheelEvent, type TouchEvent } from "react"
import { useCanvasStore } from "@/stores/canvas-store"
import { CANVAS_MIN_ZOOM, CANVAS_MAX_ZOOM, CANVAS_GRID_SIZE } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

interface InfiniteCanvasProps {
  onCanvasClick?: (worldPos: { x: number; y: number }) => void
  children?: React.ReactNode
  isEmpty?: boolean
}

export function InfiniteCanvas({ onCanvasClick, children, isEmpty }: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const zoom = useCanvasStore((s) => s.zoom)
  const pan = useCanvasStore((s) => s.pan)
  const setZoom = useCanvasStore((s) => s.setZoom)
  const setPan = useCanvasStore((s) => s.setPan)

  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0 })
  const panOrigin = useRef({ x: 0, y: 0 })
  const dragDistance = useRef(0)

  // Touch state
  const lastTouchDist = useRef(0)
  const lastTouchCenter = useRef({ x: 0, y: 0 })

  // --- Mouse pan ---
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      // Only pan on left-click on empty canvas space or middle-click
      if (e.button === 1 || (e.button === 0 && e.target === e.currentTarget)) {
        e.preventDefault()
        setIsPanning(true)
        dragDistance.current = 0
        panStart.current = { x: e.clientX, y: e.clientY }
        panOrigin.current = { ...pan }
      }
    },
    [pan]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning) return
      const dx = e.clientX - panStart.current.x
      const dy = e.clientY - panStart.current.y
      dragDistance.current = Math.sqrt(dx * dx + dy * dy)
      setPan({
        x: panOrigin.current.x + dx,
        y: panOrigin.current.y + dy,
      })
    },
    [isPanning, setPan]
  )

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isPanning) {
        setIsPanning(false)
        // If it was a click (not a drag), fire canvas click
        if (dragDistance.current < 5 && e.button === 0 && onCanvasClick) {
          const rect = containerRef.current?.getBoundingClientRect()
          if (rect) {
            const worldX = (e.clientX - rect.left - pan.x) / zoom
            const worldY = (e.clientY - rect.top - pan.y) / zoom
            onCanvasClick({ x: worldX, y: worldY })
          }
        }
      }
    },
    [isPanning, onCanvasClick, pan, zoom]
  )

  // --- Wheel zoom (toward cursor) ---
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const cursorX = e.clientX - rect.left
      const cursorY = e.clientY - rect.top

      const delta = e.deltaY > 0 ? -0.1 : 0.1
      const newZoom = Math.max(CANVAS_MIN_ZOOM, Math.min(CANVAS_MAX_ZOOM, zoom + delta))

      // Zoom toward cursor: adjust pan so cursor stays over same world point
      const worldX = (cursorX - pan.x) / zoom
      const worldY = (cursorY - pan.y) / zoom
      const newPanX = cursorX - worldX * newZoom
      const newPanY = cursorY - worldY * newZoom

      setZoom(newZoom)
      setPan({ x: newPanX, y: newPanY })
    },
    [zoom, pan, setZoom, setPan]
  )

  // --- Touch support ---
  const getTouchDist = (e: TouchEvent) => {
    if (e.touches.length < 2) return 0
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getTouchCenter = (e: TouchEvent) => {
    if (e.touches.length < 2)
      return { x: e.touches[0]?.clientX ?? 0, y: e.touches[0]?.clientY ?? 0 }
    return {
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
    }
  }

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastTouchDist.current = getTouchDist(e)
        lastTouchCenter.current = getTouchCenter(e)
      } else if (e.touches.length === 1) {
        panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        panOrigin.current = { ...pan }
        setIsPanning(true)
        dragDistance.current = 0
      }
    },
    [pan]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch zoom
        const dist = getTouchDist(e)
        const scale = dist / lastTouchDist.current
        const newZoom = Math.max(CANVAS_MIN_ZOOM, Math.min(CANVAS_MAX_ZOOM, zoom * scale))

        const center = getTouchCenter(e)
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
          const cx = center.x - rect.left
          const cy = center.y - rect.top
          const worldX = (cx - pan.x) / zoom
          const worldY = (cy - pan.y) / zoom
          setPan({ x: cx - worldX * newZoom, y: cy - worldY * newZoom })
        }

        setZoom(newZoom)
        lastTouchDist.current = dist
        lastTouchCenter.current = center
      } else if (e.touches.length === 1 && isPanning) {
        const dx = e.touches[0].clientX - panStart.current.x
        const dy = e.touches[0].clientY - panStart.current.y
        dragDistance.current = Math.sqrt(dx * dx + dy * dy)
        setPan({
          x: panOrigin.current.x + dx,
          y: panOrigin.current.y + dy,
        })
      }
    },
    [zoom, pan, isPanning, setZoom, setPan]
  )

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Grid background positioning
  const gridSize = CANVAS_GRID_SIZE * zoom
  const gridOffsetX = pan.x % gridSize
  const gridOffsetY = pan.y % gridSize

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden",
        isPanning ? "cursor-grabbing" : "cursor-grab",
        "select-none"
      )}
      style={{
        backgroundImage: `radial-gradient(circle, var(--canvas-grid) 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundPosition: `${gridOffsetX}px ${gridOffsetY}px`,
        backgroundColor: "var(--bg-canvas)",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPanning(false)}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Transform layer — children move with pan/zoom */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-[var(--border-strong)] animate-pulse">
            <Plus className="h-6 w-6 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Click anywhere to create your first agent
          </p>
        </div>
      )}
    </div>
  )
}
