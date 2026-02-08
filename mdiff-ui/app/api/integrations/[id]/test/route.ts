import { NextResponse } from "next/server"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Placeholder — in real implementation, would send test message to platform
  return NextResponse.json({
    success: true,
    integrationId: id,
    message: "Test message sent successfully (placeholder)",
  })
}
