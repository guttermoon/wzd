"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A zombie hand, reaching in from the edge of the frame.
 *
 * Cut-paper, the way Bass draws a limb: one flat silhouette, no modelling,
 * no outline. It is drawn here rather than traced from anything — the palm
 * and forearm are polygons, the fingers are round-capped strokes, which is
 * what gives them their weight without any curve fitting.
 *
 * It slides in from its edge, overshoots by a couple of degrees and settles
 * back. Decorative and inert: hidden from assistive tech, never able to
 * take a pointer event, and it sits behind everything it shares a box with.
 *
 * Like the bars, the animation is opt-in — the hand is in its final
 * position until this has mounted and confirmed the browser can and should
 * animate, so nothing depends on the animation to be visible.
 */
export function Hand({
  from = "left",
  className = "",
  delay = 0,
  tone = "ink",
}: {
  from?: "left" | "right"
  className?: string
  delay?: number
  tone?: "ink" | "accent" | "text"
}) {
  const ref = useRef<HTMLSpanElement>(null)
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const fill =
    tone === "accent" ? "var(--accent)" : tone === "text" ? "var(--text)" : "var(--near-black)"

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute block ${shown ? "in-view" : ""} ${className}`}
    >
      <svg
        viewBox="0 0 240 340"
        focusable="false"
        className={`h-full w-full ${armed ? `hand hand-${from}` : ""} ${
          from === "right" ? "-scale-x-100" : ""
        }`}
        style={{ "--delay": `${delay}ms` } as React.CSSProperties}
      >
        <g fill={fill} stroke={fill} strokeWidth="26" strokeLinecap="round">
          <path d="M70 178 L172 172 L182 252 L58 258 Z" stroke="none" />
          <path d="M70 250 L172 244 L188 340 L54 340 Z" stroke="none" />
          <path d="M92 186 L76 62" fill="none" />
          <path d="M118 183 L120 40" fill="none" />
          <path d="M146 183 L158 58" fill="none" />
          <path d="M168 188 L196 96" fill="none" />
          <path d="M74 206 L22 152" fill="none" strokeWidth="30" />
        </g>
      </svg>
    </span>
  )
}
