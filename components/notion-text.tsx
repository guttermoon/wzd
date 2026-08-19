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
