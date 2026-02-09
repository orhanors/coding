"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AgentStreamContentProps {
  content?: string
  isActive: boolean
}

export function AgentStreamContent({ content, isActive }: AgentStreamContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [content])

  if (!content) {
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <p className="text-xs text-[var(--text-muted)]">
          {isActive ? "Waiting for output..." : "No stream content"}
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div ref={scrollRef} className="px-4 py-3">
        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--text-secondary)]">
          {content}
          {isActive && (
            <span className="animate-blink-cursor text-[var(--accent-primary)]">▍</span>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}
