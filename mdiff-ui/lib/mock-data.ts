import type {
  Project,
  Diff,
  MDiffDocument,
  TimelineEntry,
  AgentState,
  Integration,
  DeliveryEntry,
  MDiffEvent,
  ArchitectureCommit,
  EventSubscriptions,
  PrdBoardItem,
  PrdTask,
} from "./types"

// ── Projects ──

export const mockProjects: Project[] = [
  {
    id: "payments-api",
    name: "payments-api",
    adrCount: 4,
    prdCount: 3,
    lastDiffAt: new Date("2026-02-08T14:32:00"),
    agentStatus: "active",
    description: "Payment processing microservice with Stripe integration",
    createdAt: new Date("2026-01-15T09:00:00"),
  },
  {
    id: "auth-service",
    name: "auth-service",
    adrCount: 7,
    prdCount: 5,
    lastDiffAt: new Date("2026-02-08T11:15:00"),
    agentStatus: "idle",
    description: "OAuth2 + JWT authentication service",
    createdAt: new Date("2026-01-10T09:00:00"),
  },
  {
    id: "mobile-app",
    name: "mobile-app",
    adrCount: 2,
    prdCount: 1,
    lastDiffAt: new Date("2026-02-07T14:00:00"),
    agentStatus: "idle",
    description: "React Native mobile client",
    createdAt: new Date("2026-02-01T09:00:00"),
  },
]

// ── Diffs ──

export const mockDiffs: Diff[] = [
  {
    id: "diff-1",
    projectId: "payments-api",
    type: "adr",
    documentName: "ADR-0004: Add Redis Caching Layer",
    description: "Add Redis caching layer for payment lookups",
    timestamp: new Date("2026-02-08T14:32:00"),
    author: "agent",
    stats: { linesAdded: 23, linesRemoved: 5 },
    hunks: [
      {
        oldStart: 12,
        oldCount: 6,
        newStart: 12,
        newCount: 8,
        lines: [
          { type: "context", content: "The application currently makes direct", lineNumber: 12 },
          { type: "context", content: "database queries for every API request.", lineNumber: 13 },
          { type: "added", content: "Under peak load (>1000 req/s), this causes", lineNumber: 14 },
          { type: "added", content: "p99 latency spikes exceeding 2 seconds.", lineNumber: 15 },
          { type: "context", content: "We need a strategy to reduce database", lineNumber: 16 },
          { type: "context", content: "pressure while maintaining data freshness.", lineNumber: 17 },
        ],
      },
      {
        oldStart: 28,
        oldCount: 5,
        newStart: 30,
        newCount: 12,
        lines: [
          { type: "context", content: "## Decision", lineNumber: 30 },
          { type: "removed", content: "We will add caching later.", lineNumber: 31 },
          { type: "added", content: "We will implement a Redis-based caching layer:", lineNumber: 31 },
          { type: "added", content: "- **Cache-aside pattern** for read-heavy endpoints", lineNumber: 32 },
          { type: "added", content: "- **TTL-based invalidation** with 5-minute default", lineNumber: 33 },
          { type: "added", content: "- **Cache warming** on deployment for critical paths", lineNumber: 34 },
          { type: "added", content: "- **Tag-based invalidation** for related data updates", lineNumber: 35 },
          { type: "context", content: "", lineNumber: 36 },
          { type: "context", content: "## Consequences", lineNumber: 37 },
          { type: "removed", content: "TBD", lineNumber: 38 },
          { type: "added", content: "- Reduced database load by ~60%", lineNumber: 38 },
          { type: "added", content: "- P99 response times under 200ms for cached queries", lineNumber: 39 },
          { type: "added", content: "- Added infrastructure dependency (Redis)", lineNumber: 40 },
        ],
      },
    ],
  },
  {
    id: "diff-2",
    projectId: "payments-api",
    type: "excalidraw",
    documentName: "Architecture Diagram",
    description: "Architecture diagram updated — Redis cache added",
    timestamp: new Date("2026-02-08T14:28:00"),
    author: "agent",
    stats: { nodesAdded: 3, edgesAdded: 2 },
  },
  {
    id: "diff-3",
    projectId: "payments-api",
    type: "prd",
    documentName: "PRD-0004: Redis Caching Implementation",
    description: "Generated implementation plan with 15 tasks",
    timestamp: new Date("2026-02-08T14:34:00"),
    author: "agent",
    stats: { linesAdded: 95 },
    hunks: [
      {
        oldStart: 0,
        oldCount: 0,
        newStart: 1,
        newCount: 6,
        lines: [
          { type: "added", content: "# PRD-0004: Redis Caching Implementation", lineNumber: 1 },
          { type: "added", content: "", lineNumber: 2 },
          { type: "added", content: "## Phase 1: Core Setup", lineNumber: 3 },
          { type: "added", content: "### Task 1: Initialize Redis connection pool", lineNumber: 4 },
          { type: "added", content: "### Task 2: Implement cache-aside pattern", lineNumber: 5 },
          { type: "added", content: "### Task 3: Add TTL configuration", lineNumber: 6 },
        ],
      },
    ],
  },
  {
    id: "diff-4",
    projectId: "auth-service",
    type: "adr",
    documentName: "ADR-0007: Rate Limiting Strategy",
    description: "Status change: Proposed → Accepted",
    timestamp: new Date("2026-02-08T11:15:00"),
    author: "user",
    stats: { linesAdded: 2, linesRemoved: 2 },
    hunks: [
      {
        oldStart: 3,
        oldCount: 3,
        newStart: 3,
        newCount: 3,
        lines: [
          { type: "context", content: "## Status", lineNumber: 3 },
          { type: "removed", content: "Proposed (2026-02-07)", lineNumber: 4 },
          { type: "added", content: "Accepted (2026-02-08)", lineNumber: 4 },
          { type: "context", content: "", lineNumber: 5 },
        ],
      },
    ],
  },
  {
    id: "diff-5",
    projectId: "auth-service",
    type: "prd",
    documentName: "PRD-0007: Rate Limiting Implementation",
    description: "Rate limiting implementation plan",
    timestamp: new Date("2026-02-07T17:45:00"),
    author: "agent",
    stats: { linesAdded: 95 },
  },
  {
    id: "diff-6",
    projectId: "mobile-app",
    type: "prd",
    documentName: "PRD-0002: Mobile App MVP",
    description: "All 18 tasks completed",
    timestamp: new Date("2026-02-07T14:00:00"),
    author: "agent",
    stats: { linesAdded: 12, linesRemoved: 8 },
  },
]

