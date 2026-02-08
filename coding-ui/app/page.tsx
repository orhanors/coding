"use client"

import { Play, FileText, ClipboardList, ScrollText, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/shared/metric-card"
import { PipelineProgress } from "@/components/shared/pipeline-progress"
import { EventFeed } from "@/components/shared/event-feed"
import { ChangeLog } from "@/components/shared/change-log"
import {
  mockPipelineRun,
  mockPipelineEvents,
  mockHistory,
  mockIntegrations,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const connectedIntegrations = mockIntegrations.filter((i) => i.status === "connected").length

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[var(--ac-text-primary)]">Dashboard</h1>
        <Button
          className="gap-2 bg-[var(--ac-accent)] text-[var(--ac-bg-primary)] hover:bg-[var(--ac-accent-secondary)]"
          size="sm"
        >
          <Play className="h-3.5 w-3.5" />
          Run Pipeline
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="ADRs"
          value={12}
          delta="+2 new"
          trend="up"
          icon={<FileText className="h-4 w-4" />}
        />
        <MetricCard
          label="PRDs"
          value={8}
          delta="+1 new"
          trend="up"
          icon={<ClipboardList className="h-4 w-4" />}
        />
        <MetricCard
          label="PRD Logs"
          value={34}
          delta="+5 today"
          trend="up"
          icon={<ScrollText className="h-4 w-4" />}
        />
        <MetricCard
          label="Integrations"
          value={`${connectedIntegrations} Connected`}
          icon={<Link2 className="h-4 w-4" />}
        />
      </div>

      {/* Active Pipeline */}
      <div className="rounded-lg border border-[var(--ac-border-default)] bg-[var(--ac-bg-secondary)] p-4">
        <h2 className="mb-4 text-sm font-medium text-[var(--ac-text-primary)]">
          Active Pipeline
        </h2>
        <PipelineProgress steps={mockPipelineRun.steps} currentStep={mockPipelineRun.currentStep} />
      </div>

      {/* Bottom Split: Recent Changes + Live Event Feed */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Architecture Changes */}
        <div className="rounded-lg border border-[var(--ac-border-default)] bg-[var(--ac-bg-secondary)]">
          <div className="border-b border-[var(--ac-border-subtle)] px-4 py-3">
            <h2 className="text-sm font-medium text-[var(--ac-text-primary)]">
              Recent Architecture Changes
            </h2>
          </div>
          <ChangeLog entries={mockHistory} maxItems={4} />
        </div>

        {/* Live Event Feed */}
        <div className="rounded-lg border border-[var(--ac-border-default)] bg-[var(--ac-bg-secondary)]">
          <div className="flex items-center gap-2 border-b border-[var(--ac-border-subtle)] px-4 py-3">
            <h2 className="text-sm font-medium text-[var(--ac-text-primary)]">
              Live Event Feed
            </h2>
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[var(--ac-accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ac-accent)]" />
            </span>
          </div>
          <EventFeed events={mockPipelineEvents} maxHeight="340px" />
        </div>
      </div>
    </div>
  )
}
