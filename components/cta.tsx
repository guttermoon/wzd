import type React from "react"
import Link from "next/link"
import { urlKey, type SiteCopy } from "@/lib/site-copy"
import { hrefKind } from "@/lib/href"
import { ExternalLink } from "@/components/external-link"

/**
 * A call to action whose words and destination both come from one Notion
 * row.
 *
 * Every button on the site that goes somewhere is one of these. The row
 * named by `k` carries the label in `Text` and the link in `URL`, so the
 * owner can repoint a button — at this year's ticketing form, a new
 * partner, a different page — without a deploy, the same way they already
 * reword one.
 *
 * `href` is the built-in destination and stays in the code. Notion
 * overrides it; it does not own it. With the `URL` cell empty, or with no
 * Notion credentials at all, the button still goes where it should, which
 * is the same contract content/site-copy.json has for the words.
 *
 * Where it ends up pointing decides how it is rendered, rather than
 * whoever wrote it deciding: a link that stays on the site goes through
 * next/link, and one that leaves opens in a new tab, announces that it
 * does, and carries rel="noopener noreferrer". That matters more here
 * than anywhere else on the site, because the destination can change
 * after the code is written — an owner who pastes an external address
 * into a button that used to point at /faq gets all three, automatically,
 * and scripts/check-links.mjs stays honest.
 *
 * mailto: and tel: hand off to another application rather than opening a
 * page, so they are plain anchors with no new tab and nothing announced.
 */
export function makeCta(copy: SiteCopy) {
  return function Cta({
    k,
    href,
    className = "",
    children,
  }: {
    /** The Notion row: its `URL` is the destination, its `Text` the label. */
    k: string
    /** Where it goes when Notion says nothing. */
    href: string
    className?: string
    /** The label, when it is not the row's own `Text`. */
    children?: React.ReactNode
  }) {
    // The built-in link stands unless the override is something that can
    // safely be an href. Notion's values are filtered on the way in
    // already; this is the same check at the point of use, because this
    // component is what actually writes the attribute and it should not
    // depend on having been handed something clean.
    const override = copy[urlKey(k)] ?? ""
    const target = hrefKind(override) ? override.trim() : href
    const label = children ?? copy[k] ?? ""

    // How it renders follows from where it actually points, decided by the
    // one classifier rather than by a second opinion kept here. A built-in
    // href is trusted, but it is read the same way: a link is external
    // because of its address, not because of who wrote it.
    switch (hrefKind(target)) {
      case "handoff":
        return (
          <a href={target} className={className}>
            {label}
          </a>
        )
      case "external":
        return (
          <ExternalLink href={target} className={className}>
            {label}
          </ExternalLink>
        )
      default:
        return (
          <Link href={target} className={className}>
            {label}
          </Link>
        )
    }
  }
}
