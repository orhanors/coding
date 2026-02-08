import type { ComponentType } from "react"

export type ComponentRegistry = Map<string, ComponentType<Record<string, unknown>>>

const registry: ComponentRegistry = new Map()

export function registerComponent(type: string, component: ComponentType<Record<string, unknown>>) {
  registry.set(type, component)
}

export function getComponent(type: string): ComponentType<Record<string, unknown>> | undefined {
  return registry.get(type)
}

export { registry }
