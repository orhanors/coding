"use client"

import React from "react"

interface AIStreamViewProps {
  content: string
}

export function AIStreamView({ content }: AIStreamViewProps) {
  return (
    <div className="p-4">
      <div className="text-sm text-[var(--text-primary)] font-mono whitespace-pre-wrap leading-relaxed">
        {content}
        <span className="inline-block w-2 text-[var(--accent-primary)] animate-blink-cursor">▍</span>
      </div>
    </div>
  )
}
