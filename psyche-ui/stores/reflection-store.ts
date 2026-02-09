import { create } from "zustand"
import type { Reflection } from "@/lib/types"
import { MOCK_REFLECTIONS } from "@/lib/mock-data"

interface ReflectionStore {
  reflections: Reflection[]
  selectedReflectionId: string | null

  addReflection: (data: Omit<Reflection, "id" | "createdAt" | "updatedAt">) => void
  updateReflection: (id: string, partial: Partial<Reflection>) => void
  acceptReflection: (id: string) => void
  supersedeReflection: (id: string, replacedById: string) => void
  setSelectedReflection: (id: string | null) => void
}

export const useReflectionStore = create<ReflectionStore>()((set) => ({
  reflections: MOCK_REFLECTIONS,
  selectedReflectionId: null,

  addReflection: (data) => {
    const reflection: Reflection = {
      ...data,
      id: `reflection-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set((s) => ({ reflections: [...s.reflections, reflection] }))
  },

  updateReflection: (id, partial) => {
    set((s) => ({
      reflections: s.reflections.map((r) =>
        r.id === id ? { ...r, ...partial, updatedAt: new Date() } : r
      ),
    }))
  },

  acceptReflection: (id) => {
    set((s) => ({
      reflections: s.reflections.map((r) =>
        r.id === id ? { ...r, status: "accepted" as const, updatedAt: new Date() } : r
      ),
    }))
  },

  supersedeReflection: (id, replacedById) => {
    set((s) => ({
      reflections: s.reflections.map((r) =>
        r.id === id
          ? { ...r, status: "superseded" as const, supersededBy: replacedById, updatedAt: new Date() }
          : r
      ),
    }))
  },

  setSelectedReflection: (id) => {
    set({ selectedReflectionId: id })
  },
}))
