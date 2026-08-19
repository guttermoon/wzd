"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

/**
 * Dark/light switch. Renders a stable placeholder until mounted so the
 * markup matches on the server (the resolved theme isn't known there), and
 * always exposes the *current* state in its accessible name.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"
  const label = !mounted
    ? "Switch colour theme"
    : isDark
      ? "Switch to light theme (currently dark)"
      : "Switch to dark theme (currently light)"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center border-2 border-rule text-text hover:bg-text hover:text-bg"
    >
      {/* Split disc: filled half reads as "dark", open half as "light". */}
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" />
      </svg>
    </button>
  )
}
