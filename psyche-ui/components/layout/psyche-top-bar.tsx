"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, PanelRight, Search } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useUIStore } from "@/stores/ui-store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/canvas", label: "Canvas" },
  { href: "/river", label: "River" },
  { href: "/visions", label: "Visions" },
  { href: "/reflections", label: "Reflections" },
]

export function PsycheTopBar() {
  const pathname = usePathname()
  const { isDark, toggleTheme } = useTheme()
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette)
  const toggleAgentOverlay = useUIStore((s) => s.toggleAgentOverlay)

  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4">
      {/* Left — Logo */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-[var(--accent-primary)]">ψ</span>
        <span className="font-display text-lg italic text-[var(--accent-primary)]">
          Psyche
        </span>
      </div>

      {/* Center — Navigation */}
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 text-sm transition-colors",
                isActive
                  ? "border-b-2 border-[var(--accent-primary)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Right — Actions */}
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                onClick={toggleCommandPalette}
              >
                <Search className="h-3.5 w-3.5" />
                <kbd className="pointer-events-none rounded border border-[var(--border-default)] bg-[var(--bg-tertiary)] px-1 py-0.5 text-2xs text-[var(--text-muted)]">
                  ⌘K
                </kbd>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Command palette</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                onClick={() => toggleAgentOverlay()}
              >
                <PanelRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Agent overlay</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </header>
  )
}
