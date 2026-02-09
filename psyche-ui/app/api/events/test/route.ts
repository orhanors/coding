import { NextResponse } from "next/server"
import { sseManager, createEvent } from "@/lib/events/sse-manager"
import type { PsycheEventType } from "@/lib/types"
import { testEventSchema } from "@/lib/validation"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = testEventSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { type, payload, agentId } = result.data
    const event = createEvent(type as PsycheEventType, payload ?? {}, agentId)
    sseManager.emit(event)

    return NextResponse.json({ ok: true, event })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
