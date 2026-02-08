import { describe, it, expect, beforeEach } from "vitest"
import { useProjectStore } from "@/stores/project-store"
import type { Project } from "@/lib/types"

const testProject: Project = {
  id: "new-proj",
  name: "new-proj",
  adrCount: 0,
  prdCount: 0,
  lastDiffAt: new Date(),
  agentStatus: "idle",
  createdAt: new Date(),
}

describe("ProjectStore", () => {
  beforeEach(() => {
    // Reset to default state (with mock data)
    const state = useProjectStore.getState()
    useProjectStore.setState({
      projects: state.projects.filter((p) => p.id !== "new-proj"),
      selectedProjectId: null,
    })
  })

  it("has initial projects from mock data", () => {
    const { projects } = useProjectStore.getState()
    expect(projects.length).toBeGreaterThan(0)
  })

  it("adds a project", () => {
    useProjectStore.getState().addProject(testProject)
    const { projects } = useProjectStore.getState()
    expect(projects.find((p) => p.id === "new-proj")).toBeDefined()
  })

  it("removes a project", () => {
    useProjectStore.getState().addProject(testProject)
    useProjectStore.getState().removeProject("new-proj")
    const { projects } = useProjectStore.getState()
    expect(projects.find((p) => p.id === "new-proj")).toBeUndefined()
  })

  it("updates a project", () => {
    useProjectStore.getState().addProject(testProject)
    useProjectStore.getState().updateProject("new-proj", { adrCount: 5 })
    const { projects } = useProjectStore.getState()
    const updated = projects.find((p) => p.id === "new-proj")
    expect(updated?.adrCount).toBe(5)
  })

  it("sets selected project", () => {
    useProjectStore.getState().setSelectedProject("payments-api")
    expect(useProjectStore.getState().selectedProjectId).toBe("payments-api")
  })

  it("clears selected project", () => {
    useProjectStore.getState().setSelectedProject("payments-api")
    useProjectStore.getState().setSelectedProject(null)
    expect(useProjectStore.getState().selectedProjectId).toBeNull()
  })
})
