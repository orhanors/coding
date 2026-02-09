"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutGrid,
  Waves,
  Kanban,
  BookOpen,
  Plus,
  UserPlus,
  Pause,
  Play,
  Sun,
  Moon,
  GitBranch,
  FileText,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useUIStore } from "@/stores/ui-store"
import { useAgentStore } from "@/stores/agent-store"
import { useCanvasStore } from "@/stores/canvas-store"
import { useTheme } from "@/hooks/use-theme"

export function CommandPalette() {
  const router = useRouter()
  const open = useUIStore((s) => s.commandPaletteOpen)
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette)
  const openConfigPanel = useAgentStore((s) => s.openConfigPanel)
  const setMode = useCanvasStore((s) => s.setMode)
  const mode = useCanvasStore((s) => s.mode)
  const { isDark, toggleTheme } = useTheme()

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        toggleCommandPalette()
      }
      // Quick nav shortcuts
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        switch (e.key) {
          case "1":
            e.preventDefault()
            router.push("/canvas")
            break
          case "2":
            e.preventDefault()
            router.push("/river")
            break
          case "3":
            e.preventDefault()
            router.push("/visions")
            break
          case "4":
            e.preventDefault()
            router.push("/reflections")
            break
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [toggleCommandPalette, router])

  const runAndClose = (fn: () => void) => {
    fn()
    toggleCommandPalette()
  }

  return (
    <CommandDialog open={open} onOpenChange={toggleCommandPalette}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runAndClose(() => router.push("/canvas"))}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            Canvas
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => router.push("/river"))}>
            <Waves className="mr-2 h-4 w-4" />
            River
            <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => router.push("/visions"))}>
            <Kanban className="mr-2 h-4 w-4" />
            Visions
            <CommandShortcut>⌘3</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => router.push("/reflections"))}>
            <BookOpen className="mr-2 h-4 w-4" />
            Reflections
            <CommandShortcut>⌘4</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Agents">
          <CommandItem
            onSelect={() =>
              runAndClose(() => {
                router.push("/canvas")
                openConfigPanel()
              })
            }
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create Agent
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runAndClose(() => {
                useAgentStore.getState().agents.forEach((a) => {
                  if (a.status === "active") {
                    useAgentStore.getState().setAgentStatus(a.id, "paused")
                  }
                })
              })
            }
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause All Agents
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runAndClose(() => {
                useAgentStore.getState().agents.forEach((a) => {
                  if (a.status === "paused") {
                    useAgentStore.getState().setAgentStatus(a.id, "active")
                  }
                })
              })
            }
          >
            <Play className="mr-2 h-4 w-4" />
            Resume All Agents
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Documents">
          <CommandItem onSelect={() => runAndClose(() => router.push("/visions"))}>
            <Plus className="mr-2 h-4 w-4" />
            New Vision
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => router.push("/reflections"))}>
            <FileText className="mr-2 h-4 w-4" />
            New Reflection
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runAndClose(toggleTheme)}>
            {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle Theme
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runAndClose(() =>
                setMode(mode === "canvas" ? "constellation" : "canvas")
              )
            }
          >
            <GitBranch className="mr-2 h-4 w-4" />
            Toggle Constellation Mode
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
