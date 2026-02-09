"use client"

import { formatDistanceToNow } from "date-fns"
import { Check } from "lucide-react"
import type { Reflection } from "@/lib/types"
import { ARCHETYPES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { ReflectionStatusBadge } from "./reflection-status-badge"
import { useAgentStore } from "@/stores/agent-store"
import { useReflectionStore } from "@/stores/reflection-store"

interface ReflectionListProps {
  reflections: Reflection[]
  selectedId: string | null
  onSelect: (id: string) => void
}

type GroupKey = "active" | "proposed" | "superseded" | "deprecated"

const GROUP_LABELS: Record<GroupKey, string> = {
  active: "Active",
  proposed: "Proposed",
  superseded: "Superseded",
  deprecated: "Deprecated",
}

function getGroup(r: Reflection): GroupKey {
  if (r.status === "accepted") return "active"
  return r.status
}

export function ReflectionList({ reflections, selectedId, onSelect }: ReflectionListProps) {
  const agents = useAgentStore((s) => s.agents)
  const acceptReflection = useReflectionStore((s) => s.acceptReflection)

  const groups: Record<GroupKey, Reflection[]> = {
    active: [],
    proposed: [],
    superseded: [],
    deprecated: [],
  }

  for (const r of reflections) {
    groups[getGroup(r)].push(r)
  }

  const groupOrder: GroupKey[] = ["active", "proposed", "superseded", "deprecated"]

  return (
    <div className="space-y-4">
      {groupOrder.map((key) => {
        const items = groups[key]
        if (items.length === 0) return null

        return (
          <div key={key}>
            <div className="flex items-center gap-2 px-3 py-1.5">
              <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                {GROUP_LABELS[key]}
              </h3>
              <span className="rounded-full bg-[var(--bg-hover)] px-1.5 py-0.5 text-[0.625rem] text-[var(--text-muted)]">
                {items.length}
              </span>
            </div>
            <div className="space-y-0.5">
              {items.map((r) => {
                const agent = r.agentId ? agents.find((a) => a.id === r.agentId) : null
                const archetype = agent ? ARCHETYPES[agent.archetype] : null
                const isSelected = selectedId === r.id

                return (
                  <div
                    key={r.id}
                    onClick={() => onSelect(r.id)}
                    className={`cursor-pointer rounded-lg px-3 py-2.5 transition-colors ${
                      isSelected
                        ? "bg-[var(--bg-active)]"
                        : "hover:bg-[var(--bg-hover)]"
                    } ${
                      r.status === "proposed"
                        ? "border-l-2 border-l-[var(--warning)]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 font-mono text-xs text-[var(--text-muted)]">
                        R-{String(r.number).padStart(3, "0")}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--text-primary)]">
                        {r.title}
                      </span>
                      <ReflectionStatusBadge status={r.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {agent ? (
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: archetype?.colorHex }}
                          />
                          ψ {agent.name}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">human</span>
                      )}
                      <span className="text-xs text-[var(--text-muted)]">·</span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {formatDistanceToNow(r.updatedAt, { addSuffix: true })}
                      </span>
                      {r.supersededBy && (
                        <>
                          <span className="text-xs text-[var(--text-muted)]">·</span>
                          <span className="text-xs text-[var(--text-muted)]">
                            replaced by R-{String(reflections.find((x) => x.id === r.supersededBy)?.number ?? "?").padStart(3, "0")}
                          </span>
                        </>
                      )}
                    </div>
                    {r.status === "proposed" && (
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            acceptReflection(r.id)
                          }}
                          className="h-6 px-2 text-xs text-[var(--success)] hover:bg-[var(--success)]/10"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
