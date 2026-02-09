import { create } from "zustand"
import { CANVAS_MIN_ZOOM, CANVAS_MAX_ZOOM, CANVAS_DEFAULT_ZOOM } from "@/lib/constants"

interface CanvasStore {
  zoom: number
  pan: { x: number; y: number }
  mode: "canvas" | "constellation"
  selectedNodeId: string | null
  isDragging: boolean

  setZoom: (level: number) => void
  setPan: (pan: { x: number; y: number }) => void
  setMode: (mode: "canvas" | "constellation") => void
  setSelectedNode: (id: string | null) => void
  setDragging: (dragging: boolean) => void
  resetView: () => void
  zoomIn: () => void
  zoomOut: () => void
}

export const useCanvasStore = create<CanvasStore>()((set) => ({
  zoom: CANVAS_DEFAULT_ZOOM,
  pan: { x: 0, y: 0 },
  mode: "canvas",
  selectedNodeId: null,
  isDragging: false,

  setZoom: (level) => {
    set({ zoom: Math.max(CANVAS_MIN_ZOOM, Math.min(CANVAS_MAX_ZOOM, level)) })
  },

  setPan: (pan) => {
    set({ pan })
  },

  setMode: (mode) => {
    set({ mode })
  },

  setSelectedNode: (id) => {
    set({ selectedNodeId: id })
  },

  setDragging: (dragging) => {
    set({ isDragging: dragging })
  },

  resetView: () => {
    set({ zoom: CANVAS_DEFAULT_ZOOM, pan: { x: 0, y: 0 } })
  },

  zoomIn: () => {
    set((s) => ({
      zoom: Math.min(CANVAS_MAX_ZOOM, s.zoom + 0.25),
    }))
  },

  zoomOut: () => {
    set((s) => ({
      zoom: Math.max(CANVAS_MIN_ZOOM, s.zoom - 0.25),
    }))
  },
}))
