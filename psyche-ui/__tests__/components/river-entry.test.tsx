import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { RiverEntryItem } from "@/components/river/river-entry"
import type { RiverEntry } from "@/lib/types"

// Mock date-fns to avoid flaky relative time assertions
vi.mock("date-fns", () => ({
  formatDistanceToNow: () => "12 minutes ago",
}))

// Mock child components that are not relevant for this test
vi.mock("@/components/diff/diff-stats", () => ({
  DiffStatsBadge: ({ stats }: { stats: unknown }) => (
    <span data-testid="diff-stats-badge">stats</span>
  ),
}))

vi.mock("@/components/diff/diff-preview", () => ({
  DiffPreview: () => <div data-testid="diff-preview">preview</div>,
}))

vi.mock("@/components/river/diagram-thumbnail", () => ({
  DiagramThumbnail: () => <div data-testid="diagram-thumbnail">diagram</div>,
}))

function createMockEntry(overrides: Partial<RiverEntry> = {}): RiverEntry {
  return {
    id: "river-1",
    type: "vision",
    title: "Vision 'Auth Redesign' updated",
    description: "Completed 3 of 4 Phase 1 tasks",
    agent: { id: "agent-1", name: "The Architect", archetype: "architect" },
    timestamp: new Date("2025-01-01"),
    ...overrides,
  }
}

describe("RiverEntryItem", () => {
  it("renders correct icon character for 'vision' type", () => {
    render(<RiverEntryItem entry={createMockEntry({ type: "vision" })} />)
    // RIVER_ENTRY_TYPES.vision.icon = "◆"
    expect(screen.getByText("◆")).toBeInTheDocument()
  })

  it("renders correct icon character for 'reflection' type", () => {
    render(<RiverEntryItem entry={createMockEntry({ type: "reflection" })} />)
    expect(screen.getByText("◇")).toBeInTheDocument()
  })

  it("renders correct icon character for 'diagram' type", () => {
    render(
      <RiverEntryItem
        entry={createMockEntry({
          type: "diagram",
          stats: { nodesAdded: 4, edgesAdded: 3 },
        })}
      />
    )
    expect(screen.getByText("◈")).toBeInTheDocument()
  })

  it("renders correct icon character for 'code' type", () => {
    render(
      <RiverEntryItem
        entry={createMockEntry({
          type: "code",
          stats: { linesAdded: 47, linesRemoved: 12 },
          diffHunks: [],
        })}
      />
    )
    expect(screen.getByText("●")).toBeInTheDocument()
  })

  it("renders correct icon character for 'status' type", () => {
    render(
      <RiverEntryItem
        entry={createMockEntry({ type: "status", agent: undefined })}
      />
    )
    expect(screen.getByText("○")).toBeInTheDocument()
  })

  it("renders correct icon character for 'agent' type", () => {
    render(<RiverEntryItem entry={createMockEntry({ type: "agent" })} />)
    expect(screen.getByText("★")).toBeInTheDocument()
  })

  it("shows title text", () => {
    render(<RiverEntryItem entry={createMockEntry()} />)
    expect(
      screen.getByText("Vision 'Auth Redesign' updated")
    ).toBeInTheDocument()
  })

  it("shows agent attribution when agent data is present", () => {
    render(<RiverEntryItem entry={createMockEntry()} />)
    // The component renders "ψ {agent.name}" so it shows "ψ The Architect"
    expect(screen.getByText(/ψ The Architect/)).toBeInTheDocument()
  })

  it("does not show agent attribution when no agent data", () => {
    render(
      <RiverEntryItem
        entry={createMockEntry({ agent: undefined })}
      />
    )
    expect(screen.queryByText(/ψ/)).not.toBeInTheDocument()
  })

  it("shows relative timestamp", () => {
    render(<RiverEntryItem entry={createMockEntry()} />)
    expect(screen.getByText("12 minutes ago")).toBeInTheDocument()
  })

  it("shows description text", () => {
    render(<RiverEntryItem entry={createMockEntry()} />)
    expect(
      screen.getByText("Completed 3 of 4 Phase 1 tasks")
    ).toBeInTheDocument()
  })
})
