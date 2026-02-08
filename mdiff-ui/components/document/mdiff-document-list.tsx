"use client"

import React from "react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import type { MDiffDocument } from "@/lib/types"

interface MdiffDocumentListProps {
  documents: MDiffDocument[]
  selectedId?: string
  onSelect: (doc: MDiffDocument) => void
  sortBy: "date" | "name" | "type"
  onSortChange: (sort: "date" | "name" | "type") => void
}

const statusStyles: Record<string, string> = {
  proposed: "bg-[var(--warning-muted)] text-[var(--warning)]",
  accepted: "bg-[var(--success-muted)] text-[var(--success)]",
  active: "bg-[var(--accent-muted)] text-[var(--accent-primary)]",
  completed: "bg-[var(--success-muted)] text-[var(--success)]",
  deprecated: "bg-[var(--error-muted)] text-[var(--error)]",
}

export function MdiffDocumentList({
  documents,
  selectedId,
  onSelect,
  sortBy,
  onSortChange,
}: MdiffDocumentListProps) {
  const sorted = [...documents].sort((a, b) => {
    if (sortBy === "date") return b.lastModified.getTime() - a.lastModified.getTime()
    if (sortBy === "name") return a.name.localeCompare(b.name)
    return a.type.localeCompare(b.type)
  })

  const grouped: Record<string, MDiffDocument[]> = {}
  for (const doc of sorted) {
    if (!grouped[doc.type]) grouped[doc.type] = []
    grouped[doc.type].push(doc)
  }

  return (
    <div>
      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-3">
        {(["date", "name", "type"] as const).map((s) => (
          <button
            key={s}
            onClick={() => onSortChange(s)}
            className={cn(
              "text-xs px-2 py-1 rounded transition-colors capitalize",
              sortBy === s
                ? "bg-[var(--accent-muted)] text-[var(--accent-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Document groups */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([type, docs]) => (
          <div key={type}>
            <h3 className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
              {type}
            </h3>
            <div className="space-y-0.5">
              {docs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onSelect(doc)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors",
                    selectedId === doc.id
                      ? "bg-[var(--accent-muted)]"
                      : "hover:bg-[var(--bg-hover)]"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--text-primary)] truncate">{doc.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {formatDistanceToNow(doc.lastModified, { addSuffix: true })} · {doc.diffCount} diff{doc.diffCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className={cn("text-2xs px-1.5 py-0.5 rounded flex-shrink-0 ml-2", statusStyles[doc.status])}>
                    {doc.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
