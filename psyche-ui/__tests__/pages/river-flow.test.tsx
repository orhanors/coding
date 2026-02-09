import { render, screen, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { useRiverStore } from "@/stores/river-store"
import { useAgentStore } from "@/stores/agent-store"

// Mock next/navigation and next/link
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}))

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

// Mock sub-components
vi.mock("@/components/river/river-filters", () => ({
  RiverFilters: () => (
    <div data-testid="river-filters">
      <select data-testid="type-filter" aria-label="Filter by type">
        <option value="all">All types</option>
      </select>
      <select data-testid="agent-filter" aria-label="Filter by agent">
        <option value="all">All agents</option>
      </select>
      <input data-testid="search-input" placeholder="Search entries..." />
    </div>
  ),
}))

vi.mock("@/components/river/river-view", () => ({
  RiverView: ({ entries }: { entries: unknown[] }) => (
    <div data-testid="river-view">{entries.length} entries</div>
  ),
}))

vi.mock("@/components/river/river-skeleton", () => ({
  RiverSkeleton: () => <div data-testid="river-skeleton">Loading...</div>,
}))

vi.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <div data-testid="scroll-area">{children}</div>,
}))

import RiverPage from "@/app/river/page"

describe("River Page Integration", () => {
  beforeEach(() => {
    vi.useFakeTimers()

    useRiverStore.setState({
      entries: [
        {
          id: "river-1",
          type: "vision",
          title: "Vision 'Auth Redesign' updated",
          description: "Completed 3 of 4 Phase 1 tasks",
          agent: { id: "agent-1", name: "The Architect", archetype: "architect" as const },
          timestamp: new Date("2025-01-02"),
        },
        {
          id: "river-2",
          type: "code",
          title: "src/auth/jwt.ts changed",
          description: "Created JWT token service",
          agent: { id: "agent-1", name: "The Architect", archetype: "architect" as const },
          timestamp: new Date("2025-01-01"),
          stats: { linesAdded: 47, linesRemoved: 12 },
        },
      ],
      filters: {},
    })

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
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders filter controls", () => {
    render(<RiverPage />)
    // Filters are shown even during loading (the river page shows filters header above the skeleton)
    expect(screen.getByTestId("river-filters")).toBeInTheDocument()
  })

  it("renders type filter dropdown", () => {
    render(<RiverPage />)
    expect(screen.getByTestId("type-filter")).toBeInTheDocument()
  })

  it("renders agent filter dropdown", () => {
    render(<RiverPage />)
    expect(screen.getByTestId("agent-filter")).toBeInTheDocument()
  })

  it("renders search input", () => {
    render(<RiverPage />)
    expect(screen.getByTestId("search-input")).toBeInTheDocument()
  })

  it("renders river view with entries after loading", () => {
    render(<RiverPage />)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(screen.getByTestId("river-view")).toBeInTheDocument()
  })

  it("shows empty state when no entries and no filters", () => {
    useRiverStore.setState({
      entries: [],
      filters: {},
    })
    render(<RiverPage />)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(
      screen.getByText("No changes yet. Create an agent on the Canvas to begin.")
    ).toBeInTheDocument()
    expect(screen.getByText("Go to Canvas")).toBeInTheDocument()
  })

  it("shows filtered empty state when filters active but no matching entries", () => {
    useRiverStore.setState({
      entries: [],
      filters: { type: "code" },
    })
    render(<RiverPage />)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(
      screen.getByText("No entries match your filters.")
    ).toBeInTheDocument()
    expect(screen.getByText("Clear all filters")).toBeInTheDocument()
  })

  it("shows skeleton while loading", () => {
    render(<RiverPage />)
    // Before timer fires, skeleton should be visible
    expect(screen.getByTestId("river-skeleton")).toBeInTheDocument()
  })
})
