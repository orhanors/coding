"use client"

import { useState, useCallback, useRef } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface UseAgentChatOptions {
  agentId: string
  archetype?: string
}

/**
 * Client hook for agent-specific streaming.
 * Wraps the /api/agents/[id]/stream endpoint.
 * In production, this would use AI SDK v6 useChat() from '@ai-sdk/react'.
 */
export function useAgentChat({ agentId, archetype }: UseAgentChatOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const append = useCallback(
    async (content: string) => {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      }
      setMessages((prev) => [...prev, assistantMsg])

      try {
        const abort = new AbortController()
        abortRef.current = abort

        const res = await fetch(`/api/agents/${agentId}/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", content }], archetype }),
          signal: abort.signal,
        })

        if (!res.body) throw new Error("No response body")

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value, { stream: true })
          const lines = text.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const chunk = JSON.parse(line.slice(2)) as string
                accumulated += chunk
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsg.id ? { ...m, content: accumulated } : m
                  )
                )
              } catch {
                // Skip malformed chunks
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: "Error: Failed to get response" }
                : m
            )
          )
        }
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [agentId, archetype]
  )

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
  }, [])

  return { messages, isLoading, append, stop }
}
