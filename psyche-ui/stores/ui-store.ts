import { create } from "zustand"

interface UIStore {
  agentOverlayOpen: boolean
  agentOverlayAgentId: string | null
  commandPaletteOpen: boolean

  toggleAgentOverlay: (agentId?: string) => void
  toggleCommandPalette: () => void
  closeAll: () => void
}

export const useUIStore = create<UIStore>()((set, get) => ({
  agentOverlayOpen: false,
  agentOverlayAgentId: null,
  commandPaletteOpen: false,

  toggleAgentOverlay: (agentId) => {
    const { agentOverlayOpen, agentOverlayAgentId } = get()
    if (agentOverlayOpen && agentOverlayAgentId === (agentId ?? null)) {
      set({ agentOverlayOpen: false, agentOverlayAgentId: null })
    } else {
      set({ agentOverlayOpen: true, agentOverlayAgentId: agentId ?? null })
    }
  },

  toggleCommandPalette: () => {
    set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen }))
  },

  closeAll: () => {
    set({
      agentOverlayOpen: false,
      agentOverlayAgentId: null,
      commandPaletteOpen: false,
    })
  },
}))
