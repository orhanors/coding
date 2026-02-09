"use client"

import {
  X,
  Minus,
  Compass,
  Shield,
  Telescope,
  FlaskConical,
  Bug,
  BookOpen,
  Radio,
  Shuffle,
  type LucideIcon,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ARCHETYPES, AGENT_STATUSES } from "@/lib/constants"
import { useIsMobile } from "@/hooks/use-mobile"
import { useUIStore } from "@/stores/ui-store"
import { useAgentStore } from "@/stores/agent-store"
import { AgentStreamContent } from "./agent-stream-content"
import { AgentEventLog } from "./agent-event-log"
import { AgentControls } from "./agent-controls"
import type { AgentArchetype } from "@/lib/types"

const ARCHETYPE_ICONS: Record<AgentArchetype, LucideIcon> = {
  architect: Compass,
  guardian: Shield,
  explorer: Telescope,
  alchemist: FlaskConical,
  shadow: Bug,
  sage: BookOpen,
  herald: Radio,
  trickster: Shuffle,
}

export function AgentStreamOverlay() {
  const isMobile = useIsMobile()
  const { agentOverlayOpen, agentOverlayAgentId, toggleAgentOverlay } = useUIStore()
  const agents = useAgentStore((s) => s.agents)

  const agent = agentOverlayAgentId
    ? agents.find((a) => a.id === agentOverlayAgentId)
    : null

  const archetype = agent ? ARCHETYPES[agent.archetype] : null
  const status = agent ? AGENT_STATUSES[agent.status] : null
  const IconComponent = agent ? ARCHETYPE_ICONS[agent.archetype] : null

  return (
    <Sheet open={agentOverlayOpen} onOpenChange={() => toggleAgentOverlay()}>
      <SheetContent
        side="right"
        role="complementary"
        aria-label="Agent stream"
        className={`border-l border-[var(--border-default)] bg-[var(--bg-secondary)] p-0 ${isMobile ? "w-full" : "w-[360px]"}`}
      >
        {agent && archetype ? (
          <div className="flex h-full flex-col">
            {/* Header */}
            <SheetHeader className="shrink-0 border-b border-[var(--border-default)] px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {IconComponent && (
                    <IconComponent
                      className="h-4 w-4"
                      style={{ color: archetype.colorHex }}
                    />
                  )}
                  <SheetTitle className="text-base text-[var(--text-primary)]">
                    {agent.name}
                  </SheetTitle>
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: archetype.colorHex }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => toggleAgentOverlay()}
                  >
                    <Minus className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close agent panel"
                    className="h-6 w-6"
                    onClick={() => toggleAgentOverlay()}
                  >
                    <X className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <span style={{ color: status?.color }}>{status?.label}</span>
                <span>·</span>
                <span className="truncate">{agent.task}</span>
              </div>
            </SheetHeader>

            {/* Stream content */}
            <AgentStreamContent
              content={agent.streamContent}
              isActive={agent.status === "active"}
            />

            {/* Event log */}
            <AgentEventLog events={agent.events} />

            {/* Controls */}
            <AgentControls agent={agent} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[var(--text-muted)]">No agent selected</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
