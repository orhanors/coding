"use client"

import React, { useState, useMemo } from "react"
import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns"
import { Search } from "lucide-react"
import { DiffStats } from "@/components/diff/diff-stats"
import { mockTimelineEntries, mockProjects } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { TimelineEntry } from "@/lib/types"

const typeColors: Record<string, string> = {
  adr: "bg-[var(--stage-adr)]",
  prd: "bg-[var(--stage-prd)]",
  "prd-log": "bg-[var(--stage-prd)]",
  excalidraw: "bg-[var(--stage-excalidraw)]",
  "status-change": "bg-[var(--text-muted)]",
}

function groupByDate(entries: TimelineEntry[]): Record<string, TimelineEntry[]> {
  const groups: Record<string, TimelineEntry[]> = {}
  for (const entry of entries) {
    let key: string
    if (isToday(entry.timestamp)) key = "Today"
    else if (isYesterday(entry.timestamp)) key = "Yesterday"
    else key = format(entry.timestamp, "MMM d, yyyy")
    if (!groups[key]) groups[key] = []
    groups[key].push(entry)
  }
  return groups
}

export default function TimelinePage() {
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    return mockTimelineEntries.filter((entry) => {
      if (selectedProject !== "all" && entry.projectName !== selectedProject) return false
      if (selectedType !== "all" && entry.type !== selectedType) return false
      if (searchQuery && !entry.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [selectedProject, selectedType, searchQuery])

  const groups = useMemo(() => groupByDate(filtered), [filtered])

  const totalStats = useMemo(() => {
    const adr = filtered.filter((e) => e.type === "adr").length
    const prd = filtered.filter((e) => e.type === "prd").length
    const logs = filtered.filter((e) => e.type === "prd-log").length
    const diagrams = filtered.filter((e) => e.type === "excalidraw").length
    return { total: filtered.length, adr, prd, logs, diagrams }
  }, [filtered])

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Timeline</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
        >
          <option value="all">All Projects</option>
          {mockProjects.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
        >
          <option value="all">All Types</option>
          <option value="adr">ADR</option>
          <option value="prd">PRD</option>
          <option value="prd-log">PRD Log</option>
          <option value="excalidraw">Excalidraw</option>
          <option value="status-change">Status Change</option>
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(groups).map(([dateLabel, entries]) => (
          <div key={dateLabel}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-semibold text-[var(--text-muted)]">{dateLabel}</h2>
              <hr className="flex-1 border-[var(--border-subtle)]" />
            </div>

            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border-subtle)]" />

              <div className="space-y-4">
                {entries.map((entry, i) => (
                  <div
                    key={entry.id}
                    className="relative flex gap-4"
                    style={{
                      animation: `timeline-entry-in 0.15s ease-out ${i * 30}ms both`,
                    }}
                  >
                    {/* Dot */}
                    <span
                      className={cn(
                        "absolute -left-6 top-1.5 w-2 h-2 rounded-full ring-2 ring-[var(--bg-primary)]",
                        typeColors[entry.type]
                      )}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-[var(--text-muted)] font-mono">
                          {format(entry.timestamp, "HH:mm")}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                          {entry.projectName}
                        </span>
                      </div>

                      <p className="text-sm text-[var(--text-primary)]">{entry.description}</p>

                      {entry.stats && (
                        <div className="mt-1">
                          <DiffStats stats={entry.stats} />
                        </div>
                      )}

                      {entry.linkedEntries && entry.linkedEntries.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {entry.linkedEntries.map((linked, j) => (
                            <p key={j} className="text-xs text-[var(--text-muted)]">{linked}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    <button className="flex-shrink-0 text-xs text-[var(--accent-primary)] hover:underline mt-0.5">
                      View Diff →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-[var(--text-muted)] py-12">
            No timeline entries match your filters.
          </p>
        )}
      </div>

      {/* Stats bar */}
      {filtered.length > 0 && (
        <div className="rounded-lg bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-secondary)]">
          {totalStats.total} total diffs · {totalStats.adr} ADRs · {totalStats.prd} PRDs · {totalStats.logs} logs · {totalStats.diagrams} diagrams
        </div>
      )}
    </div>
  )
}
