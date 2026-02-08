import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { A2UIRenderer } from "@/components/a2ui/a2ui-renderer"
import type { A2UIPayload } from "@/lib/types"

describe("A2UIRenderer", () => {
  it("shows empty message when payload is empty", () => {
    render(<A2UIRenderer payload={[]} />)
    expect(screen.getByText("No A2UI content available.")).toBeInTheDocument()
  })

  it("renders a text component", () => {
    const payload: A2UIPayload = [
      { id: "t1", type: "text", props: { content: "Hello World" } },
    ]
    render(<A2UIRenderer payload={payload} />)
    expect(screen.getByText("Hello World")).toBeInTheDocument()
  })

  it("renders heading levels", () => {
    const payload: A2UIPayload = [
      { id: "h1", type: "text", props: { content: "Title", level: 1 } },
      { id: "h2", type: "text", props: { content: "Subtitle", level: 2 } },
    ]
    render(<A2UIRenderer payload={payload} />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Title")
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Subtitle")
  })

  it("renders a progress component", () => {
    const payload: A2UIPayload = [
      { id: "p1", type: "progress", props: { value: 75, label: "Processing" } },
    ]
    render(<A2UIRenderer payload={payload} />)
    expect(screen.getByText("Processing")).toBeInTheDocument()
    expect(screen.getByText("75%")).toBeInTheDocument()
  })

  it("renders a list component", () => {
    const payload: A2UIPayload = [
      { id: "l1", type: "list", props: { items: ["Item A", "Item B", "Item C"] } },
    ]
    render(<A2UIRenderer payload={payload} />)
    expect(screen.getByText("Item A")).toBeInTheDocument()
    expect(screen.getByText("Item B")).toBeInTheDocument()
    expect(screen.getByText("Item C")).toBeInTheDocument()
  })

  it("renders a button component", () => {
    const payload: A2UIPayload = [
      { id: "b1", type: "button", props: { label: "Click Me" } },
    ]
    render(<A2UIRenderer payload={payload} />)
    expect(screen.getByText("Click Me")).toBeInTheDocument()
  })

  it("renders a card component with title", () => {
    const payload: A2UIPayload = [
      { id: "c1", type: "card", props: { title: "My Card" } },
    ]
    render(<A2UIRenderer payload={payload} />)
    expect(screen.getByText("My Card")).toBeInTheDocument()
  })

  it("renders a code component", () => {
    const payload: A2UIPayload = [
      { id: "code1", type: "code", props: { content: "const x = 42" } },
    ]
    render(<A2UIRenderer payload={payload} />)
    expect(screen.getByText("const x = 42")).toBeInTheDocument()
  })

  it("renders fallback for unknown component types", () => {
    const payload: A2UIPayload = [
      { id: "u1", type: "unknown-widget", props: {} },
    ]
    render(<A2UIRenderer payload={payload} />)
    expect(screen.getByText("Unsupported component: unknown-widget")).toBeInTheDocument()
  })

  it("renders multiple components", () => {
    const payload: A2UIPayload = [
      { id: "t1", type: "text", props: { content: "Header", level: 1 } },
      { id: "p1", type: "progress", props: { value: 50, label: "Loading" } },
      { id: "b1", type: "button", props: { label: "Go" } },
    ]
    render(<A2UIRenderer payload={payload} />)
    expect(screen.getByText("Header")).toBeInTheDocument()
    expect(screen.getByText("Loading")).toBeInTheDocument()
    expect(screen.getByText("Go")).toBeInTheDocument()
  })
})
