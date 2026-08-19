import { readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * The official WZD London lock-up.
 *
 * The lettering is Crackhouse, traced from the artwork in the style guide
 * kit into vector paths — so the letterforms are on the page without the
 * font ever being served, which matters because we hold no webfont licence
 * for it. The brain-globe inside the O is the supplied vector mark,
 * dropped in unaltered.
 *
 * It is inlined rather than linked so the lettering can take `currentColor`
 * and follow the theme. That means one asset instead of a light and a dark
 * raster, and no flash while the right one is chosen.
 *
 * Both are built by scripts/prepare-logos.mjs. The guide forbids
 * stretching, recolouring and effects; only the lettering is themed, and
 * only between the two inks the lock-up already ships in.
 */
const svg = readFileSync(join(process.cwd(), "public/brand/wordmark.svg"), "utf8")
  // The file is a standalone document; strip the outer tag so it can carry
  // the caller's sizing and be hidden from assistive tech.
  .replace(/<svg([^>]*)>/, "<svg$1 aria-hidden=\"true\" focusable=\"false\">")

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block [&>svg]:h-auto [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
