import { sseManager } from "@/lib/events/sse-manager"
import type { PsycheEvent } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const onEvent = (event: PsycheEvent) => {
        const data = `data: ${JSON.stringify(event)}\n\n`
        controller.enqueue(encoder.encode(data))
      }

      sseManager.subscribe(onEvent)

      // Keep-alive every 15s
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(": keep-alive\n\n"))
      }, 15000)

      // Clean up when the connection closes
      const cleanup = () => {
        sseManager.unsubscribe(onEvent)
        clearInterval(keepAlive)
      }

      // Store cleanup for abort signal
      ;(controller as unknown as Record<string, () => void>).__cleanup = cleanup
    },
    cancel() {
      // Called when client disconnects
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
