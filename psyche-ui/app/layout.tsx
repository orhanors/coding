import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { PsycheShell } from "@/components/layout/psyche-shell"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Psyche",
  description:
    "Psyche — multi-agent orchestration workspace. Observe, guide, and approve autonomous coding agents through an introspective, canvas-based interface.",
}

export const viewport: Viewport = {
  themeColor: "#0a0a12",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${newsreader.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <PsycheShell>{children}</PsycheShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
