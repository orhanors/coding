"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { TopBar } from "./top-bar"
import { AppSidebar } from "./app-sidebar"
import { StatusBar } from "./status-bar"
import { CommandPalette } from "./command-palette"
import {
  mockPipelineEvents,
  mockPipelineRun,
  mockDocuments,
  mockIntegrations,
} from "@/lib/mock-data"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--ac-bg-primary)]">
      <TopBar
        onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={toggleSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          recentEvents={mockPipelineEvents}
          documents={mockDocuments}
        />

        <main className="flex-1 overflow-y-auto scrollbar-thin" role="main">
          {children}
        </main>
      </div>

      <StatusBar
        pipeline={mockPipelineRun}
        integrations={mockIntegrations}
        eventCount={mockPipelineEvents.length}
      />

      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  )
}
