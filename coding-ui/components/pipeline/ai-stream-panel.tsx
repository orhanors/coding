"use client"

import { useState, useEffect, useRef } from "react"

const streamContent = `## Phase 1: Core Setup

### Task 1: Initialize project structure
- Create Next.js app with TypeScript configuration
- Set up Tailwind CSS 4 with design tokens
- Configure path aliases and ESLint

### Task 2: Database schema
- Define Prisma schema for caching layer
- Create Redis connection configuration
- Set up cache-aside pattern utilities

### Task 3: API route structure
- Create base API handler with middleware
- Implement rate limiting middleware
- Set up error handling and logging

### Task 4: Cache implementation
- Implement TTL-based cache wrapper
- Create tag-based invalidation system
- Build cache warming strategy

### Task 5: Integration testing
- Set up test fixtures for cache scenarios
- Create mock Redis client for unit tests
- Build E2E test for cache-hit/miss flows

## Phase 2: Core Endpoints

### Task 6: User endpoints
- GET /api/users with cache-aside
- POST /api/users with cache invalidation
- PATCH /api/users/:id with tag-based invalidation

### Task 7: Set up API routes`

export function AIStreamPanel() {
  const [displayedContent, setDisplayedContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < streamContent.length) {
        const chunkSize = Math.floor(Math.random() * 4) + 1
        setDisplayedContent(streamContent.slice(0, index + chunkSize))
        index += chunkSize
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, 25)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [displayedContent])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-[var(--ac-text-secondary)] scrollbar-thin"
    >
      {displayedContent.split("\n").map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <div key={i} className="mt-4 mb-2 text-sm font-semibold text-[var(--ac-text-primary)]">
              {line.replace("## ", "")}
            </div>
          )
        }
        if (line.startsWith("### ")) {
          return (
            <div key={i} className="mt-3 mb-1 text-xs font-medium text-[var(--ac-accent)]">
              {line.replace("### ", "")}
            </div>
          )
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="pl-4 py-0.5 text-[var(--ac-text-secondary)]">
              <span className="text-[var(--ac-text-muted)] mr-2">-</span>
              {line.replace("- ", "")}
            </div>
          )
        }
        if (line.trim() === "") {
          return <div key={i} className="h-2" />
        }
        return (
          <div key={i} className="py-0.5">
            {line}
          </div>
        )
      })}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-[var(--ac-accent)] animate-blink-cursor ml-0.5" />
      )}
    </div>
  )
}
