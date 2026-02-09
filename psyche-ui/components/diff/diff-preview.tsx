"use client"

import type { DiffHunk } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DiffPreviewProps {
  hunks: DiffHunk[]
  className?: string
}

export function DiffPreview({ hunks, className }: DiffPreviewProps) {
  if (!hunks.length) return null

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] font-mono text-xs",
        className
      )}
    >
      {hunks.map((hunk, i) => (
        <div key={i}>
          <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-3 py-1 text-[var(--text-muted)]">
            @@ -{hunk.oldStart},{hunk.oldCount} +{hunk.newStart},{hunk.newCount} @@
          </div>
          <div>
            {hunk.lines.map((line, j) => (
              <div
                key={j}
                className={cn(
                  "flex px-3 py-0.5",
                  line.type === "added" &&
                    "bg-[var(--diff-added-bg)] text-[var(--diff-added-text)]",
                  line.type === "removed" &&
                    "bg-[var(--diff-removed-bg)] text-[var(--diff-removed-text)]",
                  line.type === "context" && "text-[var(--text-secondary)]"
                )}
              >
                <span className="mr-3 w-8 shrink-0 select-none text-right text-[var(--text-muted)]">
                  {line.lineNumber}
                </span>
                <span className="mr-2 w-3 shrink-0 select-none">
                  {line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}
                </span>
                <span
                  className={cn(
                    line.type === "added" && "underline decoration-[var(--diff-added-text)]/70 decoration-2",
                    line.type === "removed" && "line-through decoration-[var(--diff-removed-text)]/70 decoration-2"
                  )}
                >
                  {line.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
