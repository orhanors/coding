"use client"

import React, { useState, useCallback, useRef } from "react"
import { Plus } from "lucide-react"
import { PrdCard } from "./prd-card"
import { PrdDetailModal } from "./prd-detail-modal"
import { cn } from "@/lib/utils"
import type { PrdBoardItem, PrdStage } from "@/lib/types"

const COLUMNS: { id: PrdStage; label: string; dot: string }[] = [
  { id: "backlog", label: "Backlog", dot: "bg-[var(--text-muted)]" },
  { id: "in_progress", label: "In Progress", dot: "bg-[var(--accent-primary)]" },
  { id: "review", label: "Review", dot: "bg-[var(--warning)]" },
  { id: "done", label: "Done", dot: "bg-[var(--success)]" },
]

interface PrdBoardProps {
  items: PrdBoardItem[]
}

export function PrdBoard({ items: initialItems }: PrdBoardProps) {
  const [items, setItems] = useState(initialItems)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<PrdStage | null>(null)
  const [selectedItem, setSelectedItem] = useState<PrdBoardItem | null>(null)
  const didDrag = useRef(false)

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    didDrag.current = true
    setDraggingId(id)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", id)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggingId(null)
    setDragOverColumn(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, columnId: PrdStage) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(columnId)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const { clientX, clientY } = e
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      setDragOverColumn(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, targetStage: PrdStage) => {
    e.preventDefault()
    const itemId = e.dataTransfer.getData("text/plain")
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, stage: targetStage, updatedAt: new Date() }
          : item
      )
    )
    setDraggingId(null)
    setDragOverColumn(null)
  }, [])

  const handleCardClick = useCallback((item: PrdBoardItem) => {
    // Don't open modal if we just finished a drag
    if (didDrag.current) {
      didDrag.current = false
      return
    }
    setSelectedItem(item)
  }, [])

  return (
    <>
      <div className="flex gap-3 min-h-[65vh] overflow-x-auto pb-2 scrollbar-thin">
        {COLUMNS.map((column) => {
          const columnItems = items.filter((item) => item.stage === column.id)
          const isOver = dragOverColumn === column.id && draggingId !== null

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className="flex-1 min-w-[220px] flex flex-col"
            >
              {/* Column header */}
              <div className="flex items-center gap-2 px-1 pb-3">
                <span className={cn("w-2 h-2 rounded-full", column.dot)} />
                <span className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-widest">
                  {column.label}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono ml-auto tabular-nums">
                  {columnItems.length}
                </span>
              </div>

              {/* Drop zone */}
              <div
                className={cn(
                  "flex-1 rounded-lg p-1.5 space-y-2 transition-all duration-200",
                  isOver
                    ? "bg-[var(--bg-secondary)] ring-1 ring-dashed ring-[var(--border-strong)]"
                    : "bg-transparent"
                )}
              >
                {columnItems.map((item) => (
                  <PrdCard
                    key={item.id}
                    item={item}
                    isDragging={draggingId === item.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleCardClick(item)}
                  />
                ))}

                {/* Empty state */}
                {columnItems.length === 0 && (
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-lg border border-dashed py-10 transition-all duration-200",
                      isOver
                        ? "border-[var(--border-strong)] bg-[var(--bg-hover)]/40 text-[var(--text-secondary)]"
                        : "border-[var(--border-subtle)] text-[var(--text-muted)]"
                    )}
                  >
                    <span className="text-xs">
                      {isOver ? "Drop here" : "Empty"}
                    </span>
                  </div>
                )}
              </div>

              {/* Add button — only for backlog */}
              {column.id === "backlog" && (
                <button className="mt-2 mx-1.5 flex items-center justify-center gap-1.5 py-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors text-xs">
                  <Plus className="w-3 h-3" />
                  Add item
                </button>
              )}
            </div>
          )
        })}
      </div>

      <PrdDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  )
}
