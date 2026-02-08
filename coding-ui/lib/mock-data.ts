import type {
  PipelineEvent,
  PipelineRun,
  DocumentNode,
  DocumentChange,
  Integration,
  DeliveryEntry,
  HistoryEntry,
  EventSubscriptions,
  ArchitectureCommit,
} from "./types"

export const mockPipelineEvents: PipelineEvent[] = [
  {
    id: "evt-1",
    timestamp: new Date("2026-02-08T14:33:12"),
    stage: "prd",
    type: "info",
    message: 'Task 7/15: "Set up API routes" — generating...',
  },
  {
    id: "evt-2",
    timestamp: new Date("2026-02-08T14:33:01"),
    stage: "prd",
    type: "completed",
    message: 'Task 6/15: "Database schema" — completed',
  },
  {
    id: "evt-3",
    timestamp: new Date("2026-02-08T14:32:45"),
    stage: "prd",
    type: "completed",
    message: 'Task 5/15: "Initialize project" — completed',
  },
  {
    id: "evt-4",
    timestamp: new Date("2026-02-08T14:32:30"),
    stage: "excalidraw",
    type: "completed",
    message: "Diagram updated — 3 nodes added, 2 edges",
  },
  {
    id: "evt-5",
    timestamp: new Date("2026-02-08T14:32:15"),
    stage: "adr",
    type: "created",
    message: 'ADR-0012 created — "Add caching layer"',
  },
  {
    id: "evt-6",
    timestamp: new Date("2026-02-08T14:32:10"),
    stage: "system",
    type: "info",
    message: "Pipeline #47 started",
  },
  {
    id: "evt-7",
    timestamp: new Date("2026-02-08T14:28:55"),
    stage: "system",
    type: "info",
    message: "Slack notification sent",
  },
  {
    id: "evt-8",
    timestamp: new Date("2026-02-08T14:25:00"),
    stage: "implement",
    type: "completed",
    message: "Pipeline #46 completed — all tasks implemented",
  },
]

export const mockPipelineRun: PipelineRun = {
  id: "run-47",
  number: 47,
  status: "running",
  currentStep: 2,
  startedAt: new Date("2026-02-08T14:32:10"),
  steps: [
    { id: "step-1", name: "ADR", status: "completed", duration: 42 },
    { id: "step-2", name: "Excalidraw", status: "completed", duration: 18 },
    { id: "step-3", name: "PRD", status: "running", duration: 83 },
    { id: "step-4", name: "Implement", status: "pending" },
  ],
  events: [],
}

