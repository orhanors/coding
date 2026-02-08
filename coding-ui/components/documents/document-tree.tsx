"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DocumentNode } from "@/lib/types"

interface DocumentTreeProps {
  documents: DocumentNode[]
  selectedId?: string
  onSelect: (doc: DocumentNode) => void
}

const folderLabels: Record<string, string> = {
  adr: "architecture/",
  prd: "architecture-prd/",
  "prd-log": "architecture-prd-logs/",
}

const statusColors: Record<string, string> = {
  proposed: "var(--ac-accent)",
  active: "var(--ac-accent)",
  accepted: "var(--ac-success)",
  completed: "var(--ac-success)",
  deprecated: "var(--ac-text-muted)",
}

export function DocumentTree({ documents, selectedId, onSelect }: DocumentTreeProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {documents.map((folder) => (
        <FolderNode key={folder.id} node={folder} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  )
}

function FolderNode({
  node,
  selectedId,
  onSelect,
}: {
  node: DocumentNode
  selectedId?: string
  onSelect: (doc: DocumentNode) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-[var(--ac-text-secondary)] hover:bg-[var(--ac-bg-hover)] transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform" />
        )}
        <span className="font-medium">{folderLabels[node.type] || node.name}</span>
      </button>

      {expanded && node.children && (
        <div className="ml-4 flex flex-col gap-px">
          {node.children.map((child) => (
            <button
              key={child.id}
              onClick={() => onSelect(child)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors text-left",
                selectedId === child.id
                  ? "bg-[var(--ac-accent-muted)] text-[var(--ac-accent)]"
                  : "text-[var(--ac-text-muted)] hover:bg-[var(--ac-bg-hover)] hover:text-[var(--ac-text-secondary)]"
              )}
            >
              <Circle
                className="h-1.5 w-1.5 shrink-0"
                style={{
                  color: statusColors[child.status],
                  fill: statusColors[child.status],
                }}
              />
              <span className="truncate">{child.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
