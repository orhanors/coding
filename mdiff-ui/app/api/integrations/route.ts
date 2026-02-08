import { NextResponse } from "next/server"
import { mockIntegrations } from "@/lib/mock-data"

export async function GET() {
  // Return integrations without sensitive data
  const safe = mockIntegrations.map((i) => ({
    id: i.id,
    platform: i.platform,
    status: i.status,
    channelName: i.channelName,
    capabilities: i.capabilities,
    lastActivity: i.lastActivity,
  }))
  return NextResponse.json(safe)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const platform = body.platform

    if (!["telegram", "discord", "slack"].includes(platform)) {
      return NextResponse.json(
        { error: "Platform must be telegram, discord, or slack" },
        { status: 400 }
      )
    }

    const integration = {
      id: `int-${Date.now()}`,
      platform,
      status: "connected" as const,
      channelName: body.channelName ? String(body.channelName).slice(0, 64) : undefined,
      capabilities: {
        trigger: Boolean(body.capabilities?.trigger),
        notify: Boolean(body.capabilities?.notify),
      },
      lastActivity: new Date(),
    }

    return NextResponse.json(integration, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
