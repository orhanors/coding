"use client"

import React, { useState } from "react"
import { MdiffIntegrationCard } from "@/components/integrations/mdiff-integration-card"
import { MdiffDeliveryLog } from "@/components/integrations/mdiff-delivery-log"
import { IntegrationConfigSheet } from "@/components/integrations/integration-config-sheet"
import { mockIntegrations, mockDeliveries } from "@/lib/mock-data"
import type { Integration } from "@/lib/types"

export default function IntegrationsPage() {
  const [configuring, setConfiguring] = useState<Integration | null>(null)

  return (
    <div className="py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Integrations</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Connect your team&apos;s messaging platforms to trigger agents and receive diff notifications.
        </p>
      </div>

      {/* Integration Cards */}
      <div className="space-y-4">
        {mockIntegrations.map((integration) => (
          <MdiffIntegrationCard
            key={integration.id}
            integration={integration}
            onConfigure={() => setConfiguring(integration)}
            onTest={() => {}}
          />
        ))}
      </div>

      <hr className="border-[var(--border-subtle)]" />

      {/* Delivery Log */}
      <MdiffDeliveryLog entries={mockDeliveries} onClear={() => {}} />

      {/* Config Sheet */}
      <IntegrationConfigSheet
        integration={configuring}
        open={configuring !== null}
        onOpenChange={(open) => !open && setConfiguring(null)}
      />
    </div>
  )
}
