# mdiff — Development Setup Guide

## Prerequisites

- **Node.js** 20+ (tested with 22.x)
- **npm** 10+

## Install

```bash
cd mdiff-ui
npm install
```

## Environment Variables

Create `.env.local` if needed (no required env vars for local development):

```bash
# Optional: override default port
PORT=3000
```

## Running

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint
```

The dev server starts at `http://localhost:3000`.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

Tests use [Vitest](https://vitest.dev) with React Testing Library. Test files live under `test/`.

## Project Structure

```
mdiff-ui/
├── app/                  # Next.js App Router pages & API routes
│   ├── api/              # REST API endpoints
│   ├── integrations/     # Integrations hub page
│   ├── projects/[id]/    # Project workspace page
│   ├── timeline/         # Timeline page
│   ├── globals.css       # Design tokens & theme
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard
├── components/
│   ├── a2ui/             # A2UI renderer & registry
│   ├── agent/            # Agent stream overlay & event log
│   ├── diff/             # Diff cards, viewer, stats, hunks
│   ├── document/         # Document list & reader
│   ├── excalidraw/       # Excalidraw canvas placeholder
│   ├── integrations/     # Integration cards, delivery log, config
│   ├── layout/           # Shell, top bar, status strip, cmd palette
│   ├── project/          # Project cards, workspace tabs
│   └── ui/               # shadcn/ui primitives
├── hooks/                # Custom React hooks (SSE)
├── lib/                  # Types, utils, mock data, event system
├── stores/               # Zustand state stores
├── test/                 # Test files
└── docs/                 # Developer documentation
```
