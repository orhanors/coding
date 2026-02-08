import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { StatusStrip } from "@/components/layout/status-strip"

describe("StatusStrip", () => {
  it("shows 'Idle' when agent is not active", () => {
    render(<StatusStrip />)
    expect(screen.getByText("Idle")).toBeInTheDocument()
  })

  it("shows agent message when active", () => {
    render(<StatusStrip agentActive agentMessage="Analyzing ADR-001" />)
    expect(screen.getByText("Analyzing ADR-001")).toBeInTheDocument()
  })

  it("shows 'Agent active' when active with no message", () => {
    render(<StatusStrip agentActive />)
    expect(screen.getByText("Agent active")).toBeInTheDocument()
  })

  it("shows pending diffs count", () => {
    render(<StatusStrip agentActive pendingDiffs={3} />)
    expect(screen.getByText(/3 diffs pending/)).toBeInTheDocument()
  })

  it("shows singular diff when count is 1", () => {
    render(<StatusStrip agentActive pendingDiffs={1} />)
    expect(screen.getByText(/1 diff pending/)).toBeInTheDocument()
  })

  it("shows version", () => {
    render(<StatusStrip />)
    expect(screen.getByText("mdiff v0.1")).toBeInTheDocument()
  })

  it("calls onAgentClick when clicked", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<StatusStrip onAgentClick={onClick} />)
    await user.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("has aria-live polite for accessibility", () => {
    const { container } = render(<StatusStrip />)
    expect(container.querySelector("[aria-live='polite']")).toBeInTheDocument()
  })
})
