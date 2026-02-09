"use client"

import { usePathname } from "next/navigation"

export function ViewTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div
      key={pathname}
      className="h-full w-full"
      style={{
        animation: "view-transition-fade 200ms ease forwards",
      }}
    >
      {children}
    </div>
  )
}
