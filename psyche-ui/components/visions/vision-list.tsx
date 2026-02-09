"use client"

import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ARCHETYPES, VISION_STAGES } from "@/lib/constants"
import { useVisionStore } from "@/stores/vision-store"
import { useAgentStore } from "@/stores/agent-store"
import { useState } from "react"
import { ArrowUpDown } from "lucide-react"
import type { Vision } from "@/lib/types"

type SortKey = "title" | "priority" | "progress" | "updated"
type SortDir = "asc" | "desc"

const PRIORITY_ORDER: Record<string, number> = { high: 3, medium: 2, low: 1 }

export function VisionList() {
  const { visions, setSelectedVision } = useVisionStore()
  const agents = useAgentStore((s) => s.agents)
  const [sortKey, setSortKey] = useState<SortKey>("updated")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = [...visions].sort((a, b) => {
    let cmp = 0
    switch (sortKey) {
      case "title":
        cmp = a.title.localeCompare(b.title)
        break
      case "priority":
        cmp = (PRIORITY_ORDER[a.priority] ?? 0) - (PRIORITY_ORDER[b.priority] ?? 0)
        break
      case "progress":
        cmp =
          (a.totalTasks ? a.completedTasks / a.totalTasks : 0) -
          (b.totalTasks ? b.completedTasks / b.totalTasks : 0)
        break
      case "updated":
        cmp = a.updatedAt.getTime() - b.updatedAt.getTime()
        break
    }
    return sortDir === "asc" ? cmp : -cmp
  })

  return (
    <div className="px-6 py-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] text-left text-xs text-[var(--text-muted)]">
            <SortHeader label="Title" sortKey="title" current={sortKey} dir={sortDir} onToggle={toggleSort} />
            <th className="px-3 py-2">Agent</th>
            <SortHeader label="Priority" sortKey="priority" current={sortKey} dir={sortDir} onToggle={toggleSort} />
            <SortHeader label="Progress" sortKey="progress" current={sortKey} dir={sortDir} onToggle={toggleSort} />
            <th className="px-3 py-2">Stage</th>
            <SortHeader label="Updated" sortKey="updated" current={sortKey} dir={sortDir} onToggle={toggleSort} />
          </tr>
        </thead>
        <tbody>
          {sorted.map((vision) => {
            const agent = vision.assignedAgent
              ? agents.find((a) => a.id === vision.assignedAgent)
              : null
            const archetype = agent ? ARCHETYPES[agent.archetype] : null
            const stageDef = VISION_STAGES.find((s) => s.id === vision.stage)
            const pct = vision.totalTasks
              ? Math.round((vision.completedTasks / vision.totalTasks) * 100)
              : 0

            return (
              <tr
                key={vision.id}
                onClick={() => setSelectedVision(vision.id)}
                className="cursor-pointer border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--bg-hover)]"
              >
                <td className="px-3 py-2.5 font-medium text-[var(--text-primary)]">
                  {vision.title}
                </td>
                <td className="px-3 py-2.5">
                  {agent ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: archetype?.colorHex }}
                      />
                      {agent.name}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-xs">{vision.priority}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--bg-hover)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: archetype?.colorHex ?? "var(--accent-primary)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {vision.completedTasks}/{vision.totalTasks}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <Badge variant="outline" className="border-[var(--border-default)] text-xs">
                    {stageDef?.label}
                  </Badge>
                </td>
                <td className="px-3 py-2.5 text-xs text-[var(--text-muted)]">
                  {formatDistanceToNow(vision.updatedAt, { addSuffix: true })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SortHeader({
  label,
  sortKey,
  current,
  dir,
  onToggle,
}: {
  label: string
  sortKey: SortKey
  current: SortKey
  dir: SortDir
  onToggle: (key: SortKey) => void
}) {
  return (
    <th className="px-3 py-2">
      <button
        onClick={() => onToggle(sortKey)}
        className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]"
      >
        {label}
        <ArrowUpDown
          className={`h-3 w-3 ${current === sortKey ? "text-[var(--accent-primary)]" : ""}`}
        />
      </button>
    </th>
  )
}
