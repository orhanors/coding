"use client"

import React, { useState, useMemo } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  X,
  Bot,
  User,
  ChevronDown,
  ChevronRight,
  Check,
  Circle,
  FileText,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PrdBoardItem, PrdTask, PrdTaskCategory } from "@/lib/types"

// ── Category config ──

const categoryStyle: Record<PrdTaskCategory, { label: string; color: string; bg: string }> = {
  setup:         { label: "setup",         color: "text-[var(--info)]",    bg: "bg-[var(--info-muted)]" },
  feature:       { label: "feature",       color: "text-[var(--accent-primary)]", bg: "bg-[var(--accent-muted)]" },
  integration:   { label: "integration",   color: "text-cyan-400",         bg: "bg-cyan-400/10" },
  optimization:  { label: "optimization",  color: "text-[var(--warning)]", bg: "bg-[var(--warning-muted)]" },
  security:      { label: "security",      color: "text-[var(--error)]",   bg: "bg-[var(--error-muted)]" },
  testing:       { label: "testing",       color: "text-[var(--success)]", bg: "bg-[var(--success-muted)]" },
  documentation: { label: "docs",          color: "text-[var(--text-secondary)]", bg: "bg-[var(--bg-hover)]" },
}

const priorityLabel: Record<string, { text: string; color: string }> = {
  high:   { text: "High",   color: "text-[var(--error)]" },
  medium: { text: "Medium", color: "text-[var(--warning)]" },
  low:    { text: "Low",    color: "text-[var(--text-muted)]" },
}

const stageLabel: Record<string, { text: string; color: string }> = {
  backlog:     { text: "Backlog",     color: "text-[var(--text-muted)]" },
  in_progress: { text: "In Progress", color: "text-[var(--accent-primary)]" },
  review:      { text: "Review",      color: "text-[var(--warning)]" },
  done:        { text: "Done",        color: "text-[var(--success)]" },
}

// ── Phase names ──

const phaseNames: Record<number, string> = {
  1: "Foundation",
  2: "Core Implementation",
  3: "Integration",
  4: "Hardening",
  5: "Security Review",
  6: "Testing & Quality",
  7: "Documentation",
}

// ── Helpers ──

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ── Task Item ──

