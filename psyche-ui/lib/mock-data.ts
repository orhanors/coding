/* ═══════════════════════════════════════════
   PSYCHE — Mock Data
   ═══════════════════════════════════════════ */

import type {
  Agent,
  AgentEvent,
  ChangeEntry,
  DiffHunk,
  Reflection,
  ReflectionVersion,
  RiverEntry,
  Vision,
  VisionTask,
} from "./types"

// ─── Helpers ───────────────────────────────
const now = new Date()
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000)
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000)
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000)

// ─── Mock Agents ───────────────────────────

const architectEvents: AgentEvent[] = [
  { id: "ae-1", type: "agent:started", timestamp: hoursAgo(2), message: "Started analyzing auth module" },
  { id: "ae-2", type: "agent:streaming", timestamp: hoursAgo(1.9), message: "Reading src/auth/ directory" },
  { id: "ae-3", type: "agent:step-completed", timestamp: hoursAgo(1.5), message: "Mapped existing auth patterns — found 3 legacy cookie session files" },
  { id: "ae-4", type: "agent:streaming", timestamp: hoursAgo(1), message: "Proposing JWT migration with refresh rotation" },
  { id: "ae-5", type: "agent:step-completed", timestamp: minutesAgo(28), message: "Created Reflection R-003: Choose JWT over sessions" },
]

export const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "ψ₁ The Architect",
    archetype: "architect",
    task: "Refactoring auth module",
    status: "active",
    autonomy: 3,
    progress: 73,
    position: { x: 200, y: 150 },
    dependsOn: [],
    outputFeeds: ["agent-2"],
    createdAt: hoursAgo(3),
    updatedAt: minutesAgo(5),
    streamContent: `## Analyzing Auth Module

I've examined the existing authentication patterns in \`src/auth/\` and found **3 legacy cookie-based session files**:

- \`src/auth/session-store.ts\` — Redis-backed session storage
- \`src/auth/cookie-handler.ts\` — HTTP-only cookie management
- \`src/auth/session-middleware.ts\` — Express session middleware

### Proposed Migration

Recommend moving to **JWT with refresh token rotation**:

1. Replace session-store with stateless JWT validation
2. Implement refresh token rotation with \`jti\` claim tracking
3. Add token revocation list (Redis TTL-based) for logout
4. Migrate existing sessions via dual-mode middleware (accept both cookie and Bearer)

### Current Progress
- [x] Audit existing auth files
- [x] Design JWT token structure
- [x] Write Reflection R-003
- [ ] Implement token service
- [ ] Create refresh rotation logic
- [ ] Migration middleware`,
    events: architectEvents,
  },
  {
    id: "agent-2",
    name: "ψ₂ The Guardian",
    archetype: "guardian",
    task: "Awaiting auth module tests",
    status: "idle",
    autonomy: 2,
    position: { x: 200, y: 350 },
    dependsOn: ["agent-1"],
    outputFeeds: [],
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(3),
    events: [],
  },
  {
    id: "agent-3",
    name: "ψ₃ The Explorer",
    archetype: "explorer",
    task: "Researching API gateway patterns",
    status: "idle",
    autonomy: 4,
    position: { x: 80, y: 500 },
    dependsOn: ["agent-1"],
    outputFeeds: [],
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
    events: [],
  },
  {
    id: "agent-4",
    name: "ψ₄ The Alchemist",
    archetype: "alchemist",
    task: "Optimized database queries",
    status: "completed",
    autonomy: 3,
    progress: 100,
    position: { x: 400, y: 250 },
    dependsOn: [],
    outputFeeds: [],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    events: [
      { id: "ae-alch-1", type: "agent:started", timestamp: daysAgo(1), message: "Started optimizing queries" },
      { id: "ae-alch-2", type: "agent:completed", timestamp: daysAgo(1), message: "Completed — 12 queries optimized, avg 3.2x speedup" },
    ],
  },
]

// ─── Mock Agent Connections ────────────────

export const MOCK_CONNECTIONS = [
  { id: "conn-1", sourceId: "agent-1", targetId: "agent-2", isActive: true },
  { id: "conn-2", sourceId: "agent-1", targetId: "agent-3", isActive: false },
]

