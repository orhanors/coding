"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VisionBoard } from "@/components/visions/vision-board"
import { VisionList } from "@/components/visions/vision-list"
import { VisionDetailModal } from "@/components/visions/vision-detail-modal"
import { VisionEditor } from "@/components/visions/vision-editor"
import { VisionSkeleton } from "@/components/visions/vision-skeleton"
import { useVisionStore } from "@/stores/vision-store"
import { useIsMobile } from "@/hooks/use-mobile"

export default function VisionsPage() {
  const [loading, setLoading] = useState(true)
  const { visions, viewMode, setViewMode } = useVisionStore()
  const [editorOpen, setEditorOpen] = useState(false)
  const isMobile = useIsMobile()

  // Force list view on mobile since board requires drag/swipe interactions
  const effectiveViewMode = isMobile ? "list" : viewMode

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <VisionSkeleton />
  }

  if (visions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-4">
        <p className="text-center text-sm text-[var(--text-muted)]">
          No visions yet. Start by describing what you want to build.
        </p>
        <Button
          onClick={() => setEditorOpen(true)}
          className="bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Vision
        </Button>
        <VisionEditor open={editorOpen} onOpenChange={setEditorOpen} />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3 md:px-6">
        {isMobile ? (
          <span className="text-sm font-medium text-[var(--text-secondary)]">Visions</span>
        ) : (
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "board" | "list")}>
            <TabsList className="bg-[var(--bg-secondary)]">
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        <Button
          onClick={() => setEditorOpen(true)}
          size="sm"
          className="bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New Vision
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        {effectiveViewMode === "board" ? <VisionBoard /> : <VisionList />}
      </div>

      <VisionDetailModal />
      <VisionEditor open={editorOpen} onOpenChange={setEditorOpen} />
    </div>
  )
}
