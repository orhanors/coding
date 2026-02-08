import { NextResponse } from "next/server"
import { mockMDiffDocuments } from "@/lib/mock-data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const documents = mockMDiffDocuments.filter((d) => d.projectId === id)
  return NextResponse.json(documents)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const name = String(body.name || "").trim()
    const type = body.type

    if (!name || !["adr", "prd", "prd-log"].includes(type)) {
      return NextResponse.json(
        { error: "Name and valid type (adr/prd/prd-log) required" },
        { status: 400 }
      )
    }

    const doc = {
      id: `doc-${Date.now()}`,
      name,
      type,
      status: "proposed" as const,
      lastModified: new Date(),
      diffCount: 0,
      content: body.content ? String(body.content).slice(0, 500000) : "",
      projectId: id,
    }

    return NextResponse.json(doc, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
