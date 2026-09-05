"use client"

import { useEffect, useState } from "react"

/**
 * Prints the page.
 *
 * A client component because printing is a browser action, and its words
 * are a prop because `getSiteCopy` is server-only — a string typed in here
 * would be the one string on the page the owner could not edit.
 *
 * It renders only after mount. `window.print` is a control that does
 * nothing without JavaScript, and a dead button is worse than no button:
 * someone whose script is blocked would press it and conclude the page is
 * broken. Anyone in that position still has their browser's own print
 * command, which this only ever stood in for.
 *
 * It hides itself from the printout, along with the rest of the page's
 * furniture — see the print rules in app/globals.css.
 */
export function PrintButton({ label }: { label: string }) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  if (!ready) return null
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-secondary">
      {label}
    </button>
  )
}
