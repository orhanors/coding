"use client"

import { useAgentStore } from "@/stores/agent-store"
import { useUIStore } from "@/stores/ui-store"
import { useIsMobile } from "@/hooks/use-mobile"
import { ARCHETYPES, APP_VERSION } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function StatusStrip() {
  const agents = useAgentStore((s) => s.agents)
  const toggleAgentOverlay = useUIStore((s) => s.toggleAgentOverlay)
  const isMobile = useIsMobile()

  const activeAgent = agents.find((a) => a.status === "active")
  const pendingCount = agents.filter((a) => a.status === "idle").length

  const archetypeDef = activeAgent ? ARCHETYPES[activeAgent.archetype] : null

  const truncatedName = activeAgent
    ? activeAgent.name.replace(/^ψ[₁₂₃₄₅₆₇₈₉] /, "").slice(0, 20)
    : null

  return (
    <footer
      className={cn(
        "flex h-[24px] shrink-0 cursor-pointer items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 text-2xs transition-opacity duration-[3000ms]",
        activeAgent ? "opacity-100" : "opacity-30 hover:opacity-100"
      )}
      onClick={() => {
        if (activeAgent) {
          toggleAgentOverlay(activeAgent.id)
        }
      }}
    >
      {/* Left — Agent status */}
      <div className="flex items-center gap-2 overflow-hidden">
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            activeAgent ? "animate-agent-pulse" : ""
          )}
          style={{
            backgroundColor: archetypeDef?.colorHex ?? "var(--text-muted)",
          }}
        />
        <span className="truncate text-[var(--text-secondary)]" aria-live="polite">
          {isMobile
            ? (truncatedName ?? "idle")
            : activeAgent
              ? `${activeAgent.name.replace(/^ψ[₁₂₃₄₅₆₇₈₉] /, "")}: ${activeAgent.task}...`
              : "idle"
          }
        </span>
      </div>

      {/* Right — Pending count + version (hidden on mobile) */}
      {!isMobile && (
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
          {pendingCount > 0 && (
            <span>{pendingCount} pending</span>
          )}
          <span>v{APP_VERSION}</span>
        </div>
      )}
    </footer>
  )
}
