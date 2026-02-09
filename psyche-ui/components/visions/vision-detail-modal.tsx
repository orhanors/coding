"use client"

import { formatDistanceToNow } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Circle, ChevronRight } from "lucide-react"
import { ARCHETYPES, VISION_STAGES } from "@/lib/constants"
import { useVisionStore } from "@/stores/vision-store"
import { useAgentStore } from "@/stores/agent-store"
import { useState } from "react"

export function VisionDetailModal() {
  const { visions, selectedVisionId, setSelectedVision, toggleVisionTask } = useVisionStore()
  const agents = useAgentStore((s) => s.agents)

  const vision = visions.find((v) => v.id === selectedVisionId)
  const isOpen = !!vision

  if (!vision) return null

  const assignedAgent = vision.assignedAgent
    ? agents.find((a) => a.id === vision.assignedAgent)
    : null
  const archetype = assignedAgent ? ARCHETYPES[assignedAgent.archetype] : null
  const stageDef = VISION_STAGES.find((s) => s.id === vision.stage)

  // Group tasks by phase
  const phases = new Map<number, typeof vision.tasks>()
  for (const task of vision.tasks) {
    const existing = phases.get(task.phase)
    if (existing) existing.push(task)
    else phases.set(task.phase, [task])
  }

  const priorityDots = {
    high: <span className="text-[var(--warning)]">●●●</span>,
    medium: <span><span className="text-[var(--info)]">●●</span><span className="text-[var(--text-muted)]">○</span></span>,
    low: <span><span className="text-[var(--text-secondary)]">●</span><span className="text-[var(--text-muted)]">○○</span></span>,
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setSelectedVision(null)}>
      <DialogContent className="max-w-2xl border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
        <DialogHeader>
          <DialogTitle className="text-xl">{vision.title}</DialogTitle>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {assignedAgent && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: archetype?.colorHex }}
                />
                {assignedAgent.name}
              </span>
            )}
            <span className="text-xs">{priorityDots[vision.priority]}</span>
            <Badge variant="outline" className="border-[var(--border-default)] text-xs">
              {stageDef?.label}
            </Badge>
            <span className="text-xs text-[var(--text-muted)]">
              {vision.completedTasks}/{vision.totalTasks} tasks
            </span>
          </div>
        </DialogHeader>

        <Separator className="bg-[var(--border-subtle)]" />

        {vision.overview && (
          <div className="text-sm text-[var(--text-secondary)]">{vision.overview}</div>
        )}

        {vision.tasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--text-primary)]">Tasks</h3>
            {Array.from(phases.entries()).map(([phase, tasks]) => {
              const done = tasks.filter((t) => t.implemented).length
              return (
                <PhaseSection
                  key={phase}
                  phase={phase}
                  category={tasks[0]?.category}
                  done={done}
                  total={tasks.length}
                  tasks={tasks}
                  visionId={vision.id}
                  onToggle={toggleVisionTask}
                />
              )
            })}
          </div>
        )}

        {vision.changeHistory.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[var(--text-primary)]">Change History</h3>
            <div className="space-y-1">
              {[...vision.changeHistory].reverse().map((change) => (
                <div key={change.id} className="flex items-start gap-2 text-xs">
                  <span className="shrink-0 text-[var(--text-muted)]">
                    {formatDistanceToNow(change.timestamp, { addSuffix: true })}
                  </span>
                  {change.agentName && (
                    <span className="text-[var(--text-secondary)]">
                      ψ {change.agentName}
                    </span>
                  )}
                  <span className="text-[var(--text-secondary)]">{change.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function PhaseSection({
  phase,
  category,
  done,
  total,
  tasks,
  visionId,
  onToggle,
}: {
  phase: number
  category: string
  done: number
  total: number
  tasks: { id: string; description: string; implemented: boolean }[]
  visionId: string
  onToggle: (visionId: string, taskId: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded px-1 py-1 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
      >
        <ChevronRight
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`}
        />
        <span className="font-medium">Phase {phase}</span>
        <span className="text-xs text-[var(--text-muted)]">— {category}</span>
        <span className="ml-auto text-xs text-[var(--text-muted)]">
          {done}/{total} complete
        </span>
      </button>
      {open && (
        <div className="ml-5 mt-1 space-y-1">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onToggle(visionId, task.id)}
              className="flex w-full items-center gap-2 rounded px-1 py-0.5 text-left text-sm hover:bg-[var(--bg-hover)]"
            >
              {task.implemented ? (
                <CheckCircle className="h-4 w-4 shrink-0 text-[var(--success)]" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
              )}
              <span
                className={
                  task.implemented
                    ? "text-[var(--text-muted)] line-through"
                    : "text-[var(--text-primary)]"
                }
              >
                {task.description}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
