# mdiff — Design Token Reference

All tokens are defined as CSS custom properties in `app/globals.css`. The dark theme is the default (`:root`); the light theme is applied via `.light` class.

## Base Colors

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--bg-primary` | `#09090b` | `#fafafa` | Page background |
| `--bg-secondary` | `#0f0f14` | `#ffffff` | Cards, panels |
| `--bg-tertiary` | `#16161e` | `#f4f4f5` | Badges, nested surfaces |
| `--bg-hover` | `#1e1e2a` | `#e4e4e7` | Hover state backgrounds |
| `--bg-active` | `#262636` | `#d4d4d8` | Active/pressed backgrounds |
| `--bg-surface` | `#121218` | `#f0f0f2` | Code blocks, diff gutters |

## Borders

| Token | Dark | Light |
|-------|------|-------|
| `--border-subtle` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.04)` |
| `--border-default` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |
| `--border-strong` | `rgba(255,255,255,0.14)` | `rgba(0,0,0,0.16)` |

## Text

| Token | Dark | Light |
|-------|------|-------|
| `--text-primary` | `#ededf0` | `#18181b` |
| `--text-secondary` | `#8b8b9e` | `#71717a` |
| `--text-muted` | `#4e4e64` | `#a1a1aa` |
| `--text-inverse` | `#09090b` | `#fafafa` |

## Accent — Electric Violet

| Token | Dark | Light |
|-------|------|-------|
| `--accent-primary` | `#a855f7` | `#7c3aed` |
| `--accent-hover` | `#9333ea` | `#6d28d9` |
| `--accent-muted` | `rgba(168,85,247,0.12)` | `rgba(124,58,237,0.08)` |
| `--accent-subtle` | `rgba(168,85,247,0.06)` | `rgba(124,58,237,0.04)` |
| `--accent-glow` | `rgba(168,85,247,0.25)` | `rgba(124,58,237,0.15)` |

## Semantic

| Token | Dark | Light |
|-------|------|-------|
| `--success` | `#34d399` | `#16a34a` |
| `--warning` | `#fbbf24` | `#d97706` |
| `--error` | `#f87171` | `#dc2626` |
| `--info` | `#60a5fa` | `#2563eb` |

Each semantic color has a `-muted` variant at 8-10% opacity.

## Diff Colors

| Token | Dark | Light |
|-------|------|-------|
| `--diff-added-bg` | `rgba(52,211,153,0.08)` | `rgba(22,163,74,0.06)` |
| `--diff-added-border` | `rgba(52,211,153,0.30)` | `rgba(22,163,74,0.25)` |
| `--diff-added-text` | `#6ee7b7` | `#166534` |
| `--diff-removed-bg` | `rgba(248,113,113,0.08)` | `rgba(220,38,38,0.06)` |
| `--diff-removed-border` | `rgba(248,113,113,0.30)` | `rgba(220,38,38,0.25)` |
| `--diff-removed-text` | `#fca5a5` | `#991b1b` |
| `--diff-modified-bg` | `rgba(168,85,247,0.08)` | `rgba(124,58,237,0.06)` |
| `--diff-modified-border` | `rgba(168,85,247,0.30)` | `rgba(124,58,237,0.25)` |

## Stage Colors

| Token | Dark | Light | Stage |
|-------|------|-------|-------|
| `--stage-adr` | `#a78bfa` | `#7c3aed` | ADR generation |
| `--stage-prd` | `#c084fc` | `#9333ea` | PRD generation |
| `--stage-excalidraw` | `#f9a8d4` | `#db2777` | Excalidraw diagrams |
| `--stage-implement` | `#34d399` | `#16a34a` | Implementation |

## Agent Activity

| Token | Dark | Light |
|-------|------|-------|
| `--agent-pulse` | `rgba(168,85,247,0.40)` | `rgba(124,58,237,0.25)` |
| `--agent-stream` | `#a855f7` | `#7c3aed` |

## Tailwind Utility Mappings

Extended colors in `tailwind.config.ts`:

| Tailwind Class | Maps To |
|----------------|---------|
| `md-accent` | `--accent-primary` |
| `diff-added` | `--diff-added-text` |
| `diff-removed` | `--diff-removed-text` |
| `diff-modified` | `--diff-modified-border` |
| `stage-adr` | `--stage-adr` |
| `stage-prd` | `--stage-prd` |
| `stage-excalidraw` | `--stage-excalidraw` |
| `stage-implement` | `--stage-implement` |
| `agent-pulse` | `--agent-pulse` |
| `agent-stream` | `--agent-stream` |

## Animation Utilities

| Class | Keyframes | Duration |
|-------|-----------|----------|
| `animate-agent-pulse` | `agent-pulse` | 2s ease-in-out infinite |
| `animate-shimmer` | `shimmer` | 1.5s infinite |
| `animate-blink-cursor` | `blink-cursor` | 800ms step-end infinite |
| `animate-slide-right` | `slide-from-right` | 300ms ease-out |
| `animate-slide-bottom` | `slide-from-bottom` | 300ms ease-out |
| `animate-fade-in` | `fade-in` | 200ms ease-out |
| `animate-count-up` | `count-up` | 400ms ease-out |
| `animate-slide-in` | `timeline-entry-in` | 300ms ease-out |
