import { brandSvg } from "@/lib/brand-art"

/**
 * The brain-globe on its own — the masthead mark.
 *
 * The supplied vector, cropped to the drawing and reduced in precision by
 * scripts/prepare-logos.mjs. It is full-colour artwork and takes no theming,
 * so unlike the lock-up it never needed `currentColor`; it is inlined all
 * the same, because components/photo.tsx is the only component allowed to
 * emit an image element, and that rule is worth more than one saved
 * request.
 *
 * Decorative: the accessible name comes from the link wrapping it.
 */
const svg = brandSvg("brain-mark.svg")

export function BrainMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block [&>svg]:h-full [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
