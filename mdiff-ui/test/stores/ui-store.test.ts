import { describe, it, expect, beforeEach } from "vitest"
import { useUIStore } from "@/stores/ui-store"

describe("UIStore", () => {
  beforeEach(() => {
    useUIStore.setState({
      agentOverlayOpen: false,
      agentOverlayMinimized: false,
      commandPaletteOpen: false,
      theme: "dark",
    })
  })

  it("has correct initial state", () => {
    const state = useUIStore.getState()
    expect(state.agentOverlayOpen).toBe(false)
    expect(state.agentOverlayMinimized).toBe(false)
    expect(state.commandPaletteOpen).toBe(false)
    expect(state.theme).toBe("dark")
  })

  it("toggles agent overlay", () => {
    useUIStore.getState().toggleAgentOverlay()
    expect(useUIStore.getState().agentOverlayOpen).toBe(true)
    useUIStore.getState().toggleAgentOverlay()
    expect(useUIStore.getState().agentOverlayOpen).toBe(false)
  })

  it("resets minimized state when toggling overlay", () => {
    useUIStore.setState({ agentOverlayMinimized: true })
    useUIStore.getState().toggleAgentOverlay()
    expect(useUIStore.getState().agentOverlayMinimized).toBe(false)
  })

  it("toggles agent overlay minimized", () => {
    useUIStore.getState().minimizeAgentOverlay()
    expect(useUIStore.getState().agentOverlayMinimized).toBe(true)
    useUIStore.getState().minimizeAgentOverlay()
    expect(useUIStore.getState().agentOverlayMinimized).toBe(false)
  })

  it("toggles command palette", () => {
    useUIStore.getState().toggleCommandPalette()
    expect(useUIStore.getState().commandPaletteOpen).toBe(true)
    useUIStore.getState().toggleCommandPalette()
    expect(useUIStore.getState().commandPaletteOpen).toBe(false)
  })

  it("sets theme", () => {
    useUIStore.getState().setTheme("light")
    expect(useUIStore.getState().theme).toBe("light")
    useUIStore.getState().setTheme("dark")
    expect(useUIStore.getState().theme).toBe("dark")
  })
})
