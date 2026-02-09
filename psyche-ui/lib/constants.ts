/* ═══════════════════════════════════════════
   PSYCHE — Constants & Lookup Tables
   ═══════════════════════════════════════════ */

import type { AgentArchetype, AgentStatus } from "./types"

// Archetype definitions — Jungian personality system
export const ARCHETYPES: Record<
  AgentArchetype,
  {
    label: string
    color: string
    colorHex: string
    colorClass: string
    bgClass: string
    icon: string
    description: string
  }
> = {
  architect: {
    label: "The Architect",
    color: "var(--archetype-architect)",
    colorHex: "#a78bfa",
    colorClass: "text-archetype-architect",
    bgClass: "bg-archetype-architect",
    icon: "Compass",
    description: "Designs systems, creates structure",
  },
  guardian: {
    label: "The Guardian",
    color: "var(--archetype-guardian)",
    colorHex: "#34d399",
    colorClass: "text-archetype-guardian",
    bgClass: "bg-archetype-guardian",
    icon: "Shield",
    description: "Tests, validates, ensures quality",
  },
  explorer: {
    label: "The Explorer",
    color: "var(--archetype-explorer)",
    colorHex: "#60a5fa",
    colorClass: "text-archetype-explorer",
    bgClass: "bg-archetype-explorer",
    icon: "Telescope",
    description: "Researches, discovers, proposes",
  },
  alchemist: {
    label: "The Alchemist",
    color: "var(--archetype-alchemist)",
    colorHex: "#f59e0b",
    colorClass: "text-archetype-alchemist",
    bgClass: "bg-archetype-alchemist",
    icon: "FlaskConical",
    description: "Transforms, refactors, optimizes",
  },
  shadow: {
    label: "The Shadow",
    color: "var(--archetype-shadow)",
    colorHex: "#f87171",
    colorClass: "text-archetype-shadow",
    bgClass: "bg-archetype-shadow",
    icon: "Bug",
    description: "Debugs, finds hidden issues",
  },
  sage: {
    label: "The Sage",
    color: "var(--archetype-sage)",
    colorHex: "#c084fc",
    colorClass: "text-archetype-sage",
    bgClass: "bg-archetype-sage",
    icon: "BookOpen",
    description: "Reviews, advises, documents",
  },
  herald: {
    label: "The Herald",
    color: "var(--archetype-herald)",
    colorHex: "#22d3ee",
    colorClass: "text-archetype-herald",
    bgClass: "bg-archetype-herald",
    icon: "Radio",
    description: "Communicates, integrates, notifies",
  },
  trickster: {
    label: "The Trickster",
    color: "var(--archetype-trickster)",
    colorHex: "#fb923c",
    colorClass: "text-archetype-trickster",
    bgClass: "bg-archetype-trickster",
    icon: "Shuffle",
    description: "Challenges assumptions, unconventional solutions",
  },
}

// Agent statuses
export const AGENT_STATUSES: Record<
  AgentStatus,
  { label: string; color: string; icon: string }
> = {
  idle: { label: "Idle", color: "var(--text-muted)", icon: "Circle" },
  active: { label: "Active", color: "var(--success)", icon: "CircleDot" },
  completed: { label: "Completed", color: "var(--success)", icon: "CheckCircle" },
  error: { label: "Error", color: "var(--error)", icon: "XCircle" },
  paused: { label: "Paused", color: "var(--warning)", icon: "PauseCircle" },
}

// Autonomy levels — maps to AI SDK v6 needsApproval behavior
export const AUTONOMY_LEVELS = [
  { level: 1 as const, label: "Full Approval", description: "Every action requires human approval" },
  { level: 2 as const, label: "Step Approval", description: "Approve each major step" },
  { level: 3 as const, label: "Supervised", description: "Agent works, human reviews results" },
  { level: 4 as const, label: "Light Touch", description: "Agent works freely, alerts on issues" },
  { level: 5 as const, label: "Autonomous", description: "Full autonomy, human observes" },
]

// Vision board stages
export const VISION_STAGES = [
  { id: "backlog" as const, label: "Backlog" },
  { id: "in_progress" as const, label: "In Progress" },
  { id: "review" as const, label: "Review" },
  { id: "done" as const, label: "Done" },
]

// Reflection statuses
export const REFLECTION_STATUSES = {
  proposed: {
    label: "Proposed",
    bgClass: "bg-[var(--warning-muted)]",
    textClass: "text-[var(--warning)]",
    borderClass: "border-[var(--warning)]",
  },
  accepted: {
    label: "Accepted",
    bgClass: "bg-[var(--success-muted)]",
    textClass: "text-[var(--success)]",
    borderClass: "border-[var(--success)]",
  },
  superseded: {
    label: "Superseded",
    bgClass: "bg-[var(--bg-hover)]",
    textClass: "text-[var(--text-muted)]",
    borderClass: "border-[var(--border-default)]",
  },
  deprecated: {
    label: "Deprecated",
    bgClass: "bg-[var(--error-muted)]",
    textClass: "text-[var(--text-muted)] line-through",
    borderClass: "border-[var(--error)]",
  },
}

// River entry type definitions
export const RIVER_ENTRY_TYPES = {
  vision: { icon: "◆", color: "var(--accent-primary)", label: "Vision" },
  reflection: { icon: "◇", color: "var(--archetype-sage)", label: "Reflection" },
  diagram: { icon: "◈", color: "var(--archetype-herald)", label: "Diagram" },
  code: { icon: "●", color: "var(--success)", label: "Code" },
  status: { icon: "○", color: "var(--text-secondary)", label: "Status" },
  agent: { icon: "★", color: "var(--archetype-architect)", label: "Agent" },
}

// Agent node dimensions (from ADR-0003)
export const AGENT_NODE_SIZE = { width: 180, height: 100 }
export const AGENT_NODE_SIZE_MOBILE = { width: 220, height: 120 }
export const AGENT_NODE_SIZE_TABLET = { width: 200, height: 110 }

// Layout constants
export const TOP_BAR_HEIGHT = 52
export const STATUS_STRIP_HEIGHT = 24
export const AGENT_OVERLAY_WIDTH = 360
export const CONFIG_PANEL_WIDTH = 360

// Canvas defaults
export const CANVAS_MIN_ZOOM = 0.25
export const CANVAS_MAX_ZOOM = 2.0
export const CANVAS_DEFAULT_ZOOM = 1.0
export const CANVAS_GRID_SIZE = 24

// App info
export const APP_VERSION = "0.1.0"
export const APP_NAME = "Psyche"
