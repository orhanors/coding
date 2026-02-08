import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Placeholder — in real implementation, would parse platform-specific payloads
    // and trigger agent pipeline if message matches a command pattern
    const message = String(body.message || body.text || "")

    if (message.startsWith("/mdiff ")) {
      const command = message.slice(7).trim()
      return NextResponse.json({
        acknowledged: true,
        command,
        message: `Command received: ${command}`,
      })
    }

    return NextResponse.json({ acknowledged: true })
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook payload" },
      { status: 400 }
    )
  }
}
