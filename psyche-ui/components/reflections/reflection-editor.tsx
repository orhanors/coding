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
import { reflectionSchema } from "@/lib/validation"

interface ReflectionEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReflectionEditor({ open, onOpenChange }: ReflectionEditorProps) {
  const { reflections, addReflection } = useReflectionStore()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const nextNumber = Math.max(0, ...reflections.map((r) => r.number)) + 1

  const handleSubmit = () => {
    const contentValue = content.trim() || `# R-${String(nextNumber).padStart(3, "0")}: ${title.trim()}\n\n## Status\nProposed\n\n## Context\n\n## Decision\n\n## Consequences\n`
    const result = reflectionSchema.safeParse({
      title: title.trim(),
      content: contentValue,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    addReflection({
      number: nextNumber,
      title: result.data.title,
      status: "proposed",
      content: result.data.content,
      author: "human",
      versions: [],
    })
    setTitle("")
    setContent("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-labelledby="reflection-editor-title" className="max-w-xl border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
        <DialogHeader>
          <DialogTitle id="reflection-editor-title">New Reflection</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors((prev) => { const { title: _, ...rest } = prev; return rest }) }}
              placeholder="Decision title..."
              className={`border-[var(--border-default)] bg-[var(--bg-secondary)]${errors.title ? " border-[var(--error)]" : ""}`}
              maxLength={100}
            />
            {errors.title && <p className="text-xs text-[var(--error)]">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label>Content (Markdown)</Label>
            <Textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setErrors((prev) => { const { content: _, ...rest } = prev; return rest }) }}
              placeholder="## Context\n\n## Decision\n\n## Consequences"
              className={`border-[var(--border-default)] bg-[var(--bg-secondary)] font-mono text-xs${errors.content ? " border-[var(--error)]" : ""}`}
              rows={15}
              maxLength={10000}
            />
            {errors.content && <p className="text-xs text-[var(--error)]">{errors.content}</p>}
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
