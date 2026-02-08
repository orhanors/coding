"use client"

import type { ArchitectureCommit } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CommitSidebarProps {
  commits: ArchitectureCommit[]
  selectedId: string
  onSelect: (id: string) => void
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function CommitSidebar({ commits, selectedId, onSelect }: CommitSidebarProps) {
  return (
    <div className="w-72 shrink-0 border-r border-[var(--ac-border-subtle)] bg-[var(--ac-bg-secondary)] flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--ac-border-subtle)]">
        <p className="text-2xs font-medium uppercase tracking-wider text-[var(--ac-text-muted)]">
          Commit History
        </p>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {commits.map((commit, index) => {
          const isSelected = commit.id === selectedId
          const isHead = index === commits.length - 1

          return (
            <button
              key={commit.id}
              onClick={() => onSelect(commit.id)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-[var(--ac-border-subtle)] transition-colors relative",
                isSelected
                  ? "bg-[var(--ac-accent-muted)]"
                  : "hover:bg-[var(--ac-bg-hover)]"
              )}
            >
              {/* Timeline dot */}
              <div className="absolute left-2 top-4 flex flex-col items-center">
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--ac-pipeline-excalidraw)" }}
                />
                {index < commits.length - 1 && (
                  <div className="w-px flex-1 bg-[var(--ac-border-subtle)] mt-1" style={{ minHeight: "calc(100% - 12px)" }} />
                )}
              </div>

              <div className="pl-4">
                {/* Hash + HEAD badge */}
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs text-[var(--ac-accent)]">
                    {commit.hash}
                  </span>
                  {isHead && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--ac-pipeline-excalidraw)] text-[var(--ac-bg-primary)] font-semibold leading-none">
                      HEAD
                    </span>
                  )}
                </div>

                {/* Message */}
                <p className="text-xs text-[var(--ac-text-primary)] truncate">
                  {commit.message}
                </p>

                {/* ADR ref + time + stats */}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--ac-bg-tertiary)] text-[var(--ac-pipeline-adr)] leading-none">
                    {commit.adrRef}
                  </span>
                  <span className="text-2xs text-[var(--ac-text-muted)]">
                    {formatRelativeTime(commit.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1 text-2xs text-[var(--ac-text-muted)]">
                  <span>{commit.stats.nodes} nodes</span>
                  <span>&middot;</span>
                  <span>{commit.stats.edges} edges</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
