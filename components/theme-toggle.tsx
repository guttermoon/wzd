"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

/**
 * Dark/light switch.
 *
 * It names the mode it will switch to, in words as well as an icon, because
 * a lone half-disc glyph is not obvious enough on its own. Renders a stable
 * placeholder until mounted — the resolved theme isn't known on the server,
 * so anything else would mismatch during hydration.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"
  const target = isDark ? "Light" : "Dark"
  const label = mounted
    ? `Switch to ${target.toLowerCase()} mode (currently ${isDark ? "dark" : "light"})`
    : "Switch colour mode"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="display inline-flex min-h-[44px] items-center gap-2 border-2 border-rule px-3 text-sm text-text hover:bg-text hover:text-bg"
    >
      {isDark ? (
        // Sun: switching to light.
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.2 5.2l1.9 1.9M16.9 16.9l1.9 1.9M18.8 5.2l-1.9 1.9M7.1 16.9l-1.9 1.9" />
          </g>
        </svg>
      ) : (
        // Moon: switching to dark.
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            fill="currentColor"
          />
        </svg>
      )}
      {/* Hidden from assistive tech: the button's own label already says it. */}
      <span aria-hidden="true">{mounted ? target : "Theme"}</span>
    </button>
  )
}
