"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Workflow,
  FileText,
  Link2,
  History,
  ChevronRight,
  ChevronDown,
  Circle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PipelineEvent, DocumentNode } from "@/lib/types"

interface AppSidebarProps {
  collapsed: boolean
  recentEvents: PipelineEvent[]
  documents: DocumentNode[]
}

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Pipeline", href: "/pipeline", icon: Workflow },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Integrations", href: "/integrations", icon: Link2 },
  { label: "History", href: "/history", icon: History },
]

const stageColors: Record<string, string> = {
  adr: "var(--spec-pipeline-adr)",
  excalidraw: "var(--spec-pipeline-excalidraw)",
  prd: "var(--spec-pipeline-prd)",
  implement: "var(--spec-pipeline-implement)",
  system: "var(--spec-text-muted)",
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function AppSidebar({ collapsed, recentEvents, documents }: AppSidebarProps) {
  const pathname = usePathname()

  if (collapsed) {
    return (
      <aside className="flex w-14 flex-col border-r border-[var(--spec-border-subtle)] bg-[var(--spec-bg-secondary)] py-3 transition-all duration-200">
        <nav className="flex flex-col items-center gap-1 px-1">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                  isActive
                    ? "bg-[var(--spec-accent-muted)] text-[var(--spec-accent)]"
                    : "text-[var(--spec-text-secondary)] hover:bg-[var(--spec-bg-hover)] hover:text-[var(--spec-text-primary)]"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-4 w-4" />
              </Link>
            )
          })}
        </nav>
      </aside>
    )
  }

  return (
    <aside className="flex w-60 flex-col border-r border-[var(--spec-border-subtle)] bg-[var(--spec-bg-secondary)] transition-all duration-200">
      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 p-2">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-[var(--spec-accent-muted)] text-[var(--spec-accent)]"
                  : "text-[var(--spec-text-secondary)] hover:bg-[var(--spec-bg-hover)] hover:text-[var(--spec-text-primary)]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mx-3 my-1 h-px bg-[var(--spec-border-subtle)]" />

      {/* Document Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin">
        <p className="mb-1.5 px-2.5 text-2xs font-medium uppercase tracking-wider text-[var(--spec-text-muted)]">
          Documents
        </p>
        {documents.map((folder) => (
          <DocFolder key={folder.id} node={folder} />
        ))}
      </div>

      <div className="mx-3 my-1 h-px bg-[var(--spec-border-subtle)]" />

      {/* Recent Events */}
      <div className="shrink-0 px-2 py-2">
        <p className="mb-1.5 px-2.5 text-2xs font-medium uppercase tracking-wider text-[var(--spec-text-muted)]">
          Recent Events
        </p>
        <div className="flex flex-col gap-0.5">
          {recentEvents.slice(0, 4).map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-2 rounded-md px-2.5 py-1 text-2xs animate-slide-in"
            >
              <Circle
                className="mt-0.5 h-2 w-2 shrink-0"
                style={{ color: stageColors[event.stage], fill: stageColors[event.stage] }}
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-[var(--spec-text-secondary)]">{event.message}</p>
                <p className="text-[var(--spec-text-muted)]">{formatTime(event.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function DocFolder({ node }: { node: DocumentNode }) {
  const typeLabel: Record<string, string> = {
    adr: "architecture",
    prd: "architecture-prd",
    "prd-log": "architecture-prd-logs",
  }

  return (
    <div className="mb-0.5">
      <div className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--spec-text-secondary)] hover:bg-[var(--spec-bg-hover)] cursor-pointer">
        <ChevronDown className="h-3 w-3 shrink-0" />
        <span className="truncate">{typeLabel[node.type] || node.name}/</span>
      </div>
      {node.children && (
        <div className="ml-3 flex flex-col gap-px">
          {node.children.map((child) => (
            <Link
              key={child.id}
              href={`/documents?id=${child.id}`}
              className="flex items-center gap-2 rounded-md px-2 py-0.5 text-xs text-[var(--spec-text-muted)] hover:bg-[var(--spec-bg-hover)] hover:text-[var(--spec-text-secondary)] transition-colors"
            >
              <Circle
                className="h-1.5 w-1.5 shrink-0"
                style={{
                  color: child.status === "proposed" || child.status === "active" ? "var(--spec-accent)" : "var(--spec-text-muted)",
                  fill: child.status === "proposed" || child.status === "active" ? "var(--spec-accent)" : "var(--spec-text-muted)",
                }}
              />
              <span className="truncate">{child.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
