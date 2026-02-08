import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MdiffTopBar } from "@/components/layout/mdiff-top-bar"

describe("MdiffTopBar", () => {
  it("renders the mdiff wordmark", () => {
    render(<MdiffTopBar />)
    expect(screen.getByText("mdiff")).toBeInTheDocument()
  })

  it("renders navigation items", () => {
    render(<MdiffTopBar />)
    expect(screen.getByText("Projects")).toBeInTheDocument()
    expect(screen.getByText("Timeline")).toBeInTheDocument()
    expect(screen.getByText("Integrations")).toBeInTheDocument()
  })

  it("renders theme toggle button", () => {
    render(<MdiffTopBar />)
    expect(screen.getByLabelText("Toggle theme")).toBeInTheDocument()
  })

  it("renders command palette button", () => {
    render(<MdiffTopBar />)
    expect(screen.getByLabelText("Open command palette")).toBeInTheDocument()
  })

  it("renders notification bell", () => {
    render(<MdiffTopBar />)
    expect(screen.getByLabelText("Notifications")).toBeInTheDocument()
  })

  it("shows notification count when > 0", () => {
    render(<MdiffTopBar notificationCount={5} />)
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByLabelText("Notifications, 5 unread")).toBeInTheDocument()
  })

  it("calls onCommandPalette when ⌘K button clicked", async () => {
    const onCmd = vi.fn()
    const user = userEvent.setup()
    render(<MdiffTopBar onCommandPalette={onCmd} />)
    await user.click(screen.getByLabelText("Open command palette"))
    expect(onCmd).toHaveBeenCalledOnce()
  })

  it("calls onNotificationClick when bell clicked", async () => {
    const onNotify = vi.fn()
    const user = userEvent.setup()
    render(<MdiffTopBar onNotificationClick={onNotify} />)
    await user.click(screen.getByLabelText("Notifications"))
    expect(onNotify).toHaveBeenCalledOnce()
  })
})
