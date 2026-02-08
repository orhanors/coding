"use client"

import React, { useState } from "react"
import { Pencil, X, Save } from "lucide-react"

interface MdiffDocumentReaderProps {
  content: string
  editable?: boolean
  onSave?: (content: string) => void
}

function renderMarkdown(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-6 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-semibold mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 rounded bg-[var(--bg-surface)] font-mono text-sm">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm leading-relaxed">$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote class="pl-3 border-l-2 border-[var(--accent-primary)] text-[var(--text-secondary)] italic my-2">$1</blockquote>')
    .replace(/\n\n/g, '<br/><br/>')
  return html
}

export function MdiffDocumentReader({ content, editable = true, onSave }: MdiffDocumentReaderProps) {
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)

  const handleSave = () => {
    onSave?.(editContent)
    setEditing(false)
  }

  const handleCancel = () => {
    setEditContent(content)
    setEditing(false)
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 mb-3">
        {editing ? (
          <>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[var(--accent-primary)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors"
            >
              <Save className="w-3 h-3" /> Save
            </button>
          </>
        ) : editable ? (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border-default)] rounded-md transition-colors"
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
        ) : null}
      </div>

      {/* Content */}
      {editing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-[60vh] p-4 text-sm font-mono bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] resize-none scrollbar-thin"
        />
      ) : (
        <div
          className="text-sm text-[var(--text-primary)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      )}
    </div>
  )
}
