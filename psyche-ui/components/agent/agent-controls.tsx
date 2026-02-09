"use client"

import { PauseCircle, PlayCircle, Square, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Agent } from "@/lib/types"
import { useAgentStore } from "@/stores/agent-store"

interface AgentControlsProps {
  agent: Agent
}

export function AgentControls({ agent }: AgentControlsProps) {
  const setAgentStatus = useAgentStore((s) => s.setAgentStatus)
  const isPaused = agent.status === "paused"
  const isActive = agent.status === "active"

  return (
    <div className="flex items-center gap-2 border-t border-[var(--border-default)] bg-[var(--bg-tertiary)] px-4 py-3">
      {(isActive || isPaused) && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            setAgentStatus(agent.id, isPaused ? "active" : "paused")
          }
          className="text-[var(--warning)] hover:bg-[var(--warning)]/10"
        >
          {isPaused ? (
            <>
              <PlayCircle className="mr-1.5 h-4 w-4" />
              Resume
            </>
          ) : (
            <>
              <PauseCircle className="mr-1.5 h-4 w-4" />
              Pause
            </>
          )}
        </Button>
      )}

      {isActive && (
        <Button
          size="sm"
          variant="ghost"
          className="text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10"
        >
          <CheckCheck className="mr-1.5 h-4 w-4" />
          Approve All
        </Button>
      )}

      {(isActive || isPaused) && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="text-[var(--error)] hover:bg-[var(--error)]/10"
            >
              <Square className="mr-1.5 h-4 w-4" />
              Stop
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-[var(--border-default)] bg-[var(--bg-tertiary)]">
            <AlertDialogHeader>
              <AlertDialogTitle>Stop this agent?</AlertDialogTitle>
              <AlertDialogDescription>
                This will stop {agent.name} from continuing its current task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-[var(--border-default)]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => setAgentStatus(agent.id, "error")}
                className="bg-[var(--error)] text-white hover:bg-[var(--error)]/80"
              >
                Stop Agent
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
