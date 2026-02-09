"use client"

import type { Agent, ConnectionData } from "@/lib/types"
import { ARCHETYPES, AGENT_NODE_SIZE } from "@/lib/constants"

interface ConnectionLinesProps {
  connections: ConnectionData[]
  agents: Agent[]
}

export function ConnectionLines({ connections, agents }: ConnectionLinesProps) {
  const agentMap = new Map(agents.map((a) => [a.id, a]))

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      style={{ zIndex: 5 }}
    >
      <defs>
        {/* Arrow marker for each archetype */}
        {agents.map((a) => {
          const archetype = ARCHETYPES[a.archetype]
          return (
            <marker
              key={`arrow-${a.id}`}
              id={`arrow-${a.id}`}
              viewBox="0 0 6 4"
              refX="6"
              refY="2"
              markerWidth="6"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 0 L 6 2 L 0 4 z"
                fill={a.status === "active" ? archetype.colorHex : "var(--constellation-line)"}
              />
            </marker>
          )
        })}
      </defs>

      {connections.map((conn) => {
        const source = agentMap.get(conn.sourceId)
        const target = agentMap.get(conn.targetId)
        if (!source || !target) return null

        // Source: center-right of node
        const sx = source.position.x + AGENT_NODE_SIZE.width
        const sy = source.position.y + AGENT_NODE_SIZE.height / 2

        // Target: center-left of node
        const tx = target.position.x
        const ty = target.position.y + AGENT_NODE_SIZE.height / 2

        // Bezier control points
        const offset = Math.abs(tx - sx) * 0.4
        const path = `M ${sx},${sy} C ${sx + offset},${sy} ${tx - offset},${ty} ${tx},${ty}`

        const isActive = source.status === "active" || conn.isActive
        const archetype = ARCHETYPES[source.archetype]

        return (
          <g key={conn.id}>
            <path
              d={path}
              fill="none"
              stroke={isActive ? archetype.colorHex : "var(--constellation-line)"}
              strokeWidth={isActive ? 2 : 1.5}
              strokeDasharray={isActive ? undefined : "6 4"}
              strokeOpacity={isActive ? 0.8 : 0.5}
              markerEnd={`url(#arrow-${source.id})`}
              className={isActive ? "animate-connection-flow" : ""}
              style={
                isActive
                  ? { strokeDasharray: "8 4", strokeDashoffset: 0 }
                  : undefined
              }
            />
            {/* Active glow effect */}
            {isActive && (
              <path
                d={path}
                fill="none"
                stroke={archetype.colorHex}
                strokeWidth={4}
                strokeOpacity={0.15}
                style={{ filter: `blur(4px)` }}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}
