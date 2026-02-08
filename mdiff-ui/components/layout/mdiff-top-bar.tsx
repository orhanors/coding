"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Search, Bell, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface TopBarProps {
  notificationCount?: number
  onCommandPalette?: () => void
  onNotificationClick?: () => void
}

export function MdiffTopBar({
  notificationCount = 0,
  onCommandPalette,
  onNotificationClick,
}: TopBarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { label: "Projects", href: "/" },
    { label: "Timeline", href: "/timeline" },
    { label: "Integrations", href: "/integrations" },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 md:px-6 transition-colors duration-200",
          scrolled
            ? "bg-[var(--bg-primary)]/80 backdrop-blur-bar border-b border-[var(--border-subtle)]"
            : "bg-transparent"
        )}
      >
        {/* Left: Hamburger (mobile) + Wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
            mdiff
          </Link>
        </div>

        {/* Center: Nav (desktop) */}
        <nav className="hidden md:flex items-center gap-1 mx-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/" || pathname.startsWith("/projects")
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "text-[var(--accent-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="block h-0.5 mt-0.5 bg-[var(--accent-primary)] rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            aria-label="Toggle theme"
          >
            {mounted ? (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />) : <span className="w-4 h-4" />}
          </button>

          {/* Desktop: ⌘K button, Mobile: search icon */}
          <button
            onClick={onCommandPalette}
            className="p-2 md:px-2.5 md:py-1.5 rounded-md text-[var(--text-muted)] md:text-[var(--text-muted)] md:border md:border-[var(--border-default)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] md:hover:bg-transparent md:hover:border-[var(--border-strong)] transition-colors"
            aria-label="Open command palette"
          >
            <Search className="w-4 h-4 md:w-3 md:h-3" />
            <span className="hidden md:inline ml-1.5 text-xs">⌘K</span>
          </button>

          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center px-1 text-2xs font-medium bg-[var(--accent-primary)] text-white rounded-full">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-14 z-40 md:hidden bg-[var(--bg-secondary)] border-b border-[var(--border-default)] animate-slide-in">
          <nav className="flex flex-col py-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/" || pathname.startsWith("/projects")
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-6 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "text-[var(--accent-primary)] bg-[var(--accent-muted)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
