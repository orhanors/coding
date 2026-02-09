import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Psyche accent
        "ps-accent": "var(--accent-primary)",
        "ps-accent-hover": "var(--accent-hover)",
        "ps-accent-muted": "var(--accent-muted)",
        // Archetype colors
        archetype: {
          architect: "var(--archetype-architect)",
          guardian: "var(--archetype-guardian)",
          explorer: "var(--archetype-explorer)",
          alchemist: "var(--archetype-alchemist)",
          shadow: "var(--archetype-shadow)",
          sage: "var(--archetype-sage)",
          herald: "var(--archetype-herald)",
          trickster: "var(--archetype-trickster)",
        },
        // Diff colors
        "diff-added": {
          bg: "var(--diff-added-bg)",
          border: "var(--diff-added-border)",
          text: "var(--diff-added-text)",
        },
        "diff-removed": {
          bg: "var(--diff-removed-bg)",
          border: "var(--diff-removed-border)",
          text: "var(--diff-removed-text)",
        },
        // Canvas
        "canvas-grid": "var(--canvas-grid)",
        "canvas-connection": "var(--canvas-connection)",
        "canvas-connection-active": "var(--canvas-connection-active)",
        // Constellation
        constellation: {
          line: "var(--constellation-line)",
          "line-active": "var(--constellation-line-active)",
          glow: "var(--constellation-glow)",
        },
        // Agent
        "agent-pulse": "var(--agent-pulse)",
        "agent-stream": "var(--agent-stream)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        display: ["var(--font-newsreader)", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],
        base: ["0.9375rem", { lineHeight: "1.5" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.375rem", { lineHeight: "1.4" }],
        "2xl": ["1.75rem", { lineHeight: "1.3" }],
        "3xl": ["2.25rem", { lineHeight: "1.2" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "topbar": "52px",
        "statusstrip": "24px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "agent-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 var(--agent-pulse)" },
          "50%": { boxShadow: "0 0 0 6px transparent" },
        },
        "agent-glow": {
          "0%, 100%": { boxShadow: "0 0 0px var(--agent-pulse)" },
          "50%": { boxShadow: "0 0 12px var(--agent-pulse)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "blink-cursor": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "slide-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "view-switch": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "timeline-entry-in": {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "connection-flow": {
          from: { strokeDashoffset: "20" },
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "agent-pulse": "agent-pulse 2s ease-in-out infinite",
        "agent-glow": "agent-glow 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
        "blink-cursor": "blink-cursor 0.53s infinite",
        "slide-right": "slide-from-right 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-bottom": "slide-from-bottom 0.2s cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-in": "fade-in 0.15s ease-out",
        "count-up": "count-up 0.3s ease-out",
        "slide-in": "slide-in 0.15s ease-out",
        "view-switch": "view-switch 0.2s ease",
        "timeline-entry": "timeline-entry-in 0.15s ease-out",
        "connection-flow": "connection-flow 1.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
