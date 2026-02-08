"use client"

import React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Integration } from "@/lib/types"

interface IntegrationConfigSheetProps {
  integration: Integration | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const platformNames: Record<string, string> = {
  telegram: "Telegram",
  discord: "Discord",
  slack: "Slack",
}

export function IntegrationConfigSheet({
  integration,
  open,
  onOpenChange,
}: IntegrationConfigSheetProps) {
  if (!integration) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-[var(--bg-tertiary)] border-t border-[var(--border-default)]">
        <SheetHeader>
          <SheetTitle className="text-[var(--text-primary)]">
            Configure {platformNames[integration.platform]}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Platform</label>
            <input
              readOnly
              value={platformNames[integration.platform]}
              className="w-full px-3 py-2 text-sm rounded-md bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              {integration.platform === "telegram" ? "Bot Token" : "Webhook URL"}
            </label>
            <input
              type="password"
              placeholder={integration.platform === "telegram" ? "Enter bot token..." : "https://..."}
              className="w-full px-3 py-2 text-sm rounded-md bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Channel Name</label>
            <input
              defaultValue={integration.channelName || ""}
              placeholder="#channel or @bot"
              className="w-full px-3 py-2 text-sm rounded-md bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              maxLength={64}
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-2">Event Subscriptions</label>
            <div className="space-y-2">
              {["diff:created", "agent:completed", "integration:sent"].map((evt) => (
                <label key={evt} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <input type="checkbox" defaultChecked className="rounded" />
                  {evt}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button className="px-4 py-2 text-sm font-medium rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Test Connection
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
