import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DiffCard } from "@/components/diff/diff-card"
import type { Diff } from "@/lib/types"

const baseDiff: Diff = {
  id: "d1",
  projectId: "proj-1",
  type: "adr",
  documentName: "ADR-001",
  description: "Initial architecture",
  timestamp: new Date("2026-02-08T10:00:00"),
  author: "agent",
  stats: { linesAdded: 10, linesRemoved: 3 },
  hunks: [
    {
      oldStart: 1,
      oldCount: 3,
      newStart: 1,
      newCount: 5,
      lines: [
        { type: "context", content: "line 1", lineNumber: 1 },
        { type: "removed", content: "old line", lineNumber: 2 },
        { type: "added", content: "new line", lineNumber: 2 },
        { type: "context", content: "line 3", lineNumber: 3 },
      ],
    },
  ],
}

describe("DiffCard", () => {
  it("renders document name and author", () => {
    render(<DiffCard diff={baseDiff} />)
    expect(screen.getByText("ADR-001")).toBeInTheDocument()
    expect(screen.getByText("by agent")).toBeInTheDocument()
  })

  it("renders diff stats", () => {
    render(<DiffCard diff={baseDiff} />)
    expect(screen.getByText("+10")).toBeInTheDocument()
    expect(screen.getByText("−3")).toBeInTheDocument()
  })

  it("is collapsed by default", () => {
    render(<DiffCard diff={baseDiff} />)
    expect(screen.queryByText("old line")).not.toBeInTheDocument()
  })

  it("expands when clicked", async () => {
    const user = userEvent.setup()
    render(<DiffCard diff={baseDiff} />)
    await user.click(screen.getByRole("button"))
    expect(screen.getByText("old line")).toBeInTheDocument()
    expect(screen.getByText("new line")).toBeInTheDocument()
  })

  it("renders expanded by default when defaultExpanded is true", () => {
    render(<DiffCard diff={baseDiff} defaultExpanded />)
    expect(screen.getByText("old line")).toBeInTheDocument()
  })
})
