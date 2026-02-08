import { NextResponse } from "next/server"
import { mockDiffs } from "@/lib/mock-data"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const url = new URL(request.url)
  const type = url.searchParams.get("type")
  const limit = parseInt(url.searchParams.get("limit") || "50", 10)
  const offset = parseInt(url.searchParams.get("offset") || "0", 10)

  let diffs = mockDiffs.filter((d) => d.projectId === id)

  if (type) {
    diffs = diffs.filter((d) => d.type === type)
  }

  diffs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const paginated = diffs.slice(offset, offset + limit)

  return NextResponse.json({
    diffs: paginated,
    total: diffs.length,
    offset,
    limit,
  })
}
