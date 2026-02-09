"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Moon, Sun, PanelRight, Search, Menu } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useIsMobile } from "@/hooks/use-mobile"
import { useUIStore } from "@/stores/ui-store"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  const router = useRouter()
  const { isDark, toggleTheme } = useTheme()
  const isMobile = useIsMobile()
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette)
  const toggleAgentOverlay = useUIStore((s) => s.toggleAgentOverlay)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleMobileNav = (href: string) => {
    setMobileMenuOpen(false)
    router.push(href)
  }

  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4">
      {/* Left — Logo */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-[var(--accent-primary)]">ψ</span>
        <span className="font-display text-lg italic text-[var(--accent-primary)]">
          Psyche
        </span>
      </div>

      {isMobile ? (
        /* Mobile — Hamburger menu */
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
              className="h-8 w-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" aria-label="Navigation menu" className="w-[260px] bg-[var(--bg-secondary)] p-0">
            <nav aria-label="Main navigation" className="flex flex-col gap-1 px-4 pt-12">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <button
                    key={item.href}
                    onClick={() => handleMobileNav(item.href)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                      isActive
                        ? "bg-[var(--accent-muted)] text-[var(--accent-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {item.label}
                  </button>
                )
              })}
            </nav>
            <div className="mt-6 border-t border-[var(--border-subtle)] px-4 pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-[var(--text-secondary)]"
                onClick={() => {
                  toggleTheme()
                }}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? "Light mode" : "Dark mode"}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-[var(--text-secondary)]"
                onClick={() => {
                  setMobileMenuOpen(false)
                  toggleCommandPalette()
                }}
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-[var(--text-secondary)]"
                onClick={() => {
                  setMobileMenuOpen(false)
                  toggleAgentOverlay()
                }}
              >
                <PanelRight className="h-4 w-4" />
                Agent overlay
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <>
          {/* Center — Navigation */}
          <nav aria-label="Main navigation" className="flex items-center gap-1">
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
                    aria-label="Toggle theme"
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
                    aria-label="Open command palette"
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
                    aria-label="Toggle agent panel"
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
        </>
      )}
    </header>
  )
}
