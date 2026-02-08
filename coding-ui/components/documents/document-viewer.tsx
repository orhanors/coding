"use client"

import { Badge } from "@/components/ui/badge"
import type { DocumentNode, DocumentChange } from "@/lib/types"
import { mockChanges } from "@/lib/mock-data"
import { Circle, Clock, GitBranch, Plus, Minus } from "lucide-react"

interface DocumentViewerProps {
  document: DocumentNode | null
}

const statusLabels: Record<string, string> = {
  proposed: "Proposed",
  active: "Active",
  accepted: "Accepted",
  completed: "Completed",
  deprecated: "Deprecated",
}

const statusVariants: Record<string, string> = {
  proposed: "bg-[var(--spec-accent-muted)] text-[var(--spec-accent)] border-[var(--spec-accent)]",
  active: "bg-[var(--spec-accent-muted)] text-[var(--spec-accent)] border-[var(--spec-accent)]",
  accepted: "bg-[var(--spec-success-muted)] text-[var(--spec-success)] border-[var(--spec-success)]",
  completed: "bg-[var(--spec-success-muted)] text-[var(--spec-success)] border-[var(--spec-success)]",
  deprecated: "bg-[var(--spec-bg-surface)] text-[var(--spec-text-muted)] border-[var(--spec-border-default)]",
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  if (!document) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[var(--spec-text-muted)]">Select a document to view</p>
          <p className="mt-1 text-2xs text-[var(--spec-text-muted)]">
            Choose from the document tree on the left
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto scrollbar-thin">
      {/* Document header */}
      <div className="border-b border-[var(--spec-border-subtle)] px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-base font-semibold text-[var(--spec-text-primary)]">
            {document.name}
          </h2>
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-medium ${statusVariants[document.status]}`}
          >
            {statusLabels[document.status]}
          </span>
        </div>
        <div className="flex items-center gap-4 text-2xs text-[var(--spec-text-muted)]">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(document.lastModified)}
          </span>
          <span className="flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            {document.type.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Document content */}
      {document.content ? (
        <div className="flex-1 px-6 py-4">
          <div className="prose-spec font-mono text-xs leading-relaxed">
            {document.content.split("\n").map((line, i) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={i} className="mb-3 mt-4 text-lg font-bold text-[var(--spec-text-primary)]">
                    {line.replace("# ", "")}
                  </h1>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="mb-2 mt-4 text-sm font-semibold text-[var(--spec-text-primary)]"
                  >
                    {line.replace("## ", "")}
                  </h2>
                )
              }
              if (line.startsWith("- **")) {
                const parts = line.replace("- **", "").split("**")
                return (
                  <div key={i} className="flex gap-1 py-0.5 pl-2 text-[var(--spec-text-secondary)]">
                    <span className="text-[var(--spec-text-muted)]">-</span>
                    <span>
                      <span className="font-semibold text-[var(--spec-text-primary)]">
                        {parts[0]}
                      </span>
                      {parts[1]}
                    </span>
                  </div>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <div key={i} className="flex gap-1 py-0.5 pl-2 text-[var(--spec-text-secondary)]">
                    <span className="text-[var(--spec-text-muted)]">-</span>
                    <span>{line.replace("- ", "")}</span>
                  </div>
                )
              }
              if (line.trim() === "") {
                return <div key={i} className="h-2" />
              }
              return (
                <p key={i} className="py-0.5 text-[var(--spec-text-secondary)]">
                  {line}
                </p>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center py-12">
          <p className="text-sm text-[var(--spec-text-muted)]">No content available for preview</p>
        </div>
      )}

      {/* Change history */}
      <div className="border-t border-[var(--spec-border-subtle)]">
        <div className="border-b border-[var(--spec-border-subtle)] px-6 py-2">
          <h3 className="text-xs font-medium text-[var(--spec-text-secondary)]">Change History</h3>
        </div>
        <div className="flex flex-col">
          {mockChanges.map((change) => (
            <div
              key={change.id}
              className="flex items-center gap-3 border-b border-[var(--spec-border-subtle)] px-6 py-2 last:border-b-0"
            >
              <span className="text-2xs font-mono text-[var(--spec-text-muted)] shrink-0">
                {formatDate(change.timestamp)}
              </span>
              <span className="text-xs text-[var(--spec-text-secondary)]">
                {change.description}
              </span>
              <div className="flex items-center gap-2 ml-auto shrink-0">
                <span className="flex items-center gap-0.5 text-2xs text-[var(--spec-success)]">
                  <Plus className="h-3 w-3" />
                  {change.linesAdded}
                </span>
                {change.linesRemoved > 0 && (
                  <span className="flex items-center gap-0.5 text-2xs text-[var(--spec-error)]">
                    <Minus className="h-3 w-3" />
                    {change.linesRemoved}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
