import { NextResponse } from "next/server"
import { ARCHETYPES } from "@/lib/constants"
import type { AgentArchetype } from "@/lib/types"
import { agentStreamSchema } from "@/lib/validation"

export const dynamic = "force-dynamic"

// Mock streaming response for agent chat
// In production, this would use AI SDK v6 streamText() with a real LLM provider
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const contentType = request.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const result = agentStreamSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { id } = await params
  const archetype = (result.data.archetype ?? "architect") as AgentArchetype

  const encoder = new TextEncoder()

  // Simulated streaming response based on archetype
  const responses: Record<string, string[]> = {
    architect: [
      "Analyzing the current architecture...\n",
      "I've identified 3 key structural concerns:\n",
      "1. The auth module has circular dependencies\n",
      "2. Session handling mixes concerns with JWT validation\n",
      "3. Middleware chain needs restructuring\n\n",
      "Proposing a refactored module layout that separates:\n",
      "- Token generation/validation\n",
      "- Session lifecycle management\n",
      "- Route-level authorization guards\n",
    ],
    guardian: [
      "Running validation checks...\n",
      "Test coverage analysis complete.\n",
      "Found 3 untested edge cases in auth flow.\n",
      "Generating test cases for missing coverage...\n",
    ],
    explorer: [
      "Researching alternative approaches...\n",
      "Discovered 2 promising patterns:\n",
      "1. Token rotation with sliding window\n",
      "2. Asymmetric key pairs for service-to-service auth\n",
    ],
    alchemist: [
      "Optimizing the current implementation...\n",
      "Refactoring session store from O(n) to O(1) lookup.\n",
      "Reducing JWT payload size by 40%.\n",
    ],
  }

  const chunks = responses[archetype] ?? responses.architect

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        // AI SDK v6 data stream format
        const data = `0:${JSON.stringify(chunk)}\n`
        controller.enqueue(encoder.encode(data))
        await new Promise((r) => setTimeout(r, 200 + Math.random() * 300))
      }
      // Signal completion
      const done = `d:{"finishReason":"stop","usage":{"promptTokens":100,"completionTokens":${chunks.join("").length}}}\n`
      controller.enqueue(encoder.encode(done))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Vercel-AI-Data-Stream": "v1",
    },
  })
}
