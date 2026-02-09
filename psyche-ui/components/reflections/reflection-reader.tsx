"use client"

import type { Reflection } from "@/lib/types"
import { ARCHETYPES } from "@/lib/constants"
import { ReflectionStatusBadge } from "./reflection-status-badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAgentStore } from "@/stores/agent-store"
import { useReflectionStore } from "@/stores/reflection-store"

interface ReflectionReaderProps {
  reflection: Reflection
}

export function ReflectionReader({ reflection }: ReflectionReaderProps) {
  const agents = useAgentStore((s) => s.agents)
  const { acceptReflection } = useReflectionStore()

  const agent = reflection.agentId ? agents.find((a) => a.id === reflection.agentId) : null
  const archetype = agent ? ARCHETYPES[agent.archetype] : null

  // Simple markdown-to-JSX rendering (no dangerouslySetInnerHTML)
  const lines = reflection.content.split("\n")
  const rendered = renderMarkdown(lines)

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 pt-5 pb-3">
        <div className="flex items-start gap-3">
          <h2 className="flex-1 text-lg font-medium text-[var(--text-primary)]">
            R-{String(reflection.number).padStart(3, "0")}: {reflection.title}
          </h2>
          <ReflectionStatusBadge status={reflection.status} />
        </div>
        {agent && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: archetype?.colorHex }}
            />
            ψ {agent.name}
          </div>
        )}
      </div>

      <Separator className="bg-[var(--border-subtle)]" />

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="prose-psyche space-y-3 text-sm text-[var(--text-secondary)]">
          {rendered}
        </div>
      </div>

      <Separator className="bg-[var(--border-subtle)]" />

      <div className="flex shrink-0 items-center gap-2 px-5 py-3">
        {reflection.status === "proposed" && (
          <Button
            size="sm"
            onClick={() => acceptReflection(reflection.id)}
            className="bg-[var(--success)] text-white hover:bg-[var(--success)]/80"
          >
            Accept
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="text-[var(--text-secondary)]"
        >
          Edit
        </Button>
      </div>
    </div>
  )
}

function renderMarkdown(lines: string[]): React.ReactNode[] {
  const elements: React.ReactNode[] = []
  let i = 0
  let listItems: string[] = []

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${i}`} className="list-inside list-disc space-y-1 pl-2">
          {listItems.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      )
      listItems = []
    }
  }

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("# ")) {
      flushList()
      elements.push(
        <h1 key={i} className="text-xl font-semibold text-[var(--text-primary)]">
          {line.slice(2)}
        </h1>
      )
    } else if (line.startsWith("## ")) {
      flushList()
      elements.push(
        <h2 key={i} className="text-base font-semibold text-[var(--text-primary)]">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith("### ")) {
      flushList()
      elements.push(
        <h3 key={i} className="text-sm font-semibold text-[var(--text-primary)]">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith("- ")) {
      listItems.push(line.slice(2))
    } else if (line.match(/^\d+\.\s/)) {
      flushList()
      listItems.push(line.replace(/^\d+\.\s/, ""))
    } else if (line.trim() === "") {
      flushList()
    } else {
      flushList()
      elements.push(
        <p key={i}>{renderInline(line)}</p>
      )
    }
    i++
  }
  flushList()

  return elements
}

function renderInline(text: string): React.ReactNode {
  // Handle inline code
  const parts = text.split(/(`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-[var(--bg-surface)] px-1.5 py-0.5 font-mono text-xs text-[var(--text-primary)]"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    // Handle bold
    const boldParts = part.split(/(\*\*[^*]+\*\*)/)
    return boldParts.map((bp, j) => {
      if (bp.startsWith("**") && bp.endsWith("**")) {
        return (
          <strong key={`${i}-${j}`} className="font-semibold text-[var(--text-primary)]">
            {bp.slice(2, -2)}
          </strong>
        )
      }
      return bp
    })
  })
}
