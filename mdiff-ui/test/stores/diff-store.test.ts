import { describe, it, expect, beforeEach } from "vitest"
import { useDiffStore } from "@/stores/diff-store"
import type { Diff } from "@/lib/types"

const testDiff: Diff = {
  id: "test-d1",
  projectId: "proj-1",
  type: "adr",
  documentName: "Test Doc",
  description: "Test diff",
  timestamp: new Date(),
  author: "agent",
  stats: { linesAdded: 1, linesRemoved: 0 },
}

describe("DiffStore", () => {
  beforeEach(() => {
    // Reset loading state
    useDiffStore.setState({ loading: false })
  })

  it("has initial diffs from mock data", () => {
    const { diffs } = useDiffStore.getState()
    expect(diffs.length).toBeGreaterThan(0)
  })

  it("adds a diff to the beginning", () => {
    const before = useDiffStore.getState().diffs.length
    useDiffStore.getState().addDiff(testDiff)
    const { diffs } = useDiffStore.getState()
    expect(diffs.length).toBe(before + 1)
    expect(diffs[0].id).toBe("test-d1")
  })

  it("sets diffs", () => {
    useDiffStore.getState().setDiffs([testDiff])
    const { diffs } = useDiffStore.getState()
    expect(diffs.length).toBe(1)
    expect(diffs[0].id).toBe("test-d1")
  })

  it("sets loading state", () => {
    useDiffStore.getState().setLoading(true)
    expect(useDiffStore.getState().loading).toBe(true)
    useDiffStore.getState().setLoading(false)
    expect(useDiffStore.getState().loading).toBe(false)
  })
})
