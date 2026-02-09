"use client"

import { useEffect, useState } from "react"
import {
  Compass, Shield, Telescope, FlaskConical, Bug, BookOpen, Radio, Shuffle,
  Pause, Play, Square, CheckCheck,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAgentStore } from "@/stores/agent-store"
import { useIsMobile } from "@/hooks/use-mobile"
import { ARCHETYPES, AUTONOMY_LEVELS, AGENT_STATUSES } from "@/lib/constants"
import type { AgentArchetype } from "@/lib/types"
import { cn } from "@/lib/utils"
import { agentConfigSchema } from "@/lib/validation"

const ARCHETYPE_ICONS: Record<AgentArchetype, React.ElementType> = {
  architect: Compass,
  guardian: Shield,
  explorer: Telescope,
  alchemist: FlaskConical,
  shadow: Bug,
  sage: BookOpen,
  herald: Radio,
  trickster: Shuffle,
}

const ARCHETYPE_LIST = Object.entries(ARCHETYPES) as [AgentArchetype, typeof ARCHETYPES[AgentArchetype]][]

interface NewAgentPosition {
  x: number
  y: number
}

export function AgentConfigPanel({ defaultPosition }: { defaultPosition?: NewAgentPosition }) {
  const isMobile = useIsMobile()
  const open = useAgentStore((s) => s.configPanelOpen)
  const agentId = useAgentStore((s) => s.configPanelAgentId)
  const agents = useAgentStore((s) => s.agents)
  const closeConfigPanel = useAgentStore((s) => s.closeConfigPanel)
  const addAgent = useAgentStore((s) => s.addAgent)
  const updateAgent = useAgentStore((s) => s.updateAgent)
  const removeAgent = useAgentStore((s) => s.removeAgent)
  const setAgentStatus = useAgentStore((s) => s.setAgentStatus)

  const editAgent = agentId ? agents.find((a) => a.id === agentId) : null
  const isEditing = !!editAgent

  const [name, setName] = useState("")
  const [archetype, setArchetype] = useState<AgentArchetype>("architect")
  const [task, setTask] = useState("")
  const [autonomy, setAutonomy] = useState(3)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Populate form when editing
  useEffect(() => {
    if (editAgent) {
      setName(editAgent.name)
      setArchetype(editAgent.archetype)
      setTask(editAgent.task)
      setAutonomy(editAgent.autonomy)
    } else {
      setName("")
      setArchetype("architect")
      setTask("")
      setAutonomy(3)
    }
    setErrors({})
  }, [editAgent, open])

  const handleSubmit = () => {
    const result = agentConfigSchema.safeParse({
      name: name.trim(),
      archetype,
      task: task.trim(),
      autonomy,
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

    if (isEditing && editAgent) {
      updateAgent(editAgent.id, {
        name: result.data.name,
        archetype: result.data.archetype,
        task: result.data.task,
        autonomy: result.data.autonomy as 1 | 2 | 3 | 4 | 5,
      })
    } else {
      addAgent(
        {
          name: result.data.name,
          archetype: result.data.archetype,
          task: result.data.task,
          autonomy: result.data.autonomy as 1 | 2 | 3 | 4 | 5,
        },
        defaultPosition ?? { x: 200, y: 200 }
      )
    }
    closeConfigPanel()
  }

  const handleDelete = () => {
    if (editAgent) {
      removeAgent(editAgent.id)
      closeConfigPanel()
    }
  }

  const autonomyDef = AUTONOMY_LEVELS.find((l) => l.level === autonomy)
  const statusDef = editAgent ? AGENT_STATUSES[editAgent.status] : null

  return (
    <Sheet open={open} onOpenChange={(v) => !v && closeConfigPanel()}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        aria-labelledby="agent-config-title"
        className={cn(
          "bg-[var(--bg-tertiary)]",
          isMobile
            ? "w-full max-h-[80vh] rounded-t-xl overflow-y-auto"
            : "w-[320px] sm:w-[320px]"
        )}
      >
        <SheetHeader>
          <SheetTitle id="agent-config-title" className="text-[var(--text-primary)]">
            {isEditing ? "Edit Agent" : "Create Agent"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-4">
          {/* Status display for editing */}
          {isEditing && editAgent && statusDef && (
            <div className="flex items-center gap-2 rounded-md bg-[var(--bg-surface)] p-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: ARCHETYPES[editAgent.archetype].colorHex }}
              />
              <span className="text-sm text-[var(--text-secondary)]">
                {statusDef.label}
              </span>
              {editAgent.progress != null && (
                <>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {editAgent.progress}%
                  </span>
                </>
              )}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs text-[var(--text-secondary)]">Name</Label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value.slice(0, 50)); setErrors((prev) => { const { name: _, ...rest } = prev; return rest }) }}
              placeholder="Name your agent"
              className={cn("bg-[var(--bg-surface)] border-[var(--border-default)]", errors.name && "border-[var(--error)]")}
            />
            {errors.name && <p className="text-xs text-[var(--error)]">{errors.name}</p>}
          </div>

          {/* Archetype */}
          <div className="space-y-1.5">
            <Label className="text-xs text-[var(--text-secondary)]">Archetype</Label>
            <Select value={archetype} onValueChange={(v) => setArchetype(v as AgentArchetype)}>
              <SelectTrigger className="bg-[var(--bg-surface)] border-[var(--border-default)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ARCHETYPE_LIST.map(([key, def]) => {
                  const Icon = ARCHETYPE_ICONS[key]
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" style={{ color: def.colorHex }} />
                        <span>{def.label}</span>
                        <span className="text-2xs text-[var(--text-muted)]">
                          {def.description}
                        </span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Task */}
          <div className="space-y-1.5">
            <Label className="text-xs text-[var(--text-secondary)]">Task</Label>
            <Textarea
              value={task}
              onChange={(e) => { setTask(e.target.value.slice(0, 500)); setErrors((prev) => { const { task: _, ...rest } = prev; return rest }) }}
              placeholder="Describe the task..."
              rows={4}
              className={cn("resize-none bg-[var(--bg-surface)] border-[var(--border-default)]", errors.task && "border-[var(--error)]")}
            />
            {errors.task && <p className="text-xs text-[var(--error)]">{errors.task}</p>}
          </div>

          {/* Autonomy */}
          <div className="space-y-1.5">
            <Label className="text-xs text-[var(--text-secondary)]">
              Autonomy: {autonomyDef?.label}
            </Label>
            <Slider
              value={[autonomy]}
              onValueChange={([v]) => setAutonomy(v)}
              min={1}
              max={5}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-2xs text-[var(--text-muted)]">
              <span>Full Approval</span>
              <span>Autonomous</span>
            </div>
            <p className="text-2xs text-[var(--text-muted)]">
              {autonomyDef?.description}
            </p>
          </div>

          {/* Agent controls (editing active/paused agent) */}
          {isEditing && editAgent && (editAgent.status === "active" || editAgent.status === "paused") && (
            <TooltipProvider delayDuration={200}>
              <div className="flex items-center gap-2 rounded-md bg-[var(--bg-surface)] p-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={editAgent.status === "paused" ? "Resume agent" : "Pause agent"}
                      className="h-8 w-8"
                      onClick={() =>
                        setAgentStatus(
                          editAgent.id,
                          editAgent.status === "paused" ? "active" : "paused"
                        )
                      }
                    >
                      {editAgent.status === "paused" ? (
                        <Play className="h-4 w-4 text-[var(--success)]" />
                      ) : (
                        <Pause className="h-4 w-4 text-[var(--warning)]" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {editAgent.status === "paused" ? "Resume" : "Pause"}
                  </TooltipContent>
                </Tooltip>

                <AlertDialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Stop agent" className="h-8 w-8">
                          <Square className="h-4 w-4 text-[var(--error)]" />
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Stop</TooltipContent>
                  </Tooltip>
                  <AlertDialogContent aria-labelledby="stop-agent-config-title">
                    <AlertDialogHeader>
                      <AlertDialogTitle id="stop-agent-config-title">Stop this agent?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will stop the agent. In-progress work may be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => setAgentStatus(editAgent.id, "error")}
                        className="bg-[var(--error)] text-[var(--text-inverse)]"
                      >
                        Stop
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Approve agent action"
                      className="h-8 w-8"
                    >
                      <CheckCheck className="h-4 w-4 text-[var(--accent-primary)]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Approve</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
        </div>

        <SheetFooter className="mt-6 flex-col gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !task.trim()}
            className="w-full bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
          >
            {isEditing ? "Save Changes" : "Create Agent"}
          </Button>

          <div className="flex gap-2">
            {isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="flex-1 text-[var(--error)]">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent aria-labelledby="delete-agent-title">
                  <AlertDialogHeader>
                    <AlertDialogTitle id="delete-agent-title">Delete this agent?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the agent and all its connections.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-[var(--error)] text-[var(--text-inverse)]"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button
              variant="ghost"
              className={cn("text-[var(--text-secondary)]", isEditing ? "flex-1" : "w-full")}
              onClick={closeConfigPanel}
            >
              Cancel
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
