"use client"

import type {
  ArchitectureSnapshot,
  ArchitectureDiff,
  NodeDiff,
  EdgeDiff,
  ArchitectureNode,
} from "@/lib/types"

interface ArchitectureCanvasProps {
  snapshot: ArchitectureSnapshot
  diff: ArchitectureDiff | null
  diffMode: boolean
}

const nodeTypeColors: Record<ArchitectureNode["type"], string> = {
  service: "var(--ac-pipeline-prd)",
  database: "var(--ac-pipeline-implement)",
  cache: "var(--ac-pipeline-excalidraw)",
  queue: "var(--ac-pipeline-adr)",
  gateway: "var(--ac-accent)",
}

function getDiffNodeStyle(status: NodeDiff["status"]) {
  switch (status) {
    case "added":
      return {
        stroke: "var(--ac-success)",
        fill: "var(--ac-diff-added)",
        opacity: 1,
        strokeDasharray: undefined,
      }
    case "removed":
      return {
        stroke: "var(--ac-error)",
        fill: "var(--ac-diff-removed)",
        opacity: 0.5,
        strokeDasharray: "4 2",
      }
    case "modified":
      return {
        stroke: "var(--ac-warning)",
        fill: "var(--ac-diff-modified)",
        opacity: 1,
        strokeDasharray: undefined,
      }
    default:
      return {
        stroke: undefined,
        fill: "var(--ac-bg-tertiary)",
        opacity: 0.6,
        strokeDasharray: undefined,
      }
  }
}

function getDiffEdgeColor(status: EdgeDiff["status"]) {
  switch (status) {
    case "added":
      return "var(--ac-success)"
    case "removed":
      return "var(--ac-error)"
    case "modified":
      return "var(--ac-warning)"
    default:
      return "var(--ac-text-muted)"
  }
}

function getEdgeCoords(
  edge: { from: string; to: string },
  nodeMap: Map<string, ArchitectureNode>
) {
  const fromNode = nodeMap.get(edge.from)
  const toNode = nodeMap.get(edge.to)
  if (!fromNode || !toNode) return null

  const fromCx = fromNode.x + fromNode.width / 2
  const fromCy = fromNode.y + fromNode.height / 2
  const toCx = toNode.x + toNode.width / 2
  const toCy = toNode.y + toNode.height / 2

  // Determine which side to connect from
  const dx = toCx - fromCx
  const dy = toCy - fromCy

  let x1: number, y1: number, x2: number, y2: number

  if (Math.abs(dy) > Math.abs(dx)) {
    // Vertical connection
    if (dy > 0) {
      x1 = fromCx
      y1 = fromNode.y + fromNode.height
      x2 = toCx
      y2 = toNode.y
    } else {
      x1 = fromCx
      y1 = fromNode.y
      x2 = toCx
      y2 = toNode.y + toNode.height
    }
  } else {
    // Horizontal connection
    if (dx > 0) {
      x1 = fromNode.x + fromNode.width
      y1 = fromCy
      x2 = toNode.x
      y2 = toCy
    } else {
      x1 = fromNode.x
      y1 = fromCy
      x2 = toNode.x + toNode.width
      y2 = toCy
    }
  }

  return { x1, y1, x2, y2 }
}

