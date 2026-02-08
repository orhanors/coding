"use client"

import { ExternalLink } from "lucide-react"

export function ExcalidrawPreview() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center bg-[var(--ac-bg-surface)] relative overflow-hidden">
        {/* Simulated Architecture Diagram */}
        <svg viewBox="0 0 400 300" className="w-full h-full max-h-[300px] p-6" aria-label="Architecture diagram showing API, Cache, and DB components">
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--ac-border-subtle)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* API Box */}
          <rect x="60" y="80" width="80" height="45" rx="6" fill="var(--ac-bg-tertiary)" stroke="var(--ac-pipeline-prd)" strokeWidth="1.5" />
          <text x="100" y="107" textAnchor="middle" className="text-xs font-mono" fill="var(--ac-text-primary)">API</text>

          {/* Arrow from API to Cache */}
          <line x1="140" y1="102" x2="180" y2="102" stroke="var(--ac-text-muted)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

          {/* Cache Box */}
          <rect x="180" y="80" width="80" height="45" rx="6" fill="var(--ac-bg-tertiary)" stroke="var(--ac-pipeline-excalidraw)" strokeWidth="1.5" />
          <text x="220" y="107" textAnchor="middle" className="text-xs font-mono" fill="var(--ac-text-primary)">Cache</text>

          {/* Arrow from API to DB */}
          <line x1="100" y1="125" x2="100" y2="170" stroke="var(--ac-text-muted)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

          {/* DB Box */}
          <rect x="60" y="170" width="80" height="45" rx="6" fill="var(--ac-bg-tertiary)" stroke="var(--ac-pipeline-implement)" strokeWidth="1.5" />
          <text x="100" y="197" textAnchor="middle" className="text-xs font-mono" fill="var(--ac-text-primary)">DB</text>

          {/* New Node: Queue */}
          <rect x="180" y="170" width="80" height="45" rx="6" fill="var(--ac-bg-tertiary)" stroke="var(--ac-pipeline-adr)" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8" />
          <text x="220" y="197" textAnchor="middle" className="text-xs font-mono" fill="var(--ac-pipeline-adr)">Queue</text>

          {/* Arrow from Cache to Queue */}
          <line x1="220" y1="125" x2="220" y2="170" stroke="var(--ac-text-muted)" strokeWidth="1" strokeDasharray="4 2" markerEnd="url(#arrowhead)" />

          {/* Arrow head marker */}
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M 0 0 L 8 3 L 0 6 z" fill="var(--ac-text-muted)" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="border-t border-[var(--ac-border-subtle)] px-4 py-2">
        <p className="text-2xs text-[var(--ac-text-muted)]">
          Architecture: ADR-0012 &mdash; &quot;Add caching layer&quot;
        </p>
        <p className="text-2xs text-[var(--ac-text-muted)]">Last updated: 30s ago</p>
        <button className="mt-1 flex items-center gap-1 text-2xs text-[var(--ac-accent)] hover:underline">
          Open in Excalidraw <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
