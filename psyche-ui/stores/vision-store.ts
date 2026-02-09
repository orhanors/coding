import { create } from "zustand"
import type { Vision } from "@/lib/types"
import { MOCK_VISIONS } from "@/lib/mock-data"

interface VisionStore {
  visions: Vision[]
  selectedVisionId: string | null
  viewMode: "board" | "list"

  addVision: (data: Omit<Vision, "id" | "createdAt" | "updatedAt">) => void
  updateVision: (id: string, partial: Partial<Vision>) => void
  removeVision: (id: string) => void
  moveVisionToStage: (id: string, newStage: Vision["stage"]) => void
  toggleVisionTask: (visionId: string, taskId: string) => void
  setSelectedVision: (id: string | null) => void
  setViewMode: (mode: "board" | "list") => void
}

export const useVisionStore = create<VisionStore>()((set) => ({
  visions: MOCK_VISIONS,
  selectedVisionId: null,
  viewMode: "board",

  addVision: (data) => {
    const vision: Vision = {
      ...data,
      id: `vision-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set((s) => ({ visions: [...s.visions, vision] }))
  },

  updateVision: (id, partial) => {
    set((s) => ({
      visions: s.visions.map((v) =>
        v.id === id ? { ...v, ...partial, updatedAt: new Date() } : v
      ),
    }))
  },

  removeVision: (id) => {
    set((s) => ({
      visions: s.visions.filter((v) => v.id !== id),
      selectedVisionId: s.selectedVisionId === id ? null : s.selectedVisionId,
    }))
  },

  moveVisionToStage: (id, newStage) => {
    set((s) => ({
      visions: s.visions.map((v) =>
        v.id === id ? { ...v, stage: newStage, updatedAt: new Date() } : v
      ),
    }))
  },

  toggleVisionTask: (visionId, taskId) => {
    set((s) => ({
      visions: s.visions.map((v) => {
        if (v.id !== visionId) return v
        const tasks = v.tasks.map((t) =>
          t.id === taskId ? { ...t, implemented: !t.implemented } : t
        )
        const completedTasks = tasks.filter((t) => t.implemented).length
        return { ...v, tasks, completedTasks, updatedAt: new Date() }
      }),
    }))
  },

  setSelectedVision: (id) => {
    set({ selectedVisionId: id })
  },

  setViewMode: (mode) => {
    set({ viewMode: mode })
  },
}))
