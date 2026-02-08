"use client"

import React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import {
  LayoutDashboard,
  Clock,
  Plug,
  FolderOpen,
  Plus,
  Download,
  Zap,
} from "lucide-react"
import { mockProjects } from "@/lib/mock-data"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()

  const navigate = (path: string) => {
    onOpenChange(false)
    router.push(path)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search projects, pages, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigate("/")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => navigate("/timeline")}>
            <Clock className="mr-2 h-4 w-4" />
            Timeline
          </CommandItem>
          <CommandItem onSelect={() => navigate("/integrations")}>
            <Plug className="mr-2 h-4 w-4" />
            Integrations
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Projects">
          {mockProjects.map((project) => (
            <CommandItem
              key={project.id}
              onSelect={() => navigate(`/projects/${project.id}`)}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              {project.name}
              <span className="ml-auto text-2xs text-[var(--text-muted)]">
                {project.adrCount} ADRs · {project.prdCount} PRDs
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => onOpenChange(false)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </CommandItem>
          <CommandItem onSelect={() => onOpenChange(false)}>
            <Download className="mr-2 h-4 w-4" />
            Import Project
          </CommandItem>
          <CommandItem onSelect={() => onOpenChange(false)}>
            <Zap className="mr-2 h-4 w-4" />
            Add Feature
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
