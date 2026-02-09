import { create } from "zustand"
import type { RiverEntry } from "@/lib/types"
import { MOCK_RIVER_ENTRIES } from "@/lib/mock-data"

interface RiverFilters {
  type?: string
  agentId?: string
  search?: string
}

interface RiverStore {
  entries: RiverEntry[]
  filters: RiverFilters

  addEntry: (entry: RiverEntry) => void
  setFilters: (filters: Partial<RiverFilters>) => void
  clearFilters: () => void
  getFilteredEntries: () => RiverEntry[]
}

export const useRiverStore = create<RiverStore>()((set, get) => ({
  entries: MOCK_RIVER_ENTRIES,
  filters: {},

  addEntry: (entry) => {
    set((s) => ({ entries: [entry, ...s.entries] }))
  },

  setFilters: (filters) => {
    set((s) => ({ filters: { ...s.filters, ...filters } }))
  },

  clearFilters: () => {
    set({ filters: {} })
  },

  getFilteredEntries: () => {
    const { entries, filters } = get()
    return entries.filter((entry) => {
      if (filters.type && entry.type !== filters.type) return false
      if (filters.agentId && entry.agent?.id !== filters.agentId) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (
          !entry.title.toLowerCase().includes(q) &&
          !entry.description.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  },
}))
