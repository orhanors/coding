import type { AgentArchetype } from "@/lib/types"
import { ARCHETYPES } from "@/lib/constants"

/**
 * Agent configuration scaffold for AI SDK v6 ToolLoopAgent pattern.
 * In production, this would use the AI SDK v6 `ToolLoopAgent` class with real LLM providers.
 * Currently defines system prompts and tool configurations per archetype.
 */

interface AgentToolConfig {
  archetype: AgentArchetype
  systemPrompt: string
  tools: string[]
  needsApproval: boolean
}

const ARCHETYPE_SYSTEM_PROMPTS: Record<AgentArchetype, string> = {
  architect: `You are The Architect — a systems designer and structural thinker.
Your role is to analyze codebases, design module structures, propose architectural patterns,
and create clear dependency graphs. You think in terms of separation of concerns,
interface boundaries, and scalable design patterns.`,

  guardian: `You are The Guardian — a quality assurance specialist.
Your role is to write tests, validate implementations, ensure code quality,
and identify potential issues before they reach production. You think defensively
and prioritize correctness, security, and reliability.`,

  explorer: `You are The Explorer — a research and discovery agent.
Your role is to investigate new approaches, research best practices,
evaluate alternative libraries and patterns, and propose innovative solutions.
You think broadly and challenge conventional approaches.`,

  alchemist: `You are The Alchemist — an optimization and transformation specialist.
Your role is to refactor code, optimize performance, reduce complexity,
and transform messy implementations into clean, efficient solutions.
You see the potential in existing code and know how to unlock it.`,

  shadow: `You are The Shadow — a debugging and hidden-issue specialist.
Your role is to find bugs, identify race conditions, uncover security vulnerabilities,
and surface problems that others miss. You look in the dark corners
and question assumptions that everyone else takes for granted.`,

  sage: `You are The Sage — a documentation and review specialist.
Your role is to review code, write documentation, advise on best practices,
and ensure knowledge is captured and shared. You think about maintainability,
readability, and the developer experience for those who come after.`,

  herald: `You are The Herald — a communication and integration specialist.
Your role is to connect systems, set up notifications, integrate external services,
and ensure information flows smoothly between components. You think about
interfaces, protocols, and the boundaries between systems.`,

  trickster: `You are The Trickster — an unconventional problem solver.
Your role is to challenge assumptions, propose creative solutions,
find edge cases that break expectations, and suggest approaches
that others might dismiss. You think laterally and question the status quo.`,
}

const ARCHETYPE_TOOLS: Record<AgentArchetype, string[]> = {
  architect: ["readFile", "writeFile", "listDirectory", "createDiagram", "proposeReflection"],
  guardian: ["readFile", "runTests", "analyzeCode", "writeFile", "reportIssue"],
  explorer: ["webSearch", "readFile", "analyzeCode", "proposeReflection", "compareApproaches"],
  alchemist: ["readFile", "writeFile", "refactorCode", "analyzePerformance", "runTests"],
  shadow: ["readFile", "analyzeCode", "debugCode", "traceExecution", "reportIssue"],
  sage: ["readFile", "writeFile", "analyzeCode", "generateDocs", "reviewCode"],
  herald: ["readFile", "writeFile", "callAPI", "sendNotification", "integrateService"],
  trickster: ["readFile", "writeFile", "analyzeCode", "proposeReflection", "challengeAssumption"],
}

/**
 * Creates an agent configuration based on archetype and autonomy level.
 * Autonomy levels 1-3 require human approval (needsApproval: true).
 * Autonomy levels 4-5 run autonomously (needsApproval: false).
 */
export function createAgentConfig(
  archetype: AgentArchetype,
  autonomy: 1 | 2 | 3 | 4 | 5
): AgentToolConfig {
  return {
    archetype,
    systemPrompt: ARCHETYPE_SYSTEM_PROMPTS[archetype],
    tools: ARCHETYPE_TOOLS[archetype],
    needsApproval: autonomy <= 3,
  }
}

/**
 * Returns the display information for an agent's archetype.
 */
export function getArchetypeInfo(archetype: AgentArchetype) {
  return {
    ...ARCHETYPES[archetype],
    systemPrompt: ARCHETYPE_SYSTEM_PROMPTS[archetype],
    tools: ARCHETYPE_TOOLS[archetype],
  }
}
