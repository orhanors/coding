import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '@/stores/ui-store'

const initialState = () => ({
  agentOverlayOpen: false,
  agentOverlayAgentId: null,
  commandPaletteOpen: false,
})

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState(initialState())
  })

  // ── Initial state ──────────────────────────

  it('has agentOverlayOpen=false by default', () => {
    expect(useUIStore.getState().agentOverlayOpen).toBe(false)
  })

  it('has agentOverlayAgentId=null by default', () => {
    expect(useUIStore.getState().agentOverlayAgentId).toBeNull()
  })

  it('has commandPaletteOpen=false by default', () => {
    expect(useUIStore.getState().commandPaletteOpen).toBe(false)
  })

  // ── toggleAgentOverlay ─────────────────────

  it('toggleAgentOverlay opens with agentId', () => {
    useUIStore.getState().toggleAgentOverlay('agent-1')
    const state = useUIStore.getState()
    expect(state.agentOverlayOpen).toBe(true)
    expect(state.agentOverlayAgentId).toBe('agent-1')
  })

  it('toggleAgentOverlay toggle again with same agentId closes it', () => {
    useUIStore.getState().toggleAgentOverlay('agent-1')
    useUIStore.getState().toggleAgentOverlay('agent-1')
    const state = useUIStore.getState()
    expect(state.agentOverlayOpen).toBe(false)
    expect(state.agentOverlayAgentId).toBeNull()
  })

  it('toggleAgentOverlay with different agentId switches to new agent', () => {
    useUIStore.getState().toggleAgentOverlay('agent-1')
    useUIStore.getState().toggleAgentOverlay('agent-2')
    const state = useUIStore.getState()
    expect(state.agentOverlayOpen).toBe(true)
    expect(state.agentOverlayAgentId).toBe('agent-2')
  })

  it('toggleAgentOverlay without agentId opens with null agentId', () => {
    useUIStore.getState().toggleAgentOverlay()
    const state = useUIStore.getState()
    expect(state.agentOverlayOpen).toBe(true)
    expect(state.agentOverlayAgentId).toBeNull()
  })

  it('toggleAgentOverlay without agentId when already open with null closes it', () => {
    useUIStore.getState().toggleAgentOverlay()
    useUIStore.getState().toggleAgentOverlay()
    const state = useUIStore.getState()
    expect(state.agentOverlayOpen).toBe(false)
    expect(state.agentOverlayAgentId).toBeNull()
  })

  // ── toggleCommandPalette ───────────────────

  it('toggleCommandPalette toggles from false to true', () => {
    useUIStore.getState().toggleCommandPalette()
    expect(useUIStore.getState().commandPaletteOpen).toBe(true)
  })

  it('toggleCommandPalette toggles from true to false', () => {
    useUIStore.getState().toggleCommandPalette()
    useUIStore.getState().toggleCommandPalette()
    expect(useUIStore.getState().commandPaletteOpen).toBe(false)
  })

  // ── closeAll ───────────────────────────────

  it('closeAll closes everything', () => {
    // Open multiple things
    useUIStore.getState().toggleAgentOverlay('agent-1')
    useUIStore.getState().toggleCommandPalette()

    // Verify they are open
    expect(useUIStore.getState().agentOverlayOpen).toBe(true)
    expect(useUIStore.getState().commandPaletteOpen).toBe(true)

    // Close all
    useUIStore.getState().closeAll()
    const state = useUIStore.getState()
    expect(state.agentOverlayOpen).toBe(false)
    expect(state.agentOverlayAgentId).toBeNull()
    expect(state.commandPaletteOpen).toBe(false)
  })

  it('closeAll is safe to call when everything is already closed', () => {
    useUIStore.getState().closeAll()
    const state = useUIStore.getState()
    expect(state.agentOverlayOpen).toBe(false)
    expect(state.agentOverlayAgentId).toBeNull()
    expect(state.commandPaletteOpen).toBe(false)
  })
})
