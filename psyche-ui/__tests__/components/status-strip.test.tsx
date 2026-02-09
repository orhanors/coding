import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { StatusStrip } from "@/components/layout/status-strip"
import { useAgentStore } from "@/stores/agent-store"
import { useUIStore } from "@/stores/ui-store"

describe("StatusStrip", () => {
  beforeEach(() => {
    // Reset stores before each test
    useUIStore.setState({
      agentOverlayOpen: false,
      agentOverlayAgentId: null,
    })
  })

  it("shows active agent name when agent is active", () => {
    useAgentStore.setState({
      agents: [
        {
          id: "agent-1",
          name: "ψ₁ The Architect",
          archetype: "architect",
          task: "Refactoring auth module",
          status: "active",
          autonomy: 3,
          progress: 73,
          position: { x: 200, y: 150 },
          dependsOn: [],
          outputFeeds: [],
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
          events: [],
        },
      ],
    })

    render(<StatusStrip />)
    // The component strips the ψ₁ prefix via regex: name.replace(/^ψ[₁₂₃₄₅₆₇₈₉] /, "")
    // so "ψ₁ The Architect" becomes "The Architect"
    // The displayed text is: `${name}: ${task}...`
    expect(screen.getByText(/The Architect: Refactoring auth module/)).toBeInTheDocument()
  })

  it("shows 'idle' when no active agent", () => {
    useAgentStore.setState({
      agents: [
        {
          id: "agent-2",
          name: "ψ₂ The Guardian",
          archetype: "guardian",
          task: "Awaiting auth module tests",
          status: "idle",
          autonomy: 2,
          position: { x: 200, y: 350 },
          dependsOn: [],
          outputFeeds: [],
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
          events: [],
        },
      ],
    })

    render(<StatusStrip />)
    expect(screen.getByText("idle")).toBeInTheDocument()
  })

  it("shows version number", () => {
    useAgentStore.setState({ agents: [] })
    render(<StatusStrip />)
    // APP_VERSION = "0.1.0", displayed as "v0.1.0"
    expect(screen.getByText("v0.1.0")).toBeInTheDocument()
  })

  it("shows pending count when there are idle agents", () => {
    useAgentStore.setState({
      agents: [
        {
          id: "agent-1",
          name: "ψ₁ The Architect",
          archetype: "architect",
          task: "Refactoring auth module",
          status: "active",
          autonomy: 3,
          position: { x: 200, y: 150 },
          dependsOn: [],
          outputFeeds: [],
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
          events: [],
        },
        {
          id: "agent-2",
          name: "ψ₂ The Guardian",
          archetype: "guardian",
          task: "Awaiting tests",
          status: "idle",
          autonomy: 2,
          position: { x: 200, y: 350 },
          dependsOn: [],
          outputFeeds: [],
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
          events: [],
        },
        {
          id: "agent-3",
          name: "ψ₃ The Explorer",
          archetype: "explorer",
          task: "Researching",
          status: "idle",
          autonomy: 4,
          position: { x: 80, y: 500 },
          dependsOn: [],
          outputFeeds: [],
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
          events: [],
        },
      ],
    })

    render(<StatusStrip />)
    expect(screen.getByText("2 pending")).toBeInTheDocument()
  })

  it("does not show pending count when no idle agents", () => {
    useAgentStore.setState({
      agents: [
        {
          id: "agent-1",
          name: "ψ₁ The Architect",
          archetype: "architect",
          task: "Refactoring auth module",
          status: "active",
          autonomy: 3,
          position: { x: 200, y: 150 },
          dependsOn: [],
          outputFeeds: [],
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
          events: [],
        },
      ],
    })

    render(<StatusStrip />)
    expect(screen.queryByText(/pending/)).not.toBeInTheDocument()
  })
})
