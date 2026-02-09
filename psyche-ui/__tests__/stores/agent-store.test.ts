import { describe, it, expect, beforeEach } from 'vitest'
import { useAgentStore } from '@/stores/agent-store'
import { MOCK_AGENTS, MOCK_CONNECTIONS } from '@/lib/mock-data'
import type { AgentConfig, AgentEvent } from '@/lib/types'

// Helper to get a fresh initial state snapshot
const initialState = () => ({
  agents: MOCK_AGENTS,
  connections: MOCK_CONNECTIONS,
  configPanelOpen: false,
  configPanelAgentId: null,
})

describe('useAgentStore', () => {
  beforeEach(() => {
    useAgentStore.setState(initialState())
  })

  // ── Initial state ──────────────────────────

  it('has mock agents as initial state', () => {
    const { agents } = useAgentStore.getState()
    expect(agents).toHaveLength(MOCK_AGENTS.length) // 4
    expect(agents[0].id).toBe('agent-1')
    expect(agents[0].name).toBe('ψ₁ The Architect')
  })

  it('has mock connections as initial state', () => {
    const { connections } = useAgentStore.getState()
    expect(connections).toHaveLength(MOCK_CONNECTIONS.length) // 2
  })

  it('has config panel closed by default', () => {
    const { configPanelOpen, configPanelAgentId } = useAgentStore.getState()
    expect(configPanelOpen).toBe(false)
    expect(configPanelAgentId).toBeNull()
  })

  // ── addAgent ───────────────────────────────

  it('addAgent creates agent with generated id and defaults', () => {
    const config: AgentConfig = {
      name: 'Test Agent',
      archetype: 'guardian',
      task: 'Run tests',
      autonomy: 2,
    }
    useAgentStore.getState().addAgent(config, { x: 100, y: 200 })

    const { agents } = useAgentStore.getState()
    expect(agents).toHaveLength(MOCK_AGENTS.length + 1)

    const newAgent = agents[agents.length - 1]
    expect(newAgent.id).toMatch(/^agent-\d+$/)
    expect(newAgent.name).toBe('Test Agent')
    expect(newAgent.archetype).toBe('guardian')
    expect(newAgent.task).toBe('Run tests')
    expect(newAgent.status).toBe('idle')
    expect(newAgent.autonomy).toBe(2)
    expect(newAgent.position).toEqual({ x: 100, y: 200 })
    expect(newAgent.dependsOn).toEqual([])
    expect(newAgent.outputFeeds).toEqual([])
    expect(newAgent.events).toEqual([])
    expect(newAgent.createdAt).toBeInstanceOf(Date)
    expect(newAgent.updatedAt).toBeInstanceOf(Date)
  })

  it('addAgent preserves dependsOn and outputFeeds from config', () => {
    const config: AgentConfig = {
      name: 'Dependent Agent',
      archetype: 'explorer',
      task: 'Explore',
      autonomy: 4,
      dependsOn: ['agent-1'],
      outputFeeds: ['agent-2'],
    }
    useAgentStore.getState().addAgent(config, { x: 0, y: 0 })

    const newAgent = useAgentStore.getState().agents.at(-1)!
    expect(newAgent.dependsOn).toEqual(['agent-1'])
    expect(newAgent.outputFeeds).toEqual(['agent-2'])
  })

  // ── removeAgent ────────────────────────────

  it('removeAgent removes the agent from agents array', () => {
    useAgentStore.getState().removeAgent('agent-1')
    const { agents } = useAgentStore.getState()
    expect(agents.find((a) => a.id === 'agent-1')).toBeUndefined()
    expect(agents).toHaveLength(MOCK_AGENTS.length - 1)
  })

  it('removeAgent removes all connections involving that agent', () => {
    // agent-1 is sourceId in conn-1 and conn-2
    useAgentStore.getState().removeAgent('agent-1')
    const { connections } = useAgentStore.getState()
    expect(connections).toHaveLength(0)
  })

  it('removeAgent removes connections where agent is targetId', () => {
    // agent-2 is targetId in conn-1
    useAgentStore.getState().removeAgent('agent-2')
    const { connections } = useAgentStore.getState()
    expect(connections.find((c) => c.id === 'conn-1')).toBeUndefined()
    // conn-2 should remain (agent-1 -> agent-3)
    expect(connections).toHaveLength(1)
    expect(connections[0].id).toBe('conn-2')
  })

  // ── updateAgent ────────────────────────────

  it('updateAgent merges partial data into agent', () => {
    useAgentStore.getState().updateAgent('agent-2', { task: 'Updated task', autonomy: 5 })
    const agent = useAgentStore.getState().agents.find((a) => a.id === 'agent-2')!
    expect(agent.task).toBe('Updated task')
    expect(agent.autonomy).toBe(5)
    // name should remain unchanged
    expect(agent.name).toBe('ψ₂ The Guardian')
  })

  it('updateAgent sets updatedAt to a new Date', () => {
    const before = new Date()
    useAgentStore.getState().updateAgent('agent-2', { task: 'New task' })
    const agent = useAgentStore.getState().agents.find((a) => a.id === 'agent-2')!
    expect(agent.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
  })

  // ── setAgentStatus ─────────────────────────

  it('setAgentStatus transitions agent status correctly', () => {
    useAgentStore.getState().setAgentStatus('agent-2', 'active')
    const agent = useAgentStore.getState().agents.find((a) => a.id === 'agent-2')!
    expect(agent.status).toBe('active')
  })

  it('setAgentStatus can transition to error', () => {
    useAgentStore.getState().setAgentStatus('agent-1', 'error')
    const agent = useAgentStore.getState().agents.find((a) => a.id === 'agent-1')!
    expect(agent.status).toBe('error')
  })

  it('setAgentStatus updates updatedAt', () => {
    const before = new Date()
    useAgentStore.getState().setAgentStatus('agent-2', 'paused')
    const agent = useAgentStore.getState().agents.find((a) => a.id === 'agent-2')!
    expect(agent.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
  })

  // ── addConnection ──────────────────────────

  it('addConnection creates a connection entry with sourceId and targetId', () => {
    useAgentStore.getState().addConnection('agent-3', 'agent-4')
    const { connections } = useAgentStore.getState()
    expect(connections).toHaveLength(MOCK_CONNECTIONS.length + 1)

    const newConn = connections[connections.length - 1]
    expect(newConn.id).toMatch(/^conn-\d+$/)
    expect(newConn.sourceId).toBe('agent-3')
    expect(newConn.targetId).toBe('agent-4')
  })

  // ── removeConnection ───────────────────────

  it('removeConnection removes the connection by id', () => {
    useAgentStore.getState().removeConnection('conn-1')
    const { connections } = useAgentStore.getState()
    expect(connections.find((c) => c.id === 'conn-1')).toBeUndefined()
    expect(connections).toHaveLength(MOCK_CONNECTIONS.length - 1)
  })

  // ── openConfigPanel / closeConfigPanel ─────

  it('openConfigPanel opens the panel with an agentId', () => {
    useAgentStore.getState().openConfigPanel('agent-2')
    const { configPanelOpen, configPanelAgentId } = useAgentStore.getState()
    expect(configPanelOpen).toBe(true)
    expect(configPanelAgentId).toBe('agent-2')
  })

  it('openConfigPanel without agentId sets configPanelAgentId to null', () => {
    useAgentStore.getState().openConfigPanel()
    const { configPanelOpen, configPanelAgentId } = useAgentStore.getState()
    expect(configPanelOpen).toBe(true)
    expect(configPanelAgentId).toBeNull()
  })

  it('closeConfigPanel resets panel state', () => {
    useAgentStore.getState().openConfigPanel('agent-1')
    useAgentStore.getState().closeConfigPanel()
    const { configPanelOpen, configPanelAgentId } = useAgentStore.getState()
    expect(configPanelOpen).toBe(false)
    expect(configPanelAgentId).toBeNull()
  })

  // ── appendAgentStream ──────────────────────

  it('appendAgentStream concatenates content to streamContent', () => {
    // agent-2 has no streamContent initially
    useAgentStore.getState().appendAgentStream('agent-2', 'Hello ')
    useAgentStore.getState().appendAgentStream('agent-2', 'World')
    const agent = useAgentStore.getState().agents.find((a) => a.id === 'agent-2')!
    expect(agent.streamContent).toBe('Hello World')
  })

  it('appendAgentStream appends to existing streamContent', () => {
    // agent-1 already has streamContent from mock data
    const originalContent = useAgentStore.getState().agents.find((a) => a.id === 'agent-1')!.streamContent
    useAgentStore.getState().appendAgentStream('agent-1', '\n\nExtra content')
    const agent = useAgentStore.getState().agents.find((a) => a.id === 'agent-1')!
    expect(agent.streamContent).toBe(originalContent + '\n\nExtra content')
  })

  // ── addAgentEvent ──────────────────────────

  it('addAgentEvent pushes to events array', () => {
    const event: AgentEvent = {
      id: 'test-event-1',
      type: 'agent:started',
      timestamp: new Date(),
      message: 'Test event',
    }
    const initialEventCount = useAgentStore.getState().agents.find((a) => a.id === 'agent-2')!.events.length

    useAgentStore.getState().addAgentEvent('agent-2', event)
    const agent = useAgentStore.getState().agents.find((a) => a.id === 'agent-2')!
    expect(agent.events).toHaveLength(initialEventCount + 1)
    expect(agent.events[agent.events.length - 1]).toEqual(event)
  })

  it('addAgentEvent updates updatedAt', () => {
    const before = new Date()
    const event: AgentEvent = {
      id: 'test-event-2',
      type: 'agent:completed',
      timestamp: new Date(),
      message: 'Done',
    }
    useAgentStore.getState().addAgentEvent('agent-2', event)
    const agent = useAgentStore.getState().agents.find((a) => a.id === 'agent-2')!
    expect(agent.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
  })
})
