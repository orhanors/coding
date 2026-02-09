import { describe, it, expect, beforeEach } from 'vitest'
import { useReflectionStore } from '@/stores/reflection-store'
import { MOCK_REFLECTIONS } from '@/lib/mock-data'
import type { Reflection } from '@/lib/types'

const initialState = () => ({
  reflections: MOCK_REFLECTIONS,
  selectedReflectionId: null,
})

describe('useReflectionStore', () => {
  beforeEach(() => {
    useReflectionStore.setState(initialState())
  })

  // ── Initial state ──────────────────────────

  it('has mock reflections as initial state', () => {
    const { reflections } = useReflectionStore.getState()
    expect(reflections).toHaveLength(MOCK_REFLECTIONS.length) // 4
    expect(reflections[0].title).toBe('Use cookie-based sessions')
    expect(reflections[0].status).toBe('superseded')
  })

  it('has no selected reflection by default', () => {
    expect(useReflectionStore.getState().selectedReflectionId).toBeNull()
  })

  // ── addReflection ──────────────────────────

  it('addReflection creates with generated id and timestamps', () => {
    const data: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'> = {
      number: 5,
      title: 'New Reflection',
      status: 'proposed',
      content: '# R-005: New Reflection',
      author: 'human',
      versions: [],
    }
    useReflectionStore.getState().addReflection(data)

    const { reflections } = useReflectionStore.getState()
    expect(reflections).toHaveLength(MOCK_REFLECTIONS.length + 1)

    const created = reflections[reflections.length - 1]
    expect(created.id).toMatch(/^reflection-\d+$/)
    expect(created.title).toBe('New Reflection')
    expect(created.status).toBe('proposed')
    expect(created.createdAt).toBeInstanceOf(Date)
    expect(created.updatedAt).toBeInstanceOf(Date)
  })

  it('addReflection defaults status to proposed when provided as such', () => {
    useReflectionStore.getState().addReflection({
      number: 6,
      title: 'Another Proposed',
      status: 'proposed',
      content: 'Content',
      author: 'agent',
      agentId: 'agent-1',
      versions: [],
    })
    const created = useReflectionStore.getState().reflections.at(-1)!
    expect(created.status).toBe('proposed')
  })

  // ── acceptReflection ───────────────────────

  it('acceptReflection changes status to accepted', () => {
    // reflection-4 is "proposed"
    useReflectionStore.getState().acceptReflection('reflection-4')
    const reflection = useReflectionStore.getState().reflections.find((r) => r.id === 'reflection-4')!
    expect(reflection.status).toBe('accepted')
  })

  it('acceptReflection updates updatedAt', () => {
    const before = new Date()
    useReflectionStore.getState().acceptReflection('reflection-4')
    const reflection = useReflectionStore.getState().reflections.find((r) => r.id === 'reflection-4')!
    expect(reflection.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
  })

  it('accepting an already-accepted reflection still sets status to accepted (no-op-like)', () => {
    // reflection-2 is already "accepted"
    const beforeUpdatedAt = useReflectionStore.getState().reflections.find((r) => r.id === 'reflection-2')!.updatedAt
    useReflectionStore.getState().acceptReflection('reflection-2')
    const reflection = useReflectionStore.getState().reflections.find((r) => r.id === 'reflection-2')!
    expect(reflection.status).toBe('accepted')
    // updatedAt will be refreshed, which is fine — the status remains accepted
    expect(reflection.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdatedAt.getTime())
  })

  // ── supersedeReflection ────────────────────

  it('supersedeReflection sets supersededBy and status to superseded', () => {
    useReflectionStore.getState().supersedeReflection('reflection-4', 'reflection-99')
    const reflection = useReflectionStore.getState().reflections.find((r) => r.id === 'reflection-4')!
    expect(reflection.status).toBe('superseded')
    expect(reflection.supersededBy).toBe('reflection-99')
  })

  it('supersedeReflection updates updatedAt', () => {
    const before = new Date()
    useReflectionStore.getState().supersedeReflection('reflection-4', 'reflection-99')
    const reflection = useReflectionStore.getState().reflections.find((r) => r.id === 'reflection-4')!
    expect(reflection.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
  })

  // ── setSelectedReflection ──────────────────

  it('setSelectedReflection sets an id', () => {
    useReflectionStore.getState().setSelectedReflection('reflection-3')
    expect(useReflectionStore.getState().selectedReflectionId).toBe('reflection-3')
  })

  it('setSelectedReflection clears with null', () => {
    useReflectionStore.getState().setSelectedReflection('reflection-3')
    useReflectionStore.getState().setSelectedReflection(null)
    expect(useReflectionStore.getState().selectedReflectionId).toBeNull()
  })

  // ── updateReflection ───────────────────────

  it('updateReflection merges partial data', () => {
    useReflectionStore.getState().updateReflection('reflection-2', { title: 'Updated Title' })
    const reflection = useReflectionStore.getState().reflections.find((r) => r.id === 'reflection-2')!
    expect(reflection.title).toBe('Updated Title')
    // Status should remain unchanged
    expect(reflection.status).toBe('accepted')
  })
})
