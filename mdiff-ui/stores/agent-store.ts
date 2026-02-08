import { create } from "zustand"
import type { MDiffEvent } from "@/lib/types"
import { mockAgentState } from "@/lib/mock-data"

interface AgentStore {
  active: boolean
  projectId: string | null
  currentTask: string | null
  streamContent: string
  events: MDiffEvent[]
  setActive: (active: boolean, projectId?: string, task?: string) => void
  appendStream: (content: string) => void
  addEvent: (event: MDiffEvent) => void
  clear: () => void
}

export const useAgentStore = create<AgentStore>((set) => ({
  active: mockAgentState.active,
  projectId: mockAgentState.projectId,
  currentTask: mockAgentState.currentTask,
  streamContent: mockAgentState.streamContent,
  events: mockAgentState.events,

  setActive: (active, projectId, task) =>
    set({
      active,
      projectId: projectId ?? null,
      currentTask: task ?? null,
    }),

  appendStream: (content) =>
    set((state) => ({ streamContent: state.streamContent + content })),

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 100),
    })),

  clear: () =>
    set({
      active: false,
      projectId: null,
      currentTask: null,
      streamContent: "",
      events: [],
    }),
}))
