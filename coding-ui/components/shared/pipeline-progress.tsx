"use client"

import { Check, Loader2, Circle, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PipelineStep } from "@/lib/types"

interface PipelineProgressProps {
  steps: PipelineStep[]
  currentStep: number
}

const stepColors: Record<string, string> = {
  "ADR": "var(--ac-pipeline-adr)",
  "Excalidraw": "var(--ac-pipeline-excalidraw)",
  "PRD": "var(--ac-pipeline-prd)",
  "Implement": "var(--ac-pipeline-implement)",
}

function formatDuration(seconds?: number) {
  if (!seconds) return ""
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `0:${String(s).padStart(2, "0")}`
}

export function PipelineProgress({ steps, currentStep }: PipelineProgressProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {steps.map((step, index) => {
        const color = stepColors[step.name] || "var(--ac-text-muted)"
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border px-4 py-3 transition-all min-w-[120px]",
                step.status === "completed" && "border-[var(--ac-border-strong)] bg-[var(--ac-bg-secondary)]",
                step.status === "running" && "border-[var(--ac-accent)] bg-[var(--ac-accent-muted)]",
                step.status === "pending" && "border-[var(--ac-border-subtle)] bg-[var(--ac-bg-surface)]",
                step.status === "failed" && "border-[var(--ac-error)] bg-[var(--ac-error-muted)]"
              )}
            >
              <div className="flex items-center gap-2">
                {step.status === "completed" && (
                  <Check className="h-4 w-4" style={{ color }} />
                )}
                {step.status === "running" && (
                  <Loader2 className="h-4 w-4 animate-spin" style={{ color }} />
                )}
                {step.status === "pending" && (
                  <Circle className="h-4 w-4 text-[var(--ac-text-muted)]" />
                )}
                {step.status === "failed" && (
                  <X className="h-4 w-4 text-[var(--ac-error)]" />
                )}
                <span
                  className="text-sm font-medium"
                  style={{ color: step.status === "pending" ? "var(--ac-text-muted)" : color }}
                >
                  {step.name}
                </span>
              </div>
              <span className="text-2xs text-[var(--ac-text-muted)]">
                {step.status === "completed" && "Completed"}
                {step.status === "running" && "Streaming..."}
                {step.status === "pending" && "Pending"}
                {step.status === "failed" && "Failed"}
              </span>
              {step.duration !== undefined && (
                <span className="text-2xs font-mono text-[var(--ac-text-muted)]">
                  {formatDuration(step.duration)}
                </span>
              )}
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ac-text-muted)]" />
            )}
          </div>
        )
      })}
    </div>
  )
}
