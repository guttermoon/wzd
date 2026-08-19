"use client"

import { useEffect, useRef, useState } from "react"

/**
 * The title card: hard slabs driving in from the four edges of the frame,
 * stopping at different depths, leaving the type in the negative space
 * between them.
 *
 * This is the Golden Arm main title, which is what the reference clip opens
 * on — bars enter from left, right, top and bottom, each a slightly
 * different length, each off square by a degree or two, arriving one after
 * another rather than together. They stop dead and stay put.
 *
 * Purely decorative, so it is hidden from assistive tech, and always
 * `pointer-events: none` — a slab that lands over a button and swallows the
 * click is the one way this can do real damage.
 *
 * Like components/reveal.tsx, the animation is opt-in: the bars are in
 * their final position until this has mounted and confirmed the browser
 * both can and should animate. Reduced-motion visitors get the finished
 * composition with nothing travelling.
 */

export type Bar = {
  /** Which edge it drives in from. */
  from: "left" | "right" | "top" | "bottom"
  /** Position and size, as percentages of the frame. */
  top?: string
  left?: string
  right?: string
  bottom?: string
  width?: string
  height?: string
  /** Degrees off square. Bass is never quite level. */
  tilt?: number
  /** accent (Zombie Red), ink (near-black), text, or surface. */
  tone?: "accent" | "ink" | "text" | "surface"
  /** Stagger, in ms. */
  delay?: number
}

const TONE = {
  accent: "bg-accent",
  ink: "bg-ink",
  text: "bg-text",
  surface: "bg-surface",
} as const

export function Bars({ bars, className = "" }: { bars: Bar[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
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
      { rootMargin: "0px 0px -5% 0px", threshold: 0.01 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        shown ? "in-view" : ""
      } ${className}`}
    >
      {bars.map((bar, i) => (
        <span
          key={i}
          className={`absolute block ${TONE[bar.tone ?? "accent"]} ${
            armed ? `bar bar-${bar.from}` : ""
          }`}
          style={
            {
              top: bar.top,
              left: bar.left,
              right: bar.right,
              bottom: bar.bottom,
              width: bar.width,
              height: bar.height,
              "--delay": `${bar.delay ?? i * 90}ms`,
              "--tilt": `${bar.tilt ?? 0}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
