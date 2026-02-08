import { sseManager } from "@/lib/events/sse-manager"
import type { MDiffEvent } from "@/lib/events/types"

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: MDiffEvent) => {
        try {
          const data = `data: ${JSON.stringify(event)}\n\n`
          controller.enqueue(encoder.encode(data))
        } catch {
          // Client disconnected
        }
      }

      const unsubscribe = sseManager.subscribe(send)

      // Send initial keepalive
      controller.enqueue(encoder.encode(": keepalive\n\n"))

      // Cleanup on close
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"))
        } catch {
          clearInterval(interval)
          unsubscribe()
        }
      }, 30000)

      // Store cleanup for when the connection closes
      ;(controller as unknown as Record<string, () => void>)._cleanup = () => {
        clearInterval(interval)
        unsubscribe()
      }
    },
    cancel() {
      // Connection closed by client
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
