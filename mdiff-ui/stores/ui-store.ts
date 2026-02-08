import { create } from "zustand"

interface UIStore {
  agentOverlayOpen: boolean
  agentOverlayMinimized: boolean
  commandPaletteOpen: boolean
  theme: "dark" | "light"
  toggleAgentOverlay: () => void
  minimizeAgentOverlay: () => void
  toggleCommandPalette: () => void
  setTheme: (theme: "dark" | "light") => void
}

export const useUIStore = create<UIStore>((set) => ({
  agentOverlayOpen: false,
  agentOverlayMinimized: false,
  commandPaletteOpen: false,
  theme: "dark",

  toggleAgentOverlay: () =>
    set((state) => ({
      agentOverlayOpen: !state.agentOverlayOpen,
      agentOverlayMinimized: false,
    })),

  minimizeAgentOverlay: () =>
    set((state) => ({
      agentOverlayMinimized: !state.agentOverlayMinimized,
    })),

  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  setTheme: (theme) => set({ theme }),
}))
