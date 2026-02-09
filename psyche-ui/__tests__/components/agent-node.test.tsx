import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { AgentNode } from "@/components/canvas/agent-node"
import type { Agent } from "@/lib/types"

// Mock date-fns to avoid flaky relative time assertions
vi.mock("date-fns", () => ({
  formatDistanceToNow: () => "5 minutes ago",
}))

function createMockAgent(overrides: Partial<Agent> = {}): Agent {
  return {
    id: "agent-1",
    name: "ψ₁ The Architect",
    archetype: "architect",
    task: "Refactoring auth module",
    status: "active",
    autonomy: 3,
    progress: 73,
    position: { x: 100, y: 200 },
    dependsOn: [],
    outputFeeds: [],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-02"),
    events: [],
    ...overrides,
  }
}

describe("AgentNode", () => {
  const defaultProps = {
    agent: createMockAgent(),
    canvasZoom: 1,
  }

  it("renders agent name text", () => {
    render(<AgentNode {...defaultProps} />)
    expect(screen.getByText("ψ₁ The Architect")).toBeInTheDocument()
  })

  it("renders correct archetype icon via aria-label", () => {
    // The Compass icon from lucide-react for architect archetype
    // Lucide icons render as SVGs; check that the node's accessible label includes archetype
    render(<AgentNode {...defaultProps} />)
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute(
      "aria-label",
      "ψ₁ The Architect - The Architect - Active"
    )
  })

  it("shows progress bar with correct width percentage", () => {
    const { container } = render(<AgentNode {...defaultProps} />)
    // The progress bar inner div has an inline style with width percentage
    const progressBar = container.querySelector(
      'div[style*="width: 73%"]'
    )
    expect(progressBar).toBeInTheDocument()
  })

  it("does not show progress bar when progress is undefined", () => {
    const agentNoProgress = createMockAgent({ progress: undefined })
    const { container } = render(
      <AgentNode agent={agentNoProgress} canvasZoom={1} />
    )
    const progressBar = container.querySelector(
      'div[style*="width:"]'
    )
    // Should not find a progress bar inner div (the agent position div also has style, so be more specific)
    const allStyledDivs = container.querySelectorAll('div[class*="rounded-full"][class*="h-full"]')
    expect(allStyledDivs.length).toBe(0)
  })

  it("has a status dot element", () => {
    const { container } = render(<AgentNode {...defaultProps} />)
    // Status dot is a span with h-1.5 w-1.5 rounded-full classes
    const statusDot = container.querySelector("span.rounded-full")
    expect(statusDot).toBeInTheDocument()
  })

  it("fires onClick callback on mousedown + mouseup with distance < 5px", () => {
    const handleClick = vi.fn()
    render(<AgentNode {...defaultProps} onClick={handleClick} />)
    const button = screen.getByRole("button")

    // Simulate mousedown at position 100,200
    fireEvent.mouseDown(button, { button: 0, clientX: 100, clientY: 200 })

    // When dragging is active, a fixed overlay div appears for mouse capture.
    // We need to fire mouseUp on that overlay.
    // After mousedown, the component sets isDragging=true which renders the overlay div
    const overlay = document.querySelector(".fixed.inset-0")
    expect(overlay).toBeInTheDocument()

    // Simulate mouseup at same position (distance = 0, which is < 5)
    fireEvent.mouseUp(overlay!, { button: 0, clientX: 100, clientY: 200 })

    expect(handleClick).toHaveBeenCalledWith("agent-1")
  })

  it("does not fire onClick when drag distance >= 5px", () => {
    const handleClick = vi.fn()
    render(<AgentNode {...defaultProps} onClick={handleClick} />)
    const button = screen.getByRole("button")

    fireEvent.mouseDown(button, { button: 0, clientX: 100, clientY: 200 })

    const overlay = document.querySelector(".fixed.inset-0")
    expect(overlay).toBeInTheDocument()

    // Fire mouseMove to create drag distance, then mouseUp
    fireEvent.mouseMove(overlay!, { clientX: 200, clientY: 200 })
    fireEvent.mouseUp(overlay!, { button: 0, clientX: 200, clientY: 200 })

    expect(handleClick).not.toHaveBeenCalled()
  })

  it("has role='button' and aria-label with name, archetype, and status", () => {
    render(<AgentNode {...defaultProps} />)
    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
    expect(button.getAttribute("aria-label")).toBe(
      "ψ₁ The Architect - The Architect - Active"
    )
  })

  it("has tabIndex=0", () => {
    render(<AgentNode {...defaultProps} />)
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("tabindex", "0")
  })

  it("renders task text", () => {
    render(<AgentNode {...defaultProps} />)
    expect(screen.getByText("Refactoring auth module")).toBeInTheDocument()
  })

  it("renders timestamp", () => {
    render(<AgentNode {...defaultProps} />)
    expect(screen.getByText("5 minutes ago")).toBeInTheDocument()
  })

  it("renders different archetype labels correctly", () => {
    const guardianAgent = createMockAgent({
      archetype: "guardian",
      name: "ψ₂ The Guardian",
      status: "idle",
    })
    render(<AgentNode agent={guardianAgent} canvasZoom={1} />)
    const button = screen.getByRole("button")
    expect(button.getAttribute("aria-label")).toBe(
      "ψ₂ The Guardian - The Guardian - Idle"
    )
  })
})
