/**
 * What a link is, and whether it is fit to be one at all.
 *
 * A call to action's destination can come from a `URL` cell in Notion,
 * typed by hand long after the code was written, and it lands directly in
 * an `href`. So two questions have to be answered about every value, and
 * they are answered here rather than in each place that asks:
 *
 *  - **Is it safe?** `javascript:` and `data:` are the reason this exists.
 *  - **Where does it go?** Off the site or across it — which decides how
 *    it renders, per components/cta.tsx.
 *
 * Both used to be spelled out as separate regexes in lib/site-copy.ts and
 * components/cta.tsx, which meant two lists of schemes that had to agree
 * and no single place to correct when they did not. They are one list now.
 */

/** How a safe destination should be rendered. */
export type HrefKind = "external" | "internal" | "handoff"

/**
 * An outside address. `//` is required rather than optional: a bare
 * `https:foo` is not an address anyone means to type, and accepting it
 * would let something through that is neither external nor a path.
 */
const EXTERNAL = /^https?:\/\//i

/** Hands off to another application rather than opening a page. */
const HANDOFF = /^(mailto:|tel:)/i

/**
 * A path on this site.
 *
 * The second character matters as much as the first. `//evil.example` is a
 * protocol-relative URL — the browser reads it as `https://evil.example`
 * and leaves the site — but it begins with a slash, so a check that only
 * looks at the first character calls it internal. It would then be handed
 * to next/link, opening in the same tab with no `rel="noopener"` and none
 * of the announcement an outbound link owes a screen reader, and
 * `npm run check:links` would agree it was internal and pass.
 *
 * A backslash is the same trap: browsers normalise `/\evil.example` to
 * `//evil.example`. Both are rejected, and the button's built-in link
 * stands — which is the whole point of the built-in link.
 */
const INTERNAL = /^\/(?![/\\])/

/**
 * What kind of link this is, or `null` if it is not one we will write.
 * Anything that is not one of the three forms — `javascript:` above all,
 * but equally a half-finished address or a bare word — is nothing.
 */
export function hrefKind(value: string): HrefKind | null {
  const href = value.trim()
  if (EXTERNAL.test(href)) return "external"
  if (HANDOFF.test(href)) return "handoff"
  if (INTERNAL.test(href)) return "internal"
  return null
}

/**
 * Whether a value is fit to become an `href`.
 *
 * Checked in two places on purpose: in lib/site-copy.ts, where a link
 * enters from Notion, and again in components/cta.tsx, which is the last
 * thing between a value and the DOM. One gate is a gate someone can walk
 * around.
 */
export const isSafeHref = (value: string): boolean => hrefKind(value) !== null
