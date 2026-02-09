import { z } from "zod"

// Agent config validation
export const agentConfigSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long").regex(/^[a-zA-Z0-9 _-]+$/, "Name can only contain letters, numbers, spaces, hyphens, underscores"),
  archetype: z.enum(["architect", "guardian", "explorer", "alchemist", "shadow", "sage", "herald", "trickster"]),
  task: z.string().min(1, "Task is required").max(500, "Task too long"),
  autonomy: z.number().int().min(1).max(5),
})

// Vision validation
export const visionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  overview: z.string().max(5000, "Overview too long").optional().default(""),
  priority: z.enum(["low", "medium", "high"]),
})

// Reflection validation
export const reflectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  content: z.string().min(1, "Content is required").max(10000, "Content too long"),
})

// SSE test event validation
export const testEventSchema = z.object({
  type: z.string().min(1),
  payload: z.record(z.unknown()).optional(),
  agentId: z.string().optional(),
})
