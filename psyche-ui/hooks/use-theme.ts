"use client"

import { useTheme as useNextTheme } from "next-themes"
import { useCallback } from "react"

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme()

  const isDark = resolvedTheme === "dark"

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? "light" : "dark")
  }, [isDark, setTheme])

  return { theme, isDark, toggleTheme, setTheme }
}
