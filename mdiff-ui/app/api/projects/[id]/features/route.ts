import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return NextResponse.json({
    features: [],
    projectId: id,
  })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const name = String(body.name || "").trim()

    if (!name || name.length > 200) {
      return NextResponse.json(
        { error: "Feature name required (max 200 chars)" },
        { status: 400 }
      )
    }

    const feature = {
      id: `feat-${Date.now()}`,
      name,
      projectId: id,
      status: "pending",
      createdAt: new Date(),
    }

    return NextResponse.json(feature, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
