"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type RevealEffect = "settle" | "fade" | "stamp"

interface RevealProps {
  children: ReactNode
  effect?: RevealEffect
  /** Stagger delay in ms */
  delay?: number
  /** Resting rotation in degrees (clippings settle into this angle) */
  rotate?: number
  className?: string
  as?: "div" | "span" | "section" | "li" | "article"
}

/**
 * Adds .is-inview once when the element scrolls ~15% into view, driving the
 * CSS reveal animations (settle / fade-up / stamp-in) and any .highlight or
 * .overprint descendants. Renders in final state under prefers-reduced-motion.
 */
export function Reveal({
  children,
  effect = "settle",
  delay = 0,
  rotate = 0,
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style: CSSProperties = {
    "--reveal-delay": `${delay}ms`,
    "--clip-rot": `${rotate}deg`,
    "--settle-rot": `${rotate === 0 ? -1.5 : rotate}deg`,
  } as CSSProperties

  return (
    <Tag
      // @ts-expect-error ref type varies with Tag
      ref={ref}
      style={style}
      className={cn(`reveal-${effect}`, inView && "is-inview", className)}
    >
      {children}
    </Tag>
  )
}
