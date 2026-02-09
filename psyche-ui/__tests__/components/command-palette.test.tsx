import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { CommandPalette } from "@/components/layout/command-palette"
import { useUIStore } from "@/stores/ui-store"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: vi.fn(),
    resolvedTheme: "dark",
  }),
}))

// Mock Radix/cmdk Dialog to simply render children when open
vi.mock("@/components/ui/command", () => {
  return {
    CommandDialog: ({
      open,
      children,
    }: {
      open: boolean
      onOpenChange: (v: boolean) => void
      children: React.ReactNode
    }) => (open ? <div data-testid="command-dialog">{children}</div> : null),
    CommandInput: ({ placeholder }: { placeholder?: string }) => (
      <input data-testid="command-input" placeholder={placeholder} />
    ),
    CommandList: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="command-list">{children}</div>
    ),
    CommandEmpty: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    CommandGroup: ({
      heading,
      children,
    }: {
      heading?: string
      children: React.ReactNode
    }) => (
      <div data-testid={`command-group-${heading}`}>
        {heading && <div>{heading}</div>}
        {children}
      </div>
    ),
    CommandItem: ({
      children,
      onSelect,
    }: {
      children: React.ReactNode
      onSelect?: () => void
    }) => (
      <div role="option" onClick={onSelect}>
        {children}
      </div>
    ),
    CommandSeparator: () => <hr />,
    CommandShortcut: ({ children }: { children: React.ReactNode }) => (
      <span>{children}</span>
    ),
  }
})

describe("CommandPalette", () => {
  beforeEach(() => {
    // Reset UI store state
    useUIStore.setState({ commandPaletteOpen: false })
  })

  it("does not render when command palette is closed", () => {
    useUIStore.setState({ commandPaletteOpen: false })
    render(<CommandPalette />)
    expect(screen.queryByTestId("command-dialog")).not.toBeInTheDocument()
  })

  it("renders when command palette is open", () => {
    useUIStore.setState({ commandPaletteOpen: true })
    render(<CommandPalette />)
    expect(screen.getByTestId("command-dialog")).toBeInTheDocument()
  })

  it("shows navigation commands", () => {
    useUIStore.setState({ commandPaletteOpen: true })
    render(<CommandPalette />)

    expect(screen.getByText("Navigation")).toBeInTheDocument()
    expect(screen.getByText("Canvas")).toBeInTheDocument()
    expect(screen.getByText("River")).toBeInTheDocument()
    expect(screen.getByText("Visions")).toBeInTheDocument()
    expect(screen.getByText("Reflections")).toBeInTheDocument()
  })

  it("shows agent commands", () => {
    useUIStore.setState({ commandPaletteOpen: true })
    render(<CommandPalette />)

    expect(screen.getByText("Agents")).toBeInTheDocument()
    expect(screen.getByText("Create Agent")).toBeInTheDocument()
    expect(screen.getByText("Pause All Agents")).toBeInTheDocument()
    expect(screen.getByText("Resume All Agents")).toBeInTheDocument()
  })

  it("shows document commands", () => {
    useUIStore.setState({ commandPaletteOpen: true })
    render(<CommandPalette />)

    expect(screen.getByText("Documents")).toBeInTheDocument()
    expect(screen.getByText("New Vision")).toBeInTheDocument()
    expect(screen.getByText("New Reflection")).toBeInTheDocument()
  })

  it("shows settings commands", () => {
    useUIStore.setState({ commandPaletteOpen: true })
    render(<CommandPalette />)

    expect(screen.getByText("Settings")).toBeInTheDocument()
    expect(screen.getByText("Toggle Theme")).toBeInTheDocument()
    expect(screen.getByText("Toggle Constellation Mode")).toBeInTheDocument()
  })

  it("shows keyboard shortcuts", () => {
    useUIStore.setState({ commandPaletteOpen: true })
    render(<CommandPalette />)

    expect(screen.getByText("⌘1")).toBeInTheDocument()
    expect(screen.getByText("⌘2")).toBeInTheDocument()
    expect(screen.getByText("⌘3")).toBeInTheDocument()
    expect(screen.getByText("⌘4")).toBeInTheDocument()
  })

  it("shows search input with placeholder", () => {
    useUIStore.setState({ commandPaletteOpen: true })
    render(<CommandPalette />)

    const input = screen.getByTestId("command-input")
    expect(input).toHaveAttribute(
      "placeholder",
      "Type a command or search..."
    )
  })
})
