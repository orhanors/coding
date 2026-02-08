"use client"

import React, { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Settings } from "lucide-react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { PrdBoard } from "@/components/board/prd-board"
import { DiffCard } from "@/components/diff/diff-card"
import { MdiffDocumentList } from "@/components/document/mdiff-document-list"
import { MdiffDocumentReader } from "@/components/document/mdiff-document-reader"
import { MdiffExcalidrawCanvas } from "@/components/excalidraw/mdiff-excalidraw-canvas"
import { A2UIRenderer } from "@/components/a2ui/a2ui-renderer"
import { mockProjects, mockDiffs, mockMDiffDocuments, mockA2UIPayload, mockPrdBoardItems } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { MDiffDocument } from "@/lib/types"

const tabs = [
  { id: "board", label: "Board" },
  { id: "diffs", label: "Diffs" },
  { id: "docs", label: "Docs" },
  { id: "diagram", label: "Diagram" },
  { id: "a2ui", label: "A2UI" },
]

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const project = mockProjects.find((p) => p.id === id)
  const projectDiffs = mockDiffs
    .filter((d) => d.projectId === id)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  const projectDocs = mockMDiffDocuments.filter((d) => d.projectId === id)
  const projectBoardItems = mockPrdBoardItems.filter((item) => item.projectId === id)

  const [selectedDoc, setSelectedDoc] = useState<MDiffDocument | null>(null)
  const [docSortBy, setDocSortBy] = useState<"date" | "name" | "type">("date")

  if (!project) {
    return (
      <div className="py-8">
        <p className="text-[var(--text-muted)]">Project not found.</p>
        <Link href="/" className="text-[var(--accent-primary)] hover:underline text-sm mt-2 block">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">{project.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Add PRD
          </button>
          <button className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <TabsPrimitive.Root defaultValue="board">
        <TabsPrimitive.List className="flex gap-1 border-b border-[var(--border-subtle)] mb-5">
          {tabs.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors relative",
                "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                "data-[state=active]:text-[var(--accent-primary)]",
                "group"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "absolute bottom-0 left-1 right-1 h-0.5 bg-[var(--accent-primary)] rounded-full",
                  "opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-200"
                )}
              />
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>

        {/* Board Tab */}
        <TabsPrimitive.Content value="board">
          {projectBoardItems.length > 0 ? (
            <PrdBoard items={projectBoardItems} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-[var(--text-muted)] text-sm">No PRD items yet.</p>
              <p className="text-[var(--text-muted)] text-xs mt-1">Add a PRD to start tracking.</p>
            </div>
          )}
        </TabsPrimitive.Content>

        {/* Diffs Tab */}
        <TabsPrimitive.Content value="diffs" className="space-y-3">
          {projectDiffs.length > 0 ? (
            projectDiffs.map((diff) => <DiffCard key={diff.id} diff={diff} />)
          ) : (
            <p className="text-center text-[var(--text-muted)] py-12">
              No diffs yet. Add a feature to get started.
            </p>
          )}
        </TabsPrimitive.Content>

        {/* Docs Tab */}
        <TabsPrimitive.Content value="docs">
          <div className="flex gap-6">
            <div className="w-2/5 flex-shrink-0">
              <MdiffDocumentList
                documents={projectDocs}
                selectedId={selectedDoc?.id}
                onSelect={setSelectedDoc}
                sortBy={docSortBy}
                onSortChange={setDocSortBy}
              />
            </div>
            <div className="flex-1 min-w-0">
              {selectedDoc?.content ? (
                <MdiffDocumentReader
                  content={selectedDoc.content}
                  onSave={(content) => {
                    console.log("Saved:", content.slice(0, 50))
                  }}
                />
              ) : selectedDoc ? (
                <div className="flex items-center justify-center py-20 text-[var(--text-muted)] text-sm">
                  No content available for this document.
                </div>
              ) : (
                <div className="flex items-center justify-center py-20 text-[var(--text-muted)] text-sm">
                  Select a document to view its content.
                </div>
              )}
            </div>
          </div>
        </TabsPrimitive.Content>

        {/* Diagram Tab */}
        <TabsPrimitive.Content value="diagram">
          <MdiffExcalidrawCanvas projectId={id} />
        </TabsPrimitive.Content>

        {/* A2UI Tab */}
        <TabsPrimitive.Content value="a2ui">
          <A2UIRenderer payload={mockA2UIPayload} />
        </TabsPrimitive.Content>
      </TabsPrimitive.Root>
    </div>
  )
}
