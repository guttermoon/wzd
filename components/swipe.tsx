"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Type that arrives in pieces.
 *
 * Reveal pulls one panel off a whole block. This does it a word at a time,
 * each word coming up behind its own panel of ground colour, 60ms behind
 * the last — under the 80-120ms house stagger because words are smaller
 * and closer together than blocks, and at 100ms a long heading reads as a
 * queue rather than a title card.
 *
 * It takes a string rather than children because it has to split the text,
 * and `<T k="…" />` returns nodes with <br/> in them. `makeS` in
 * components/notion-text.tsx already returns the plain string for exactly
 * this kind of slot, so headings pass `S("home.hero.title")`.
 *
 * Opt-in, like everything else here: until this has mounted and confirmed
 * the browser can and should animate, the words are simply there, with no
 * panels over them and no transform on them. A heading that depends on an
 * animation to be legible is one broken custom property away from an
 * invisible page, which has happened on this project once already.
 */
export function Swipe({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  step = 60,
}: {
  text: string
  as?: "h1" | "h2" | "p" | "span"
  className?: string
  /** Stagger before the first word, in ms. */
  delay?: number
  /** Gap between words, in ms. */
  step?: number
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const words = text.split(/\s+/).filter(Boolean)

  return (
    <Tag ref={ref as never} className={`${shown ? "in-view" : ""} ${className}`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          {/* The space sits outside the inline-block, not inside it. Inside,
              the line cannot break there, and the heading wraps differently
              once this arms than it did on the server. */}
          <span
            className={armed ? "swipe-word" : undefined}
            style={{ "--delay": `${delay + i * step}ms` } as React.CSSProperties}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  )
}
