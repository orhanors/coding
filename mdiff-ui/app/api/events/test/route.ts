import { NextResponse } from "next/server"
import { sseManager } from "@/lib/events/sse-manager"
import type { MDiffEvent } from "@/lib/events/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const event: MDiffEvent = {
      id: `evt-${Date.now()}`,
      type: body.type || "diff:created",
      timestamp: new Date(),
      payload: body.payload || {},
    }

    sseManager.emitEvent(event)

    return NextResponse.json({ success: true, event })
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}
