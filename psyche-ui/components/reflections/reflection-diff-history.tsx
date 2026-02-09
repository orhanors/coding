"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import type { Reflection } from "@/lib/types"
import { ARCHETYPES } from "@/lib/constants"
import { DiffPreview } from "@/components/diff/diff-preview"
import { useAgentStore } from "@/stores/agent-store"

interface ReflectionDiffHistoryProps {
  reflection: Reflection
}

export function ReflectionDiffHistory({ reflection }: ReflectionDiffHistoryProps) {
  const agents = useAgentStore((s) => s.agents)
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null)

  const versions = [...reflection.versions].sort((a, b) => b.version - a.version)
  const latestVersion = versions[0]?.id

  if (versions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 py-8">
        <p className="text-xs text-[var(--text-muted)]">No version history</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-4 pt-5 pb-3">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">Diff History</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-3">
          {versions.map((version) => {
            const agent = version.agentId
              ? agents.find((a) => a.id === version.agentId)
              : null
            const archetype = agent ? ARCHETYPES[agent.archetype] : null
            const isLatest = version.id === latestVersion
            const isExpanded = expandedVersion === version.id

            return (
              <div
                key={version.id}
                className={`rounded-lg border p-3 transition-colors ${
                  isLatest
                    ? "border-[var(--accent-primary)]/20 bg-[var(--accent-subtle)]"
                    : "border-[var(--border-subtle)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedVersion(isExpanded ? null : version.id)
                  }
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[var(--bg-hover)] px-1.5 py-0.5 font-mono text-xs text-[var(--text-secondary)]">
                      v{version.version}
                    </span>
                    {isLatest && (
                      <span className="text-xs text-[var(--accent-primary)]">(current)</span>
                    )}
                    <span className="ml-auto text-xs text-[var(--text-muted)]">
                      {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {version.description}
                  </p>

                  <div className="mt-1 text-xs text-[var(--text-muted)]">
                    {agent ? (
                      <span className="inline-flex items-center gap-1">
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: archetype?.colorHex }}
                        />
                        ψ {agent.name}
                      </span>
                    ) : (
                      <span>{version.author}</span>
                    )}
                  </div>
                </button>

                {isExpanded && version.diff.length > 0 && (
                  <div className="mt-3">
                    <DiffPreview hunks={version.diff} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
