"use client"

import React from "react"
import { Plus } from "lucide-react"

interface AddProjectCardProps {
  onClick?: () => void
}

export function AddProjectCard({ onClick }: AddProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-5 rounded-lg border-2 border-dashed border-[var(--border-default)] hover:border-[var(--border-strong)] transition-colors flex items-center justify-center min-h-[140px] group"
    >
      <span className="flex items-center gap-2 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">Add project</span>
      </span>
    </button>
  )
}