export function ArchitectureCanvas({ snapshot, diff, diffMode }: ArchitectureCanvasProps) {
  // Build node map for edge coordinate lookups
  const allNodes = diffMode && diff
    ? diff.nodes.map((d) => d.node)
    : snapshot.nodes
  const nodeMap = new Map(allNodes.map((n) => [n.id, n]))

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center bg-[var(--ac-bg-surface)] relative overflow-hidden">
        <svg
          viewBox="0 0 480 310"
          className="w-full h-full max-h-[500px] p-4"
          aria-label="Architecture diagram"
        >
          {/* Grid background */}
          <defs>
            <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--ac-border-subtle)" strokeWidth="0.5" />
            </pattern>
            <marker id="arch-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M 0 0 L 8 3 L 0 6 z" fill="var(--ac-text-muted)" />
            </marker>
            <marker id="arch-arrow-added" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M 0 0 L 8 3 L 0 6 z" fill="var(--ac-success)" />
            </marker>
            <marker id="arch-arrow-removed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M 0 0 L 8 3 L 0 6 z" fill="var(--ac-error)" />
            </marker>
            <marker id="arch-arrow-modified" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M 0 0 L 8 3 L 0 6 z" fill="var(--ac-warning)" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#arch-grid)" />

          {/* Render edges */}
          {diffMode && diff ? (
            diff.edges.map(({ edge, status }) => {
              const coords = getEdgeCoords(edge, nodeMap)
              if (!coords) return null
              const color = getDiffEdgeColor(status)
              const markerSuffix = status === "unchanged" ? "" : `-${status}`
              return (
                <line
                  key={edge.id}
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke={color}
                  strokeWidth={1.5}
                  strokeDasharray={edge.style === "dashed" || status === "removed" ? "4 2" : undefined}
                  opacity={status === "unchanged" ? 0.6 : status === "removed" ? 0.5 : 1}
                  markerEnd={`url(#arch-arrow${markerSuffix})`}
                />
              )
            })
          ) : (
            snapshot.edges.map((edge) => {
              const coords = getEdgeCoords(edge, nodeMap)
              if (!coords) return null
              return (
                <line
                  key={edge.id}
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke="var(--ac-text-muted)"
                  strokeWidth={1.5}
                  strokeDasharray={edge.style === "dashed" ? "4 2" : undefined}
                  markerEnd="url(#arch-arrow)"
                />
              )
            })
          )}

          {/* Render nodes */}
          {diffMode && diff ? (
            diff.nodes.map(({ node, status }) => {
              const style = getDiffNodeStyle(status)
              return (
                <g key={node.id} opacity={style.opacity}>
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rx={6}
                    fill={style.fill}
                    stroke={style.stroke || nodeTypeColors[node.type]}
                    strokeWidth={status === "unchanged" ? 1 : 2}
                    strokeDasharray={style.strokeDasharray}
                  />
                  <text
                    x={node.x + node.width / 2}
                    y={node.y + node.height / 2 + 4}
                    textAnchor="middle"
                    className="text-xs font-mono"
                    fill={status === "removed" ? "var(--ac-error)" : "var(--ac-text-primary)"}
                  >
                    {node.label}
                  </text>
                </g>
              )
            })
          ) : (
            snapshot.nodes.map((node) => (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx={6}
                  fill="var(--ac-bg-tertiary)"
                  stroke={nodeTypeColors[node.type]}
                  strokeWidth={1.5}
                />
                <text
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2 + 4}
                  textAnchor="middle"
                  className="text-xs font-mono"
                  fill="var(--ac-text-primary)"
                >
                  {node.label}
                </text>
              </g>
            ))
          )}

          {/* Diff legend */}
          {diffMode && diff && (
            <g transform="translate(10, 280)">
              <circle cx={6} cy={6} r={4} fill="var(--ac-success)" />
              <text x={14} y={10} className="text-[9px] font-mono" fill="var(--ac-text-secondary)">Added</text>
              <circle cx={56} cy={6} r={4} fill="var(--ac-error)" />
              <text x={64} y={10} className="text-[9px] font-mono" fill="var(--ac-text-secondary)">Removed</text>
              <circle cx={116} cy={6} r={4} fill="var(--ac-warning)" />
              <text x={124} y={10} className="text-[9px] font-mono" fill="var(--ac-text-secondary)">Modified</text>
            </g>
          )}
        </svg>
      </div>

      {/* Diff summary bar */}
      {diffMode && diff && (
        <div className="border-t border-[var(--ac-border-subtle)] px-4 py-2 flex items-center gap-4 text-2xs text-[var(--ac-text-secondary)]">
          <span className="font-mono text-[var(--ac-text-muted)]">Diff summary:</span>
          {diff.stats.nodesAdded > 0 && (
            <span className="text-[var(--ac-success)]">+{diff.stats.nodesAdded} nodes</span>
          )}
          {diff.stats.nodesRemoved > 0 && (
            <span className="text-[var(--ac-error)]">-{diff.stats.nodesRemoved} nodes</span>
          )}
          {diff.stats.nodesModified > 0 && (
            <span className="text-[var(--ac-warning)]">~{diff.stats.nodesModified} nodes</span>
          )}
          {diff.stats.edgesAdded > 0 && (
            <span className="text-[var(--ac-success)]">+{diff.stats.edgesAdded} edges</span>
          )}
          {diff.stats.edgesRemoved > 0 && (
            <span className="text-[var(--ac-error)]">-{diff.stats.edgesRemoved} edges</span>
          )}
          {diff.stats.edgesModified > 0 && (
            <span className="text-[var(--ac-warning)]">~{diff.stats.edgesModified} edges</span>
          )}
        </div>
      )}
    </div>
  )
}
