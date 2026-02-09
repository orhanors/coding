"use client"

import { useRef } from "react"
import type { Vision } from "@/lib/types"
import { ARCHETYPES } from "@/lib/constants"
import { useAgentStore } from "@/stores/agent-store"

interface VisionCardProps {
  vision: Vision
  onClick: () => void
  onDragStart: (e: React.DragEvent, visionId: string) => void
}

export function VisionCard({ vision, onClick, onDragStart }: VisionCardProps) {
  const agents = useAgentStore((s) => s.agents)
  const didDrag = useRef(false)

  const assignedAgent = vision.assignedAgent
    ? agents.find((a) => a.id === vision.assignedAgent)
    : null
  const archetype = assignedAgent ? ARCHETYPES[assignedAgent.archetype] : null
  const progressPercent =
    vision.totalTasks > 0 ? (vision.completedTasks / vision.totalTasks) * 100 : 0
  const isAgentActive = assignedAgent?.status === "active"

  const priorityDots = {
    high: (
      <span className="text-[var(--warning)]">●●●</span>
    ),
    medium: (
      <span>
        <span className="text-[var(--info)]">●●</span>
        <span className="text-[var(--text-muted)]">○</span>
      </span>
    ),
    low: (
      <span>
        <span className="text-[var(--text-secondary)]">●</span>
        <span className="text-[var(--text-muted)]">○○</span>
      </span>
    ),
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        didDrag.current = true
        onDragStart(e, vision.id)
      }}
      onDragEnd={() => {
        setTimeout(() => {
          didDrag.current = false
        }, 0)
      }}
      onClick={() => {
        if (!didDrag.current) onClick()
      }}
      className={`group cursor-pointer rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3 transition-all duration-150 hover:-translate-y-px hover:border-[var(--border-strong)] hover:shadow-md ${
        isAgentActive ? "animate-pulse-subtle" : ""
      }`}
      style={{
        borderLeftWidth: "3px",
        borderLeftColor: archetype?.colorHex ?? "var(--border-default)",
      }}
    >
      <h4 className="line-clamp-2 text-sm font-medium text-[var(--text-primary)]">
        {vision.title}
      </h4>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
        {assignedAgent ? (
          <>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: archetype?.colorHex }}
            />
            <span className="truncate">{assignedAgent.name}</span>
          </>
        ) : (
          <span>Unassigned</span>
        )}
      </div>

      <div className="mt-1.5 flex items-center gap-2 text-xs">
        {priorityDots[vision.priority]}
        <span className="text-[var(--text-muted)]">{vision.priority}</span>
      </div>

      <div className="mt-2">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--bg-hover)]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: archetype?.colorHex ?? "var(--accent-primary)",
            }}
          />
        </div>
        <span className="mt-0.5 block text-[0.6875rem] text-[var(--text-muted)]">
          {vision.completedTasks}/{vision.totalTasks}
        </span>
      </div>
    </div>
  )
}
