import { readFileSync } from "node:fs"
import { join } from "node:path"

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
const svg = readFileSync(join(process.cwd(), "public/brand/wordmark.svg"), "utf8")
  // Standalone document: strip its own sizing so the caller can size it.
  .replace(/<svg([^>]*)>/, '<svg$1 aria-hidden="true" focusable="false">')

export function Wordmark({
  className = "",
  label = true,
}: {
  className?: string
  label?: boolean
}) {
  return (
    <span className={`block [&>svg]:h-auto [&>svg]:w-full ${className}`}>
      <span dangerouslySetInnerHTML={{ __html: svg }} />
      {label ? <span className="sr-only">World Zombie Day: London</span> : null}
    </span>
  )
}
