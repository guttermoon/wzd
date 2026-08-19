"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Plays an element's entrance once, when it first comes into view.
 *
 * The animation is opt-in rather than opt-out: nothing is hidden until this
 * component has mounted and confirmed the browser can animate. Without
 * JavaScript, or before hydration, the content is simply there — so a
 * failed script can never leave the page blank.
 *
 * Reduced-motion visitors are given the finished state immediately and the
 * observer is never attached.
 */
export function Reveal({
  children = null,
  variant = "slide-up",
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children?: ReactNode
  /** How the element arrives. `wipe` pulls a panel off it. */
  variant?: "slide-up" | "slide-left" | "slide-right" | "cut" | "wipe" | "wipe-surface" | "wipe-red"
  /** Stagger, in ms. The style is 80–120ms between related elements. */
  delay?: number
  className?: string
  as?: "div" | "section" | "li" | "span" | "p"
}) {
  const ref = useRef<HTMLElement>(null)
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced || typeof IntersectionObserver === "undefined") return
    setArmed(true)

    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setShown(true)
          observer.disconnect()
        }
      },
      // Start a little before the element reaches the fold.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const wipe = variant.startsWith("wipe")
  const classes = [
    armed ? (wipe ? `wipe ${variant !== "wipe" ? variant : ""}` : variant) : "",
    shown ? "in-view" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <Tag
      ref={ref as never}
      className={classes}
      style={delay ? ({ "--delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
