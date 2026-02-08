import type {
  ArchitectureSnapshot,
  ArchitectureDiff,
  NodeDiff,
  EdgeDiff,
  ArchitectureNode,
  ArchitectureEdge,
} from "./types"

function nodesEqual(a: ArchitectureNode, b: ArchitectureNode): boolean {
  return (
    a.label === b.label &&
    a.type === b.type &&
    a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height
  )
}

function edgesEqual(a: ArchitectureEdge, b: ArchitectureEdge): boolean {
  return (
    a.from === b.from &&
    a.to === b.to &&
    a.label === b.label &&
    a.style === b.style
  )
}

export function computeArchitectureDiff(
  before: ArchitectureSnapshot,
  after: ArchitectureSnapshot
): ArchitectureDiff {
  const beforeNodeMap = new Map(before.nodes.map((n) => [n.id, n]))
  const afterNodeMap = new Map(after.nodes.map((n) => [n.id, n]))

  const nodeDiffs: NodeDiff[] = []

  // Check after nodes (added, modified, unchanged)
  for (const node of after.nodes) {
    const prev = beforeNodeMap.get(node.id)
    if (!prev) {
      nodeDiffs.push({ node, status: "added" })
    } else if (!nodesEqual(prev, node)) {
      nodeDiffs.push({ node, status: "modified" })
    } else {
      nodeDiffs.push({ node, status: "unchanged" })
    }
  }

  // Check removed nodes
  for (const node of before.nodes) {
    if (!afterNodeMap.has(node.id)) {
      nodeDiffs.push({ node, status: "removed" })
    }
  }

  const beforeEdgeMap = new Map(before.edges.map((e) => [e.id, e]))
  const afterEdgeMap = new Map(after.edges.map((e) => [e.id, e]))

  const edgeDiffs: EdgeDiff[] = []

  for (const edge of after.edges) {
    const prev = beforeEdgeMap.get(edge.id)
    if (!prev) {
      edgeDiffs.push({ edge, status: "added" })
    } else if (!edgesEqual(prev, edge)) {
      edgeDiffs.push({ edge, status: "modified" })
    } else {
      edgeDiffs.push({ edge, status: "unchanged" })
    }
  }

  for (const edge of before.edges) {
    if (!afterEdgeMap.has(edge.id)) {
      edgeDiffs.push({ edge, status: "removed" })
    }
  }

  return {
    nodes: nodeDiffs,
    edges: edgeDiffs,
    stats: {
      nodesAdded: nodeDiffs.filter((d) => d.status === "added").length,
      nodesRemoved: nodeDiffs.filter((d) => d.status === "removed").length,
      nodesModified: nodeDiffs.filter((d) => d.status === "modified").length,
      edgesAdded: edgeDiffs.filter((d) => d.status === "added").length,
      edgesRemoved: edgeDiffs.filter((d) => d.status === "removed").length,
      edgesModified: edgeDiffs.filter((d) => d.status === "modified").length,
    },
  }
}
