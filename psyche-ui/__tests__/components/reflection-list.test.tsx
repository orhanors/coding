import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ReflectionList } from "@/components/reflections/reflection-list"
import type { Reflection } from "@/lib/types"
import { useAgentStore } from "@/stores/agent-store"
import { useReflectionStore } from "@/stores/reflection-store"

// Mock date-fns
vi.mock("date-fns", () => ({
  formatDistanceToNow: () => "2 hours ago",
}))

// Mock sub-components
vi.mock("@/components/reflections/reflection-status-badge", () => ({
  ReflectionStatusBadge: ({ status }: { status: string }) => (
    <span data-testid={`status-badge-${status}`}>{status}</span>
  ),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: React.PropsWithChildren<{ onClick?: React.MouseEventHandler }>) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

function createMockReflection(overrides: Partial<Reflection> = {}): Reflection {
  return {
    id: "reflection-1",
    number: 1,
    title: "Use cookie-based sessions",
    status: "accepted",
    content: "# R-001: Use cookie-based sessions",
    author: "human",
    versions: [],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-02"),
    ...overrides,
  }
}

const mockReflections: Reflection[] = [
  createMockReflection({
    id: "r-1",
    number: 1,
    title: "Use cookie-based sessions",
    status: "accepted",
  }),
  createMockReflection({
    id: "r-2",
    number: 2,
    title: "Use PostgreSQL for persistence",
    status: "accepted",
  }),
  createMockReflection({
    id: "r-3",
    number: 3,
    title: "Choose JWT over sessions",
    status: "proposed",
    author: "agent",
    agentId: "agent-1",
  }),
  createMockReflection({
    id: "r-4",
    number: 4,
    title: "Deprecated approach",
    status: "deprecated",
  }),
]

describe("ReflectionList", () => {
  beforeEach(() => {
    // Set up agent store with a mock agent
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

  it("renders reflections grouped by status", () => {
    render(
      <ReflectionList
        reflections={mockReflections}
        selectedId={null}
        onSelect={vi.fn()}
      />
    )

    // "Active" group header (accepted reflections go to "active" group)
    expect(screen.getByText("Active")).toBeInTheDocument()
    // "Proposed" group header
    expect(screen.getByText("Proposed")).toBeInTheDocument()
    // "Deprecated" group header
    expect(screen.getByText("Deprecated")).toBeInTheDocument()

    // Check that reflection titles render
    expect(screen.getByText("Use cookie-based sessions")).toBeInTheDocument()
    expect(screen.getByText("Use PostgreSQL for persistence")).toBeInTheDocument()
    expect(screen.getByText("Choose JWT over sessions")).toBeInTheDocument()
    expect(screen.getByText("Deprecated approach")).toBeInTheDocument()
  })

  it("shows group counts", () => {
    render(
      <ReflectionList
        reflections={mockReflections}
        selectedId={null}
        onSelect={vi.fn()}
      />
    )

    // Active group should have 2 items
    expect(screen.getByText("2")).toBeInTheDocument()
    // Proposed and Deprecated groups each have 1 item
    const oneCountElements = screen.getAllByText("1")
    expect(oneCountElements.length).toBe(2)
  })

  it("click fires selection callback", () => {
    const handleSelect = vi.fn()
    render(
      <ReflectionList
        reflections={mockReflections}
        selectedId={null}
        onSelect={handleSelect}
      />
    )

    fireEvent.click(screen.getByText("Use cookie-based sessions"))
    expect(handleSelect).toHaveBeenCalledWith("r-1")
  })

  it("proposed reflections show approve action", () => {
    render(
      <ReflectionList
        reflections={mockReflections}
        selectedId={null}
        onSelect={vi.fn()}
      />
    )

    // The proposed reflection should have an "Approve" button
    const approveButton = screen.getByText("Approve")
    expect(approveButton).toBeInTheDocument()
  })

  it("does not show approve button for non-proposed reflections", () => {
    const acceptedOnly = [mockReflections[0]]
    render(
      <ReflectionList
        reflections={acceptedOnly}
        selectedId={null}
        onSelect={vi.fn()}
      />
    )

    expect(screen.queryByText("Approve")).not.toBeInTheDocument()
  })

  it("renders reflection numbers with R-XXX format", () => {
    render(
      <ReflectionList
        reflections={mockReflections}
        selectedId={null}
        onSelect={vi.fn()}
      />
    )

    expect(screen.getByText("R-001")).toBeInTheDocument()
    expect(screen.getByText("R-002")).toBeInTheDocument()
    expect(screen.getByText("R-003")).toBeInTheDocument()
    expect(screen.getByText("R-004")).toBeInTheDocument()
  })

  it("shows agent name for agent-authored reflections", () => {
    render(
      <ReflectionList
        reflections={mockReflections}
        selectedId={null}
        onSelect={vi.fn()}
      />
    )

    // Agent-authored reflection shows "ψ {agent.name}"
    expect(screen.getByText(/ψ₁ The Architect/)).toBeInTheDocument()
  })

  it("shows 'human' for human-authored reflections", () => {
    render(
      <ReflectionList
        reflections={mockReflections}
        selectedId={null}
        onSelect={vi.fn()}
      />
    )

    // Human-authored reflections show "human"
    const humanLabels = screen.getAllByText("human")
    expect(humanLabels.length).toBeGreaterThan(0)
  })

  it("does not render empty groups", () => {
    // No superseded reflections in our mock data
    render(
      <ReflectionList
        reflections={mockReflections}
        selectedId={null}
        onSelect={vi.fn()}
      />
    )

    expect(screen.queryByText("Superseded")).not.toBeInTheDocument()
  })
})
