"use client"

import React from "react"
import type { A2UIPayload, A2UIComponent } from "@/lib/types"
import { Progress } from "@/components/ui/progress"

function TextComponent({ level, content }: { level?: number; content?: string }) {
  const text = String(content || "")
  if (level === 1) return <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-3">{text}</h1>
  if (level === 2) return <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{text}</h2>
  if (level === 3) return <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{text}</h3>
  return <p className="text-sm text-[var(--text-primary)] mb-2">{text}</p>
}

function ProgressComponent({ value, label }: { value?: number; label?: string }) {
  return (
    <div className="mb-4">
      {label && <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>}
      <Progress value={Number(value || 0)} className="h-2" />
      <p className="text-xs text-[var(--text-muted)] mt-1">{value}%</p>
    </div>
  )
}

function ListComponent({ items }: { items?: string[] }) {
  return (
    <ul className="space-y-1 mb-4">
      {(items || []).map((item, i) => (
        <li key={i} className="text-sm text-[var(--text-primary)] pl-2">{String(item)}</li>
      ))}
    </ul>
  )
}

function ButtonComponent({ label, variant }: { label?: string; variant?: string }) {
  return (
    <button
      className={
        variant === "outline"
          ? "px-3 py-1.5 text-sm font-medium rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
          : "px-3 py-1.5 text-sm font-medium rounded-md bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] transition-colors"
      }
    >
      {String(label || "Button")}
    </button>
  )
}

function CardComponent({ title, ...props }: { title?: string } & Record<string, unknown>) {
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4 mb-4">
      {title && <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{title}</h3>}
      <p className="text-xs text-[var(--text-muted)]">Card content</p>
    </div>
  )
}

function CodeComponent({ content }: { content?: string }) {
  return (
    <pre className="rounded-md bg-[var(--bg-surface)] p-3 text-sm font-mono text-[var(--text-primary)] overflow-x-auto mb-4">
      {String(content || "")}
    </pre>
  )
}

function FallbackComponent({ type }: { type: string }) {
  return (
    <div className="rounded-md border-2 border-dashed border-[var(--border-default)] p-3 mb-4">
      <p className="text-xs text-[var(--text-muted)]">Unsupported component: {type}</p>
    </div>
  )
}

const componentMap: Record<string, React.ComponentType<Record<string, unknown>>> = {
  text: TextComponent as React.ComponentType<Record<string, unknown>>,
  progress: ProgressComponent as React.ComponentType<Record<string, unknown>>,
  list: ListComponent as React.ComponentType<Record<string, unknown>>,
  button: ButtonComponent as React.ComponentType<Record<string, unknown>>,
  card: CardComponent as React.ComponentType<Record<string, unknown>>,
  code: CodeComponent as React.ComponentType<Record<string, unknown>>,
}

function renderComponent(component: A2UIComponent) {
  const Component = componentMap[component.type]
  if (!Component) {
    return <FallbackComponent key={component.id} type={component.type} />
  }
  return <Component key={component.id} {...component.props} />
}

interface A2UIRendererProps {
  payload: A2UIPayload
  onAction?: (actionId: string, data: unknown) => void
}

export function A2UIRenderer({ payload, onAction }: A2UIRendererProps) {
  if (!payload || payload.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--text-muted)] text-sm">
        No A2UI content available.
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {payload.map((component) => renderComponent(component))}
    </div>
  )
}
