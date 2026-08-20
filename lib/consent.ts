"use client"

import { useEffect, useState } from "react"

/**
 * Whether the visitor has agreed to things being stored on their device.
 *
 * One answer covers all three: PostHog, Google Analytics 4, and the Zeffy
 * registration form. Nothing that writes to the device loads until it is
 * "granted", which is what UK PECR requires — consent has to come before
 * the storage, not after it.
 *
 * The answer itself is kept in localStorage. That is allowed without
 * consent: remembering a choice the visitor actively made is strictly
 * necessary for a service they asked for, and it is the one thing the
 * banner cannot ask permission for without asking every time.
 *
 * Changes are broadcast on a window event as well as through the hook, so
 * a component mounted elsewhere in the tree reacts without a page reload.
 */
export type Consent = "granted" | "denied"

const KEY = "wzd-consent"
const EVENT = "wzd-consent-change"

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null
  try {
    const value = window.localStorage.getItem(KEY)
    return value === "granted" || value === "denied" ? value : null
  } catch {
    // Storage can throw in private modes. Treat it as "not answered".
    return null
  }
}

export function writeConsent(value: Consent) {
  try {
    window.localStorage.setItem(KEY, value)
  } catch {
    // If it cannot be stored the visitor will be asked again, which is the
    // safe way round.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }))
}

/**
 * `null` means the question has not been answered yet. `undefined` means
 * this has not mounted, so nothing should be decided on it: the server has
 * no way to know the answer, and rendering either state would be a
 * hydration mismatch.
 */
export function useConsent(): Consent | null | undefined {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined)

  useEffect(() => {
    setConsent(readConsent())
    const onChange = (event: Event) =>
      setConsent((event as CustomEvent<Consent>).detail)
    window.addEventListener(EVENT, onChange)
    return () => window.removeEventListener(EVENT, onChange)
  }, [])

  return consent
}
