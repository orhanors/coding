"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import type { RiverEntry as RiverEntryType } from "@/lib/types"
import { RIVER_ENTRY_TYPES, ARCHETYPES } from "@/lib/constants"
import { DiffStatsBadge } from "@/components/diff/diff-stats"
import { DiffPreview } from "@/components/diff/diff-preview"
import { DiagramThumbnail } from "./diagram-thumbnail"

interface RiverEntryItemProps {
  entry: RiverEntryType
}

export function RiverEntryItem({ entry }: RiverEntryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const entryType = RIVER_ENTRY_TYPES[entry.type]

  const iconColor =
    entry.type === "agent" && entry.agent
      ? ARCHETYPES[entry.agent.archetype].color
      : entryType.color

  const hasPreview =
    (entry.type === "code" || entry.type === "vision" || entry.type === "reflection") &&
    entry.diffHunks?.length
  const hasDiagram = entry.type === "diagram"
  const isExpandable = hasPreview || hasDiagram

  return (
    <div className="group animate-timeline-entry">
      <div
        role={isExpandable ? "button" : undefined}
        aria-expanded={isExpandable ? isExpanded : undefined}
        tabIndex={isExpandable ? 0 : undefined}
        className={`flex gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 ${
          isExpandable ? "cursor-pointer hover:bg-[var(--bg-hover)]" : ""
        }`}
        onClick={isExpandable ? () => setIsExpanded(!isExpanded) : undefined}
        onKeyDown={isExpandable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsExpanded(!isExpanded) } } : undefined}
      >
        {/* Timeline icon */}
        <div className="flex flex-col items-center pt-0.5">
          <span
            className="text-base leading-none"
            style={{ color: iconColor }}
          >
            {entryType.icon}
          </span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-[var(--text-primary)]">
              {entry.title}
            </h4>
            <span className="shrink-0 text-xs text-[var(--text-muted)]">
              {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
            </span>
          </div>

          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            {entry.description}
          </p>

          <div className="mt-1.5 flex items-center gap-3">
            {entry.agent && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  aria-hidden="true"
                  style={{ backgroundColor: ARCHETYPES[entry.agent.archetype].colorHex }}
                />
                ψ {entry.agent.name}
                <span className="sr-only">({ARCHETYPES[entry.agent.archetype].label})</span>
              </span>
            )}
            {entry.stats && <DiffStatsBadge stats={entry.stats} />}
          </div>
        </div>
      </div>

      {/* Expandable preview */}
      {isExpanded && (
        <div className="ml-8 mt-1 mb-2">
          {hasPreview && entry.diffHunks && (
            <DiffPreview hunks={entry.diffHunks} />
          )}
          {hasDiagram && (
            <DiagramThumbnail stats={entry.stats} />
          )}
        </div>
      )}
    </div>
  )
}
