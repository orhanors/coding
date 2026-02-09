"use client"

import { Badge } from "@/components/ui/badge"
import type { Reflection } from "@/lib/types"

interface ReflectionStatusBadgeProps {
  status: Reflection["status"]
}

const STATUS_STYLES: Record<Reflection["status"], string> = {
  proposed: "border-[var(--warning)] bg-[var(--warning)]/10 text-[var(--warning)]",
  accepted: "border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]",
  superseded: "border-[var(--border-default)] bg-[var(--bg-hover)] text-[var(--text-muted)]",
  deprecated: "border-[var(--error)]/30 bg-[var(--bg-hover)] text-[var(--text-muted)] line-through",
}

export function ReflectionStatusBadge({ status }: ReflectionStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium uppercase ${STATUS_STYLES[status]}`}
    >
      {status}
    </Badge>
  )
}
