import { Skeleton } from "@/components/ui/skeleton"

export function RiverSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          {/* Icon circle */}
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

          {/* Title + description lines */}
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-4/5" />
          </div>

          {/* Timestamp */}
          <Skeleton className="h-3 w-16 shrink-0" />
        </div>
      ))}
    </div>
  )
}
