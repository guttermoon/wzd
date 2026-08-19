import { cn } from "@/lib/utils"

interface MarqueeProps {
  text: string
  /** Seconds per loop */
  speed?: number
  /** Times the phrase repeats inside one half of the track */
  repeat?: number
  className?: string
  textClassName?: string
}

/**
 * Pure-CSS infinite ticker. The track holds two identical halves and slides
 * -50%, so the loop is seamless. Pauses on hover; static under
 * prefers-reduced-motion (see globals.css).
 */
export function Marquee({
  text,
  speed = 22,
  repeat = 6,
  className,
  textClassName,
}: MarqueeProps) {
  const phrase = Array.from({ length: repeat }, () => text)

  const half = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {phrase.map((t, i) => (
        <span key={i} className={cn("whitespace-nowrap px-4", textClassName)}>
          {t}
        </span>
      ))}
    </div>
  )

  return (
    <div
      className={cn("marquee overflow-hidden", className)}
      style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}
    >
      <div className="marquee-track">
        {half(false)}
        {half(true)}
      </div>
    </div>
  )
}
