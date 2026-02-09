import { Skeleton } from "@/components/ui/skeleton"

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
      {/* Title */}
      <Skeleton className="h-4 w-4/5" />

      {/* Agent dot */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>

      {/* Progress bar */}
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  )
}

export function VisionSkeleton() {
  const columns = ["Planned", "In Progress", "Review", "Done"]

  return (
    <div className="flex h-full gap-4 overflow-x-auto p-6">
      {columns.map((col) => (
        <div key={col} className="flex w-64 shrink-0 flex-col gap-3">
          {/* Column header */}
          <Skeleton className="h-5 w-24" />

          {/* 3 skeleton cards per column */}
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ))}
    </div>
  )
}
