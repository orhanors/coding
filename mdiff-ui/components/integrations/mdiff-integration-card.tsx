"use client"

import React from "react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import type { Integration } from "@/lib/types"

const platformNames: Record<string, string> = {
  telegram: "Telegram",
  discord: "Discord",
  slack: "Slack",
}

interface MdiffIntegrationCardProps {
  integration: Integration
  onConfigure: () => void
  onTest: () => void
}

export function MdiffIntegrationCard({ integration, onConfigure, onTest }: MdiffIntegrationCardProps) {
  const connected = integration.status === "connected"

  return (
    <div
      className={cn(
        "rounded-lg p-5 transition-colors",
        connected
          ? "border border-[var(--border-default)] bg-[var(--bg-secondary)]"
          : "border-2 border-dashed border-[var(--border-subtle)]"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {platformNames[integration.platform]}
        </h3>
        <span
          className={cn(
            "text-xs flex items-center gap-1.5",
            connected ? "text-[var(--success)]" : "text-[var(--text-muted)]"
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              connected ? "bg-[var(--success)]" : "bg-[var(--text-muted)]"
            )}
          />
          {connected ? "Connected" : "Not connected"}
        </span>
      </div>

      {connected ? (
        <>
          <p className="text-sm text-[var(--text-secondary)] mb-2">{integration.channelName}</p>
          <div className="flex gap-4 text-xs text-[var(--text-secondary)] mb-3">
            <span>Trigger: {integration.capabilities.trigger ? "✓" : "—"}</span>
            <span>Notify: {integration.capabilities.notify ? "✓" : "—"}</span>
          </div>
          {integration.lastActivity && (
            <p className="text-xs text-[var(--text-muted)] mb-4">
              Last: {formatDistanceToNow(integration.lastActivity, { addSuffix: true })}
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={onConfigure}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
            >
              Configure
            </button>
            <button
              onClick={onTest}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
            >
              Test
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={onConfigure}
          className="mt-2 text-sm text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors"
        >
          Connect →
        </button>
      )}
    </div>
  )
}
