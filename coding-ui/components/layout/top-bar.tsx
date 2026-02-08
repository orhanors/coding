"use client"

import { Search, Sun, Moon, Settings, Hexagon, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  onCommandPaletteOpen: () => void
  sidebarCollapsed: boolean
  onSidebarToggle: () => void
}

export function TopBar({ onCommandPaletteOpen, sidebarCollapsed, onSidebarToggle }: TopBarProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const theme = resolvedTheme; // Declare the theme variable

  return (
    <header className="flex h-12 shrink-0 items-center border-b border-[var(--spec-border-subtle)] bg-[var(--spec-bg-secondary)] px-4">
      <button
        onClick={onSidebarToggle}
        className="mr-3 flex items-center gap-2 text-[var(--spec-text-primary)] hover:text-[var(--spec-accent)] transition-colors"
        aria-label="Toggle sidebar"
      >
        <Hexagon className="h-5 w-5 text-[var(--spec-accent)]" />
        {!sidebarCollapsed && (
          <span className="text-sm font-semibold tracking-tight">SPEC</span>
        )}
      </button>

      <div className="flex items-center gap-1 rounded-md bg-[var(--spec-bg-surface)] px-2 py-1 text-2xs text-[var(--spec-text-secondary)]">
        <span>Pipeline #47</span>
        <ChevronDown className="h-3 w-3" />
      </div>

      <div className="flex-1" />

      <button
        onClick={onCommandPaletteOpen}
        className="flex items-center gap-2 rounded-md border border-[var(--spec-border-default)] bg-[var(--spec-bg-surface)] px-3 py-1.5 text-xs text-[var(--spec-text-muted)] hover:text-[var(--spec-text-secondary)] hover:border-[var(--spec-border-strong)] transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search...</span>
        <kbd className="ml-4 rounded border border-[var(--spec-border-default)] bg-[var(--spec-bg-tertiary)] px-1.5 py-0.5 text-2xs font-mono text-[var(--spec-text-muted)]">
          {"K"}
        </kbd>
      </button>

      <div className="ml-4 flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[var(--spec-text-secondary)] hover:text-[var(--spec-text-primary)] hover:bg-[var(--spec-bg-hover)]"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[var(--spec-text-secondary)] hover:text-[var(--spec-text-primary)] hover:bg-[var(--spec-bg-hover)]"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <div className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--spec-accent-muted)] text-xs font-medium text-[var(--spec-accent)]">
          U
        </div>
      </div>
    </header>
  )
}
