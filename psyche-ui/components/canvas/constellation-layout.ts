import type { Agent, ConnectionData } from "@/lib/types"
import { AGENT_NODE_SIZE } from "@/lib/constants"

interface Position {
  x: number
  y: number
}

/**
 * Force-directed layout algorithm for constellation mode.
 * Arranges agents based on their dependency graph with repulsion, attraction, and gravity forces.
 */
export function calculateConstellationLayout(
  agents: Agent[],
  connections: ConnectionData[],
  viewportWidth: number,
  viewportHeight: number
): Map<string, Position> {
  if (agents.length === 0) return new Map()

  // Initialize positions from current agent positions
  const positions = new Map<string, Position>(
    agents.map((a) => [a.id, { x: a.position.x, y: a.position.y }])
  )

  // Build adjacency lookup
  const adjacency = new Map<string, Set<string>>()
  for (const a of agents) {
    adjacency.set(a.id, new Set())
  }
  for (const conn of connections) {
    adjacency.get(conn.sourceId)?.add(conn.targetId)
    adjacency.get(conn.targetId)?.add(conn.sourceId)
  }

  const REPULSION = 5000
  const ATTRACTION = 0.1
  const REST_LENGTH = 200
  const GRAVITY = 0.05
  const DAMPING = 0.9
  const ITERATIONS = 60

  // Center of viewport
  const centerX = viewportWidth / 2 - AGENT_NODE_SIZE.width / 2
  const centerY = viewportHeight / 2 - AGENT_NODE_SIZE.height / 2

  // Velocity map
  const velocities = new Map<string, Position>(
    agents.map((a) => [a.id, { x: 0, y: 0 }])
  )

  for (let iter = 0; iter < ITERATIONS; iter++) {
    const forces = new Map<string, Position>(
      agents.map((a) => [a.id, { x: 0, y: 0 }])
    )

    // Repulsion: each node repels all others (Coulomb force)
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const a = agents[i]
        const b = agents[j]
        const posA = positions.get(a.id)!
        const posB = positions.get(b.id)!

        const dx = posA.x - posB.x
        const dy = posA.y - posB.y
        const distSq = dx * dx + dy * dy
        const dist = Math.sqrt(distSq) || 1

        const force = REPULSION / distSq
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force

        const fA = forces.get(a.id)!
        const fB = forces.get(b.id)!
        fA.x += fx
        fA.y += fy
        fB.x -= fx
        fB.y -= fy
      }
    }

    // Attraction: connected nodes attract (spring force)
    for (const conn of connections) {
      const posS = positions.get(conn.sourceId)
      const posT = positions.get(conn.targetId)
      if (!posS || !posT) continue

      const dx = posT.x - posS.x
      const dy = posT.y - posS.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1

      const displacement = dist - REST_LENGTH
      const force = ATTRACTION * displacement
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force

      const fS = forces.get(conn.sourceId)!
      const fT = forces.get(conn.targetId)!
      fS.x += fx
      fS.y += fy
      fT.x -= fx
      fT.y -= fy
    }

    // Gravity: pull toward center
    for (const agent of agents) {
      const pos = positions.get(agent.id)!
      const f = forces.get(agent.id)!
      f.x += (centerX - pos.x) * GRAVITY
      f.y += (centerY - pos.y) * GRAVITY
    }

    // Apply forces with velocity damping
    for (const agent of agents) {
      const pos = positions.get(agent.id)!
      const vel = velocities.get(agent.id)!
      const f = forces.get(agent.id)!

      vel.x = (vel.x + f.x) * DAMPING
      vel.y = (vel.y + f.y) * DAMPING

      pos.x += vel.x
      pos.y += vel.y
    }
  }

  // Center the layout in the viewport
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const pos of positions.values()) {
    minX = Math.min(minX, pos.x)
    minY = Math.min(minY, pos.y)
    maxX = Math.max(maxX, pos.x + AGENT_NODE_SIZE.width)
    maxY = Math.max(maxY, pos.y + AGENT_NODE_SIZE.height)
  }

  const layoutCenterX = (minX + maxX) / 2
  const layoutCenterY = (minY + maxY) / 2
  const viewCenterX = viewportWidth / 2
  const viewCenterY = viewportHeight / 2
  const offsetX = viewCenterX - layoutCenterX
  const offsetY = viewCenterY - layoutCenterY

  for (const [id, pos] of positions) {
    positions.set(id, { x: pos.x + offsetX, y: pos.y + offsetY })
  }

  return positions
}
