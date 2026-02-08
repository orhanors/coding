import { create } from "zustand"
import type { Diff } from "@/lib/types"
import { mockDiffs } from "@/lib/mock-data"

interface DiffStore {
  diffs: Diff[]
  loading: boolean
  addDiff: (diff: Diff) => void
  setDiffs: (diffs: Diff[]) => void
  setLoading: (loading: boolean) => void
}

export const useDiffStore = create<DiffStore>((set) => ({
  diffs: mockDiffs,
  loading: false,

  addDiff: (diff) =>
    set((state) => ({ diffs: [diff, ...state.diffs] })),

  setDiffs: (diffs) => set({ diffs }),

  setLoading: (loading) => set({ loading }),
}))
