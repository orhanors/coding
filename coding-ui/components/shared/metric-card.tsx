"use client"

import React from "react"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: number | string
  delta?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ReactNode
}

export function MetricCard({ label, value, delta, trend, icon }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[var(--spec-border-default)] bg-[var(--spec-bg-secondary)] p-4 transition-colors hover:border-[var(--spec-border-strong)]">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--spec-text-secondary)]">{label}</span>
        {icon && (
          <span className="text-[var(--spec-text-muted)]">{icon}</span>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight text-[var(--spec-text-primary)]">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              trend === "up" && "text-[var(--spec-success)]",
              trend === "down" && "text-[var(--spec-error)]",
              trend === "neutral" && "text-[var(--spec-text-muted)]"
            )}
          >
            {trend === "up" && <TrendingUp className="h-3 w-3" />}
            {trend === "down" && <TrendingDown className="h-3 w-3" />}
            {trend === "neutral" && <Minus className="h-3 w-3" />}
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}
