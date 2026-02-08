"use client"

import React from "react"
import { ExternalLink } from "lucide-react"

interface MdiffExcalidrawCanvasProps {
  projectId: string
}

export function MdiffExcalidrawCanvas({ projectId }: MdiffExcalidrawCanvasProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors">
          <ExternalLink className="w-3 h-3" />
          Open in Excalidraw
        </button>
      </div>

      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] aspect-video flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--text-muted)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <line x1="10" y1="6.5" x2="14" y2="6.5" />
              <line x1="6.5" y1="10" x2="6.5" y2="14" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Architecture Diagram</p>
            <p className="text-xs text-[var(--text-muted)]">
              Excalidraw canvas for {projectId}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              6 nodes · 5 edges · Last updated 12m ago
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
