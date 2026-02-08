import React from "react"
import type { DiffHunk as DiffHunkType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DiffHunkProps {
  hunk: DiffHunkType
  hunkIndex: number
  approveState?: "approved" | "rejected" | "pending"
  onApprove?: (hunkIndex: number) => void
  onReject?: (hunkIndex: number) => void
}

export function DiffHunkView({
  hunk,
  hunkIndex,
  approveState = "pending",
  onApprove,
  onReject,
}: DiffHunkProps) {
  return (
    <div
      className={cn(
        "rounded-md overflow-hidden border",
        approveState === "approved" && "border-l-2 border-l-[var(--diff-added-border)]",
        approveState === "rejected" && "border-l-2 border-l-[var(--diff-removed-border)]",
        approveState === "pending" && "border-[var(--border-subtle)]"
      )}
    >
      {/* Hunk header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] font-mono group">
        <span>
          @@ -{hunk.oldStart},{hunk.oldCount} +{hunk.newStart},{hunk.newCount} @@
          {approveState !== "pending" && (
            <span className={cn(
              "ml-2",
              approveState === "approved" ? "text-[var(--success)]" : "text-[var(--error)]"
            )}>
              {approveState === "approved" ? "✓" : "✗"}
            </span>
          )}
        </span>
        {onApprove && onReject && approveState === "pending" && (
          <span className="hidden group-hover:flex items-center gap-1">
            <button
              onClick={() => onApprove(hunkIndex)}
              className="p-0.5 rounded text-[var(--success)] hover:bg-[var(--success-muted)] transition-colors"
              aria-label="Approve hunk"
            >
              ✓
            </button>
            <button
              onClick={() => onReject(hunkIndex)}
              className="p-0.5 rounded text-[var(--error)] hover:bg-[var(--error-muted)] transition-colors"
              aria-label="Reject hunk"
            >
              ✗
            </button>
          </span>
        )}
      </div>

      {/* Diff lines */}
      <div className="text-sm font-mono">
        {hunk.lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              line.type === "added" &&
                "bg-[var(--diff-added-bg)] border-l-2 border-l-[var(--diff-added-border)]",
              line.type === "removed" &&
                "bg-[var(--diff-removed-bg)] border-l-2 border-l-[var(--diff-removed-border)]",
              line.type === "context" && "border-l-2 border-l-transparent"
            )}
          >
            <span className="w-12 flex-shrink-0 text-right pr-2 text-xs text-[var(--text-muted)] select-none py-0.5">
              {line.lineNumber}
            </span>
            <span className="w-4 flex-shrink-0 text-center select-none py-0.5">
              {line.type === "added" && (
                <span className="text-[var(--diff-added-text)]">+</span>
              )}
              {line.type === "removed" && (
                <span className="text-[var(--diff-removed-text)]">−</span>
              )}
            </span>
            <span
              className={cn(
                "flex-1 py-0.5 pr-3",
                line.type === "added" && "text-[var(--diff-added-text)]",
                line.type === "removed" && "text-[var(--diff-removed-text)]",
                line.type === "context" && "text-[var(--text-secondary)]"
              )}
            >
              {line.content}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
