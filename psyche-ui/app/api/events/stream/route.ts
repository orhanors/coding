import { sseManager } from "@/lib/events/sse-manager"
import type { PsycheEvent } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function GET() {
  const encoder = new TextEncoder()
  let cleanup: (() => void) | null = null

  const stream = new ReadableStream({
    start(controller) {
      const onEvent = (event: PsycheEvent) => {
        try {
          const data = `data: ${JSON.stringify(event)}\n\n`
          controller.enqueue(encoder.encode(data))
        } catch {
          // Connection may have closed — clean up
          cleanup?.()
        }
      }

      sseManager.subscribe(onEvent)

      // Keep-alive every 15s
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keep-alive\n\n"))
        } catch {
          cleanup?.()
        }
      }, 15000)

      cleanup = () => {
        sseManager.unsubscribe(onEvent)
        clearInterval(keepAlive)
        cleanup = null
      }
    },
    cancel() {
      cleanup?.()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
