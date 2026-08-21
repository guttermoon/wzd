import { brandSvg } from "@/lib/brand-art"

/**
 * The full lock-up, inlined.
 *
 * Inlined rather than linked so the lettering can take `currentColor` and
 * follow the theme: one file serves both grounds, and there is no flash
 * while the right one is chosen. It is the same file `/press` offers as a
 * download, so what is on the page is what people get.
 *
 * The SVG is marked decorative and the name is carried by an adjacent
 * `sr-only` span, because the drawing is the site's name and a screen
 * reader needs to hear it. Callers that already announce the name — the
 * masthead link, for instance — should pass `label={false}`.
 */
const svg = brandSvg("wordmark.svg")

export function Wordmark({
  className = "",
  label = true,
}: {
  className?: string
  label?: boolean
}) {
  return (
    // The size rules reach the <svg> by descendant, not child: the markup
    // is wrapped in a span of its own, so `[&>svg]` matched nothing and the
    // drawing kept its intrinsic width whatever the caller asked for.
    <span className={`block [&_svg]:h-auto [&_svg]:w-full ${className}`}>
      <span className="block" dangerouslySetInnerHTML={{ __html: svg }} />
      {label ? <span className="sr-only">World Zombie Day: London</span> : null}
    </span>
  )
}
