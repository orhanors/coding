import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { useAgentStore } from "@/stores/agent-store"
import { useCanvasStore } from "@/stores/canvas-store"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock the complex canvas sub-components that are not the focus of this integration test
vi.mock("@/components/canvas/infinite-canvas", () => ({
  InfiniteCanvas: ({
    children,
    isEmpty,
  }: {
    children: React.ReactNode
    isEmpty?: boolean
    onCanvasClick?: (pos: { x: number; y: number }) => void
  }) => (
    <div data-testid="infinite-canvas">
      {isEmpty && <p>Click anywhere to create your first agent</p>}
      {children}
    </div>
  ),
}))

vi.mock("@/components/canvas/connection-line", () => ({
  ConnectionLines: () => <div data-testid="connection-lines" />,
}))

vi.mock("@/components/canvas/agent-config-panel", () => ({
  AgentConfigPanel: () => <div data-testid="agent-config-panel" />,
}))

vi.mock("@/components/canvas/canvas-toolbar", () => ({
  CanvasToolbar: () => <div data-testid="canvas-toolbar" />,
}))

vi.mock("@/components/canvas/constellation-layout", () => ({
  calculateConstellationLayout: () => new Map(),
}))

// Mock date-fns for AgentNode
vi.mock("date-fns", () => ({
  formatDistanceToNow: () => "5 minutes ago",
}))

// Import page after mocks
import CanvasPage from "@/app/canvas/page"

describe("Canvas Page Integration", () => {
  beforeEach(() => {
    // Reset stores with mock agent data
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
          outputFeeds: ["agent-2"],
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
          events: [],
        },
        {
          id: "agent-2",
          name: "ψ₂ The Guardian",
          archetype: "guardian",
          task: "Awaiting auth module tests",
          status: "idle",
          autonomy: 2,
          position: { x: 200, y: 350 },
          dependsOn: ["agent-1"],
          outputFeeds: [],
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-02"),
          events: [],
        },
      ],
      connections: [
        { id: "conn-1", sourceId: "agent-1", targetId: "agent-2", isActive: true },
      ],
      configPanelOpen: false,
      configPanelAgentId: null,
    })
    useCanvasStore.setState({
      zoom: 1,
      pan: { x: 0, y: 0 },
      mode: "canvas",
      selectedNodeId: null,
      isDragging: false,
      freeformPositions: new Map(),
    })
  })

  it("renders the infinite canvas", () => {
    render(<CanvasPage />)
    expect(screen.getByTestId("infinite-canvas")).toBeInTheDocument()
  })

  it("renders agent nodes with mock agent names", () => {
    render(<CanvasPage />)
    expect(screen.getByText("ψ₁ The Architect")).toBeInTheDocument()
    expect(screen.getByText("ψ₂ The Guardian")).toBeInTheDocument()
  })

  it("renders the canvas toolbar", () => {
    render(<CanvasPage />)
    expect(screen.getByTestId("canvas-toolbar")).toBeInTheDocument()
  })

  it("renders the agent config panel", () => {
    render(<CanvasPage />)
    expect(screen.getByTestId("agent-config-panel")).toBeInTheDocument()
  })

  it("renders connection lines component", () => {
    render(<CanvasPage />)
    expect(screen.getByTestId("connection-lines")).toBeInTheDocument()
  })

  it("shows agent tasks", () => {
    render(<CanvasPage />)
    expect(screen.getByText("Refactoring auth module")).toBeInTheDocument()
    expect(screen.getByText("Awaiting auth module tests")).toBeInTheDocument()
  })
})