// ── Documents ──

export const mockMDiffDocuments: MDiffDocument[] = [
  {
    id: "doc-adr-0001",
    name: "ADR-0001: Database Selection",
    type: "adr",
    status: "accepted",
    lastModified: new Date("2026-01-20T10:00:00"),
    diffCount: 2,
    projectId: "payments-api",
    content: `# ADR-0001: Database Selection

## Status
Accepted (2026-01-20)

## Context
We need a primary database for the payments service. Key requirements:
- ACID transactions for payment processing
- High write throughput for transaction logging
- JSON support for flexible metadata storage

## Decision
We will use PostgreSQL 16 as our primary database.
- Proven ACID compliance for financial transactions
- JSONB columns for flexible payment metadata
- Excellent ecosystem and tooling support

## Consequences
- Need PostgreSQL expertise on the team
- Connection pooling required for high concurrency (PgBouncer)
- Migration tooling: use Prisma for schema management`,
  },
  {
    id: "doc-adr-0002",
    name: "ADR-0002: API Framework",
    type: "adr",
    status: "accepted",
    lastModified: new Date("2026-01-22T14:00:00"),
    diffCount: 1,
    projectId: "payments-api",
  },
  {
    id: "doc-adr-0003",
    name: "ADR-0003: Authentication",
    type: "adr",
    status: "accepted",
    lastModified: new Date("2026-01-28T09:00:00"),
    diffCount: 3,
    projectId: "payments-api",
  },
  {
    id: "doc-adr-0004",
    name: "ADR-0004: Redis Caching Layer",
    type: "adr",
    status: "proposed",
    lastModified: new Date("2026-02-08T14:32:00"),
    diffCount: 1,
    projectId: "payments-api",
    content: `# ADR-0004: Add Redis Caching Layer

## Status
Proposed (2026-02-08)

## Context
The application currently makes direct database queries for every API request.
Under peak load (>1000 req/s), this causes p99 latency spikes exceeding 2 seconds.
We need a strategy to reduce database pressure while maintaining data freshness.

## Decision
We will implement a Redis-based caching layer with the following strategy:
- **Cache-aside pattern** for read-heavy endpoints
- **TTL-based invalidation** with 5-minute default TTL
- **Cache warming** on deployment for critical paths
- **Tag-based invalidation** for related data updates

## Consequences
- Reduced database load by ~60%
- P99 response times under 200ms for cached queries
- Added infrastructure dependency (Redis)
- Cache invalidation complexity for writes`,
  },
  {
    id: "doc-prd-0003",
    name: "PRD-0003: Auth Integration",
    type: "prd",
    status: "completed",
    lastModified: new Date("2026-02-01T16:00:00"),
    diffCount: 4,
    projectId: "payments-api",
  },
  {
    id: "doc-prd-0004",
    name: "PRD-0004: Redis Caching",
    type: "prd",
    status: "active",
    lastModified: new Date("2026-02-08T14:34:00"),
    diffCount: 1,
    projectId: "payments-api",
  },
  {
    id: "doc-log-0004-1",
    name: "PRD-0004 Run Log #1",
    type: "prd-log",
    status: "active",
    lastModified: new Date("2026-02-08T14:34:00"),
    diffCount: 1,
    projectId: "payments-api",
  },
]

// ── Timeline Entries ──

export const mockTimelineEntries: TimelineEntry[] = [
  {
    id: "tl-1",
    timestamp: new Date("2026-02-08T14:34:00"),
    projectName: "payments-api",
    type: "prd",
    description: 'PRD-0004 created · "Redis caching implementation"',
    stats: { linesAdded: 95 },
    linkedEntries: ["15 tasks generated"],
  },
  {
    id: "tl-2",
    timestamp: new Date("2026-02-08T14:32:00"),
    projectName: "payments-api",
    type: "adr",
    description: 'ADR-0004 created · "Add Redis caching layer"',
    stats: { linesAdded: 120 },
    linkedEntries: ["→ PRD generated (15 tasks)", "→ Excalidraw: +3 nodes, +2 edges"],
  },
  {
    id: "tl-3",
    timestamp: new Date("2026-02-08T14:28:00"),
    projectName: "payments-api",
    type: "excalidraw",
    description: "Architecture diagram updated",
    stats: { nodesAdded: 3, edgesAdded: 2 },
  },
  {
    id: "tl-4",
    timestamp: new Date("2026-02-08T11:15:00"),
    projectName: "auth-service",
    type: "status-change",
    description: "ADR-0007 status: Proposed → Accepted",
    linkedEntries: ["Approved by agent"],
  },
  {
    id: "tl-5",
    timestamp: new Date("2026-02-08T09:30:00"),
    projectName: "auth-service",
    type: "prd",
    description: "PRD-0007 updated — Task 12/15 marked complete",
    stats: { linesAdded: 3, linesRemoved: 3 },
  },
  {
    id: "tl-6",
    timestamp: new Date("2026-02-07T17:45:00"),
    projectName: "auth-service",
    type: "adr",
    description: 'ADR-0007 created · "Rate limiting"',
    stats: { linesAdded: 95 },
    linkedEntries: ["→ PRD generated (12 tasks)"],
  },
  {
    id: "tl-7",
    timestamp: new Date("2026-02-07T14:00:00"),
    projectName: "mobile-app",
    type: "prd",
    description: "PRD-0002 completed",
    linkedEntries: ["All 18 tasks implemented · Duration: 4h 23m"],
  },
  {
    id: "tl-8",
    timestamp: new Date("2026-02-07T09:00:00"),
    projectName: "mobile-app",
    type: "adr",
    description: 'ADR-0002 created · "Navigation architecture"',
    stats: { linesAdded: 67 },
  },
  {
    id: "tl-9",
    timestamp: new Date("2026-02-06T16:20:00"),
    projectName: "auth-service",
    type: "adr",
    description: 'ADR-0006 created · "Auth system design"',
    stats: { linesAdded: 87 },
  },
  {
    id: "tl-10",
    timestamp: new Date("2026-02-06T10:00:00"),
    projectName: "payments-api",
    type: "prd",
    description: "PRD-0003 completed — Auth integration done",
    linkedEntries: ["All 10 tasks implemented"],
  },
]

// ── PRD Board Items ──

// ── PRD Task data ──

