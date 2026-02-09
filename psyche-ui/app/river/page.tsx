"use client"

import Link from "next/link"
import { useRiverStore } from "@/stores/river-store"
import { RiverFilters } from "@/components/river/river-filters"
import { RiverView } from "@/components/river/river-view"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function RiverPage() {
  const { filters, getFilteredEntries } = useRiverStore()
  const entries = getFilteredEntries()
  const hasFilters = !!(filters.type || filters.agentId || filters.search)

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-[var(--border-subtle)] px-6 py-4">
        <RiverFilters />
      </div>
      <ScrollArea className="flex-1 px-6 py-4">
        {entries.length > 0 ? (
          <RiverView entries={entries} />
        ) : hasFilters ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm text-[var(--text-muted)]">No entries match your filters.</p>
            <button
              onClick={() => useRiverStore.getState().clearFilters()}
              className="mt-2 text-sm text-[var(--accent-primary)] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              No changes yet. Create an agent on the Canvas to begin.
            </p>
            <Link
              href="/canvas"
              className="mt-2 text-sm text-[var(--accent-primary)] hover:underline"
            >
              Go to Canvas
            </Link>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
