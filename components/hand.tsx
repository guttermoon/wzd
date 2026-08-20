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
/**
 * Written out in full, never interpolated: Tailwind deletes @layer
 * components rules whose class name it cannot find literally in the
 * source. See scripts/check-css.mjs.
 */
const TILT = { left: "hand-tilt-left", right: "hand-tilt-right" } as const
const ENTER = { left: "hand-left", right: "hand-right" } as const

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
      {/* The forearm runs the full height of the viewBox and off the bottom
          of it, so the arm carries on past whatever crops it: a hand that
          stops at a wrist reads as a mitten someone has put down. */}
      <svg
        viewBox="0 0 240 640"
        preserveAspectRatio="xMidYMin meet"
        focusable="false"
        className={`${TILT[from]} ${armed ? `hand ${ENTER[from]}` : ""} h-full w-full`}
        style={{ "--delay": `${delay}ms` } as React.CSSProperties}
      >
        <g fill={fill} stroke={fill} strokeWidth="30" strokeLinecap="round">
          <path d="M62 196 L178 190 L192 302 L50 310 Z" stroke="none" />
          <path d="M50 300 L192 292 L178 640 L70 640 Z" stroke="none" />
          <path d="M86 204 L64 62" fill="none" />
          <path d="M118 200 L120 34" fill="none" />
          <path d="M150 202 L168 54" fill="none" />
          <path d="M178 210 L210 100" fill="none" />
          <path d="M58 234 L6 166" fill="none" strokeWidth="34" />
        </g>
      </svg>
    </span>
  )
}