const redisCachingTasks: PrdTask[] = [
  // Phase 1 — Foundation (3 tasks, all done)
  { phase: 1, category: "setup", description: "Install and configure Redis client with connection pooling", steps: ["Install ioredis as dependency", "Create src/lib/redis.ts with singleton client", "Configure connection pool: maxRetriesPerRequest=3, connectTimeout=5000ms", "Add REDIS_URL to env schema and .env.example"], implemented: true, improvements: [], improvements_done: false },
  { phase: 1, category: "setup", description: "Create CacheService class with get/set/invalidate methods", steps: ["Create src/services/cache-service.ts", "Implement get(key): check cache, return parsed value or null", "Implement set(key, value, ttl): serialize and store with TTL", "Implement invalidate(key): delete from cache, log invalidation"], implemented: true, improvements: [], improvements_done: false },
  { phase: 1, category: "setup", description: "Add environment-based TTL configuration", steps: ["Create src/config/cache-config.ts with TTL presets", "Default: 300s, Payment lookups: 60s, User sessions: 1800s", "Support per-key TTL override via config map"], implemented: true, improvements: [], improvements_done: false },
  // Phase 2 — Core Implementation (4 tasks, not done)
  { phase: 2, category: "feature", description: "Implement cache-aside read pattern for payment lookups", steps: ["Wrap PaymentRepository.findById with CacheService.get", "On cache miss: fetch from DB, store in cache with payment TTL", "Add cache hit/miss logging for observability", "Verify with manual test: first call hits DB, second hits cache"], implemented: false, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Add cache write-through for payment creation", steps: ["After successful payment insert, write to cache", "Use transaction-safe pattern: DB write → cache write", "Handle cache write failure gracefully (log, don't fail request)"], implemented: false, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement TTL-based invalidation with configurable expiry", steps: ["Set TTL on all cache entries via CacheService.set", "Add cache:flush admin endpoint for manual invalidation", "Implement stale-while-revalidate pattern for non-critical data"], implemented: false, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Add tag-based invalidation for related payment data", steps: ["Implement tag registry: map tags to cache keys", "CacheService.invalidateByTag(tag): remove all keys with tag", "Tag payment entries by merchant_id and customer_id", "On payment update: invalidate related tags"], implemented: false, improvements: [], improvements_done: false },
  // Phase 3 — Integration (3 tasks)
  { phase: 3, category: "integration", description: "Wire CacheService to payment lookup API endpoints", steps: ["Update GET /api/payments/:id to use cached reads", "Update GET /api/payments?merchant_id= to use tag-based cache", "Add X-Cache-Status response header (HIT/MISS)"], implemented: false, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Add cache warming script for deployment pipeline", steps: ["Create scripts/warm-cache.ts for critical payment paths", "Query top 1000 active merchants and pre-fill cache", "Add to CI/CD post-deploy step"], implemented: false, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Connect cache metrics to monitoring dashboard", steps: ["Emit cache.hit and cache.miss StatsD metrics", "Add Grafana panel for cache hit ratio and latency", "Set alert threshold: hit ratio < 80% triggers warning"], implemented: false, improvements: [], improvements_done: false },
  // Phase 4 — Hardening (2 tasks)
  { phase: 4, category: "optimization", description: "Add circuit breaker for Redis connection failures", steps: ["Implement circuit breaker with 5-failure threshold", "Open state: bypass cache, serve directly from DB", "Half-open: test one request per 30s before closing"], implemented: false, improvements: [], improvements_done: false },
  { phase: 4, category: "optimization", description: "Implement cache stampede prevention", steps: ["Add probabilistic early expiration (XFetch algorithm)", "Implement request coalescing for concurrent cache misses", "Load test with 1000 concurrent requests to same key"], implemented: false, improvements: [], improvements_done: false },
  // Phase 5 — Security (1 task)
  { phase: 5, category: "security", description: "Audit cache key patterns and add key namespacing", steps: ["Prefix all keys with service:env: namespace", "Ensure no PII in cache keys (hash sensitive identifiers)", "Add TTL cap of 24h to prevent stale sensitive data", "Review Redis ACLs and network access controls"], implemented: false, improvements: [], improvements_done: false },
  // Phase 6 — Testing (2 tasks)
  { phase: 6, category: "testing", description: "Unit tests for CacheService with Redis mock", steps: ["Test get/set/invalidate with ioredis-mock", "Test TTL expiry behavior", "Test circuit breaker state transitions", "Test tag-based invalidation clears correct keys"], implemented: false, improvements: [], improvements_done: false },
  { phase: 6, category: "testing", description: "Integration tests with Redis testcontainer", steps: ["Spin up Redis container in test setup", "Test full cache-aside flow end-to-end", "Test cache warming script execution", "Verify metrics emission on hit/miss"], implemented: false, improvements: [], improvements_done: false },
]

const idempotencyKeysTasks: PrdTask[] = [
  { phase: 1, category: "setup", description: "Create idempotency_keys table with unique constraints", steps: ["Add Prisma migration for idempotency_keys table", "Columns: key (unique), response_body, status_code, created_at, expires_at", "Add index on expires_at for cleanup job"], implemented: true, improvements: ["Add partitioning by date for better cleanup performance"], improvements_done: false },
  { phase: 1, category: "feature", description: "Implement IdempotencyService with key validation", steps: ["Create src/services/idempotency-service.ts", "check(key): return cached response or null", "store(key, response, statusCode): persist with 24h TTL"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Add idempotency middleware to payment mutation endpoints", steps: ["Create src/middleware/idempotency.ts Express middleware", "Extract Idempotency-Key header from request", "If key exists: return cached response immediately", "If new key: proceed, then store response on success"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Wire middleware to all payment mutation endpoints", steps: ["Apply to POST /api/payments", "Apply to POST /api/refunds", "Apply to PUT /api/payments/:id/capture"], implemented: true, improvements: [], improvements_done: false },
  { phase: 4, category: "testing", description: "Unit and integration tests for idempotency flow", steps: ["Test duplicate request returns cached response", "Test different keys produce independent responses", "Test expired keys allow re-processing", "Load test: 100 concurrent requests with same key"], implemented: true, improvements: [], improvements_done: false },
  { phase: 4, category: "security", description: "Validate key format and add TTL cleanup", steps: ["Enforce UUID v4 format for idempotency keys", "Add cron job to purge keys older than 24h", "Rate limit key creation per client IP"], implemented: true, improvements: [], improvements_done: false },
]

const webhookDeliveryTasks: PrdTask[] = [
  { phase: 1, category: "setup", description: "Create webhook_endpoints and webhook_events tables", steps: ["Add Prisma migrations for both tables", "webhook_endpoints: url, secret, active, events[]", "webhook_events: endpoint_id, payload, status, attempts, next_retry_at"], implemented: false, improvements: [], improvements_done: false },
  { phase: 1, category: "setup", description: "Create WebhookService with registration and delivery", steps: ["Create src/services/webhook-service.ts", "register(url, events, secret): create endpoint", "deliver(event, payload): fan out to matching endpoints"], implemented: false, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement HMAC signature generation for payloads", steps: ["Generate SHA-256 HMAC using endpoint secret", "Include timestamp in signature to prevent replay attacks", "Set X-Webhook-Signature and X-Webhook-Timestamp headers"], implemented: false, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Add exponential retry with backoff", steps: ["Retry schedule: 1m, 5m, 30m, 2h, 12h (5 attempts max)", "Use Bull queue for delayed retry scheduling", "Mark endpoint as failing after 5 consecutive failures"], implemented: false, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Emit webhook events from payment lifecycle", steps: ["payment.created, payment.captured, payment.failed, refund.created", "Serialize event payload with consistent schema", "Wire into existing payment service event handlers"], implemented: false, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Add webhook management API endpoints", steps: ["POST /api/webhooks — register endpoint", "GET /api/webhooks — list endpoints", "DELETE /api/webhooks/:id — remove endpoint", "GET /api/webhooks/:id/events — delivery log"], implemented: false, improvements: [], improvements_done: false },
  { phase: 4, category: "testing", description: "Integration tests for webhook delivery flow", steps: ["Test successful delivery with signature verification", "Test retry behavior on 5xx responses", "Test endpoint deactivation after max failures"], implemented: false, improvements: [], improvements_done: false },
  { phase: 5, category: "security", description: "Audit webhook endpoint validation and secrets", steps: ["Validate URL format and reject internal/private IPs", "Enforce HTTPS-only webhook URLs in production", "Rotate secrets via API with grace period for old signatures"], implemented: false, improvements: [], improvements_done: false },
]

const authIntegrationTasks: PrdTask[] = [
  { phase: 1, category: "setup", description: "Install and configure JWT verification library", steps: ["Install jose for JWT validation", "Configure JWKS endpoint URL from auth-service"], implemented: true, improvements: [], improvements_done: false },
  { phase: 1, category: "setup", description: "Create auth middleware for Express routes", steps: ["Extract Bearer token from Authorization header", "Verify JWT signature against JWKS", "Attach decoded user to request context"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement role-based access control", steps: ["Parse roles from JWT claims", "Create requireRole(role) middleware factory", "Apply admin role to management endpoints"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Add API key authentication for service-to-service", steps: ["Create api_keys table with hashed keys", "Implement X-API-Key header validation middleware", "Support both JWT and API key auth on endpoints"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement token refresh flow", steps: ["Add /api/auth/refresh endpoint", "Validate refresh token and issue new access token", "Rotate refresh token on use"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Wire auth middleware to all API routes", steps: ["Apply JWT auth to all /api/* routes", "Exclude health check and public endpoints", "Add auth context to request logging"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Add user context to audit logging", steps: ["Log user_id and roles on every authenticated request", "Add correlation ID for request tracing"], implemented: true, improvements: [], improvements_done: false },
  { phase: 4, category: "security", description: "Security audit of auth implementation", steps: ["Verify token expiry is enforced (max 15min access)", "Test with expired, malformed, and tampered tokens", "Ensure JWKS cache refreshes on key rotation"], implemented: true, improvements: [], improvements_done: false },
  { phase: 5, category: "testing", description: "Unit tests for auth middleware", steps: ["Test valid token passes through", "Test expired token returns 401", "Test missing token returns 401", "Test role-based access returns 403"], implemented: true, improvements: [], improvements_done: false },
  { phase: 5, category: "testing", description: "Integration tests for auth flow", steps: ["Test full login → access → refresh → access cycle", "Test API key authentication end-to-end"], implemented: true, improvements: [], improvements_done: false },
]

const rateLimitingAuthTasks: PrdTask[] = [
  { phase: 1, category: "setup", description: "Install rate-limiter-flexible and configure Redis backend", steps: ["Install rate-limiter-flexible package", "Configure RateLimiterRedis with existing Redis connection"], implemented: true, improvements: [], improvements_done: false },
  { phase: 1, category: "setup", description: "Create RateLimitService with configurable windows", steps: ["Create src/services/rate-limit-service.ts", "Support sliding window algorithm", "Configure per-endpoint limits via config map"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement sliding window rate limiter", steps: ["Track requests per client IP in Redis sorted sets", "Window size: 60s for login, 300s for registration", "Return X-RateLimit-Remaining and X-RateLimit-Reset headers"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Add tiered rate limits by authentication status", steps: ["Unauthenticated: 20 req/min", "Authenticated: 100 req/min", "Service-to-service: 1000 req/min"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement progressive penalties for abuse", steps: ["Track violations per IP over 24h window", "3+ violations: reduce limit by 50%", "10+ violations: block for 1 hour"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Wire rate limiting to login and registration endpoints", steps: ["Apply to POST /api/auth/login", "Apply to POST /api/auth/register", "Apply to POST /api/auth/forgot-password"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Wire rate limiting to token endpoints", steps: ["Apply to POST /api/auth/refresh", "Apply to POST /api/auth/verify-email", "Apply to POST /api/auth/reset-password"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Add rate limit metrics to monitoring", steps: ["Emit rate_limit.hit and rate_limit.exceeded metrics", "Add Grafana dashboard for rate limit events", "Set alert on spike in exceeded events"], implemented: true, improvements: [], improvements_done: false },
  { phase: 4, category: "optimization", description: "Add IP allowlisting for internal services", steps: ["Maintain allowlist in environment config", "Skip rate limiting for allowlisted CIDRs", "Log allowlist bypasses for audit"], implemented: true, improvements: [], improvements_done: false },
  { phase: 4, category: "optimization", description: "Implement rate limit response caching", steps: ["Cache 429 responses to avoid re-computation", "Use Redis TTL aligned with rate limit window"], implemented: true, improvements: [], improvements_done: false },
  { phase: 4, category: "optimization", description: "Add distributed rate limiting across instances", steps: ["Use Redis atomic operations for consistency", "Test with multiple service replicas", "Verify no race conditions under load"], implemented: true, improvements: [], improvements_done: false },
  { phase: 5, category: "security", description: "Audit rate limit bypass vectors", steps: ["Test with X-Forwarded-For header spoofing", "Ensure proxy trust is correctly configured", "Verify IPv6 and IPv4 are handled consistently"], implemented: true, improvements: [], improvements_done: false },
  { phase: 6, category: "testing", description: "Unit tests for RateLimitService", steps: ["Test window boundary behavior", "Test tiered limits by auth status", "Test progressive penalty escalation"], implemented: false, improvements: [], improvements_done: false },
  { phase: 6, category: "testing", description: "Integration tests with concurrent requests", steps: ["Send N+1 requests and verify 429 on overflow", "Test rate limit reset after window expiry", "Test distributed consistency with parallel clients"], implemented: false, improvements: [], improvements_done: false },
  { phase: 7, category: "documentation", description: "Document rate limiting behavior for API consumers", steps: ["Add rate limit section to API docs", "Document response headers and retry-after behavior", "Add examples for handling 429 responses in client SDKs"], implemented: false, improvements: [], improvements_done: false },
]

const mfaSupportTasks: PrdTask[] = [
  { phase: 1, category: "setup", description: "Install TOTP library and configure secret generation", steps: ["Install otpauth package", "Create src/services/mfa-service.ts", "Implement secret generation with base32 encoding"], implemented: false, improvements: [], improvements_done: false },
  { phase: 1, category: "setup", description: "Add MFA columns to users table", steps: ["Migration: add mfa_enabled, mfa_secret, mfa_backup_codes to users", "Encrypt mfa_secret at rest using app-level encryption"], implemented: false, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement TOTP enrollment flow", steps: ["Generate secret and QR code URI", "Return QR code data for authenticator app scanning", "Require verification of first code before enabling"], implemented: false, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement TOTP verification on login", steps: ["After password verification, check if MFA enabled", "Prompt for TOTP code as second factor", "Validate code with 30s window and 1-step tolerance"], implemented: false, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Generate and manage backup codes", steps: ["Generate 10 single-use backup codes on enrollment", "Hash codes before storing in database", "Allow code regeneration (invalidates old codes)"], implemented: false, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Add MFA management API endpoints", steps: ["POST /api/auth/mfa/enroll — start enrollment", "POST /api/auth/mfa/verify — verify and enable", "DELETE /api/auth/mfa — disable MFA (requires current code)", "POST /api/auth/mfa/backup-codes — regenerate"], implemented: false, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Update login flow to support MFA challenge", steps: ["Return mfa_required flag on initial login if MFA enabled", "Add POST /api/auth/mfa/challenge endpoint", "Issue session token only after MFA verification"], implemented: false, improvements: [], improvements_done: false },
  { phase: 4, category: "optimization", description: "Add rate limiting to MFA verification attempts", steps: ["Max 5 attempts per 15-minute window", "Lock account after 10 failed attempts in 1 hour", "Send notification email on lockout"], implemented: false, improvements: [], improvements_done: false },
  { phase: 5, category: "security", description: "Security audit of MFA implementation", steps: ["Verify TOTP secrets are encrypted at rest", "Test timing-safe comparison for code validation", "Ensure backup codes are single-use and hashed", "Audit MFA bypass paths (password reset, admin)"], implemented: false, improvements: [], improvements_done: false },
  { phase: 6, category: "testing", description: "Unit tests for MFA service", steps: ["Test TOTP generation and validation", "Test backup code generation and consumption", "Test enrollment flow state machine"], implemented: false, improvements: [], improvements_done: false },
  { phase: 6, category: "testing", description: "Integration tests for MFA login flow", steps: ["Test login with MFA enabled requires second factor", "Test backup code login succeeds and invalidates code", "Test MFA disable requires valid current code"], implemented: false, improvements: [], improvements_done: false },
  { phase: 7, category: "documentation", description: "Document MFA setup for end users", steps: ["Add MFA setup guide with screenshots", "Document backup code recovery process", "Add troubleshooting section for common issues"], implemented: false, improvements: [], improvements_done: false },
]

const sessionMgmtTasks: PrdTask[] = [
  { phase: 1, category: "setup", description: "Configure Redis-backed session store", steps: ["Install connect-redis and express-session", "Create session store with Redis client"], implemented: true, improvements: [], improvements_done: false },
  { phase: 1, category: "setup", description: "Define session schema and serialization", steps: ["Define session data interface: userId, roles, createdAt, lastActivity", "Configure JSON serialization with type preservation"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement session creation and validation", steps: ["Create session on successful authentication", "Validate session on each request via middleware", "Return 401 on expired or invalid sessions"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Add session rotation on privilege escalation", steps: ["Regenerate session ID after login", "Regenerate on role change or MFA verification", "Invalidate old session ID immediately"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Add session listing and revocation endpoints", steps: ["GET /api/sessions — list active sessions for user", "DELETE /api/sessions/:id — revoke specific session", "DELETE /api/sessions — revoke all sessions (logout everywhere)"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Wire session middleware to all authenticated routes", steps: ["Apply session validation after auth middleware", "Track last activity timestamp on each request"], implemented: true, improvements: [], improvements_done: false },
  { phase: 4, category: "security", description: "Audit session security configuration", steps: ["Verify secure cookie flags: httpOnly, secure, sameSite=strict", "Set session TTL to 30 minutes idle, 24h absolute", "Test session fixation prevention"], implemented: true, improvements: [], improvements_done: false },
  { phase: 5, category: "testing", description: "Tests for session lifecycle", steps: ["Test session creation, validation, rotation, and revocation", "Test idle timeout and absolute expiry", "Test concurrent session limits"], implemented: true, improvements: [], improvements_done: false },
]

const oauthProvidersTasks: PrdTask[] = [
  { phase: 1, category: "setup", description: "Install OAuth client library and configure providers", steps: ["Install arctic for OAuth 2.0 flows", "Configure Google, GitHub, Apple client credentials in env"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement Google OAuth sign-in", steps: ["Add GET /api/auth/google — redirect to Google consent", "Add GET /api/auth/google/callback — exchange code for tokens", "Create or link user account from Google profile"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement GitHub OAuth sign-in", steps: ["Add GET /api/auth/github — redirect to GitHub authorize", "Add GET /api/auth/github/callback — exchange code", "Fetch primary email via GitHub API if not in profile"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement Apple Sign In", steps: ["Add GET /api/auth/apple — redirect to Apple authorize", "Add POST /api/auth/apple/callback — handle form_post response", "Parse identity token for user info (name only on first sign-in)"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "feature", description: "Account linking for existing users", steps: ["Allow linking OAuth provider to existing email-based account", "Prevent duplicate accounts for same email across providers", "Add GET /api/auth/providers — list linked providers"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Wire OAuth routes to session creation", steps: ["Create session after successful OAuth callback", "Set same session cookie as password-based login", "Redirect to app with session established"], implemented: true, improvements: [], improvements_done: false },
  { phase: 4, category: "security", description: "Audit OAuth implementation security", steps: ["Verify state parameter prevents CSRF", "Verify PKCE is used for all providers", "Test with invalid/expired codes and tokens"], implemented: true, improvements: [], improvements_done: false },
  { phase: 5, category: "testing", description: "Unit tests for OAuth service", steps: ["Mock OAuth provider responses", "Test account creation and linking logic", "Test error handling for denied/failed OAuth"], implemented: true, improvements: [], improvements_done: false },
  { phase: 5, category: "testing", description: "Integration tests for OAuth flows", steps: ["Test full redirect → callback → session flow", "Test account linking prevents duplicates", "Test provider unlinking preserves account access"], implemented: true, improvements: [], improvements_done: false },
]

const mobileAppMvpTasks: PrdTask[] = [
  { phase: 1, category: "setup", description: "Initialize React Native project with Expo", steps: ["npx create-expo-app with TypeScript template", "Configure path aliases and ESLint"], implemented: true, improvements: [], improvements_done: false },
  { phase: 1, category: "setup", description: "Configure navigation with expo-router", steps: ["Set up file-based routing structure", "Create tab navigator with Home, Search, Profile tabs"], implemented: true, improvements: [], improvements_done: false },
  { phase: 1, category: "setup", description: "Set up design system and theme", steps: ["Create theme tokens: colors, spacing, typography", "Build base components: Text, Button, Card, Input"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement home feed screen", steps: ["Create FeedScreen with FlatList", "Build FeedCard component with image, title, metadata", "Add pull-to-refresh and infinite scroll"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement search screen with filters", steps: ["Create SearchScreen with search bar", "Add debounced search with API integration", "Build filter chips for category filtering"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement user profile screen", steps: ["Create ProfileScreen with user info header", "Add settings list with navigation", "Implement avatar upload with image picker"], implemented: true, improvements: [], improvements_done: false },
  { phase: 2, category: "feature", description: "Implement detail screen with deep linking", steps: ["Create DetailScreen with full content view", "Configure deep linking scheme for sharing", "Add share button with native share sheet"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Set up API client with auth token management", steps: ["Create API client with axios and interceptors", "Store auth token in SecureStore", "Add automatic token refresh on 401"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Implement offline-first data layer", steps: ["Set up MMKV for fast local storage", "Implement optimistic updates with rollback", "Queue mutations when offline, sync on reconnect"], implemented: true, improvements: [], improvements_done: false },
  { phase: 3, category: "integration", description: "Add push notification registration", steps: ["Request push notification permissions", "Register device token with backend", "Handle notification tap to navigate to content"], implemented: true, improvements: [], improvements_done: false },
  { phase: 4, category: "optimization", description: "Optimize list rendering performance", steps: ["Implement FlashList for large lists", "Add image caching with expo-image", "Profile and fix re-render issues with React DevTools"], implemented: true, improvements: [], improvements_done: false },
  { phase: 4, category: "optimization", description: "Add skeleton loading states", steps: ["Create Skeleton component with shimmer animation", "Add skeletons to feed, profile, and detail screens"], implemented: true, improvements: [], improvements_done: false },
  { phase: 4, category: "optimization", description: "Implement app startup optimization", steps: ["Minimize splash screen duration", "Lazy load non-critical screens", "Prefetch initial feed data during splash"], implemented: true, improvements: [], improvements_done: false },
  { phase: 5, category: "security", description: "Security audit of mobile app", steps: ["Verify SecureStore usage for sensitive data", "Test certificate pinning configuration", "Audit deep link handling for injection"], implemented: true, improvements: [], improvements_done: false },
  { phase: 6, category: "testing", description: "Unit tests for core components", steps: ["Test navigation flow with expo-router testing", "Test API client interceptor logic", "Test offline queue sync behavior"], implemented: true, improvements: [], improvements_done: false },
  { phase: 6, category: "testing", description: "E2E tests with Detox", steps: ["Configure Detox for iOS and Android", "Test login → feed → detail → share flow", "Test offline mode behavior"], implemented: true, improvements: [], improvements_done: false },
  { phase: 7, category: "documentation", description: "Document app architecture and setup", steps: ["Write development setup guide", "Document navigation structure and deep linking scheme"], implemented: true, improvements: [], improvements_done: false },
  { phase: 7, category: "documentation", description: "Create App Store submission assets", steps: ["Generate screenshots for all required device sizes", "Write app description and keywords", "Prepare privacy policy and data usage declaration"], implemented: true, improvements: [], improvements_done: false },
]

export const mockPrdBoardItems: PrdBoardItem[] = [
  {
    id: "prd-b-1",
    projectId: "payments-api",
    name: "Redis Caching",
    description: "Cache-aside pattern with TTL-based invalidation for payment lookups",
    stage: "in_progress",
    priority: "high",
    totalTasks: 15,
    completedTasks: 3,
    author: "agent",
    createdAt: new Date("2026-02-08T14:34:00"),
    updatedAt: new Date("2026-02-08T14:34:00"),
    sourceAdr: "ADR-0004: Redis Caching Layer",
    overview: "Implement a Redis-based caching layer to reduce database pressure under peak load. Uses cache-aside pattern for read-heavy endpoints, TTL-based invalidation with configurable expiry, cache warming on deployment, and tag-based invalidation for related data updates. Expected to reduce DB load by ~60% and bring p99 response times under 200ms.",
    tasks: redisCachingTasks,
  },
  {
    id: "prd-b-2",
    projectId: "payments-api",
    name: "Webhook Delivery",
    description: "Reliable webhook delivery system with exponential retry",
    stage: "backlog",
    priority: "medium",
    totalTasks: 8,
    completedTasks: 0,
    author: "agent",
    createdAt: new Date("2026-02-07T10:00:00"),
    updatedAt: new Date("2026-02-07T10:00:00"),
    sourceAdr: "ADR-0005: Webhook Delivery System",
    overview: "Build a reliable webhook delivery system for notifying merchants of payment events. Includes HMAC signature verification, exponential retry with backoff, and endpoint health tracking.",
    tasks: webhookDeliveryTasks,
  },
  {
    id: "prd-b-3",
    projectId: "payments-api",
    name: "Auth Integration",
    description: "OAuth2 + JWT token validation middleware",
    stage: "done",
    priority: "high",
    totalTasks: 10,
    completedTasks: 10,
    author: "agent",
    createdAt: new Date("2026-01-28T09:00:00"),
    updatedAt: new Date("2026-02-01T16:00:00"),
    sourceAdr: "ADR-0003: Authentication",
    overview: "Integrate JWT-based authentication from the auth-service. Includes role-based access control, API key authentication for service-to-service calls, and token refresh flow.",
    tasks: authIntegrationTasks,
  },
  {
    id: "prd-b-4",
    projectId: "payments-api",
    name: "Idempotency Keys",
    description: "Prevent duplicate payment processing with unique request keys",
    stage: "review",
    priority: "high",
    totalTasks: 6,
    completedTasks: 6,
    author: "agent",
    createdAt: new Date("2026-02-05T11:00:00"),
    updatedAt: new Date("2026-02-08T10:00:00"),
    sourceAdr: "ADR-0006: Idempotent Payment Processing",
    overview: "Implement idempotency keys to prevent duplicate payment processing. Clients include a unique key with mutation requests; repeated requests return the cached response instead of re-processing.",
    tasks: idempotencyKeysTasks,
  },
  {
    id: "prd-b-5",
    projectId: "payments-api",
    name: "Rate Limiting",
    description: "Sliding window rate limiter for public API endpoints",
    stage: "backlog",
    priority: "low",
    totalTasks: 0,
    completedTasks: 0,
    author: "user",
    createdAt: new Date("2026-02-08T08:00:00"),
    updatedAt: new Date("2026-02-08T08:00:00"),
    overview: "Rate limiting for the payments API. Waiting for ADR to be created.",
    tasks: [],
  },
  {
    id: "prd-b-6",
    projectId: "auth-service",
    name: "Rate Limiting",
    description: "Sliding window rate limiter for auth endpoints",
    stage: "in_progress",
    priority: "high",
    totalTasks: 15,
    completedTasks: 12,
    author: "agent",
    createdAt: new Date("2026-02-07T17:45:00"),
    updatedAt: new Date("2026-02-08T09:30:00"),
    sourceAdr: "ADR-0007: Rate Limiting Strategy",
    overview: "Implement sliding window rate limiting for all authentication endpoints. Includes tiered limits by auth status, progressive penalties for abuse, IP allowlisting for internal services, and distributed rate limiting across service replicas.",
    tasks: rateLimitingAuthTasks,
  },
  {
    id: "prd-b-7",
    projectId: "auth-service",
    name: "MFA Support",
    description: "TOTP-based multi-factor authentication flow",
    stage: "backlog",
    priority: "medium",
    totalTasks: 12,
    completedTasks: 0,
    author: "agent",
    createdAt: new Date("2026-02-06T14:00:00"),
    updatedAt: new Date("2026-02-06T14:00:00"),
    sourceAdr: "ADR-0008: Multi-Factor Authentication",
    overview: "Add TOTP-based multi-factor authentication. Users can enroll via authenticator app, with backup codes for recovery. Includes rate limiting on verification attempts and security audit.",
    tasks: mfaSupportTasks,
  },
  {
    id: "prd-b-8",
    projectId: "auth-service",
    name: "Session Management",
    description: "Redis-backed session store with key rotation",
    stage: "done",
    priority: "high",
    totalTasks: 8,
    completedTasks: 8,
    author: "agent",
    createdAt: new Date("2026-02-03T09:00:00"),
    updatedAt: new Date("2026-02-05T15:00:00"),
    sourceAdr: "ADR-0005: Session Architecture",
    overview: "Redis-backed session management with automatic rotation on privilege escalation, idle timeout, and multi-device session listing and revocation.",
    tasks: sessionMgmtTasks,
  },
  {
    id: "prd-b-9",
    projectId: "auth-service",
    name: "OAuth Providers",
    description: "Google, GitHub, and Apple sign-in integration",
    stage: "review",
    priority: "medium",
    totalTasks: 9,
    completedTasks: 9,
    author: "agent",
    createdAt: new Date("2026-02-04T10:00:00"),
    updatedAt: new Date("2026-02-08T08:00:00"),
    sourceAdr: "ADR-0004: OAuth Provider Integration",
    overview: "Integrate Google, GitHub, and Apple as OAuth sign-in providers. Includes account linking for existing users, PKCE for all flows, and session creation on successful authentication.",
    tasks: oauthProvidersTasks,
  },
  {
    id: "prd-b-10",
    projectId: "mobile-app",
    name: "Mobile App MVP",
    description: "Core screens, navigation, and offline-first architecture",
    stage: "done",
    priority: "high",
    totalTasks: 18,
    completedTasks: 18,
    author: "agent",
    createdAt: new Date("2026-02-07T09:00:00"),
    updatedAt: new Date("2026-02-07T14:00:00"),
    sourceAdr: "ADR-0002: Navigation Architecture",
    overview: "Build the mobile app MVP with React Native and Expo. Core screens (feed, search, profile, detail), offline-first data layer with MMKV, push notification registration, and App Store submission preparation.",
    tasks: mobileAppMvpTasks,
  },
  {
    id: "prd-b-11",
    projectId: "mobile-app",
    name: "Push Notifications",
    description: "FCM integration for real-time alerts",
    stage: "backlog",
    priority: "medium",
    totalTasks: 0,
    completedTasks: 0,
    author: "user",
    createdAt: new Date("2026-02-08T09:00:00"),
    updatedAt: new Date("2026-02-08T09:00:00"),
    overview: "Full push notification system with FCM. Waiting for ADR.",
    tasks: [],
  },
]

// ── Agent State ──

export const mockAgentState: AgentState = {
  active: true,
  projectId: "payments-api",
  currentTask: "Generating PRD...",
  streamContent: `## Phase 1: Core Setup

### Task 1: Initialize Redis Connection Pool
Set up Redis client with connection pooling. Configure timeout of 5 seconds, max retries of 3, and exponential backoff.

### Task 2: Implement Cache-Aside Pattern
Create a CacheService class that wraps Redis operations:
- \`get(key)\` — check cache first, then DB
- \`set(key, value, ttl)\` — write to cache with TTL
- \`invalidate(key)\` — remove from cache

### Task 3: Add TTL Configuration
Environment-based TTL settings:
- Default: 300s (5 min)
- Payment lookups: 60s (1 min)
- User sessions: 1800s (30 min)`,
  events: [
    {
      id: "evt-1",
      type: "agent:streaming",
      timestamp: new Date("2026-02-08T14:33:12"),
      payload: { message: "PRD task 3/15 completed" },
    },
    {
      id: "evt-2",
      type: "agent:step-completed",
      timestamp: new Date("2026-02-08T14:33:01"),
      payload: { message: "PRD task 2/15 completed" },
    },
    {
      id: "evt-3",
      type: "excalidraw:diff",
      timestamp: new Date("2026-02-08T14:32:45"),
      payload: { message: "Excalidraw updated" },
    },
    {
      id: "evt-4",
      type: "diff:created",
      timestamp: new Date("2026-02-08T14:32:30"),
      payload: { message: "ADR-0004 created" },
    },
    {
      id: "evt-5",
      type: "agent:started",
      timestamp: new Date("2026-02-08T14:32:10"),
      payload: { message: "Agent started for payments-api" },
    },
  ],
}

// ── Integrations ──

export const mockIntegrations: Integration[] = [
  {
    id: "int-telegram",
    platform: "telegram",
    status: "connected",
    channelName: "@mdiff_bot",
    capabilities: { trigger: true, notify: true },
    lastActivity: new Date("2026-02-08T14:33:00"),
  },
  {
    id: "int-discord",
    platform: "discord",
    status: "connected",
    channelName: "#arch-updates",
    capabilities: { trigger: true, notify: true },
    lastActivity: new Date("2026-02-08T14:28:00"),
  },
  {
    id: "int-slack",
    platform: "slack",
    status: "disconnected",
    capabilities: { trigger: false, notify: false },
  },
]

export const mockDeliveries: DeliveryEntry[] = [
  {
    id: "del-1",
    timestamp: new Date("2026-02-08T14:33:12"),
    platform: "telegram",
    success: true,
    message: 'ADR-0004 created: "Add Redis caching layer"',
  },
  {
    id: "del-2",
    timestamp: new Date("2026-02-08T14:33:12"),
    platform: "discord",
    success: true,
    message: 'ADR-0004 created: "Add Redis caching layer"',
  },
  {
    id: "del-3",
    timestamp: new Date("2026-02-08T14:28:00"),
    platform: "telegram",
    success: true,
    message: "Excalidraw updated: +3 nodes",
  },
  {
    id: "del-4",
    timestamp: new Date("2026-02-08T14:15:00"),
    platform: "discord",
    success: false,
    message: "Pipeline started",
    retrying: true,
  },
]

export const mockSubscriptions: EventSubscriptions = {
  "Pipeline started": { discord: true, telegram: true, slack: false },
  "ADR created": { discord: true, telegram: true, slack: false },
  "Excalidraw updated": { discord: true, telegram: false, slack: false },
  "PRD generated": { discord: true, telegram: true, slack: false },
  "Task completed": { discord: false, telegram: false, slack: false },
  "Pipeline completed": { discord: true, telegram: true, slack: false },
  "Pipeline failed": { discord: true, telegram: true, slack: false },
}

// ── Architecture Commits (reused from coding-ui) ──

export const mockArchitectureCommits: ArchitectureCommit[] = [
  {
    id: "arch-1",
    hash: "e1a2b3c",
    message: "Initial API + Database setup",
    author: "pipeline",
    timestamp: new Date("2026-02-05T09:30:00"),
    adrRef: "ADR-0001",
    snapshot: {
      nodes: [
        { id: "api", label: "API", type: "service", x: 160, y: 80, width: 100, height: 50 },
        { id: "db", label: "DB", type: "database", x: 160, y: 200, width: 100, height: 50 },
      ],
      edges: [{ id: "api-db", from: "api", to: "db", label: "queries", style: "solid" }],
    },
    stats: { nodes: 2, edges: 1 },
  },
  {
    id: "arch-5",
    hash: "a3f7c2d",
    message: "Add Cache + Queue",
    author: "pipeline",
    timestamp: new Date("2026-02-08T14:32:00"),
    adrRef: "ADR-0004",
    snapshot: {
      nodes: [
        { id: "gateway", label: "Gateway", type: "gateway", x: 160, y: 20, width: 100, height: 50 },
        { id: "api", label: "API", type: "service", x: 60, y: 120, width: 100, height: 50 },
        { id: "auth", label: "Auth", type: "service", x: 320, y: 120, width: 100, height: 50 },
        { id: "cache", label: "Cache", type: "cache", x: 190, y: 120, width: 100, height: 50 },
        { id: "db", label: "DB", type: "database", x: 60, y: 230, width: 100, height: 50 },
        { id: "queue", label: "Queue", type: "queue", x: 190, y: 230, width: 100, height: 50 },
      ],
      edges: [
        { id: "gw-api", from: "gateway", to: "api", label: "route", style: "solid" },
        { id: "gw-auth", from: "gateway", to: "auth", label: "auth + rate limit", style: "solid" },
        { id: "api-cache", from: "api", to: "cache", label: "read/write", style: "solid" },
        { id: "api-db", from: "api", to: "db", label: "queries", style: "solid" },
        { id: "cache-queue", from: "cache", to: "queue", label: "invalidate", style: "dashed" },
      ],
    },
    stats: { nodes: 6, edges: 5 },
  },
]

// ── Mock A2UI Payload ──

export const mockA2UIPayload: import("./types").A2UIPayload = [
  {
    id: "heading-1",
    type: "text",
    props: { level: 2, content: "Redis Caching Implementation Progress" },
  },
  {
    id: "progress-1",
    type: "progress",
    props: { value: 45, label: "Overall Progress" },
  },
  {
    id: "list-1",
    type: "list",
    props: {
      items: [
        "✓ Initialize Redis connection pool",
        "✓ Implement cache-aside pattern",
        "◉ Add TTL configuration",
        "○ Set up cache warming",
        "○ Implement tag-based invalidation",
      ],
    },
  },
  {
    id: "button-1",
    type: "button",
    props: { label: "View Full Plan", variant: "outline" },
  },
]
