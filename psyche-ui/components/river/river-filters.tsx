"use client"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RIVER_ENTRY_TYPES, ARCHETYPES } from "@/lib/constants"
import { useRiverStore } from "@/stores/river-store"
import { useAgentStore } from "@/stores/agent-store"

export function RiverFilters() {
  const { filters, setFilters, clearFilters } = useRiverStore()
  const agents = useAgentStore((s) => s.agents)
  const [searchInput, setSearchInput] = useState(filters.search ?? "")

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchInput || undefined })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, setFilters])

  const activeFilters: { key: string; label: string }[] = []
  if (filters.type) {
    activeFilters.push({
      key: "type",
      label: `Type: ${RIVER_ENTRY_TYPES[filters.type as keyof typeof RIVER_ENTRY_TYPES]?.label ?? filters.type}`,
    })
  }
  if (filters.agentId) {
    const agent = agents.find((a) => a.id === filters.agentId)
    activeFilters.push({
      key: "agentId",
      label: `Agent: ${agent?.name ?? filters.agentId}`,
    })
  }
  if (filters.search) {
    activeFilters.push({ key: "search", label: `Search: "${filters.search}"` })
  }

  const clearFilter = (key: string) => {
    if (key === "search") {
      setSearchInput("")
    }
    setFilters({ [key]: undefined })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Select
          value={filters.type ?? "all"}
          onValueChange={(v) => setFilters({ type: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="w-[160px] border-[var(--border-default)] bg-[var(--bg-secondary)]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {Object.entries(RIVER_ENTRY_TYPES).map(([key, def]) => (
              <SelectItem key={key} value={key}>
                <span className="inline-flex items-center gap-2">
                  <span style={{ color: def.color }}>{def.icon}</span>
                  {def.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.agentId ?? "all"}
          onValueChange={(v) => setFilters({ agentId: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="w-[180px] border-[var(--border-default)] bg-[var(--bg-secondary)]">
            <SelectValue placeholder="All agents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All agents</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: ARCHETYPES[agent.archetype].colorHex }}
                  />
                  {agent.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search entries..."
            className="border-[var(--border-default)] bg-[var(--bg-secondary)] pl-8"
          />
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => clearFilter(f.key)}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-muted)] px-2.5 py-0.5 text-xs text-[var(--accent-primary)] transition-colors hover:bg-[var(--accent-subtle)]"
            >
              {f.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          {activeFilters.length > 1 && (
            <button
              onClick={() => {
                setSearchInput("")
                clearFilters()
              }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  )
}
