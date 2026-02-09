import { useEffect } from "react"

export interface ShortcutDefinition {
  key: string
  meta?: boolean
  ctrl?: boolean
  shift?: boolean
  handler: () => void
}

/**
 * Centralized keyboard shortcut handler.
 *
 * - Accepts an array of shortcut definitions.
 * - Handles platform detection: on macOS `meta` matches Cmd; on other
 *   platforms `meta` is treated as Ctrl so shortcuts work cross-platform.
 * - Ignores shortcuts when focus is inside an input, textarea, or select.
 * - Registers a single global `keydown` listener on mount and removes it
 *   on unmount.
 */
export function useKeyboardShortcuts(shortcuts: ShortcutDefinition[]) {
  useEffect(() => {
    const isMac =
      typeof navigator !== "undefined" &&
      /Mac|iPod|iPhone|iPad/.test(navigator.platform)

    function handleKeyDown(e: KeyboardEvent) {
      // Ignore shortcuts when focus is inside form elements
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return
      }

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
        if (!keyMatch) continue

        // Platform-aware modifier matching:
        // If shortcut.meta is set, match metaKey on Mac, ctrlKey on others.
        // If shortcut.ctrl is set, always match ctrlKey.
        const wantsMeta = shortcut.meta ?? false
        const wantsCtrl = shortcut.ctrl ?? false
        const wantsShift = shortcut.shift ?? false

        let modifierMatch: boolean
        if (wantsMeta) {
          // On Mac, meta = Cmd; on Windows/Linux, treat meta shortcuts as Ctrl
          const metaSatisfied = isMac ? e.metaKey : e.ctrlKey
          modifierMatch =
            metaSatisfied &&
            e.shiftKey === wantsShift &&
            // Ensure the other modifier is not pressed unexpectedly
            (isMac ? !e.ctrlKey || wantsCtrl : !e.metaKey)
        } else if (wantsCtrl) {
          modifierMatch =
            e.ctrlKey &&
            !e.metaKey &&
            e.shiftKey === wantsShift
        } else {
          // No modifier required — make sure none are pressed
          modifierMatch = !e.metaKey && !e.ctrlKey && e.shiftKey === wantsShift
        }

        if (modifierMatch) {
          e.preventDefault()
          shortcut.handler()
          return
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts])
}
