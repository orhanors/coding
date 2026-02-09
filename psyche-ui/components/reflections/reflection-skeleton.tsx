import { Skeleton } from "@/components/ui/skeleton"

function SkeletonEntry() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Badge placeholder */}
      <Skeleton className="h-5 w-16 rounded-full" />

      {/* Title line */}
      <Skeleton className="h-4 flex-1" />

      {/* Status badge */}
      <Skeleton className="h-5 w-14 rounded-full" />

      {/* Timestamp */}
      <Skeleton className="h-3 w-20 shrink-0" />
    </div>
  )
}

export function ReflectionSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Section 1 */}
      <div className="border-b border-[var(--border-subtle)] py-2">
        <div className="px-4 py-2">
          <Skeleton className="h-3 w-28" />
        </div>
        <SkeletonEntry />
        <SkeletonEntry />
      </div>

      {/* Section 2 */}
      <div className="py-2">
        <div className="px-4 py-2">
          <Skeleton className="h-3 w-28" />
        </div>
        <SkeletonEntry />
        <SkeletonEntry />
      </div>
    </div>
  )
}