function TaskItem({ task, index }: { task: PrdTask; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const cat = categoryStyle[task.category]

  return (
    <div
      className={cn(
        "rounded-md border transition-colors",
        task.implemented
          ? "border-[var(--border-subtle)] bg-[var(--bg-primary)]"
          : "border-[var(--border-default)] bg-[var(--bg-surface)]"
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-2.5 p-2.5 text-left"
      >
        {/* Status icon */}
        {task.implemented ? (
          <Check className="w-3.5 h-3.5 text-[var(--success)] mt-0.5 shrink-0" />
        ) : (
          <Circle className="w-3.5 h-3.5 text-[var(--text-muted)] mt-0.5 shrink-0" />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", cat.color, cat.bg)}>
              {cat.label}
            </span>
            <span
              className={cn(
                "text-xs leading-snug",
                task.implemented ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"
              )}
            >
              {task.description}
            </span>
          </div>
        </div>

        {/* Expand chevron */}
        {task.steps.length > 0 && (
          expanded ? (
            <ChevronDown className="w-3 h-3 text-[var(--text-muted)] mt-0.5 shrink-0" />
          ) : (
            <ChevronRight className="w-3 h-3 text-[var(--text-muted)] mt-0.5 shrink-0" />
          )
        )}
      </button>

      {/* Steps */}
      {expanded && task.steps.length > 0 && (
        <div className="px-2.5 pb-2.5 ml-6">
          <ul className="space-y-1">
            {task.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                <span className="text-[var(--text-muted)] font-mono shrink-0 w-3 text-right">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>

          {/* Improvements */}
          {task.improvements.length > 0 && (
            <div className="mt-2 pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-[var(--warning)]" />
                <span className="text-[10px] font-medium text-[var(--warning)]">Improvements</span>
              </div>
              {task.improvements.map((imp, i) => (
                <p key={i} className="text-[11px] text-[var(--text-muted)] ml-4">{imp}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Phase Group ──

function PhaseGroup({ phase, tasks }: { phase: number; tasks: PrdTask[] }) {
  const [collapsed, setCollapsed] = useState(false)
  const done = tasks.filter((t) => t.implemented).length
  const allDone = done === tasks.length
  const phaseName = phaseNames[phase] || `Phase ${phase}`

  return (
    <div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-2 py-2 group"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        )}
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          Phase {phase}
        </span>
        <span className="text-[10px] text-[var(--text-muted)]">
          {phaseName}
        </span>
        <span className="ml-auto text-[10px] font-mono tabular-nums text-[var(--text-muted)]">
          <span className={allDone ? "text-[var(--success)]" : ""}>{done}</span>/{tasks.length}
        </span>
      </button>

      {!collapsed && (
        <div className="space-y-1.5 ml-1 pb-3">
          {tasks.map((task, i) => (
            <TaskItem key={i} task={task} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Modal ──

interface PrdDetailModalProps {
  item: PrdBoardItem | null
  onClose: () => void
}

export function PrdDetailModal({ item, onClose }: PrdDetailModalProps) {
  if (!item) return null

  const progress = item.totalTasks > 0 ? (item.completedTasks / item.totalTasks) * 100 : 0
  const stage = stageLabel[item.stage]
  const priority = priorityLabel[item.priority]

  // Group tasks by phase
  const phases = useMemo(() => {
    const map = new Map<number, PrdTask[]>()
    for (const task of item.tasks) {
      const existing = map.get(task.phase) || []
      existing.push(task)
      map.set(task.phase, existing)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b)
  }, [item.tasks])

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, { total: number; done: number }> = {}
    for (const task of item.tasks) {
      if (!counts[task.category]) counts[task.category] = { total: 0, done: 0 }
      counts[task.category].total++
      if (task.implemented) counts[task.category].done++
    }
    return Object.entries(counts)
  }, [item.tasks])

  return (
    <DialogPrimitive.Root open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-2xl max-h-[85vh] translate-x-[-50%] translate-y-[-50%]",
            "flex flex-col rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] shadow-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98]",
            "duration-200"
          )}
        >
          {/* ── Header ── */}
          <div className="shrink-0 px-5 pt-5 pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                  {item.name}
                </h2>
                {item.sourceAdr && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <FileText className="w-3 h-3 text-[var(--text-muted)]" />
                    <span className="text-[11px] text-[var(--text-muted)]">{item.sourceAdr}</span>
                  </div>
                )}
              </div>
              <DialogPrimitive.Close className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
                <X className="w-4 h-4" />
              </DialogPrimitive.Close>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className={cn("text-[10px] font-medium uppercase tracking-wider", stage.color)}>
                {stage.text}
              </span>
              <span className="w-px h-3 bg-[var(--border-default)]" />
              <span className={cn("text-[10px] font-medium", priority.color)}>
                {priority.text} priority
              </span>
              <span className="w-px h-3 bg-[var(--border-default)]" />
              <div className="flex items-center gap-1">
                {item.author === "agent" ? (
                  <Bot className="w-3 h-3 text-[var(--accent-primary)]" />
                ) : (
                  <User className="w-3 h-3 text-[var(--text-muted)]" />
                )}
                <span className="text-[10px] text-[var(--text-muted)]">{item.author}</span>
              </div>
              <span className="w-px h-3 bg-[var(--border-default)]" />
              <span className="text-[10px] text-[var(--text-muted)]">
                {formatDate(item.createdAt)}
              </span>
            </div>

            {/* Progress */}
            {item.totalTasks > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    Progress
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-[var(--text-muted)]">
                    {item.completedTasks}/{item.totalTasks} tasks
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--bg-hover)] overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      progress === 100 ? "bg-[var(--success)]" : "bg-[var(--accent-primary)]"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
            {/* Overview */}
            {item.overview && (
              <div className="mb-5">
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.overview}
                </p>
              </div>
            )}

            {/* Category breakdown */}
            {categoryBreakdown.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {categoryBreakdown.map(([cat, counts]) => {
                  const style = categoryStyle[cat as PrdTaskCategory]
                  return (
                    <div
                      key={cat}
                      className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md", style.bg)}
                    >
                      <span className={cn("text-[10px] font-medium", style.color)}>{style.label}</span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {counts.done}/{counts.total}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Tasks by phase */}
            {phases.length > 0 ? (
              <div className="space-y-1">
                {phases.map(([phase, tasks]) => (
                  <PhaseGroup key={phase} phase={phase} tasks={tasks} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Circle className="w-6 h-6 text-[var(--text-muted)] mb-2" />
                <p className="text-xs text-[var(--text-muted)]">No tasks yet.</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Run the agent to generate tasks from the source ADR.
                </p>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <DialogPrimitive.Title className="sr-only">{item.name} details</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            PRD detail view showing {item.totalTasks} tasks across {phases.length} phases
          </DialogPrimitive.Description>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
