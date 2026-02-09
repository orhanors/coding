import { render, screen, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { useReflectionStore } from "@/stores/reflection-store"
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

// Mock sub-components
vi.mock("@/components/reflections/reflection-list", () => ({
  ReflectionList: ({
    reflections,
    selectedId,
    onSelect,
  }: {
    reflections: unknown[]
    selectedId: string | null
    onSelect: (id: string) => void
  }) => (
    <div data-testid="reflection-list">
      {reflections.length} reflections
    </div>
  ),
}))

vi.mock("@/components/reflections/reflection-reader", () => ({
  ReflectionReader: () => <div data-testid="reflection-reader" />,
}))

vi.mock("@/components/reflections/reflection-diff-history", () => ({
  ReflectionDiffHistory: () => <div data-testid="reflection-diff-history" />,
}))

vi.mock("@/components/reflections/reflection-editor", () => ({
  ReflectionEditor: ({
    open,
  }: {
    open: boolean
    onOpenChange: (v: boolean) => void
  }) => (open ? <div data-testid="reflection-editor">Editor</div> : null),
}))

vi.mock("@/components/reflections/reflection-skeleton", () => ({
  ReflectionSkeleton: () => (
    <div data-testid="reflection-skeleton">Loading...</div>
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

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}))

import ReflectionsPage from "@/app/reflections/page"

describe("Reflections Page Integration", () => {
  beforeEach(() => {
    vi.useFakeTimers()

    useReflectionStore.setState({
      reflections: [
        {
          id: "reflection-1",
          number: 1,
          title: "Use cookie-based sessions",
          status: "accepted",
          content: "# R-001",
          author: "human",
          versions: [],
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
        },
        {
          id: "reflection-2",
          number: 2,
          title: "Use PostgreSQL",
          status: "proposed",
          content: "# R-002",
          author: "agent",
          agentId: "agent-1",
          versions: [],
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
        },
      ],
      selectedReflectionId: null,
    })

    useAgentStore.setState({
      agents: [
        {
          id: "agent-1",
          name: "ψ₁ The Architect",
          archetype: "architect",
          task: "Refactoring",
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

  it("renders the 'New Reflection' button", () => {
    render(<ReflectionsPage />)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(screen.getByText("New Reflection")).toBeInTheDocument()
  })

  it("renders search input", () => {
    render(<ReflectionsPage />)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    const searchInput = screen.getByPlaceholderText("Search reflections...")
    expect(searchInput).toBeInTheDocument()
  })

  it("renders the reflection list", () => {
    render(<ReflectionsPage />)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(screen.getByTestId("reflection-list")).toBeInTheDocument()
  })

  it("shows empty state with 'New Reflection' button when no reflections", () => {
    useReflectionStore.setState({ reflections: [] })
    render(<ReflectionsPage />)
    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(
      screen.getByText(
        "No reflections yet. Agents will propose reflections as they make architectural decisions."
      )
    ).toBeInTheDocument()
    expect(screen.getByText("New Reflection")).toBeInTheDocument()
  })

  it("shows skeleton while loading", () => {
    render(<ReflectionsPage />)
    // Before timer fires, skeleton should be visible
    expect(screen.getByTestId("reflection-skeleton")).toBeInTheDocument()
  })
})
