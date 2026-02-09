"use client"

import type { Vision } from "@/lib/types"
import { VISION_STAGES } from "@/lib/constants"
import { VisionCard } from "./vision-card"
import { useVisionStore } from "@/stores/vision-store"
import { useState } from "react"

export function VisionBoard() {
  const { visions, moveVisionToStage, setSelectedVision } = useVisionStore()
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, visionId: string) => {
    e.dataTransfer.setData("text/plain", visionId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverStage(stageId)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    const visionId = e.dataTransfer.getData("text/plain")
    if (visionId) {
      moveVisionToStage(visionId, stageId as Vision["stage"])
    }
    setDragOverStage(null)
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto px-6 py-4">
      {VISION_STAGES.map((stage) => {
        const stageVisions = visions.filter((v) => v.stage === stage.id)
        const isDragOver = dragOverStage === stage.id

        return (
          <div
            key={stage.id}
            className="flex min-w-[260px] flex-1 flex-col"
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">
                {stage.label}
              </h3>
              <span className="rounded-full bg-[var(--bg-hover)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                {stageVisions.length}
              </span>
            </div>

            <div
              className={`flex-1 space-y-3 overflow-y-auto rounded-lg border-2 border-dashed p-2 transition-colors duration-150 ${
                isDragOver
                  ? "border-[var(--accent-primary)] bg-[var(--accent-subtle)]"
                  : "border-transparent"
              }`}
            >
              {stageVisions.length > 0 ? (
                stageVisions.map((vision) => (
                  <VisionCard
                    key={vision.id}
                    vision={vision}
                    onClick={() => setSelectedVision(vision.id)}
                    onDragStart={handleDragStart}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-xs text-[var(--text-muted)]">No visions</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
