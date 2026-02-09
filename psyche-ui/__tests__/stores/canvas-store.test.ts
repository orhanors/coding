import { describe, it, expect, beforeEach } from 'vitest'
import { useCanvasStore } from '@/stores/canvas-store'
import { CANVAS_MIN_ZOOM, CANVAS_MAX_ZOOM, CANVAS_DEFAULT_ZOOM } from '@/lib/constants'

const initialState = () => ({
  zoom: CANVAS_DEFAULT_ZOOM,
  pan: { x: 0, y: 0 },
  mode: 'canvas' as const,
  selectedNodeId: null,
  isDragging: false,
  freeformPositions: new Map(),
})

describe('useCanvasStore', () => {
  beforeEach(() => {
    useCanvasStore.setState(initialState())
  })

  // ── Initial state ──────────────────────────

  it('has zoom=1 by default', () => {
    expect(useCanvasStore.getState().zoom).toBe(1)
  })

  it('has pan={0,0} by default', () => {
    expect(useCanvasStore.getState().pan).toEqual({ x: 0, y: 0 })
  })

  it('has mode="canvas" by default', () => {
    expect(useCanvasStore.getState().mode).toBe('canvas')
  })

  it('has selectedNodeId=null by default', () => {
    expect(useCanvasStore.getState().selectedNodeId).toBeNull()
  })

  it('has isDragging=false by default', () => {
    expect(useCanvasStore.getState().isDragging).toBe(false)
  })

  // ── setZoom ────────────────────────────────

  it('setZoom sets zoom to the given value', () => {
    useCanvasStore.getState().setZoom(1.5)
    expect(useCanvasStore.getState().zoom).toBe(1.5)
  })

  it('setZoom clamps to minimum (0.25)', () => {
    useCanvasStore.getState().setZoom(0.1)
    expect(useCanvasStore.getState().zoom).toBe(CANVAS_MIN_ZOOM) // 0.25
  })

  it('setZoom clamps to maximum (2.0)', () => {
    useCanvasStore.getState().setZoom(5.0)
    expect(useCanvasStore.getState().zoom).toBe(CANVAS_MAX_ZOOM) // 2.0
  })

  it('setZoom accepts exact boundary value 0.25', () => {
    useCanvasStore.getState().setZoom(0.25)
    expect(useCanvasStore.getState().zoom).toBe(0.25)
  })

  it('setZoom accepts exact boundary value 2.0', () => {
    useCanvasStore.getState().setZoom(2.0)
    expect(useCanvasStore.getState().zoom).toBe(2.0)
  })

  // ── zoomIn / zoomOut ───────────────────────

  it('zoomIn increments zoom by 0.25', () => {
    useCanvasStore.getState().zoomIn()
    expect(useCanvasStore.getState().zoom).toBe(1.25)
  })

  it('zoomIn clamps at max zoom', () => {
    useCanvasStore.setState({ zoom: CANVAS_MAX_ZOOM })
    useCanvasStore.getState().zoomIn()
    expect(useCanvasStore.getState().zoom).toBe(CANVAS_MAX_ZOOM)
  })

  it('zoomOut decrements zoom by 0.25', () => {
    useCanvasStore.getState().zoomOut()
    expect(useCanvasStore.getState().zoom).toBe(0.75)
  })

  it('zoomOut clamps at min zoom', () => {
    useCanvasStore.setState({ zoom: CANVAS_MIN_ZOOM })
    useCanvasStore.getState().zoomOut()
    expect(useCanvasStore.getState().zoom).toBe(CANVAS_MIN_ZOOM)
  })

  it('multiple zoomIn calls accumulate correctly', () => {
    useCanvasStore.getState().zoomIn()
    useCanvasStore.getState().zoomIn()
    useCanvasStore.getState().zoomIn()
    expect(useCanvasStore.getState().zoom).toBe(1.75)
  })

  // ── setPan ─────────────────────────────────

  it('setPan updates coordinates', () => {
    useCanvasStore.getState().setPan({ x: 100, y: -50 })
    expect(useCanvasStore.getState().pan).toEqual({ x: 100, y: -50 })
  })

  it('setPan accepts negative values', () => {
    useCanvasStore.getState().setPan({ x: -200, y: -300 })
    expect(useCanvasStore.getState().pan).toEqual({ x: -200, y: -300 })
  })

  // ── setMode ────────────────────────────────

  it('setMode switches to constellation', () => {
    useCanvasStore.getState().setMode('constellation')
    expect(useCanvasStore.getState().mode).toBe('constellation')
  })

  it('setMode switches back to canvas', () => {
    useCanvasStore.getState().setMode('constellation')
    useCanvasStore.getState().setMode('canvas')
    expect(useCanvasStore.getState().mode).toBe('canvas')
  })

  // ── setSelectedNode ────────────────────────

  it('setSelectedNode sets a node id', () => {
    useCanvasStore.getState().setSelectedNode('agent-1')
    expect(useCanvasStore.getState().selectedNodeId).toBe('agent-1')
  })

  it('setSelectedNode clears with null', () => {
    useCanvasStore.getState().setSelectedNode('agent-1')
    useCanvasStore.getState().setSelectedNode(null)
    expect(useCanvasStore.getState().selectedNodeId).toBeNull()
  })

  // ── setDragging ────────────────────────────

  it('setDragging toggles isDragging', () => {
    useCanvasStore.getState().setDragging(true)
    expect(useCanvasStore.getState().isDragging).toBe(true)
    useCanvasStore.getState().setDragging(false)
    expect(useCanvasStore.getState().isDragging).toBe(false)
  })

  // ── resetView ──────────────────────────────

  it('resetView returns zoom and pan to defaults', () => {
    useCanvasStore.setState({ zoom: 1.75, pan: { x: 300, y: -150 } })
    useCanvasStore.getState().resetView()
    expect(useCanvasStore.getState().zoom).toBe(CANVAS_DEFAULT_ZOOM)
    expect(useCanvasStore.getState().pan).toEqual({ x: 0, y: 0 })
  })

  // ── saveFreeformPositions ──────────────────

  it('saveFreeformPositions stores a copy of positions map', () => {
    const positions = new Map<string, { x: number; y: number }>([
      ['agent-1', { x: 100, y: 200 }],
      ['agent-2', { x: 300, y: 400 }],
    ])
    useCanvasStore.getState().saveFreeformPositions(positions)

    const saved = useCanvasStore.getState().freeformPositions
    expect(saved.size).toBe(2)
    expect(saved.get('agent-1')).toEqual({ x: 100, y: 200 })
    expect(saved.get('agent-2')).toEqual({ x: 300, y: 400 })
  })

  it('saveFreeformPositions creates a new Map (not reference)', () => {
    const positions = new Map<string, { x: number; y: number }>([
      ['agent-1', { x: 10, y: 20 }],
    ])
    useCanvasStore.getState().saveFreeformPositions(positions)

    // Mutating original should not affect store
    positions.set('agent-1', { x: 999, y: 999 })
    const saved = useCanvasStore.getState().freeformPositions
    expect(saved.get('agent-1')).toEqual({ x: 10, y: 20 })
  })
})
