import { create } from "zustand"
import type { Project } from "@/lib/types"
import { mockProjects } from "@/lib/mock-data"

interface ProjectStore {
  projects: Project[]
  selectedProjectId: string | null
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  setSelectedProject: (id: string | null) => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: mockProjects,
  selectedProjectId: null,

  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),

  removeProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  setSelectedProject: (id) => set({ selectedProjectId: id }),
}))
