import { describe, it, expect } from "vitest"
import { GET, POST } from "@/app/api/projects/route"

describe("API: /api/projects", () => {
  describe("GET", () => {
    it("returns a list of projects", async () => {
      const res = await GET()
      const data = await res.json()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
      expect(data[0]).toHaveProperty("id")
      expect(data[0]).toHaveProperty("name")
    })
  })

  describe("POST", () => {
    it("creates a project with valid name", async () => {
      const req = new Request("http://localhost/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: "test-project-create" }),
        headers: { "Content-Type": "application/json" },
      })
      const res = await POST(req)
      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.name).toBe("test-project-create")
      expect(data.adrCount).toBe(0)
    })

    it("rejects empty name", async () => {
      const req = new Request("http://localhost/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: "" }),
        headers: { "Content-Type": "application/json" },
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })

    it("rejects name with special characters", async () => {
      const req = new Request("http://localhost/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: "test project!" }),
        headers: { "Content-Type": "application/json" },
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })

    it("rejects name longer than 64 characters", async () => {
      const req = new Request("http://localhost/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: "a".repeat(65) }),
        headers: { "Content-Type": "application/json" },
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })

    it("rejects invalid JSON", async () => {
      const req = new Request("http://localhost/api/projects", {
        method: "POST",
        body: "not json",
        headers: { "Content-Type": "application/json" },
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })
})
