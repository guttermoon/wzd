import type React from "react"

/**
 * A link that leaves the site.
 *
 * Every one of them opens in a new tab, which is the owner's instruction,
 * and every one of them says so. A link that moves you somewhere else
 * without warning is disorienting for anyone who cannot see it happen, and
 * with `target="_blank"` the back button no longer returns you either, so
 * the announcement is not a nicety.
 *
 * `rel="noopener noreferrer"` because a page opened this way can otherwise
 * reach back through `window.opener`.
 *
 * It exists so that the three things that have to travel together —
 * target, rel and the announcement — cannot be separated by someone
 * writing the next link, and scripts/check-links.mjs fails the build if an
 * external link ever appears without them.
 *
 * Internal links keep using next/link: they stay on the site, they should
 * not open a tab, and the router should handle them.
 */
export function ExternalLink({
  href,
  className = "",
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
