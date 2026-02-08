"use client"

import React from "react"

import { useState } from "react"
import {
  Check,
  X,
  AlertTriangle,
  ExternalLink,
  RefreshCcw,
  Circle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  mockIntegrations,
  mockDeliveries,
  mockSubscriptions,
} from "@/lib/mock-data"
import type { Integration, DeliveryEntry } from "@/lib/types"

const platformIcons: Record<string, string> = {
  discord: "Discord",
  telegram: "Telegram",
  slack: "Slack",
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  connected: {
    label: "Connected",
    color: "var(--spec-success)",
    icon: <Check className="h-3.5 w-3.5" />,
  },
  disconnected: {
    label: "Disconnected",
    color: "var(--spec-text-muted)",
    icon: <X className="h-3.5 w-3.5" />,
  },
  error: {
    label: "Error",
    color: "var(--spec-error)",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const status = statusConfig[integration.status]
  return (
    <div className="rounded-lg border border-[var(--spec-border-default)] bg-[var(--spec-bg-secondary)] p-4 transition-colors hover:border-[var(--spec-border-strong)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold"
            style={{
              backgroundColor: `color-mix(in srgb, ${status.color} 15%, transparent)`,
              color: status.color,
            }}
          >
            {platformIcons[integration.platform]?.[0]}
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--spec-text-primary)]">
              {platformIcons[integration.platform]}
            </h3>
            {integration.channelName && (
              <p className="text-2xs text-[var(--spec-text-muted)]">{integration.channelName}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: status.color }}>
          {status.icon}
          <span className="text-2xs font-medium">{status.label}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        {integration.lastDelivery ? (
          <span className="text-2xs text-[var(--spec-text-muted)]">
            Last: {formatTime(integration.lastDelivery)}
          </span>
        ) : (
          <span className="text-2xs text-[var(--spec-text-muted)]">No deliveries</span>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-2xs border-[var(--spec-border-default)] bg-transparent text-[var(--spec-text-secondary)] hover:bg-[var(--spec-bg-hover)] hover:text-[var(--spec-text-primary)]"
        >
          {integration.status === "connected" ? "Configure" : "Connect"}
        </Button>
      </div>
    </div>
  )
}

function DeliveryRow({ delivery }: { delivery: DeliveryEntry }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--spec-border-subtle)] px-4 py-2 last:border-b-0">
      <span className="shrink-0 font-mono text-2xs text-[var(--spec-text-muted)]">
        {formatTime(delivery.timestamp)}
      </span>
      <span
        className="shrink-0 rounded px-1.5 py-0.5 text-2xs font-medium uppercase"
        style={{
          color: delivery.success ? "var(--spec-success)" : "var(--spec-error)",
          backgroundColor: delivery.success ? "var(--spec-success-muted)" : "var(--spec-error-muted)",
        }}
      >
        {delivery.statusCode}
      </span>
      <span className="shrink-0 text-2xs font-medium text-[var(--spec-text-secondary)] capitalize">
        {delivery.platform}
      </span>
      <span className="text-xs text-[var(--spec-text-secondary)] truncate">
        {delivery.message}
      </span>
      {!delivery.success && (
        <AlertTriangle className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--spec-error)]" />
      )}
    </div>
  )
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "deliveries" | "subscriptions">("overview")

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--spec-border-subtle)] px-6 py-3">
        <h1 className="text-lg font-semibold text-[var(--spec-text-primary)]">Integrations</h1>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-[var(--spec-border-default)] bg-transparent text-[var(--spec-text-secondary)] hover:bg-[var(--spec-bg-hover)] hover:text-[var(--spec-text-primary)]"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--spec-border-subtle)] px-6">
        {(["overview", "deliveries", "subscriptions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "border-b-2 px-4 py-2.5 text-xs font-medium capitalize transition-colors",
              activeTab === tab
                ? "border-[var(--spec-accent)] text-[var(--spec-accent)]"
                : "border-transparent text-[var(--spec-text-muted)] hover:text-[var(--spec-text-secondary)]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        )}

        {activeTab === "deliveries" && (
          <div className="rounded-lg border border-[var(--spec-border-default)] bg-[var(--spec-bg-secondary)]">
            <div className="border-b border-[var(--spec-border-subtle)] px-4 py-3">
              <h2 className="text-sm font-medium text-[var(--spec-text-primary)]">
                Recent Deliveries
              </h2>
            </div>
            <div className="flex flex-col">
              {mockDeliveries.map((delivery) => (
                <DeliveryRow key={delivery.id} delivery={delivery} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "subscriptions" && (
          <div className="rounded-lg border border-[var(--spec-border-default)] bg-[var(--spec-bg-secondary)]">
            <div className="border-b border-[var(--spec-border-subtle)] px-4 py-3">
              <h2 className="text-sm font-medium text-[var(--spec-text-primary)]">
                Event Subscriptions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--spec-border-subtle)]">
                    <th className="px-4 py-2 text-left text-2xs font-medium text-[var(--spec-text-muted)]">
                      Event
                    </th>
                    {mockIntegrations.map((i) => (
                      <th
                        key={i.id}
                        className="px-4 py-2 text-center text-2xs font-medium text-[var(--spec-text-muted)] capitalize"
                      >
                        {i.platform}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(mockSubscriptions).map(([event, subs]) => (
                    <tr
                      key={event}
                      className="border-b border-[var(--spec-border-subtle)] last:border-b-0"
                    >
                      <td className="px-4 py-2 text-xs text-[var(--spec-text-secondary)]">
                        {event}
                      </td>
                      {mockIntegrations.map((i) => (
                        <td key={i.id} className="px-4 py-2 text-center">
                          {subs[i.platform] ? (
                            <Circle
                              className="mx-auto h-2.5 w-2.5"
                              style={{
                                color: "var(--spec-accent)",
                                fill: "var(--spec-accent)",
                              }}
                            />
                          ) : (
                            <Circle className="mx-auto h-2.5 w-2.5 text-[var(--spec-border-default)]" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
