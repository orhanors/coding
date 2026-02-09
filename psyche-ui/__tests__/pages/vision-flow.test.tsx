import { render, screen, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { useVisionStore } from "@/stores/vision-store"
import { useAgentStore } from "@/stores/agent-store"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock useIsMobile to return false (desktop)
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}))

// Mock sub-components that require complex rendering
vi.mock("@/components/visions/vision-board", () => ({
  VisionBoard: () => <div data-testid="vision-board">Board View</div>,
}))

vi.mock("@/components/visions/vision-list", () => ({
  VisionList: () => <div data-testid="vision-list">List View</div>,
}))

vi.mock("@/components/visions/vision-detail-modal", () => ({
  VisionDetailModal: () => <div data-testid="vision-detail-modal" />,
}))

vi.mock("@/components/visions/vision-editor", () => ({
  VisionEditor: ({
    open,
  }: {
    open: boolean
    onOpenChange: (v: boolean) => void
  }) => (open ? <div data-testid="vision-editor">Editor</div> : null),
}))

vi.mock("@/components/visions/vision-skeleton", () => ({
  VisionSkeleton: () => <div data-testid="vision-skeleton">Loading...</div>,
}))

// Mock Radix Tabs to render simply
vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode
    value: string
    onValueChange: (v: string) => void
  }) => <div data-testid="tabs">{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list" role="tablist">
      {children}
    </div>
  ),
  TabsTrigger: ({
    children,
    value,
  }: {
    children: React.ReactNode
    value: string
  }) => (
    <button role="tab" data-value={value}>
      {children}
    </button>
  ),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: React.PropsWithChildren<{
    onClick?: React.MouseEventHandler
    size?: string
    className?: string
    variant?: string
  }>) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

import VisionsPage from "@/app/visions/page"

describe("Visions Page Integration", () => {
  beforeEach(() => {
    vi.useFakeTimers()

    // Seed the vision store with visions so we get the full UI (not the empty state)
    useVisionStore.setState({
      visions: [
        {
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
        },
      ],
      viewMode: "board",
      selectedVisionId: null,
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

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders the board/list toggle", () => {
    render(<VisionsPage />)
    // Advance past the 100ms loading timer
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(screen.getByText("Board")).toBeInTheDocument()
    expect(screen.getByText("List")).toBeInTheDocument()
  })

  it("renders the 'New Vision' button", () => {
    render(<VisionsPage />)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(screen.getByText("New Vision")).toBeInTheDocument()
  })

  it("renders the vision board by default", () => {
    render(<VisionsPage />)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(screen.getByTestId("vision-board")).toBeInTheDocument()
  })

  it("shows empty state with 'New Vision' button when no visions", () => {
    useVisionStore.setState({ visions: [] })
    render(<VisionsPage />)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(
      screen.getByText("No visions yet. Start by describing what you want to build.")
    ).toBeInTheDocument()
    expect(screen.getByText("New Vision")).toBeInTheDocument()
  })

  it("shows skeleton while loading", () => {
    render(<VisionsPage />)
    // Before timer fires, skeleton should be visible
    expect(screen.getByTestId("vision-skeleton")).toBeInTheDocument()
  })
})
