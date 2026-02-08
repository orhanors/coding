import { describe, it, expect } from "vitest"
import { POST } from "@/app/api/integrations/webhook/route"

describe("API: /api/integrations/webhook", () => {
  it("acknowledges a plain message", async () => {
    const req = new Request("http://localhost/api/integrations/webhook", {
      method: "POST",
      body: JSON.stringify({ message: "hello" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    const data = await res.json()
    expect(data.acknowledged).toBe(true)
    expect(data.command).toBeUndefined()
  })

  it("parses /mdiff command", async () => {
    const req = new Request("http://localhost/api/integrations/webhook", {
      method: "POST",
      body: JSON.stringify({ message: "/mdiff analyze payments-api" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    const data = await res.json()
    expect(data.acknowledged).toBe(true)
    expect(data.command).toBe("analyze payments-api")
  })

  it("handles text field as fallback", async () => {
    const req = new Request("http://localhost/api/integrations/webhook", {
      method: "POST",
      body: JSON.stringify({ text: "/mdiff status" }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    const data = await res.json()
    expect(data.command).toBe("status")
  })

  it("returns 400 for invalid payload", async () => {
    const req = new Request("http://localhost/api/integrations/webhook", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
