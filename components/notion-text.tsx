import type React from "react"
import type { SiteCopy } from "@/lib/site-copy"

export type { SiteCopy }

/**
 * Builds a <T> component bound to the site's copy map. `<T k="faq.q1" />`
 * renders the text for that key — from Notion when a Published row exists,
 * otherwise the built-in copy in content/site-copy.json.
 *
 * Newlines become <br/>, so multi-line slots stay editable as plain text.
 * Passing children overrides both, for the rare slot that isn't keyed.
 */
export function makeT(copy: SiteCopy) {
  return function T({ k, children }: { k?: string; children?: React.ReactNode }) {
    const value = k ? copy[k] : undefined
    if (value == null || value === "") return <>{children}</>
    const lines = value.split("\n")
    return (
      <>
        {lines.flatMap((line, i) =>
          i === 0 ? [line] : [<br key={`br-${i}`} />, line],
        )}
      </>
    )
  }
}

/** Plain-string lookup, for alt text, titles and other attribute slots. */
export function makeS(copy: SiteCopy) {
  return (k: string, fallback = ""): string => copy[k] ?? fallback
}

/**
 * Whether a key has anything to say.
 *
 * Clearing a row in Notion is how the owner removes a line from the site,
 * so every slot that can be emptied has to be able to disappear with it —
 * markup included. A blank key left to render on its own gives an empty
 * bullet, a paragraph of nothing, or a heading with a gap under it, which
 * looks like a bug rather than a decision.
 *
 * Use it to drop the whole construct: `WORK.filter(has)` before a list,
 * and a guard around a section that has been emptied out entirely.
 */
export function makeHas(copy: SiteCopy) {
  return (k: string): boolean => (copy[k] ?? "").trim() !== ""
}

/** True if any of these keys has copy — for deciding whether a section survives. */
export function makeAny(copy: SiteCopy) {
  const has = makeHas(copy)
  return (...keys: string[]): boolean => keys.some(has)
}

/**
 * A paragraph that is not there at all when its key is empty, rather than
 * an empty `<p>` holding open a margin.
 */
export function makeP(copy: SiteCopy) {
  const T = makeT(copy)
  const has = makeHas(copy)
  return function P({ k, className = "" }: { k: string; className?: string }) {
    if (!has(k)) return null
    return (
      <p className={className}>
        <T k={k} />
      </p>
    )
  }
}
