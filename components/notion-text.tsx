import type React from "react"
import type { HomeContent } from "@/lib/homepage-content"

export type { HomeContent }

/**
 * Builds a <T> component bound to the homepage content map. Each text slot
 * renders the Notion override for `home.<k>` when one exists, otherwise its
 * built-in fallback children. Newlines in the Notion text become <br/>s so
 * multi-line slots stay editable as plain text.
 */
export function makeT(content: HomeContent) {
  return function T({ k, children }: { k: string; children?: React.ReactNode }) {
    const v = content[`home.${k}`]
    if (v == null || v === "") return <>{children}</>
    const lines = v.split("\n")
    return (
      <>
        {lines.flatMap((line, i) =>
          i === 0 ? [line] : [<br key={`br-${i}`} />, line],
        )}
      </>
    )
  }
}