// ─── Mock Visions ──────────────────────────

const authRedesignTasks: VisionTask[] = [
  // Phase 1 — Foundation (3 done, 1 pending)
  { id: "vt-1", phase: 1, category: "setup", description: "Install JWT library (jose)", steps: ["npm install jose", "Add to auth module"], implemented: true },
  { id: "vt-2", phase: 1, category: "setup", description: "Create token service", steps: ["Define TokenService class", "Implement sign/verify methods", "Add token TTL config"], implemented: true },
  { id: "vt-3", phase: 1, category: "setup", description: "Create auth middleware", steps: ["Extract Bearer token from header", "Verify JWT signature", "Attach user to request context"], implemented: true },
  { id: "vt-4", phase: 1, category: "feature", description: "Implement refresh token rotation", steps: ["Generate refresh tokens with jti claim", "Store jti in Redis with TTL", "Rotate on each refresh", "Detect reuse and revoke family"], implemented: false },
  // Phase 2 — Core (0/6)
  { id: "vt-5", phase: 2, category: "feature", description: "OAuth2 provider integration", steps: ["Add Google OAuth2 flow", "Add GitHub OAuth2 flow", "Map provider profiles to users"], implemented: false },
  { id: "vt-6", phase: 2, category: "feature", description: "Session migration middleware", steps: ["Accept both cookie and Bearer", "Convert cookie sessions to JWT on first request", "Log migration events"], implemented: false },
  { id: "vt-7", phase: 2, category: "feature", description: "Token revocation list", steps: ["Redis-based revocation set", "Check on every auth request", "Auto-expire with TTL matching token lifetime"], implemented: false },
  { id: "vt-8", phase: 2, category: "feature", description: "Password reset flow", steps: ["Generate time-limited reset token", "Email delivery via SendGrid", "Validate and consume token on reset"], implemented: false },
  { id: "vt-9", phase: 2, category: "feature", description: "Multi-factor authentication", steps: ["TOTP setup with QR code", "Recovery codes generation", "Verification middleware"], implemented: false },
  { id: "vt-10", phase: 2, category: "feature", description: "Rate limiting on auth endpoints", steps: ["Configure express-rate-limit", "Apply to /login, /register, /refresh", "Return 429 with retry-after header"], implemented: false },
  // Phase 3 — Integration (0/3)
  { id: "vt-11", phase: 3, category: "integration", description: "Update all API routes to use new auth", steps: ["Replace session checks with JWT middleware", "Update user context types", "Remove deprecated session imports"], implemented: false },
  { id: "vt-12", phase: 3, category: "integration", description: "Client-side token management", steps: ["Implement token refresh interceptor", "Handle 401 responses with auto-refresh", "Secure token storage"], implemented: false },
  { id: "vt-13", phase: 3, category: "integration", description: "Audit logging for auth events", steps: ["Log all login/logout/refresh events", "Include IP and user-agent", "Store in audit table"], implemented: false },
  // Phase 4 — Testing (0/2)
  { id: "vt-14", phase: 4, category: "testing", description: "Unit tests for token service", steps: ["Test sign/verify cycle", "Test expiration handling", "Test refresh rotation", "Test revocation"], implemented: false },
  { id: "vt-15", phase: 4, category: "testing", description: "Integration tests for auth flow", steps: ["Test registration → login → refresh → logout", "Test expired token handling", "Test concurrent refresh race condition"], implemented: false },
]