export const mockDocuments: DocumentNode[] = [
  {
    id: "adr-folder",
    name: "architecture",
    type: "adr",
    status: "active",
    lastModified: new Date("2026-02-08T14:32:00"),
    children: [
      {
        id: "adr-0012",
        name: "0012-add-caching-layer",
        type: "adr",
        status: "proposed",
        lastModified: new Date("2026-02-08T14:32:00"),
        content: `# ADR-0012: Add Caching Layer

## Status
Proposed (2026-02-08)

## Context
The application currently makes direct database queries for every API request. Under load, this causes significant latency and database connection pool exhaustion. P99 response times exceed 2 seconds for complex queries.

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
        id: "adr-0011",
        name: "0011-api-rate-limiting",
        type: "adr",
        status: "accepted",
        lastModified: new Date("2026-02-07T17:45:00"),
      },
      {
        id: "adr-0010",
        name: "0010-auth-system",
        type: "adr",
        status: "accepted",
        lastModified: new Date("2026-02-06T10:00:00"),
      },
      {
        id: "adr-0009",
        name: "0009-database-selection",
        type: "adr",
        status: "accepted",
        lastModified: new Date("2026-02-05T09:00:00"),
      },
    ],
  },
  {
    id: "prd-folder",
    name: "architecture-prd",
    type: "prd",
    status: "active",
    lastModified: new Date("2026-02-08T14:33:00"),
    children: [
      {
        id: "prd-0012",
        name: "0012-caching-layer",
        type: "prd",
        status: "active",
        lastModified: new Date("2026-02-08T14:33:00"),
      },
      {
        id: "prd-0011",
        name: "0011-api-rate-limiting",
        type: "prd",
        status: "completed",
        lastModified: new Date("2026-02-07T17:45:00"),
      },
    ],
  },
  {
    id: "log-folder",
    name: "architecture-prd-logs",
    type: "prd-log",
    status: "active",
    lastModified: new Date("2026-02-08T14:33:00"),
    children: [
      {
        id: "log-0012-1",
        name: "0012-run-1",
        type: "prd-log",
        status: "active",
        lastModified: new Date("2026-02-08T14:33:00"),
      },
      {
        id: "log-0012-2",
        name: "0012-run-2",
        type: "prd-log",
        status: "active",
        lastModified: new Date("2026-02-08T14:30:00"),
      },
    ],
  },
]

export const mockChanges: DocumentChange[] = [
  {
    id: "change-1",
    timestamp: new Date("2026-02-08T14:32:00"),
    description: "Add caching layer",
    linesAdded: 45,
    linesRemoved: 3,
    author: "pipeline",
    pipelineRunId: "run-47",
  },
  {
    id: "change-2",
    timestamp: new Date("2026-02-08T14:28:00"),
    description: "Initial draft",
    linesAdded: 120,
    linesRemoved: 0,
    author: "pipeline",
    pipelineRunId: "run-47",
  },
]

export const mockIntegrations: Integration[] = [
  {
    id: "int-discord",
    platform: "discord",
    status: "connected",
    channelName: "#arch-updates",
    lastDelivery: new Date("2026-02-08T14:33:12"),
  },
  {
    id: "int-telegram",
    platform: "telegram",
    status: "connected",
    channelName: "@agentic_bot",
    lastDelivery: new Date("2026-02-08T14:32:30"),
  },
  {
    id: "int-slack",
    platform: "slack",
    status: "disconnected",
  },
]

export const mockDeliveries: DeliveryEntry[] = [
  {
    id: "del-1",
    timestamp: new Date("2026-02-08T14:33:12"),
    platform: "discord",
    statusCode: 200,
    message: "PRD generated for ADR-0012",
    success: true,
  },
  {
    id: "del-2",
    timestamp: new Date("2026-02-08T14:32:30"),
    platform: "telegram",
    statusCode: 200,
    message: "Excalidraw updated: 3 nodes added",
    success: true,
  },
  {
    id: "del-3",
    timestamp: new Date("2026-02-08T14:32:15"),
    platform: "discord",
    statusCode: 200,
    message: "ADR-0012 created: Add caching layer",
    success: true,
  },
  {
    id: "del-4",
    timestamp: new Date("2026-02-08T14:32:15"),
    platform: "telegram",
    statusCode: 200,
    message: "ADR-0012 created: Add caching layer",
    success: true,
  },
  {
    id: "del-5",
    timestamp: new Date("2026-02-08T14:30:00"),
    platform: "discord",
    statusCode: 500,
    message: "Pipeline started — retry in 30s",
    success: false,
  },
]

export const mockSubscriptions: EventSubscriptions = {
  "Pipeline started": {
    discord: true,
    telegram: true,
    slack: false,
  },
  "ADR created": {
    discord: true,
    telegram: true,
    slack: false,
  },
  "Excalidraw updated": {
    discord: true,
    telegram: false,
    slack: false,
  },
  "PRD generated": {
    discord: true,
    telegram: true,
    slack: false,
  },
  "Task completed": {
    discord: false,
    telegram: false,
    slack: false,
  },
  "Pipeline completed": {
    discord: true,
    telegram: true,
    slack: false,
  },
  "Pipeline failed": {
    discord: true,
    telegram: true,
    slack: false,
  },
}

export const mockHistory: HistoryEntry[] = [
  {
    id: "hist-1",
    timestamp: new Date("2026-02-08T14:32:00"),
    type: "adr",
    action: "Created",
    title: "ADR-0012",
    description: "Add caching layer",
    linesAdded: 120,
    pipelineRunId: "run-47",
    relatedItems: ["PRD-0012 generated (15 tasks)", "Excalidraw: +3 nodes, +2 edges"],
  },
  {
    id: "hist-2",
    timestamp: new Date("2026-02-08T11:15:00"),
    type: "adr",
    action: "Status Changed",
    title: "ADR-0011",
    description: "Proposed -> Accepted",
    relatedItems: ["Approved by: @user"],
  },
  {
    id: "hist-3",
    timestamp: new Date("2026-02-08T09:30:00"),
    type: "prd",
    action: "Updated",
    title: "PRD-0011",
    description: "Task 12/15 marked complete",
    relatedItems: ["Implementation progress: 80%"],
  },
  {
    id: "hist-4",
    timestamp: new Date("2026-02-07T17:45:00"),
    type: "adr",
    action: "Created",
    title: "ADR-0011",
    description: "API rate limiting",
    linesAdded: 95,
    pipelineRunId: "run-46",
    relatedItems: ["PRD-0011 generated (12 tasks)"],
  },
  {
    id: "hist-5",
    timestamp: new Date("2026-02-07T14:00:00"),
    type: "prd",
    action: "Completed",
    title: "PRD-0010",
    description: "All 18 tasks implemented",
    relatedItems: ["Duration: 4h 23m"],
  },
  {
    id: "hist-6",
    timestamp: new Date("2026-02-06T16:20:00"),
    type: "adr",
    action: "Created",
    title: "ADR-0010",
    description: "Auth system design",
    linesAdded: 87,
    linesRemoved: 0,
    pipelineRunId: "run-44",
  },
]

// Architecture commits — progressive build-up matching existing ADRs
export const mockArchitectureCommits: ArchitectureCommit[] = [
  {
    id: "arch-1",
    hash: "e1a2b3c",
    message: "Initial API + Database setup",
    author: "pipeline",
    timestamp: new Date("2026-02-05T09:30:00"),
    adrRef: "ADR-0009",
    snapshot: {
      nodes: [
        { id: "api", label: "API", type: "service", x: 160, y: 80, width: 100, height: 50 },
        { id: "db", label: "DB", type: "database", x: 160, y: 200, width: 100, height: 50 },
      ],
      edges: [
        { id: "api-db", from: "api", to: "db", label: "queries", style: "solid" },
      ],
    },
    stats: { nodes: 2, edges: 1 },
  },
  {
    id: "arch-2",
    hash: "f4d5e6a",
    message: "Add Auth service",
    author: "pipeline",
    timestamp: new Date("2026-02-06T10:15:00"),
    adrRef: "ADR-0010",
    snapshot: {
      nodes: [
        { id: "api", label: "API", type: "service", x: 160, y: 80, width: 100, height: 50 },
        { id: "db", label: "DB", type: "database", x: 160, y: 200, width: 100, height: 50 },
        { id: "auth", label: "Auth", type: "service", x: 320, y: 80, width: 100, height: 50 },
      ],
      edges: [
        { id: "api-db", from: "api", to: "db", label: "queries", style: "solid" },
        { id: "api-auth", from: "api", to: "auth", label: "authenticate", style: "solid" },
      ],
    },
    stats: { nodes: 3, edges: 2 },
  },
  {
    id: "arch-3",
    hash: "b7c8d9e",
    message: "Add API Gateway",
    author: "pipeline",
    timestamp: new Date("2026-02-06T16:45:00"),
    adrRef: "ADR-0010",
    snapshot: {
      nodes: [
        { id: "gateway", label: "Gateway", type: "gateway", x: 160, y: 20, width: 100, height: 50 },
        { id: "api", label: "API", type: "service", x: 80, y: 120, width: 100, height: 50 },
        { id: "auth", label: "Auth", type: "service", x: 240, y: 120, width: 100, height: 50 },
        { id: "db", label: "DB", type: "database", x: 160, y: 230, width: 100, height: 50 },
      ],
      edges: [
        { id: "gw-api", from: "gateway", to: "api", label: "route", style: "solid" },
        { id: "gw-auth", from: "gateway", to: "auth", label: "auth check", style: "solid" },
        { id: "api-db", from: "api", to: "db", label: "queries", style: "solid" },
      ],
    },
    stats: { nodes: 4, edges: 3 },
  },
  {
    id: "arch-4",
    hash: "c2d3f4a",
    message: "Rate limiting on Gateway",
    author: "pipeline",
    timestamp: new Date("2026-02-07T17:50:00"),
    adrRef: "ADR-0011",
    snapshot: {
      nodes: [
        { id: "gateway", label: "Gateway", type: "gateway", x: 160, y: 20, width: 100, height: 50 },
        { id: "api", label: "API", type: "service", x: 80, y: 120, width: 100, height: 50 },
        { id: "auth", label: "Auth", type: "service", x: 240, y: 120, width: 100, height: 50 },
        { id: "db", label: "DB", type: "database", x: 160, y: 230, width: 100, height: 50 },
      ],
      edges: [
        { id: "gw-api", from: "gateway", to: "api", label: "route", style: "solid" },
        { id: "gw-auth", from: "gateway", to: "auth", label: "auth + rate limit", style: "solid" },
        { id: "api-db", from: "api", to: "db", label: "queries", style: "solid" },
      ],
    },
    stats: { nodes: 4, edges: 3 },
  },
  {
    id: "arch-5",
    hash: "a3f7c2d",
    message: "Add Cache + Queue",
    author: "pipeline",
    timestamp: new Date("2026-02-08T14:32:00"),
    adrRef: "ADR-0012",
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
