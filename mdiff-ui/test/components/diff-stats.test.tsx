import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { DiffStats } from "@/components/diff/diff-stats"

describe("DiffStats", () => {
  it("renders line additions and removals", () => {
    render(<DiffStats stats={{ linesAdded: 10, linesRemoved: 3 }} />)
    expect(screen.getByText("+10")).toBeInTheDocument()
    expect(screen.getByText("−3")).toBeInTheDocument()
  })

  it("renders 'no changes' when both are zero", () => {
    render(<DiffStats stats={{ linesAdded: 0, linesRemoved: 0 }} />)
    expect(screen.getByText("no changes")).toBeInTheDocument()
  })

  it("renders excalidraw stats with nodes", () => {
    render(<DiffStats stats={{ nodesAdded: 3, nodesRemoved: 1 }} />)
    expect(screen.getByText("+3 nodes")).toBeInTheDocument()
    expect(screen.getByText("−1 node")).toBeInTheDocument()
  })

  it("renders excalidraw stats with edges", () => {
    render(<DiffStats stats={{ nodesAdded: 0, edgesAdded: 2 }} />)
    expect(screen.getByText("+2 edges")).toBeInTheDocument()
  })

  it("only shows additions if no removals", () => {
    render(<DiffStats stats={{ linesAdded: 5, linesRemoved: 0 }} />)
    expect(screen.getByText("+5")).toBeInTheDocument()
    expect(screen.queryByText(/−/)).not.toBeInTheDocument()
  })
})
