"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocumentTree } from "@/components/documents/document-tree"
import { DocumentViewer } from "@/components/documents/document-viewer"
import { mockDocuments } from "@/lib/mock-data"
import type { DocumentNode } from "@/lib/types"

function findDoc(docs: DocumentNode[], id: string): DocumentNode | undefined {
  for (const doc of docs) {
    if (doc.id === id) return doc
    if (doc.children) {
      const found = findDoc(doc.children, id)
      if (found) return found
    }
  }
  return undefined
}

export default function DocumentsPage() {
  const [selectedId, setSelectedId] = useState<string | undefined>("adr-0012")
  const selectedDoc = selectedId ? findDoc(mockDocuments, selectedId) ?? null : null

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--ac-border-subtle)] px-6 py-3">
        <h1 className="text-lg font-semibold text-[var(--ac-text-primary)]">Documents</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-[var(--ac-border-default)] bg-[var(--ac-bg-surface)] px-2.5 py-1.5">
            <Search className="h-3.5 w-3.5 text-[var(--ac-text-muted)]" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-48 bg-transparent text-xs text-[var(--ac-text-secondary)] placeholder:text-[var(--ac-text-muted)] focus:outline-none"
            />
          </div>
          <Button
            size="sm"
            className="gap-1.5 bg-[var(--ac-accent)] text-[var(--ac-bg-primary)] hover:bg-[var(--ac-accent-secondary)]"
          >
            <Plus className="h-3.5 w-3.5" />
            New ADR
          </Button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tree sidebar */}
        <div className="w-64 shrink-0 border-r border-[var(--ac-border-subtle)] overflow-y-auto p-3 scrollbar-thin">
          <DocumentTree
            documents={mockDocuments}
            selectedId={selectedId}
            onSelect={(doc) => setSelectedId(doc.id)}
          />
        </div>

        {/* Document viewer */}
        <DocumentViewer document={selectedDoc} />
      </div>
    </div>
  )
}
