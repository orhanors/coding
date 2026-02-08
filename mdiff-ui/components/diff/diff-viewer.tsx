"use client"

import React, { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import type { DiffHunk, DiffLine } from "@/lib/types"

interface DiffViewerProps {
  oldContent: string
  newContent: string
  oldLabel?: string
  newLabel?: string
  mode?: "unified" | "split"
  onApproveHunk?: (hunkIndex: number) => void
  onRejectHunk?: (hunkIndex: number) => void
}

function computeHunks(oldContent: string, newContent: string): DiffHunk[] {
  const oldLines = oldContent.split("\n")
  const newLines = newContent.split("\n")
  const maxLen = Math.max(oldLines.length, newLines.length)
  const lines: DiffLine[] = []

  let lineNum = 1
  for (let i = 0; i < maxLen; i++) {
    const oldLine = i < oldLines.length ? oldLines[i] : undefined
    const newLine = i < newLines.length ? newLines[i] : undefined

    if (oldLine === newLine) {
      lines.push({ type: "context", content: newLine ?? "", lineNumber: lineNum++ })
    } else {
      if (oldLine !== undefined) {
        lines.push({ type: "removed", content: oldLine, lineNumber: lineNum })
      }
      if (newLine !== undefined) {
        lines.push({ type: "added", content: newLine, lineNumber: lineNum })
      }
      lineNum++
    }
  }

  if (lines.length === 0) return []

  return [
    {
      oldStart: 1,
      oldCount: oldLines.length,
      newStart: 1,
      newCount: newLines.length,
      lines,
    },
  ]
}

export function DiffViewer({
  oldContent,
  newContent,
  oldLabel = "Before",
  newLabel = "After",
  mode: initialMode = "unified",
  onApproveHunk,
  onRejectHunk,
}: DiffViewerProps) {
  const [mode, setMode] = useState(initialMode)
  const [hunkStates, setHunkStates] = useState<Record<number, "approved" | "rejected" | "pending">>({})

  const hunks = useMemo(() => computeHunks(oldContent, newContent), [oldContent, newContent])

  const approvedCount = Object.values(hunkStates).filter((s) => s === "approved").length

  const handleApprove = (idx: number) => {
    setHunkStates((prev) => ({ ...prev, [idx]: "approved" }))
    onApproveHunk?.(idx)
  }

  const handleReject = (idx: number) => {
    setHunkStates((prev) => ({ ...prev, [idx]: "rejected" }))
    onRejectHunk?.(idx)
  }

  const approveAll = () => {
    const newStates: Record<number, "approved"> = {}
    hunks.forEach((_, i) => {
      if (hunkStates[i] !== "rejected") newStates[i] = "approved"
    })
    setHunkStates((prev) => ({ ...prev, ...newStates }))
  }

  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
          <span>{oldLabel}</span>
          <span>→</span>
          <span>{newLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          {onApproveHunk && (
            <button
              onClick={approveAll}
              className="text-xs text-[var(--success)] hover:text-[var(--success)] hover:underline transition-colors"
            >
              Approve All
            </button>
          )}
          <div className="flex rounded-md border border-[var(--border-default)] overflow-hidden">
            <button
              onClick={() => setMode("unified")}
              className={cn(
                "px-2 py-1 text-xs transition-colors",
                mode === "unified"
                  ? "bg-[var(--accent-muted)] text-[var(--accent-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              Unified
            </button>
            <button
              onClick={() => setMode("split")}
              className={cn(
                "px-2 py-1 text-xs transition-colors",
                mode === "split"
                  ? "bg-[var(--accent-muted)] text-[var(--accent-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              Split
            </button>
          </div>
        </div>
      </div>

      {/* Diff content */}
      {mode === "unified" ? (
        <div className="text-sm font-mono">
          {hunks.map((hunk, hi) => (
            <div key={hi}>
              <div className="flex items-center justify-between px-3 py-1 bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] group">
                <span>
                  @@ -{hunk.oldStart},{hunk.oldCount} +{hunk.newStart},{hunk.newCount} @@
                </span>
                {onApproveHunk && onRejectHunk && hunkStates[hi] !== "approved" && hunkStates[hi] !== "rejected" && (
                  <span className="hidden group-hover:flex items-center gap-1">
                    <button onClick={() => handleApprove(hi)} className="text-[var(--success)]">✓</button>
                    <button onClick={() => handleReject(hi)} className="text-[var(--error)]">✗</button>
                  </span>
                )}
              </div>
              {hunk.lines.map((line, li) => (
                <div
                  key={li}
                  className={cn(
                    "flex",
                    line.type === "added" && "bg-[var(--diff-added-bg)] border-l-2 border-l-[var(--diff-added-border)]",
                    line.type === "removed" && "bg-[var(--diff-removed-bg)] border-l-2 border-l-[var(--diff-removed-border)]",
                    line.type === "context" && "border-l-2 border-l-transparent"
                  )}
                >
                  <span className="w-12 flex-shrink-0 text-right pr-2 text-xs text-[var(--text-muted)] select-none py-0.5">
                    {line.lineNumber}
                  </span>
                  <span className="w-4 flex-shrink-0 text-center select-none py-0.5">
                    {line.type === "added" && <span className="text-[var(--diff-added-text)]">+</span>}
                    {line.type === "removed" && <span className="text-[var(--diff-removed-text)]">−</span>}
                  </span>
                  <span className={cn(
                    "flex-1 py-0.5 pr-3",
                    line.type === "added" && "text-[var(--diff-added-text)]",
                    line.type === "removed" && "text-[var(--diff-removed-text)]",
                    line.type === "context" && "text-[var(--text-secondary)]"
                  )}>
                    {line.content}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 text-sm font-mono">
          {hunks.map((hunk, hi) => {
            const removed = hunk.lines.filter((l) => l.type === "removed" || l.type === "context")
            const added = hunk.lines.filter((l) => l.type === "added" || l.type === "context")
            return (
              <React.Fragment key={hi}>
                {/* Left (old) */}
                <div className="border-r border-[var(--border-subtle)]">
                  {removed.map((line, li) => (
                    <div
                      key={li}
                      className={cn(
                        "flex py-0.5",
                        line.type === "removed" && "bg-[var(--diff-removed-bg)]"
                      )}
                    >
                      <span className="w-10 flex-shrink-0 text-right pr-2 text-xs text-[var(--text-muted)] select-none">
                        {line.lineNumber}
                      </span>
                      <span className={cn(
                        "flex-1 pr-2",
                        line.type === "removed" ? "text-[var(--diff-removed-text)]" : "text-[var(--text-secondary)]"
                      )}>
                        {line.content}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Right (new) */}
                <div>
                  {added.map((line, li) => (
                    <div
                      key={li}
                      className={cn(
                        "flex py-0.5",
                        line.type === "added" && "bg-[var(--diff-added-bg)]"
                      )}
                    >
                      <span className="w-10 flex-shrink-0 text-right pr-2 text-xs text-[var(--text-muted)] select-none">
                        {line.lineNumber}
                      </span>
                      <span className={cn(
                        "flex-1 pr-2",
                        line.type === "added" ? "text-[var(--diff-added-text)]" : "text-[var(--text-secondary)]"
                      )}>
                        {line.content}
                      </span>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            )
          })}
        </div>
      )}

      {/* Summary */}
      {onApproveHunk && hunks.length > 0 && (
        <div className="px-3 py-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          {approvedCount}/{hunks.length} hunks approved
        </div>
      )}
    </div>
  )
}
