"use client"

import { PsycheTopBar } from "./psyche-top-bar"
import { StatusStrip } from "./status-strip"
import { CommandPalette } from "./command-palette"

export function PsycheShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <PsycheTopBar />
      <main className="flex-1 overflow-hidden">{children}</main>
      <StatusStrip />
      <CommandPalette />
    </div>
  )
}
