"use client"

import { isToday, isYesterday, format } from "date-fns"
import type { RiverEntry } from "@/lib/types"
import { RiverDateGroup } from "./river-date-group"
import { RiverEntryItem } from "./river-entry"

interface RiverViewProps {
  entries: RiverEntry[]
}

function getDateLabel(date: Date): string {
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"
  return format(date, "MMM d, yyyy")
}

function groupByDate(entries: RiverEntry[]): Map<string, RiverEntry[]> {
  const groups = new Map<string, RiverEntry[]>()
  for (const entry of entries) {
    const label = getDateLabel(entry.timestamp)
    const existing = groups.get(label)
    if (existing) {
      existing.push(entry)
    } else {
      groups.set(label, [entry])
    }
  }
  return groups
}

export function RiverView({ entries }: RiverViewProps) {
  if (entries.length === 0) return null

  const groups = groupByDate(entries)

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[var(--border-subtle)]" />

      <div className="relative space-y-1">
        {Array.from(groups.entries()).map(([label, groupEntries]) => (
          <div key={label}>
            <RiverDateGroup label={label} />
            <div className="space-y-0.5">
              {groupEntries.map((entry) => (
                <RiverEntryItem key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
