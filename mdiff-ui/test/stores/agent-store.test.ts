import { describe, it, expect, beforeEach } from "vitest"
import { useAgentStore } from "@/stores/agent-store"

describe("AgentStore", () => {
  beforeEach(() => {
    useAgentStore.getState().clear()
  })

  it("starts cleared", () => {
    const state = useAgentStore.getState()
    expect(state.active).toBe(false)
    expect(state.projectId).toBeNull()
    expect(state.currentTask).toBeNull()
    expect(state.streamContent).toBe("")
    expect(state.events).toHaveLength(0)
  })

  it("sets active state", () => {
    useAgentStore.getState().setActive(true, "proj-1", "Analyzing ADR")
    const state = useAgentStore.getState()
    expect(state.active).toBe(true)
    expect(state.projectId).toBe("proj-1")
    expect(state.currentTask).toBe("Analyzing ADR")
  })

  it("appends to stream content", () => {
    useAgentStore.getState().appendStream("Hello ")
    useAgentStore.getState().appendStream("World")
    expect(useAgentStore.getState().streamContent).toBe("Hello World")
  })

  it("adds events", () => {
    useAgentStore.getState().addEvent({
      id: "e1",
      type: "agent:started",
      timestamp: new Date(),
      payload: {},
    })
    expect(useAgentStore.getState().events).toHaveLength(1)
    expect(useAgentStore.getState().events[0].id).toBe("e1")
  })

  it("caps events at 100", () => {
    for (let i = 0; i < 110; i++) {
      useAgentStore.getState().addEvent({
        id: `e-${i}`,
        type: "agent:streaming",
        timestamp: new Date(),
        payload: {},
      })
    }
    expect(useAgentStore.getState().events).toHaveLength(100)
  })

  it("most recent events are first", () => {
    useAgentStore.getState().addEvent({
      id: "first",
      type: "agent:started",
      timestamp: new Date(),
      payload: {},
    })
    useAgentStore.getState().addEvent({
      id: "second",
      type: "agent:completed",
      timestamp: new Date(),
      payload: {},
    })
    expect(useAgentStore.getState().events[0].id).toBe("second")
  })

  it("clears all state", () => {
    useAgentStore.getState().setActive(true, "proj-1", "Task")
    useAgentStore.getState().appendStream("content")
    useAgentStore.getState().addEvent({
      id: "e1",
      type: "agent:started",
      timestamp: new Date(),
      payload: {},
    })
    useAgentStore.getState().clear()
    const state = useAgentStore.getState()
    expect(state.active).toBe(false)
    expect(state.streamContent).toBe("")
    expect(state.events).toHaveLength(0)
  })
})
