"use client"

import Link from "next/link"
import { useConsent, writeConsent } from "@/lib/consent"

/**
 * The cookie bar.
 *
 * A bar at the foot of the page rather than a modal over the content: it
 * does not block anything, it does not trap focus, and it can be ignored
 * while someone reads. Rejecting is the same size and weight as accepting,
 * because a reject button that is harder to find than the accept button is
 * not a free choice and the ICO says so.
 *
 * It only appears when the question has not been answered. Until then
 * nothing that writes to the device has loaded, so there is no race to
 * lose: components/analytics.tsx and components/zeffy-embed.tsx both wait
 * on the same answer.
 *
 * `role="region"` with a name rather than `role="dialog"`, since it is not
 * modal and nothing behind it is inert. Placed last in the layout, so it is
 * last in the tab order and never comes between a visitor and the page.
 *
 * It slides up from the foot of the screen once the title card has landed
 * (`.consent-bar` in globals.css), because everything on this site arrives
 * rather than appearing.
 */
export function ConsentBanner() {
  const consent = useConsent()

  // undefined: not mounted. null: not answered. Anything else: answered.
  if (consent !== null) return null

  return (
    <div
      role="region"
      aria-label="Cookies"
      className="consent-bar fixed inset-x-0 bottom-0 z-50 border-t-2 border-blood-text bg-blood text-blood-text"
    >
      <div className="mx-auto flex max-w-page flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p className="font-body text-sm">
          We would like to store a few things on your device: analytics, so we
          know which pages are read, and the registration form, which is run by
          Zeffy. Neither loads unless you say yes.{" "}
          <Link href="/privacy" className="underline decoration-2 underline-offset-4">
            What we collect
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => writeConsent("granted")}
            className="btn bg-blood-text text-blood"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => writeConsent("denied")}
            className="btn border-2 border-blood-text text-blood-text"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}
