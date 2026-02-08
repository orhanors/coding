"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Workflow,
  Pencil,
  FileText,
  Link2,
  History,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Circle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PipelineEvent, DocumentNode } from "@/lib/types"

interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
  recentEvents: PipelineEvent[]
  documents: DocumentNode[]
}

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Pipeline", href: "/pipeline", icon: Workflow },
  { label: "Architecture", href: "/architecture", icon: Pencil },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Integrations", href: "/integrations", icon: Link2 },
  { label: "History", href: "/history", icon: History },
]

const stageColors: Record<string, string> = {
  adr: "var(--ac-pipeline-adr)",
  excalidraw: "var(--ac-pipeline-excalidraw)",
  prd: "var(--ac-pipeline-prd)",
  implement: "var(--ac-pipeline-implement)",
  system: "var(--ac-text-muted)",
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function AppSidebar({ collapsed, onToggle, recentEvents, documents }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[var(--ac-border-subtle)] bg-[var(--ac-bg-secondary)] transition-all duration-200 ease-in-out overflow-hidden shrink-0",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Navigation */}
      <nav className={cn("flex flex-col gap-0.5", collapsed ? "items-center px-1 py-3" : "p-2")}>
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md transition-colors shrink-0",
                collapsed
                  ? "h-9 w-9 justify-center"
                  : "gap-2.5 px-2.5 py-1.5 text-sm",
                isActive
                  ? "bg-[var(--ac-accent-muted)] text-[var(--ac-accent)]"
                  : "text-[var(--ac-text-secondary)] hover:bg-[var(--ac-bg-hover)] hover:text-[var(--ac-text-primary)]"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Sections only visible when expanded */}
      {!collapsed && (
        <>
          <div className="mx-3 my-1 h-px bg-[var(--ac-border-subtle)]" />

          {/* Document Tree */}
          <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin">
            <p className="mb-1.5 px-2.5 text-2xs font-medium uppercase tracking-wider text-[var(--ac-text-muted)]">
              Documents
            </p>
            {documents.map((folder) => (
              <DocFolder key={folder.id} node={folder} />
            ))}
          </div>

          <div className="mx-3 my-1 h-px bg-[var(--ac-border-subtle)]" />

          {/* Recent Events */}
          <div className="shrink-0 px-2 py-2">
            <p className="mb-1.5 px-2.5 text-2xs font-medium uppercase tracking-wider text-[var(--ac-text-muted)]">
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
                    <p className="truncate text-[var(--ac-text-secondary)]">{event.message}</p>
                    <p className="text-[var(--ac-text-muted)]">{formatTime(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Collapse toggle */}
      <div className={cn(
        "shrink-0 border-t border-[var(--ac-border-subtle)]",
        collapsed ? "flex justify-center py-2" : "px-2 py-2"
      )}>
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center rounded-md text-[var(--ac-text-muted)] hover:bg-[var(--ac-bg-hover)] hover:text-[var(--ac-text-secondary)] transition-colors",
            collapsed
              ? "h-9 w-9 justify-center"
              : "w-full gap-2.5 px-2.5 py-1.5 text-xs"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" />
              <span className="truncate">Collapse</span>
            </>
          )}
        </button>
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
      <div className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--ac-text-secondary)] hover:bg-[var(--ac-bg-hover)] cursor-pointer">
        <ChevronDown className="h-3 w-3 shrink-0" />
        <span className="truncate">{typeLabel[node.type] || node.name}/</span>
      </div>
      {node.children && (
        <div className="ml-3 flex flex-col gap-px">
          {node.children.map((child) => (
            <Link
              key={child.id}
              href={`/documents?id=${child.id}`}
              className="flex items-center gap-2 rounded-md px-2 py-0.5 text-xs text-[var(--ac-text-muted)] hover:bg-[var(--ac-bg-hover)] hover:text-[var(--ac-text-secondary)] transition-colors"
            >
              <Circle
                className="h-1.5 w-1.5 shrink-0"
                style={{
                  color: child.status === "proposed" || child.status === "active" ? "var(--ac-accent)" : "var(--ac-text-muted)",
                  fill: child.status === "proposed" || child.status === "active" ? "var(--ac-accent)" : "var(--ac-text-muted)",
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
