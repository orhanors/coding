"use client"

interface RiverDateGroupProps {
  label: string
}

export function RiverDateGroup({ label }: RiverDateGroupProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[var(--border-strong)] bg-[var(--bg-primary)]" />
      <span className="text-sm font-medium text-[var(--text-muted)]">{label}</span>
      <div className="h-px flex-1 bg-[var(--border-subtle)]" />
    </div>
  )
}
