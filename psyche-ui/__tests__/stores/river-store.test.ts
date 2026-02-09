import { describe, it, expect, beforeEach } from 'vitest'
import { useRiverStore } from '@/stores/river-store'
import { MOCK_RIVER_ENTRIES } from '@/lib/mock-data'
import type { RiverEntry } from '@/lib/types'

const initialState = () => ({
  entries: MOCK_RIVER_ENTRIES,
  filters: {},
})

describe('useRiverStore', () => {
  beforeEach(() => {
    useRiverStore.setState(initialState())
  })

  // ── Initial state ──────────────────────────

  it('has mock river entries as initial state', () => {
    const { entries } = useRiverStore.getState()
    expect(entries).toHaveLength(MOCK_RIVER_ENTRIES.length) // 10
    expect(entries[0].id).toBe('river-1')
  })

  it('has empty filters by default', () => {
    expect(useRiverStore.getState().filters).toEqual({})
  })

  // ── addEntry ───────────────────────────────

  it('addEntry prepends (newest first)', () => {
    const newEntry: RiverEntry = {
      id: 'river-new',
      type: 'status',
      title: 'New entry',
      description: 'Just added',
      timestamp: new Date(),
    }
    useRiverStore.getState().addEntry(newEntry)
    const { entries } = useRiverStore.getState()
    expect(entries).toHaveLength(MOCK_RIVER_ENTRIES.length + 1)
    expect(entries[0].id).toBe('river-new')
  })

  it('addEntry does not remove existing entries', () => {
    const newEntry: RiverEntry = {
      id: 'river-extra',
      type: 'agent',
      title: 'Extra',
      description: 'Extra entry',
      timestamp: new Date(),
    }
    useRiverStore.getState().addEntry(newEntry)
    const { entries } = useRiverStore.getState()
    // Original entries should still be present
    expect(entries.find((e) => e.id === 'river-1')).toBeDefined()
    expect(entries.find((e) => e.id === 'river-10')).toBeDefined()
  })

  // ── setFilters ─────────────────────────────

  it('setFilters({type:"vision"}) filters correctly via getFilteredEntries', () => {
    useRiverStore.getState().setFilters({ type: 'vision' })
    const filtered = useRiverStore.getState().getFilteredEntries()
    // river-1 (vision) and river-8 (vision) from mock data
    expect(filtered.length).toBe(2)
    expect(filtered.every((e) => e.type === 'vision')).toBe(true)
  })

  it('setFilters({type:"reflection"}) filters correctly', () => {
    useRiverStore.getState().setFilters({ type: 'reflection' })
    const filtered = useRiverStore.getState().getFilteredEntries()
    // river-2 and river-6 are type "reflection"
    expect(filtered.length).toBe(2)
    expect(filtered.every((e) => e.type === 'reflection')).toBe(true)
  })

  it('setFilters({search:"auth"}) does case-insensitive match on title and description', () => {
    useRiverStore.getState().setFilters({ search: 'auth' })
    const filtered = useRiverStore.getState().getFilteredEntries()
    // Should match entries with "auth" in title or description (case-insensitive)
    expect(filtered.length).toBeGreaterThan(0)
    filtered.forEach((entry) => {
      const matchesTitle = entry.title.toLowerCase().includes('auth')
      const matchesDescription = entry.description.toLowerCase().includes('auth')
      expect(matchesTitle || matchesDescription).toBe(true)
    })
  })

  it('setFilters({search:"AUTH"}) is case-insensitive', () => {
    useRiverStore.getState().setFilters({ search: 'AUTH' })
    const filtered = useRiverStore.getState().getFilteredEntries()
    expect(filtered.length).toBeGreaterThan(0)
  })

  it('setFilters({agentId:"agent-4"}) filters by agent id', () => {
    useRiverStore.getState().setFilters({ agentId: 'agent-4' })
    const filtered = useRiverStore.getState().getFilteredEntries()
    // river-7 and river-9 have agent-4
    expect(filtered.length).toBe(2)
    expect(filtered.every((e) => e.agent?.id === 'agent-4')).toBe(true)
  })

  // ── Combined filters (AND logic) ──────────

  it('combined filters apply AND logic', () => {
    // type=reflection AND agentId=agent-1
    useRiverStore.getState().setFilters({ type: 'reflection', agentId: 'agent-1' })
    const filtered = useRiverStore.getState().getFilteredEntries()
    // river-2 is type "reflection" with agent-1
    expect(filtered.length).toBe(1)
    expect(filtered[0].id).toBe('river-2')
  })

  it('combined type + search filters apply AND logic', () => {
    useRiverStore.getState().setFilters({ type: 'code', search: 'jwt' })
    const filtered = useRiverStore.getState().getFilteredEntries()
    // river-4 is type "code" and description mentions "JWT"
    expect(filtered.length).toBe(1)
    expect(filtered[0].id).toBe('river-4')
  })

  // ── clearFilters ───────────────────────────

  it('clearFilters resets all filters', () => {
    useRiverStore.getState().setFilters({ type: 'vision', search: 'auth' })
    useRiverStore.getState().clearFilters()
    expect(useRiverStore.getState().filters).toEqual({})
  })

  it('clearFilters causes getFilteredEntries to return all entries', () => {
    useRiverStore.getState().setFilters({ type: 'vision' })
    useRiverStore.getState().clearFilters()
    const filtered = useRiverStore.getState().getFilteredEntries()
    expect(filtered).toHaveLength(MOCK_RIVER_ENTRIES.length)
  })

  // ── getFilteredEntries with no filters ─────

  it('getFilteredEntries returns all entries when no filters are set', () => {
    const filtered = useRiverStore.getState().getFilteredEntries()
    expect(filtered).toHaveLength(MOCK_RIVER_ENTRIES.length)
  })

  // ── setFilters merges with existing filters ─

  it('setFilters merges with existing filters', () => {
    useRiverStore.getState().setFilters({ type: 'vision' })
    useRiverStore.getState().setFilters({ search: 'auth' })
    const { filters } = useRiverStore.getState()
    expect(filters.type).toBe('vision')
    expect(filters.search).toBe('auth')
  })
})
