import { create } from "zustand"
import type { Agent, AgentConfig, AgentEvent, AgentStatus, ConnectionData } from "@/lib/types"
import { MOCK_AGENTS, MOCK_CONNECTIONS } from "@/lib/mock-data"

interface AgentStore {
  agents: Agent[]
  connections: ConnectionData[]
  configPanelOpen: boolean
  configPanelAgentId: string | null

  addAgent: (config: AgentConfig, position: { x: number; y: number }) => void
  removeAgent: (id: string) => void
  updateAgent: (id: string, partial: Partial<Agent>) => void
  setAgentStatus: (id: string, status: AgentStatus) => void
  addConnection: (sourceId: string, targetId: string) => void
  removeConnection: (id: string) => void
  openConfigPanel: (agentId?: string) => void
  closeConfigPanel: () => void
  appendAgentStream: (agentId: string, content: string) => void
  addAgentEvent: (agentId: string, event: AgentEvent) => void
}

export const useAgentStore = create<AgentStore>()((set, get) => ({
  agents: MOCK_AGENTS,
  connections: MOCK_CONNECTIONS,
  configPanelOpen: false,
  configPanelAgentId: null,

  addAgent: (config, position) => {
    const agent: Agent = {
      id: `agent-${Date.now()}`,
      name: config.name,
      archetype: config.archetype,
      task: config.task,
      status: "idle",
      autonomy: config.autonomy,
      position,
      dependsOn: config.dependsOn ?? [],
      outputFeeds: config.outputFeeds ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
      events: [],
    }
    set((s) => ({ agents: [...s.agents, agent] }))
  },

  removeAgent: (id) => {
    set((s) => ({
      agents: s.agents.filter((a) => a.id !== id),
      connections: s.connections.filter(
        (c) => c.sourceId !== id && c.targetId !== id
      ),
    }))
  },

  updateAgent: (id, partial) => {
    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === id ? { ...a, ...partial, updatedAt: new Date() } : a
      ),
    }))
  },

  setAgentStatus: (id, status) => {
    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === id ? { ...a, status, updatedAt: new Date() } : a
      ),
    }))
  },

  addConnection: (sourceId, targetId) => {
    const conn: ConnectionData = {
      id: `conn-${Date.now()}`,
      sourceId,
      targetId,
    }
    set((s) => ({ connections: [...s.connections, conn] }))
  },

  removeConnection: (id) => {
    set((s) => ({
      connections: s.connections.filter((c) => c.id !== id),
    }))
  },

  openConfigPanel: (agentId) => {
    set({ configPanelOpen: true, configPanelAgentId: agentId ?? null })
  },

  closeConfigPanel: () => {
    set({ configPanelOpen: false, configPanelAgentId: null })
  },

  appendAgentStream: (agentId, content) => {
    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === agentId
          ? { ...a, streamContent: (a.streamContent ?? "") + content, updatedAt: new Date() }
          : a
      ),
    }))
  },

  addAgentEvent: (agentId, event) => {
    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === agentId
          ? { ...a, events: [...a.events, event], updatedAt: new Date() }
          : a
      ),
    }))
  },
}))
