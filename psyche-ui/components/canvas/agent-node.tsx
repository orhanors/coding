"use client"

import { useCallback, useRef, useState, type MouseEvent, type KeyboardEvent } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  Compass, Shield, Telescope, FlaskConical, Bug, BookOpen, Radio, Shuffle,
} from "lucide-react"
import type { Agent, AgentArchetype } from "@/lib/types"
import { ARCHETYPES, AGENT_STATUSES, AGENT_NODE_SIZE } from "@/lib/constants"
import { cn } from "@/lib/utils"

const ARCHETYPE_ICONS: Record<AgentArchetype, React.ElementType> = {
  architect: Compass,
  guardian: Shield,
  explorer: Telescope,
  alchemist: FlaskConical,
  shadow: Bug,
  sage: BookOpen,
  herald: Radio,
  trickster: Shuffle,
}

interface AgentNodeProps {
  agent: Agent
  isSelected?: boolean
  onClick?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onDrag?: (id: string, position: { x: number; y: number }) => void
  onConnectStart?: (id: string) => void
  canvasZoom: number
}

export function AgentNode({
  agent,
  isSelected,
  onClick,
  onDoubleClick,
  onDrag,
  onConnectStart,
  canvasZoom,
}: AgentNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })
  const dragDistance = useRef(0)

  const archetype = ARCHETYPES[agent.archetype]
  const statusDef = AGENT_STATUSES[agent.status]
  const Icon = ARCHETYPE_ICONS[agent.archetype]

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return
      e.stopPropagation()
      setIsDragging(true)
      dragDistance.current = 0
      dragStart.current = { x: e.clientX, y: e.clientY }
      startPos.current = { x: agent.position.x, y: agent.position.y }
    },
    [agent.position]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      e.stopPropagation()
      const dx = (e.clientX - dragStart.current.x) / canvasZoom
      const dy = (e.clientY - dragStart.current.y) / canvasZoom
      dragDistance.current = Math.sqrt(dx * dx + dy * dy)
      onDrag?.(agent.id, {
        x: startPos.current.x + dx,
        y: startPos.current.y + dy,
      })
    },
    [isDragging, canvasZoom, onDrag, agent.id]
  )

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      e.stopPropagation()
      setIsDragging(false)
      if (dragDistance.current < 5) {
        onClick?.(agent.id)
      }
    },
    [isDragging, onClick, agent.id]
  )

  const handleDoubleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      onDoubleClick?.(agent.id)
    },
    [onDoubleClick, agent.id]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onClick?.(agent.id)
      } else if (e.key === " ") {
        e.preventDefault()
        onDoubleClick?.(agent.id)
      }
    },
    [onClick, onDoubleClick, agent.id]
  )

  const handleConnectMouseDown = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      onConnectStart?.(agent.id)
    },
    [onConnectStart, agent.id]
  )

  const isActive = agent.status === "active"
  const isCompleted = agent.status === "completed"
  const isError = agent.status === "error"
  const isPaused = agent.status === "paused"

  return (
    <>
      {/* Global mouse listeners when dragging */}
      {isDragging && (
        <div
          className="fixed inset-0 z-50 cursor-grabbing"
          style={{ pointerEvents: "all" }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      )}
      <div
        ref={nodeRef}
        role="button"
        tabIndex={0}
        aria-label={`${agent.name} - ${archetype.label} - ${statusDef.label}`}
        className={cn(
          "absolute rounded-xl border p-3 transition-all duration-150",
          "bg-[var(--bg-secondary)]/80 backdrop-blur-sm",
          isDragging ? "cursor-grabbing z-20" : "cursor-grab z-10",
          isSelected && "ring-2 ring-[var(--accent-primary)]",
          isActive && "animate-agent-glow",
          isCompleted && "border-[var(--success)]",
          isError && "border-[var(--error)]",
          isPaused && "border-dashed opacity-85",
          !isActive && !isCompleted && !isError && !isPaused && "border-[var(--border-default)] opacity-70",
          "hover:translate-y-[-2px] hover:shadow-lg"
        )}
        style={{
          left: agent.position.x,
          top: agent.position.y,
          width: AGENT_NODE_SIZE.width,
          height: AGENT_NODE_SIZE.height,
          borderColor: isActive
            ? archetype.colorHex
            : isCompleted
            ? "var(--success)"
            : isError
            ? "var(--error)"
            : undefined,
          // For active glow animation
          ...(isActive && {
            "--agent-pulse": `${archetype.colorHex}66`,
          } as React.CSSProperties),
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
      >
        {/* Top: icon + name */}
        <div className="flex items-center gap-1.5">
          <Icon
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: archetype.colorHex }}
          />
          <span className="truncate text-sm font-medium text-[var(--text-primary)]">
            {agent.name}
          </span>
        </div>

        {/* Separator */}
        <div className="my-1.5 h-px bg-[var(--border-subtle)]" />

        {/* Task */}
        <p className="truncate text-xs text-[var(--text-secondary)]">
          {agent.task}
        </p>

        {/* Progress bar */}
        {agent.progress != null && (
          <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-[var(--bg-hover)]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${agent.progress}%`,
                backgroundColor: archetype.colorHex,
              }}
            />
          </div>
        )}

        {/* Bottom: status + timestamp */}
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: statusDef.color }}
            />
            <span className="text-2xs text-[var(--text-muted)]">
              {statusDef.label.toLowerCase()}
            </span>
          </div>
          <span className="text-2xs text-[var(--text-muted)]">
            {formatDistanceToNow(agent.updatedAt, { addSuffix: true })}
          </span>
        </div>

        {/* Connection handle (bottom center) */}
        <div
          className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 cursor-crosshair rounded-full border-2 border-[var(--border-strong)] bg-[var(--bg-tertiary)] opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
          style={{ opacity: isSelected ? 1 : undefined }}
          onMouseDown={handleConnectMouseDown}
        />
      </div>
    </>
  )
}
