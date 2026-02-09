import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { VisionCard } from "@/components/visions/vision-card"
import type { Vision } from "@/lib/types"
import { useAgentStore } from "@/stores/agent-store"

// Seed the agent store with a mock agent for the assigned agent lookup
beforeEach(() => {
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
})

function createMockVision(overrides: Partial<Vision> = {}): Vision {
  return {
    id: "vision-1",
    title: "Auth Redesign",
    overview: "Migrate from cookie-based sessions to JWT",
    stage: "in_progress",
    priority: "high",
    assignedAgent: "agent-1",
    tasks: [],
    totalTasks: 15,
    completedTasks: 3,
    changeHistory: [],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-02"),
    ...overrides,
  }
}

describe("VisionCard", () => {
  const defaultProps = {
    vision: createMockVision(),
    onClick: vi.fn(),
    onDragStart: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders vision title", () => {
    render(<VisionCard {...defaultProps} />)
    expect(screen.getByText("Auth Redesign")).toBeInTheDocument()
  })

  it("shows progress bar with correct width", () => {
    const { container } = render(<VisionCard {...defaultProps} />)
    // 3/15 = 20%
    const progressBar = container.querySelector('div[style*="width: 20%"]')
    expect(progressBar).toBeInTheDocument()
  })

  it("shows completed/total tasks count", () => {
    render(<VisionCard {...defaultProps} />)
    expect(screen.getByText("3/15")).toBeInTheDocument()
  })

  it("shows priority indicator for high priority", () => {
    render(<VisionCard {...defaultProps} />)
    // High priority shows three filled dots and the text "high"
    expect(screen.getByText("high")).toBeInTheDocument()
    expect(screen.getByText("●●●")).toBeInTheDocument()
  })

  it("shows priority indicator for medium priority", () => {
    const mediumVision = createMockVision({ priority: "medium" })
    render(
      <VisionCard
        vision={mediumVision}
        onClick={vi.fn()}
        onDragStart={vi.fn()}
      />
    )
    expect(screen.getByText("medium")).toBeInTheDocument()
    expect(screen.getByText("●●")).toBeInTheDocument()
  })

  it("shows priority indicator for low priority", () => {
    const lowVision = createMockVision({ priority: "low" })
    render(
      <VisionCard
        vision={lowVision}
        onClick={vi.fn()}
        onDragStart={vi.fn()}
      />
    )
    expect(screen.getByText("low")).toBeInTheDocument()
  })

  it("click fires selection callback", () => {
    const handleClick = vi.fn()
    render(
      <VisionCard
        {...defaultProps}
        onClick={handleClick}
      />
    )
    fireEvent.click(screen.getByText("Auth Redesign"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("shows assigned agent name when agent exists", () => {
    render(<VisionCard {...defaultProps} />)
    expect(screen.getByText("ψ₁ The Architect")).toBeInTheDocument()
  })

  it("shows 'Unassigned' when no agent is assigned", () => {
    const unassignedVision = createMockVision({ assignedAgent: undefined })
    render(
      <VisionCard
        vision={unassignedVision}
        onClick={vi.fn()}
        onDragStart={vi.fn()}
      />
    )
    expect(screen.getByText("Unassigned")).toBeInTheDocument()
  })

  it("shows 0% progress when totalTasks is 0", () => {
    const emptyVision = createMockVision({ totalTasks: 0, completedTasks: 0 })
    const { container } = render(
      <VisionCard
        vision={emptyVision}
        onClick={vi.fn()}
        onDragStart={vi.fn()}
      />
    )
    const progressBar = container.querySelector('div[style*="width: 0%"]')
    expect(progressBar).toBeInTheDocument()
  })
})
