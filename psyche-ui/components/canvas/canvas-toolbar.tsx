"use client"

import { Minus, Plus, LayoutGrid, Sparkles, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { useCanvasStore } from "@/stores/canvas-store"
import { useAgentStore } from "@/stores/agent-store"
import { cn } from "@/lib/utils"

export function CanvasToolbar() {
  const zoom = useCanvasStore((s) => s.zoom)
  const mode = useCanvasStore((s) => s.mode)
  const zoomIn = useCanvasStore((s) => s.zoomIn)
  const zoomOut = useCanvasStore((s) => s.zoomOut)
  const resetView = useCanvasStore((s) => s.resetView)
  const setMode = useCanvasStore((s) => s.setMode)
  const openConfigPanel = useAgentStore((s) => s.openConfigPanel)

  const zoomPercent = `${Math.round(zoom * 100)}%`

  return (
    <TooltipProvider delayDuration={200}>
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-0.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-tertiary)]/80 px-2 py-1 backdrop-blur-sm">
        {/* Zoom out */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Zoom out"
              className="h-7 w-7 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              onClick={zoomOut}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom out</TooltipContent>
        </Tooltip>

        {/* Zoom display */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-label="Reset zoom"
              className="min-w-[40px] px-1 text-center text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              onClick={resetView}
            >
              {zoomPercent}
            </button>
          </TooltipTrigger>
          <TooltipContent>Click to reset view</TooltipContent>
        </Tooltip>

        {/* Zoom in */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Zoom in"
              className="h-7 w-7 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              onClick={zoomIn}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom in</TooltipContent>
        </Tooltip>

        {/* Separator */}
        <Separator orientation="vertical" className="mx-1 h-4 bg-[var(--border-default)]" />

        {/* Mode toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={mode === "canvas" ? "Switch to constellation mode" : "Switch to canvas mode"}
              className={cn(
                "h-7 w-7 rounded-md",
                mode === "constellation"
                  ? "text-[var(--accent-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              )}
              onClick={() => setMode(mode === "canvas" ? "constellation" : "canvas")}
            >
              {mode === "canvas" ? (
                <LayoutGrid className="h-3.5 w-3.5" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {mode === "canvas" ? "Switch to constellation" : "Switch to canvas"}
          </TooltipContent>
        </Tooltip>

        {/* Separator */}
        <Separator orientation="vertical" className="mx-1 h-4 bg-[var(--border-default)]" />

        {/* Add agent */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Add agent"
              className="h-7 w-7 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              onClick={() => openConfigPanel()}
            >
              <UserPlus className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add agent</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