export const MOCK_VISIONS: Vision[] = [
  {
    id: "vision-1",
    title: "Auth Redesign",
    overview: "Migrate from cookie-based sessions to JWT with refresh token rotation. Includes OAuth2 provider support, MFA, and comprehensive audit logging.",
    stage: "in_progress",
    priority: "high",
    assignedAgent: "agent-1",
    tasks: authRedesignTasks,
    totalTasks: 15,
    completedTasks: 3,
    changeHistory: [
      { id: "ch-1", timestamp: daysAgo(3), description: "Created vision from architecture review", author: "human" },
      { id: "ch-2", timestamp: daysAgo(1), description: "Assigned to The Architect agent", author: "human" },
      { id: "ch-3", timestamp: hoursAgo(2), description: "Agent began Phase 1 implementation", author: "agent", agentId: "agent-1", agentName: "The Architect" },
      { id: "ch-4", timestamp: minutesAgo(12), description: "Completed 3 of 4 Phase 1 tasks — JWT library, token service, auth middleware", author: "agent", agentId: "agent-1", agentName: "The Architect" },
    ],
    createdAt: daysAgo(3),
    updatedAt: minutesAgo(12),
  },
  {
    id: "vision-2",
    title: "API Gateway Layer",
    overview: "Introduce a unified API gateway for routing, rate limiting, and service discovery across microservices.",
    stage: "in_progress",
    priority: "medium",
    assignedAgent: "agent-3",
    tasks: [],
    totalTasks: 12,
    completedTasks: 5,
    changeHistory: [
      { id: "ch-5", timestamp: daysAgo(5), description: "Created from team planning session", author: "human" },
    ],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    id: "vision-3",
    title: "Dashboard Metrics",
    overview: "Add real-time metrics dashboard with system health, request latency, and error rates using Recharts.",
    stage: "review",
    priority: "low",
    assignedAgent: "agent-2",
    tasks: [],
    totalTasks: 8,
    completedTasks: 2,
    changeHistory: [],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(2),
  },
  {
    id: "vision-4",
    title: "Onboarding Flow",
    overview: "Multi-step onboarding wizard with workspace setup, team invitations, and initial project configuration.",
    stage: "done",
    priority: "medium",
    tasks: [],
    totalTasks: 8,
    completedTasks: 8,
    changeHistory: [],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(1),
  },
  {
    id: "vision-5",
    title: "Testing Strategy",
    overview: "Establish comprehensive testing strategy with unit, integration, and E2E test infrastructure.",
    stage: "backlog",
    priority: "high",
    tasks: [],
    totalTasks: 6,
    completedTasks: 0,
    changeHistory: [],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
]

// ─── Mock Reflections ──────────────────────

const r003Versions: ReflectionVersion[] = [
  {
    id: "rv-1",
    version: 1,
    diff: [],
    author: "agent",
    agentId: "agent-1",
    timestamp: hoursAgo(3),
    description: "Initial draft — proposing JWT over cookie sessions",
  },
  {
    id: "rv-2",
    version: 2,
    diff: [
      {
        oldStart: 12,
        oldCount: 3,
        newStart: 12,
        newCount: 5,
        lines: [
          { type: "removed", content: "Sessions are stored server-side in Redis.", lineNumber: 12 },
          { type: "removed", content: "This creates a single point of failure.", lineNumber: 13 },
          { type: "added", content: "Sessions are stored server-side in Redis, creating a single point of failure", lineNumber: 12 },
          { type: "added", content: "and requiring sticky sessions for horizontal scaling.", lineNumber: 13 },
          { type: "added", content: "JWT tokens are self-contained and can be verified by any service instance,", lineNumber: 14 },
          { type: "added", content: "enabling true stateless horizontal scaling.", lineNumber: 15 },
        ],
      },
    ],
    author: "agent",
    agentId: "agent-1",
    timestamp: hoursAgo(1),
    description: "Expanded rationale — added horizontal scaling argument",
  },
  {
    id: "rv-3",
    version: 3,
    diff: [
      {
        oldStart: 28,
        oldCount: 0,
        newStart: 28,
        newCount: 8,
        lines: [
          { type: "added", content: "## Migration Plan", lineNumber: 28 },
          { type: "added", content: "", lineNumber: 29 },
          { type: "added", content: "1. Deploy dual-mode middleware (accept cookie OR Bearer)", lineNumber: 30 },
          { type: "added", content: "2. New logins issue JWT; existing sessions continue working", lineNumber: 31 },
          { type: "added", content: "3. After 30 days, deprecate cookie path", lineNumber: 32 },
          { type: "added", content: "4. Remove cookie middleware after 60 days", lineNumber: 33 },
          { type: "added", content: "", lineNumber: 34 },
          { type: "added", content: "## Rollback Strategy", lineNumber: 35 },
        ],
      },
    ],
    author: "agent",
    agentId: "agent-1",
    timestamp: minutesAgo(28),
    description: "Added migration plan and rollback strategy",
  },
]

export const MOCK_REFLECTIONS: Reflection[] = [
  {
    id: "reflection-1",
    number: 1,
    title: "Use cookie-based sessions",
    status: "superseded",
    content: "# R-001: Use cookie-based sessions\n\n## Status\nSuperseded by R-003\n\n## Context\nThe application needs user authentication and session management.\n\n## Decision\nUse HTTP-only cookies with Redis-backed server-side sessions.\n\n## Consequences\n- Simple implementation\n- Requires sticky sessions for scaling\n- CSRF protection needed",
    author: "human",
    versions: [],
    supersededBy: "reflection-3",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: "reflection-2",
    number: 2,
    title: "Use PostgreSQL for persistence",
    status: "accepted",
    content: "# R-002: Use PostgreSQL for persistence\n\n## Status\nAccepted\n\n## Context\nWe need a primary database for application state. Requirements include ACID transactions, JSON support, and full-text search.\n\n## Decision\nUse PostgreSQL 16 with Drizzle ORM.\n\n## Consequences\n- Mature, battle-tested database\n- Excellent JSON support via jsonb\n- Built-in full-text search\n- Drizzle provides type-safe queries with minimal overhead",
    author: "human",
    versions: [],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: "reflection-3",
    number: 3,
    title: "Choose JWT over sessions",
    status: "accepted",
    content: "# R-003: Choose JWT over sessions\n\n## Status\nAccepted\n\n## Context\nThe existing cookie-based session system (R-001) creates scaling challenges. Sessions are stored server-side in Redis, creating a single point of failure and requiring sticky sessions for horizontal scaling. JWT tokens are self-contained and can be verified by any service instance, enabling true stateless horizontal scaling.\n\n## Decision\nMigrate to JWT with refresh token rotation using the `jose` library.\n\n### Token Structure\n- Access token: 15min TTL, contains user ID and roles\n- Refresh token: 7day TTL, includes `jti` claim for rotation tracking\n- Token family tracking via Redis for reuse detection\n\n## Migration Plan\n\n1. Deploy dual-mode middleware (accept cookie OR Bearer)\n2. New logins issue JWT; existing sessions continue working\n3. After 30 days, deprecate cookie path\n4. Remove cookie middleware after 60 days\n\n## Rollback Strategy\nRe-enable cookie middleware and revert login endpoint to issue sessions. Dual-mode middleware ensures backward compatibility during transition.\n\n## Consequences\n### Positive\n- Stateless auth enables horizontal scaling\n- No session store dependency\n- Portable across services\n\n### Negative\n- Token revocation requires additional infrastructure\n- Larger request headers\n- Must implement refresh rotation carefully to prevent token theft",
    author: "agent",
    agentId: "agent-1",
    versions: r003Versions,
    createdAt: hoursAgo(3),
    updatedAt: minutesAgo(28),
  },
  {
    id: "reflection-4",
    number: 4,
    title: "Adopt event sourcing for audit log",
    status: "proposed",
    content: "# R-004: Adopt event sourcing for audit log\n\n## Status\nProposed\n\n## Context\nWe need comprehensive audit logging for compliance. Traditional append-only tables lose context about state transitions.\n\n## Decision\nImplement event sourcing pattern for the audit log subsystem. Every state change is recorded as an immutable event with full context.\n\n## Consequences\n### Positive\n- Complete audit trail with temporal queries\n- Can replay events to reconstruct any past state\n- Natural fit for our agent event system\n\n### Negative\n- Added complexity for event store\n- Need projection/materialization for read queries\n- Storage growth requires event compaction strategy",
    author: "agent",
    agentId: "agent-3",
    versions: [],
    createdAt: minutesAgo(5),
    updatedAt: minutesAgo(5),
  },
]

// ─── Mock River Entries ────────────────────

export const MOCK_RIVER_ENTRIES: RiverEntry[] = [
  {
    id: "river-1",
    type: "vision",
    title: "Vision 'Auth Redesign' updated",
    description: "Completed 3 of 4 Phase 1 tasks — JWT library, token service, auth middleware",
    agent: { id: "agent-1", name: "The Architect", archetype: "architect" },
    timestamp: minutesAgo(12),
    linkedDocumentId: "vision-1",
    linkedDocumentType: "vision",
  },
  {
    id: "river-2",
    type: "reflection",
    title: "Reflection R-003 accepted",
    description: "Choose JWT over sessions — added migration plan and rollback strategy (v3)",
    agent: { id: "agent-1", name: "The Architect", archetype: "architect" },
    timestamp: minutesAgo(28),
    linkedDocumentId: "reflection-3",
    linkedDocumentType: "reflection",
  },
  {
    id: "river-3",
    type: "diagram",
    title: "Diagram auth-architecture.excalidraw updated",
    description: "Added JWT flow diagram with refresh rotation sequence",
    agent: { id: "agent-1", name: "The Architect", archetype: "architect" },
    timestamp: minutesAgo(35),
    stats: { nodesAdded: 4, edgesAdded: 3 },
  },
  {
    id: "river-4",
    type: "code",
    title: "src/auth/jwt.ts changed",
    description: "Created JWT token service with sign, verify, and refresh methods",
    agent: { id: "agent-1", name: "The Architect", archetype: "architect" },
    timestamp: hoursAgo(1),
    stats: { linesAdded: 47, linesRemoved: 12 },
    diffHunks: [
      {
        oldStart: 1,
        oldCount: 3,
        newStart: 1,
        newCount: 8,
        lines: [
          { type: "removed", content: 'import { SessionStore } from "./session-store"', lineNumber: 1 },
          { type: "removed", content: 'import { CookieHandler } from "./cookie-handler"', lineNumber: 2 },
          { type: "added", content: 'import { SignJWT, jwtVerify, type JWTPayload } from "jose"', lineNumber: 1 },
          { type: "added", content: "", lineNumber: 2 },
          { type: "added", content: "const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)", lineNumber: 3 },
          { type: "added", content: "const ACCESS_TTL = \"15m\"", lineNumber: 4 },
          { type: "added", content: "const REFRESH_TTL = \"7d\"", lineNumber: 5 },
        ],
      },
    ],
  },
  {
    id: "river-5",
    type: "agent",
    title: "The Architect started",
    description: "Began analyzing auth module for JWT migration",
    agent: { id: "agent-1", name: "The Architect", archetype: "architect" },
    timestamp: hoursAgo(2),
  },
  {
    id: "river-6",
    type: "reflection",
    title: "Reflection R-004 proposed",
    description: "Adopt event sourcing for audit log — awaiting human review",
    agent: { id: "agent-3", name: "The Explorer", archetype: "explorer" },
    timestamp: minutesAgo(5),
    linkedDocumentId: "reflection-4",
    linkedDocumentType: "reflection",
  },
  {
    id: "river-7",
    type: "agent",
    title: "The Alchemist completed",
    description: "Optimized 12 database queries — avg 3.2x speedup",
    agent: { id: "agent-4", name: "The Alchemist", archetype: "alchemist" },
    timestamp: daysAgo(1),
  },
  {
    id: "river-8",
    type: "vision",
    title: "Vision 'Onboarding Flow' marked done",
    description: "All 8 tasks completed — multi-step wizard, team invitations, project setup",
    timestamp: daysAgo(1),
    linkedDocumentId: "vision-4",
    linkedDocumentType: "vision",
  },
  {
    id: "river-9",
    type: "code",
    title: "src/db/queries/users.ts changed",
    description: "Optimized user lookup queries with composite index",
    agent: { id: "agent-4", name: "The Alchemist", archetype: "alchemist" },
    timestamp: daysAgo(1),
    stats: { linesAdded: 23, linesRemoved: 31 },
  },
  {
    id: "river-10",
    type: "status",
    title: "Project milestone reached",
    description: "Phase 1 infrastructure complete — 4 agents configured, 2 visions in progress",
    timestamp: daysAgo(2),
  },
]
