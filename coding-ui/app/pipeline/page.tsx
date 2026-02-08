"use client"

import { Pause, Square, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PipelineProgress } from "@/components/shared/pipeline-progress"
import { EventFeed } from "@/components/shared/event-feed"
import { AIStreamPanel } from "@/components/pipeline/ai-stream-panel"
import { ExcalidrawPreview } from "@/components/pipeline/excalidraw-preview"
import { mockPipelineRun, mockPipelineEvents } from "@/lib/mock-data"

export default function PipelinePage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--ac-border-subtle)] px-6 py-3">
        <h1 className="text-lg font-semibold text-[var(--ac-text-primary)]">
          Pipeline &mdash; Run #{mockPipelineRun.number}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-[var(--ac-border-default)] bg-transparent text-[var(--ac-text-secondary)] hover:bg-[var(--ac-bg-hover)] hover:text-[var(--ac-text-primary)]"
          >
            <Pause className="h-3.5 w-3.5" />
            Pause
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-[var(--ac-border-default)] bg-transparent text-[var(--ac-text-secondary)] hover:bg-[var(--ac-bg-hover)] hover:text-[var(--ac-text-primary)]"
          >
            <Square className="h-3.5 w-3.5" />
            Stop
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-[var(--ac-border-default)] bg-transparent text-[var(--ac-text-secondary)] hover:bg-[var(--ac-bg-hover)] hover:text-[var(--ac-text-primary)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      </div>

      {/* Pipeline Steps */}
      <div className="border-b border-[var(--ac-border-subtle)] px-6 py-4">
        <PipelineProgress steps={mockPipelineRun.steps} currentStep={mockPipelineRun.currentStep} />
      </div>

      {/* Main Split: AI Stream + Excalidraw Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* AI Stream Panel */}
        <div className="flex flex-1 flex-col border-r border-[var(--ac-border-subtle)]">
          <div className="border-b border-[var(--ac-border-subtle)] px-4 py-2">
            <h2 className="text-xs font-medium text-[var(--ac-text-secondary)]">
              AI Stream Output
            </h2>
          </div>
          <AIStreamPanel />
        </div>

        {/* Excalidraw Preview */}
        <div className="flex w-[45%] flex-col">
          <div className="border-b border-[var(--ac-border-subtle)] px-4 py-2">
            <h2 className="text-xs font-medium text-[var(--ac-text-secondary)]">
              Excalidraw Preview
            </h2>
          </div>
          <ExcalidrawPreview />
        </div>
      </div>

      {/* Pipeline Events */}
      <div className="shrink-0 border-t border-[var(--ac-border-subtle)]">
        <div className="border-b border-[var(--ac-border-subtle)] px-4 py-2">
          <h2 className="text-xs font-medium text-[var(--ac-text-secondary)]">
            Pipeline Events
          </h2>
        </div>
        <EventFeed events={mockPipelineEvents} maxHeight="160px" compact />
      </div>
    </div>
  )
}
