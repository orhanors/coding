"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(`/projects/${project.id}`)}
      className={cn(
        "w-full text-left p-5 rounded-lg border transition-all duration-150",
        "bg-[var(--bg-secondary)] border-[var(--border-subtle)]",
        "hover:border-[var(--border-strong)] hover:-translate-y-[0.5px]",
        "hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">{project.name}</h3>
        <span
          className={cn(
            "flex items-center gap-1.5 text-xs",
            project.agentStatus === "active"
              ? "text-[var(--accent-primary)]"
              : "text-[var(--text-muted)]"
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              project.agentStatus === "active"
                ? "bg-[var(--accent-primary)] animate-agent-pulse"
                : "bg-[var(--text-muted)]"
            )}
          />
          {project.agentStatus === "active" ? "Agent working" : "Idle"}
        </span>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-2">
        {project.adrCount} ADR{project.adrCount !== 1 ? "s" : ""} · {project.prdCount} PRD{project.prdCount !== 1 ? "s" : ""}
      </p>

      <p className="text-xs text-[var(--text-muted)]">
        Last diff: {formatDistanceToNow(project.lastDiffAt, { addSuffix: true })}
      </p>
    </button>
  )
}
