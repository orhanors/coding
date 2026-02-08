"use client"

import { useState, useMemo } from "react"
import { CommitSidebar } from "@/components/architecture/commit-sidebar"
import { ArchitectureCanvas } from "@/components/architecture/architecture-canvas"
import { mockArchitectureCommits } from "@/lib/mock-data"
import { computeArchitectureDiff } from "@/lib/architecture-utils"
import { cn } from "@/lib/utils"

export default function ArchitecturePage() {
  const commits = mockArchitectureCommits
  const [selectedCommitId, setSelectedCommitId] = useState(commits[commits.length - 1].id)
  const [diffMode, setDiffMode] = useState(false)

  const selectedIndex = commits.findIndex((c) => c.id === selectedCommitId)
  const selectedCommit = commits[selectedIndex]

  const diff = useMemo(() => {
    if (!diffMode || selectedIndex <= 0) return null
    const prevSnapshot = commits[selectedIndex - 1].snapshot
    return computeArchitectureDiff(prevSnapshot, selectedCommit.snapshot)
  }, [diffMode, selectedIndex, selectedCommit, commits])

  const prevCommit = selectedIndex > 0 ? commits[selectedIndex - 1] : null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-[var(--ac-border-subtle)]">
        <h1 className="text-sm font-semibold text-[var(--ac-text-primary)]">Architecture</h1>
        <div className="flex items-center gap-1 bg-[var(--ac-bg-tertiary)] rounded-md p-0.5">
          <button
            onClick={() => setDiffMode(false)}
            className={cn(
              "px-3 py-1 text-xs rounded transition-colors",
              !diffMode
                ? "bg-[var(--ac-bg-active)] text-[var(--ac-text-primary)]"
                : "text-[var(--ac-text-muted)] hover:text-[var(--ac-text-secondary)]"
            )}
          >
            Snapshot
          </button>
          <button
            onClick={() => setDiffMode(true)}
            className={cn(
              "px-3 py-1 text-xs rounded transition-colors",
              diffMode
                ? "bg-[var(--ac-bg-active)] text-[var(--ac-text-primary)]"
                : "text-[var(--ac-text-muted)] hover:text-[var(--ac-text-secondary)]"
            )}
          >
            Diff
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <CommitSidebar
          commits={commits}
          selectedId={selectedCommitId}
          onSelect={setSelectedCommitId}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <ArchitectureCanvas
            snapshot={selectedCommit.snapshot}
            diff={diff}
            diffMode={diffMode}
          />

          {/* Commit comparison bar */}
          {diffMode && prevCommit && (
            <div className="shrink-0 border-t border-[var(--ac-border-subtle)] px-4 py-2 flex items-center gap-2 text-2xs">
              <span className="font-mono text-[var(--ac-accent)]">{selectedCommit.hash}</span>
              <span className="text-[var(--ac-text-muted)]">&larr;</span>
              <span className="font-mono text-[var(--ac-text-secondary)]">{prevCommit.hash}</span>
              {diff && (
                <span className="ml-2 text-[var(--ac-text-muted)]">
                  {diff.stats.nodesAdded > 0 && <span className="text-[var(--ac-success)]">+{diff.stats.nodesAdded} nodes </span>}
                  {diff.stats.nodesRemoved > 0 && <span className="text-[var(--ac-error)]">-{diff.stats.nodesRemoved} nodes </span>}
                  {diff.stats.edgesAdded > 0 && <span className="text-[var(--ac-success)]">+{diff.stats.edgesAdded} edges </span>}
                  {diff.stats.edgesRemoved > 0 && <span className="text-[var(--ac-error)]">-{diff.stats.edgesRemoved} edges </span>}
                  {diff.stats.edgesModified > 0 && <span className="text-[var(--ac-warning)]">~{diff.stats.edgesModified} edges</span>}
                </span>
              )}
            </div>
          )}

          {!diffMode && (
            <div className="shrink-0 border-t border-[var(--ac-border-subtle)] px-4 py-2 flex items-center gap-2 text-2xs">
              <span className="font-mono text-[var(--ac-accent)]">{selectedCommit.hash}</span>
              <span className="text-[var(--ac-text-muted)]">&mdash;</span>
              <span className="text-[var(--ac-text-secondary)]">{selectedCommit.message}</span>
              <span className="text-[var(--ac-text-muted)]">&middot;</span>
              <span className="text-[var(--ac-text-muted)]">{selectedCommit.stats.nodes} nodes, {selectedCommit.stats.edges} edges</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
