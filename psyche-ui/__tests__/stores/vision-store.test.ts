import { describe, it, expect, beforeEach } from 'vitest'
import { useVisionStore } from '@/stores/vision-store'
import { MOCK_VISIONS } from '@/lib/mock-data'
import type { Vision } from '@/lib/types'

const initialState = () => ({
  visions: MOCK_VISIONS,
  selectedVisionId: null,
  viewMode: 'board' as const,
})

describe('useVisionStore', () => {
  beforeEach(() => {
    useVisionStore.setState(initialState())
  })

  // ── Initial state ──────────────────────────

  it('has mock visions as initial state', () => {
    const { visions } = useVisionStore.getState()
    expect(visions).toHaveLength(MOCK_VISIONS.length) // 5
    expect(visions[0].title).toBe('Auth Redesign')
  })

  it('has viewMode "board" by default', () => {
    expect(useVisionStore.getState().viewMode).toBe('board')
  })

  it('has no selected vision by default', () => {
    expect(useVisionStore.getState().selectedVisionId).toBeNull()
  })

  // ── addVision ──────────────────────────────

  it('addVision creates a vision with generated id and timestamps', () => {
    const newVisionData: Omit<Vision, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'New Feature',
      overview: 'A new feature overview',
      stage: 'backlog',
      priority: 'medium',
      tasks: [],
      totalTasks: 0,
      completedTasks: 0,
      changeHistory: [],
    }

    useVisionStore.getState().addVision(newVisionData)
    const { visions } = useVisionStore.getState()
    expect(visions).toHaveLength(MOCK_VISIONS.length + 1)

    const created = visions[visions.length - 1]
    expect(created.id).toMatch(/^vision-\d+$/)
    expect(created.title).toBe('New Feature')
    expect(created.stage).toBe('backlog')
    expect(created.createdAt).toBeInstanceOf(Date)
    expect(created.updatedAt).toBeInstanceOf(Date)
  })

  it('addVision defaults stage to backlog when provided', () => {
    useVisionStore.getState().addVision({
      title: 'Backlog Vision',
      overview: 'Test',
      stage: 'backlog',
      priority: 'low',
      tasks: [],
      totalTasks: 0,
      completedTasks: 0,
      changeHistory: [],
    })
    const created = useVisionStore.getState().visions.at(-1)!
    expect(created.stage).toBe('backlog')
  })

  // ── moveVisionToStage ──────────────────────

  it('moveVisionToStage updates the stage correctly', () => {
    useVisionStore.getState().moveVisionToStage('vision-5', 'in_progress')
    const vision = useVisionStore.getState().visions.find((v) => v.id === 'vision-5')!
    expect(vision.stage).toBe('in_progress')
  })

  it('moveVisionToStage updates updatedAt', () => {
    const before = new Date()
    useVisionStore.getState().moveVisionToStage('vision-5', 'review')
    const vision = useVisionStore.getState().visions.find((v) => v.id === 'vision-5')!
    expect(vision.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
  })

  it('moveVisionToStage can move from in_progress to done', () => {
    useVisionStore.getState().moveVisionToStage('vision-1', 'done')
    const vision = useVisionStore.getState().visions.find((v) => v.id === 'vision-1')!
    expect(vision.stage).toBe('done')
  })

  // ── toggleVisionTask ───────────────────────

  it('toggleVisionTask flips implemented and updates completedTasks count', () => {
    // vision-1 has tasks: vt-1, vt-2, vt-3 are implemented=true, vt-4 is false
    // Initial completedTasks = 3
    const visionBefore = useVisionStore.getState().visions.find((v) => v.id === 'vision-1')!
    expect(visionBefore.completedTasks).toBe(3)

    // Toggle vt-4 to implemented (false -> true)
    useVisionStore.getState().toggleVisionTask('vision-1', 'vt-4')
    const visionAfter = useVisionStore.getState().visions.find((v) => v.id === 'vision-1')!
    const task4 = visionAfter.tasks.find((t) => t.id === 'vt-4')!
    expect(task4.implemented).toBe(true)
    expect(visionAfter.completedTasks).toBe(4)
  })

  it('toggleVisionTask can un-implement a task', () => {
    // Toggle vt-1 from implemented=true to false
    useVisionStore.getState().toggleVisionTask('vision-1', 'vt-1')
    const vision = useVisionStore.getState().visions.find((v) => v.id === 'vision-1')!
    const task1 = vision.tasks.find((t) => t.id === 'vt-1')!
    expect(task1.implemented).toBe(false)
    expect(vision.completedTasks).toBe(2) // was 3, now 2
  })

  it('toggleVisionTask updates updatedAt', () => {
    const before = new Date()
    useVisionStore.getState().toggleVisionTask('vision-1', 'vt-1')
    const vision = useVisionStore.getState().visions.find((v) => v.id === 'vision-1')!
    expect(vision.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
  })

  // ── setViewMode ────────────────────────────

  it('setViewMode toggles to list', () => {
    useVisionStore.getState().setViewMode('list')
    expect(useVisionStore.getState().viewMode).toBe('list')
  })

  it('setViewMode toggles back to board', () => {
    useVisionStore.getState().setViewMode('list')
    useVisionStore.getState().setViewMode('board')
    expect(useVisionStore.getState().viewMode).toBe('board')
  })

  // ── removeVision ───────────────────────────

  it('removeVision removes from the array', () => {
    useVisionStore.getState().removeVision('vision-3')
    const { visions } = useVisionStore.getState()
    expect(visions.find((v) => v.id === 'vision-3')).toBeUndefined()
    expect(visions).toHaveLength(MOCK_VISIONS.length - 1)
  })

  it('removeVision clears selectedVisionId if removed vision was selected', () => {
    useVisionStore.setState({ selectedVisionId: 'vision-3' })
    useVisionStore.getState().removeVision('vision-3')
    expect(useVisionStore.getState().selectedVisionId).toBeNull()
  })

  it('removeVision does not clear selectedVisionId if a different vision was selected', () => {
    useVisionStore.setState({ selectedVisionId: 'vision-1' })
    useVisionStore.getState().removeVision('vision-3')
    expect(useVisionStore.getState().selectedVisionId).toBe('vision-1')
  })

  // ── setSelectedVision ──────────────────────

  it('setSelectedVision sets an id', () => {
    useVisionStore.getState().setSelectedVision('vision-2')
    expect(useVisionStore.getState().selectedVisionId).toBe('vision-2')
  })

  it('setSelectedVision clears with null', () => {
    useVisionStore.getState().setSelectedVision('vision-2')
    useVisionStore.getState().setSelectedVision(null)
    expect(useVisionStore.getState().selectedVisionId).toBeNull()
  })

  // ── updateVision ───────────────────────────

  it('updateVision merges partial data', () => {
    useVisionStore.getState().updateVision('vision-2', { title: 'Updated Title', priority: 'high' })
    const vision = useVisionStore.getState().visions.find((v) => v.id === 'vision-2')!
    expect(vision.title).toBe('Updated Title')
    expect(vision.priority).toBe('high')
    expect(vision.overview).toBe('Introduce a unified API gateway for routing, rate limiting, and service discovery across microservices.')
  })
})
