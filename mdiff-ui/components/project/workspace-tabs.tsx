"use client"

import React from "react"
import * as Tabs from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

interface WorkspaceTabsProps {
  children: React.ReactNode
  defaultTab?: string
}

const tabs = [
  { id: "diffs", label: "Diffs" },
  { id: "docs", label: "Docs" },
  { id: "diagram", label: "Diagram" },
  { id: "a2ui", label: "A2UI" },
]

export function WorkspaceTabs({ children, defaultTab = "diffs" }: WorkspaceTabsProps) {
  return (
    <Tabs.Root defaultValue={defaultTab}>
      <Tabs.List className="flex gap-1 border-b border-[var(--border-subtle)] mb-6">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors relative",
              "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
              "data-[state=active]:text-[var(--accent-primary)]"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] rounded-full",
                "scale-x-0 transition-transform duration-200",
                "data-[state=active]:scale-x-0"
              )}
            />
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {children}
    </Tabs.Root>
  )
}

export { Tabs }
