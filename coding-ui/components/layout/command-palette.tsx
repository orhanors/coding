"use client"

import { useRouter } from "next/navigation"
import { useEffect, useCallback } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { LayoutDashboard, Workflow, FileText, Link2, History, Play, Plus, Search } from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()

  const navigate = useCallback(
    (path: string) => {
      router.push(path)
      onOpenChange(false)
    },
    [router, onOpenChange]
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigate("/")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => navigate("/pipeline")}>
            <Workflow className="mr-2 h-4 w-4" />
            Pipeline
          </CommandItem>
          <CommandItem onSelect={() => navigate("/documents")}>
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </CommandItem>
          <CommandItem onSelect={() => navigate("/integrations")}>
            <Link2 className="mr-2 h-4 w-4" />
            Integrations
          </CommandItem>
          <CommandItem onSelect={() => navigate("/history")}>
            <History className="mr-2 h-4 w-4" />
            History
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>
            <Play className="mr-2 h-4 w-4" />
            Run Pipeline
          </CommandItem>
          <CommandItem>
            <Plus className="mr-2 h-4 w-4" />
            New ADR
          </CommandItem>
          <CommandItem>
            <Search className="mr-2 h-4 w-4" />
            Search Documents
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
