import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DiffViewer } from "@/components/diff/diff-viewer"

const oldContent = `line 1
line 2
line 3`

const newContent = `line 1
line 2 modified
line 3
line 4`

describe("DiffViewer", () => {
  it("renders unified mode by default", () => {
    render(<DiffViewer oldContent={oldContent} newContent={newContent} />)
    expect(screen.getByText("Unified")).toBeInTheDocument()
    expect(screen.getByText("Split")).toBeInTheDocument()
  })

  it("shows old and new labels", () => {
    render(<DiffViewer oldContent={oldContent} newContent={newContent} oldLabel="v1" newLabel="v2" />)
    expect(screen.getByText("v1")).toBeInTheDocument()
    expect(screen.getByText("v2")).toBeInTheDocument()
  })

  it("renders diff lines with added/removed markers", () => {
    render(<DiffViewer oldContent={oldContent} newContent={newContent} />)
    expect(screen.getByText("line 2")).toBeInTheDocument()
    expect(screen.getByText("line 2 modified")).toBeInTheDocument()
  })

  it("switches to split mode", async () => {
    const user = userEvent.setup()
    render(<DiffViewer oldContent={oldContent} newContent={newContent} />)
    await user.click(screen.getByText("Split"))
    // Split mode renders with grid layout — "line 1" appears on both sides
    const matches = screen.getAllByText("line 1")
    expect(matches.length).toBe(2)
  })

  it("shows hunk summary when approve/reject callbacks provided", () => {
    const onApprove = vi.fn()
    const onReject = vi.fn()
    render(
      <DiffViewer
        oldContent={oldContent}
        newContent={newContent}
        onApproveHunk={onApprove}
        onRejectHunk={onReject}
      />
    )
    expect(screen.getByText(/0\/1 hunks approved/)).toBeInTheDocument()
  })

  it("shows Approve All button when callbacks provided", () => {
    render(
      <DiffViewer
        oldContent={oldContent}
        newContent={newContent}
        onApproveHunk={vi.fn()}
        onRejectHunk={vi.fn()}
      />
    )
    expect(screen.getByText("Approve All")).toBeInTheDocument()
  })
})
