import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Placeholder - in real app would fetch from storage
  return NextResponse.json({ id, message: `Project ${id} details` })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  return NextResponse.json({ id, updated: true, ...body })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    if (body.confirm !== id) {
      return NextResponse.json(
        { error: "Confirmation name must match project ID" },
        { status: 400 }
      )
    }
    return NextResponse.json({ id, deleted: true })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
