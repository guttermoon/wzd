"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { NAV } from "@/lib/event"

/**
 * The small-screen menu.
 *
 * Still a native <details>, so it opens with the keyboard, works before
 * hydration, and needs no focus trapping of its own. What the browser does
 * not do is close it again: app-router navigation never reloads the page,
 * so without this the menu stays open over whatever you just navigated to.
 *
 * It closes on three things:
 *
 * - a change of route, which covers every link in it, plus the back and
 *   forward buttons;
 * - a click on any link, because choosing the page you are already on
 *   changes no route and would otherwise leave the menu hanging open;
 * - Escape, which is what anyone who has met a menu expects, with focus
 *   returned to the button so the keyboard does not lose its place.
 */
export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (ref.current) ref.current.open = false
  }, [pathname])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      const menu = ref.current
      if (!menu?.open) return
      menu.open = false
      menu.querySelector("summary")?.focus()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <details ref={ref} className="group relative lg:hidden">
      <summary
        className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center border-2 border-blood-text [&::-webkit-details-marker]:hidden"
        aria-label="Menu"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </summary>
      <nav
        aria-label="Primary"
        className="absolute right-0 z-50 mt-2 w-56 border-2 border-rule bg-bg p-2 text-text shadow-lg"
      >
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => {
                  if (ref.current) ref.current.open = false
                }}
                className="display flex min-h-[44px] items-center px-3 text-base text-text hover:bg-text hover:text-bg"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  )
}
