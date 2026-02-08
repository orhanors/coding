"use client"

import React from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { DeliveryEntry } from "@/lib/types"

const platformColors: Record<string, string> = {
  telegram: "bg-blue-500/10 text-blue-400",
  discord: "bg-indigo-500/10 text-indigo-400",
  slack: "bg-green-500/10 text-green-400",
}

interface MdiffDeliveryLogProps {
  entries: DeliveryEntry[]
  onClear: () => void
}

export function MdiffDeliveryLog({ entries, onClear }: MdiffDeliveryLogProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Delivery Log</h2>
        <button
          onClick={onClear}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          Clear log
        </button>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden">
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5",
              i !== entries.length - 1 && "border-b border-[var(--border-subtle)]"
            )}
          >
            <span className="text-xs text-[var(--text-muted)] font-mono w-12 flex-shrink-0">
              {format(entry.timestamp, "HH:mm")}
            </span>

            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded capitalize flex-shrink-0",
                platformColors[entry.platform]
              )}
            >
              {entry.platform}
            </span>

            <span
              className={cn(
                "text-xs flex-shrink-0",
                entry.success ? "text-[var(--success)]" : "text-[var(--error)]"
              )}
            >
              {entry.success ? "✓" : "✗"}
            </span>

            <span className="text-sm text-[var(--text-secondary)] truncate flex-1">
              {entry.message}
            </span>

            {entry.retrying && (
              <span className="text-xs text-[var(--warning)] flex-shrink-0">retrying...</span>
            )}
          </div>
        ))}

        {entries.length === 0 && (
          <p className="text-center text-[var(--text-muted)] py-8 text-sm">No deliveries yet.</p>
        )}
      </div>
    </div>
  )
}
