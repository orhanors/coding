import { NextResponse } from "next/server"
import type { Project } from "@/lib/types"

// In-memory store for MVP
const projects: Project[] = [
  {
    id: "payments-api",
    name: "payments-api",
    adrCount: 4,
    prdCount: 3,
    lastDiffAt: new Date("2026-02-08T14:32:00"),
    agentStatus: "active",
    description: "Payment processing microservice",
    createdAt: new Date("2026-01-15T09:00:00"),
  },
  {
    id: "auth-service",
    name: "auth-service",
    adrCount: 7,
    prdCount: 5,
    lastDiffAt: new Date("2026-02-08T11:15:00"),
    agentStatus: "idle",
    description: "OAuth2 + JWT authentication",
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

export async function GET() {
  return NextResponse.json(projects)
}

const NAME_REGEX = /^[a-zA-Z0-9-]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || "").trim()

    if (!name || name.length > 64) {
      return NextResponse.json(
        { error: "Name must be 1-64 characters" },
        { status: 400 }
      )
    }

    if (!NAME_REGEX.test(name)) {
      return NextResponse.json(
        { error: "Name must be alphanumeric with hyphens only" },
        { status: 400 }
      )
    }

    if (projects.some((p) => p.name === name)) {
      return NextResponse.json(
        { error: "Project name already exists" },
        { status: 409 }
      )
    }

    const project: Project = {
      id: name,
      name,
      adrCount: 0,
      prdCount: 0,
      lastDiffAt: new Date(),
      agentStatus: "idle",
      description: body.description ? String(body.description).slice(0, 500) : undefined,
      createdAt: new Date(),
    }

    projects.push(project)
    return NextResponse.json(project, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
