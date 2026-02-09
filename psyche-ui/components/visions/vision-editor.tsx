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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ARCHETYPES } from "@/lib/constants"
import { useVisionStore } from "@/stores/vision-store"
import { useAgentStore } from "@/stores/agent-store"
import { visionSchema } from "@/lib/validation"

interface VisionEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VisionEditor({ open, onOpenChange }: VisionEditorProps) {
  const addVision = useVisionStore((s) => s.addVision)
  const agents = useAgentStore((s) => s.agents)

  const [title, setTitle] = useState("")
  const [overview, setOverview] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [assignedAgent, setAssignedAgent] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    const result = visionSchema.safeParse({
      title: title.trim(),
      overview: overview.trim(),
      priority,
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
    addVision({
      title: result.data.title,
      overview: result.data.overview,
      stage: "backlog",
      priority,
      assignedAgent: assignedAgent || undefined,
      tasks: [],
      totalTasks: 0,
      completedTasks: 0,
      changeHistory: [
        {
          id: `ch-${Date.now()}`,
          timestamp: new Date(),
          description: "Created vision",
          author: "human",
        },
      ],
    })
    setTitle("")
    setOverview("")
    setPriority("medium")
    setAssignedAgent("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-labelledby="vision-editor-title" className="border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
        <DialogHeader>
          <DialogTitle id="vision-editor-title">New Vision</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors((prev) => { const { title: _, ...rest } = prev; return rest }) }}
              placeholder="What do you want to build?"
              className={`border-[var(--border-default)] bg-[var(--bg-secondary)]${errors.title ? " border-[var(--error)]" : ""}`}
              maxLength={100}
            />
            {errors.title && <p className="text-xs text-[var(--error)]">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label>Overview</Label>
            <Textarea
              value={overview}
              onChange={(e) => { setOverview(e.target.value); setErrors((prev) => { const { overview: _, ...rest } = prev; return rest }) }}
              placeholder="Describe the vision..."
              className={`border-[var(--border-default)] bg-[var(--bg-secondary)]${errors.overview ? " border-[var(--error)]" : ""}`}
              rows={6}
              maxLength={5000}
            />
            {errors.overview && <p className="text-xs text-[var(--error)]">{errors.overview}</p>}
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup
              value={priority}
              onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-sm font-normal">Low</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-sm font-normal">Medium</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-sm font-normal">High</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Assign Agent (optional)</Label>
            <Select value={assignedAgent} onValueChange={setAssignedAgent}>
              <SelectTrigger className="border-[var(--border-default)] bg-[var(--bg-secondary)]">
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: ARCHETYPES[agent.archetype].colorHex }}
                      />
                      {agent.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            Create Vision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
