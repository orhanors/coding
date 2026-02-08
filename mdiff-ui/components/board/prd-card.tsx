"use client"

import React from "react"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PrdBoardItem } from "@/lib/types"

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

const priorityDot: Record<string, string> = {
  high: "bg-[var(--error)]",
  medium: "bg-[var(--warning)]",
  low: "bg-[var(--text-muted)]",
}

interface PrdCardProps {
  item: PrdBoardItem
  isDragging?: boolean
  onDragStart: (e: React.DragEvent, id: string) => void
  onDragEnd: () => void
  onClick: () => void
}

export function PrdCard({ item, isDragging, onDragStart, onDragEnd, onClick }: PrdCardProps) {
  const progress = item.totalTasks > 0 ? (item.completedTasks / item.totalTasks) * 100 : 0

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "group rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-3",
        "cursor-grab active:cursor-grabbing select-none",
        "transition-all duration-150",
        "hover:border-[var(--border-strong)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.3)]",
        isDragging && "opacity-30 scale-[0.97]"
      )}
    >
      {/* Title row */}
      <div className="flex items-start gap-2">
        <span className={cn("w-1.5 h-1.5 rounded-full mt-[5px] shrink-0", priorityDot[item.priority])} />
        <h4 className="text-sm font-medium text-[var(--text-primary)] leading-snug">
          {item.name}
        </h4>
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--text-muted)] mt-1 ml-3.5 line-clamp-2 leading-relaxed">
        {item.description}
      </p>

      {/* Progress */}
      {item.totalTasks > 0 && (
        <div className="mt-2.5 ml-3.5">
          <div className="h-1 rounded-full bg-[var(--bg-hover)] overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progress === 100
                  ? "bg-[var(--success)]"
                  : "bg-[var(--accent-primary)]"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2.5 ml-3.5">
        <div className="flex items-center gap-1">
          {item.author === "agent" ? (
            <Bot className="w-3 h-3 text-[var(--accent-primary)]" />
          ) : (
            <User className="w-3 h-3 text-[var(--text-muted)]" />
          )}
          {item.totalTasks > 0 && (
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              {item.completedTasks}/{item.totalTasks}
            </span>
          )}
        </div>
        <span className="text-[10px] text-[var(--text-muted)] font-mono">
          {timeAgo(item.updatedAt)}
        </span>
      </div>
    </div>
  )
}
