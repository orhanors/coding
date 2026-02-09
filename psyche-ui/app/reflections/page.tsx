"use client"

import { useState, useEffect } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReflectionList } from "@/components/reflections/reflection-list"
import { ReflectionReader } from "@/components/reflections/reflection-reader"
import { ReflectionDiffHistory } from "@/components/reflections/reflection-diff-history"
import { ReflectionEditor } from "@/components/reflections/reflection-editor"
import { useReflectionStore } from "@/stores/reflection-store"

export default function ReflectionsPage() {
  const { reflections, selectedReflectionId, setSelectedReflection } = useReflectionStore()
  const [editorOpen, setEditorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filtered = debouncedSearch
    ? reflections.filter(
        (r) =>
          r.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          r.content.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : reflections

  const selectedReflection = reflections.find((r) => r.id === selectedReflectionId)

  if (reflections.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-sm text-[var(--text-muted)]">
          No reflections yet. Agents will propose reflections as they make architectural decisions.
        </p>
        <Button
          onClick={() => setEditorOpen(true)}
          className="bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Reflection
        </Button>
        <ReflectionEditor open={editorOpen} onOpenChange={setEditorOpen} />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-6 py-3">
        <Button
          onClick={() => setEditorOpen(true)}
          size="sm"
          className="bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New Reflection
        </Button>
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reflections..."
            className="h-8 border-[var(--border-default)] bg-[var(--bg-secondary)] pl-8 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div
          className={`overflow-y-auto border-r border-[var(--border-subtle)] ${
            selectedReflection ? "w-[320px] shrink-0" : "flex-1"
          }`}
        >
          {filtered.length > 0 ? (
            <ReflectionList
              reflections={filtered}
              selectedId={selectedReflectionId}
              onSelect={setSelectedReflection}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-xs text-[var(--text-muted)]">
                No reflections match your search
              </p>
            </div>
          )}
        </div>

        {/* Reader + Diff History */}
        {selectedReflection && (
          <>
            <div className="flex-1 overflow-hidden border-r border-[var(--border-subtle)]">
              <ReflectionReader reflection={selectedReflection} />
            </div>
            <div className="w-[320px] shrink-0 overflow-hidden">
              <ReflectionDiffHistory reflection={selectedReflection} />
            </div>
          </>
        )}
      </div>

      <ReflectionEditor open={editorOpen} onOpenChange={setEditorOpen} />
    </div>
  )
}
