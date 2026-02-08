import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MdiffIntegrationCard } from "@/components/integrations/mdiff-integration-card"
import type { Integration } from "@/lib/types"

const connectedIntegration: Integration = {
  id: "int-1",
  platform: "telegram",
  status: "connected",
  channelName: "#dev-alerts",
  capabilities: { trigger: true, notify: true },
  lastActivity: new Date("2026-02-08T10:00:00"),
}

const disconnectedIntegration: Integration = {
  id: "int-2",
  platform: "slack",
  status: "disconnected",
  capabilities: { trigger: false, notify: false },
}

describe("MdiffIntegrationCard", () => {
  it("shows platform name for connected integration", () => {
    render(
      <MdiffIntegrationCard
        integration={connectedIntegration}
        onConfigure={vi.fn()}
        onTest={vi.fn()}
      />
    )
    expect(screen.getByText("Telegram")).toBeInTheDocument()
  })

  it("shows 'Connected' status for connected integration", () => {
    render(
      <MdiffIntegrationCard
        integration={connectedIntegration}
        onConfigure={vi.fn()}
        onTest={vi.fn()}
      />
    )
    expect(screen.getByText("Connected")).toBeInTheDocument()
  })

  it("shows channel name for connected integration", () => {
    render(
      <MdiffIntegrationCard
        integration={connectedIntegration}
        onConfigure={vi.fn()}
        onTest={vi.fn()}
      />
    )
    expect(screen.getByText("#dev-alerts")).toBeInTheDocument()
  })

  it("shows Configure and Test buttons for connected integration", () => {
    render(
      <MdiffIntegrationCard
        integration={connectedIntegration}
        onConfigure={vi.fn()}
        onTest={vi.fn()}
      />
    )
    expect(screen.getByText("Configure")).toBeInTheDocument()
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  it("shows 'Not connected' for disconnected integration", () => {
    render(
      <MdiffIntegrationCard
        integration={disconnectedIntegration}
        onConfigure={vi.fn()}
        onTest={vi.fn()}
      />
    )
    expect(screen.getByText("Not connected")).toBeInTheDocument()
  })

  it("shows Connect link for disconnected integration", () => {
    render(
      <MdiffIntegrationCard
        integration={disconnectedIntegration}
        onConfigure={vi.fn()}
        onTest={vi.fn()}
      />
    )
    expect(screen.getByText("Connect →")).toBeInTheDocument()
  })

  it("calls onConfigure when Configure clicked", async () => {
    const onConfigure = vi.fn()
    const user = userEvent.setup()
    render(
      <MdiffIntegrationCard
        integration={connectedIntegration}
        onConfigure={onConfigure}
        onTest={vi.fn()}
      />
    )
    await user.click(screen.getByText("Configure"))
    expect(onConfigure).toHaveBeenCalledOnce()
  })

  it("calls onTest when Test clicked", async () => {
    const onTest = vi.fn()
    const user = userEvent.setup()
    render(
      <MdiffIntegrationCard
        integration={connectedIntegration}
        onConfigure={vi.fn()}
        onTest={onTest}
      />
    )
    await user.click(screen.getByText("Test"))
    expect(onTest).toHaveBeenCalledOnce()
  })

  it("shows capability indicators", () => {
    render(
      <MdiffIntegrationCard
        integration={connectedIntegration}
        onConfigure={vi.fn()}
        onTest={vi.fn()}
      />
    )
    expect(screen.getByText(/Trigger: ✓/)).toBeInTheDocument()
    expect(screen.getByText(/Notify: ✓/)).toBeInTheDocument()
  })
})
