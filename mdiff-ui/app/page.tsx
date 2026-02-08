"use client"

import React from "react"
import { ProjectCard } from "@/components/project/project-card"
import { AddProjectCard } from "@/components/project/add-project-card"
import { RecentDiffList } from "@/components/diff/recent-diff-list"
import { mockProjects, mockDiffs } from "@/lib/mock-data"
import { Plus, Download } from "lucide-react"

export default function DashboardPage() {
  const recentDiffs = [...mockDiffs].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  ).slice(0, 5)

  return (
    <div className="py-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Your Projects</h1>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] transition-colors">
            <Plus className="w-4 h-4" />
            New Project
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors">
            <Download className="w-4 h-4" />
            Import
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <AddProjectCard />
      </div>

      {/* Divider */}
      <hr className="border-[var(--border-subtle)]" />

      {/* Recent Diffs */}
      <RecentDiffList diffs={recentDiffs} />
    </div>
  )
}
