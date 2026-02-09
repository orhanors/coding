"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useReflectionStore } from "@/stores/reflection-store"

interface ReflectionEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReflectionEditor({ open, onOpenChange }: ReflectionEditorProps) {
  const { reflections, addReflection } = useReflectionStore()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const nextNumber = Math.max(0, ...reflections.map((r) => r.number)) + 1

  const handleSubmit = () => {
    if (!title.trim()) return
    addReflection({
      number: nextNumber,
      title: title.trim(),
      status: "proposed",
      content: content.trim() || `# R-${String(nextNumber).padStart(3, "0")}: ${title.trim()}\n\n## Status\nProposed\n\n## Context\n\n## Decision\n\n## Consequences\n`,
      author: "human",
      versions: [],
    })
    setTitle("")
    setContent("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
        <DialogHeader>
          <DialogTitle>New Reflection</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Decision title..."
              className="border-[var(--border-default)] bg-[var(--bg-secondary)]"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label>Content (Markdown)</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="## Context\n\n## Decision\n\n## Consequences"
              className="border-[var(--border-default)] bg-[var(--bg-secondary)] font-mono text-xs"
              rows={15}
              maxLength={10000}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[var(--text-secondary)]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
          >
            Create Reflection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
