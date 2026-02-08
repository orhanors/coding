import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ProjectCard } from "@/components/project/project-card"
import type { Project } from "@/lib/types"

const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
}))

const baseProject: Project = {
  id: "test-proj",
  name: "test-proj",
  adrCount: 3,
  prdCount: 2,
  lastDiffAt: new Date("2026-02-08T10:00:00"),
  agentStatus: "idle",
  createdAt: new Date("2026-01-01T00:00:00"),
}

describe("ProjectCard", () => {
  it("renders project name", () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByText("test-proj")).toBeInTheDocument()
  })

  it("renders ADR and PRD counts", () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByText(/3 ADRs · 2 PRDs/)).toBeInTheDocument()
  })

  it("shows singular when count is 1", () => {
    const proj = { ...baseProject, adrCount: 1, prdCount: 1 }
    render(<ProjectCard project={proj} />)
    expect(screen.getByText(/1 ADR · 1 PRD/)).toBeInTheDocument()
  })

  it("shows 'Idle' for idle agent status", () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByText("Idle")).toBeInTheDocument()
  })

  it("shows 'Agent working' for active agent status", () => {
    const activeProject = { ...baseProject, agentStatus: "active" as const }
    render(<ProjectCard project={activeProject} />)
    expect(screen.getByText("Agent working")).toBeInTheDocument()
  })

  it("navigates to project page on click", async () => {
    const user = userEvent.setup()
    render(<ProjectCard project={baseProject} />)
    await user.click(screen.getByRole("button"))
    expect(mockPush).toHaveBeenCalledWith("/projects/test-proj")
  })
})
