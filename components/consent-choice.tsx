"use client"

import { useConsent, writeConsent } from "@/lib/consent"

/**
 * The current cookie choice, and a way to change it, for the privacy page.
 *
 * Consent that cannot be withdrawn as easily as it was given is not
 * consent, so this sits in the policy where someone will look for it,
 * rather than only in a bar that disappears once answered.
 *
 * Withdrawing stops anything further being loaded on the next page view.
 * It cannot reach back into a script that is already running in this tab,
 * which is why the wording says what it says.
 */
export function ConsentChoice() {
  const consent = useConsent()

  if (consent === undefined) {
    // Not mounted: the server cannot know the answer, and rendering either
    // state would be a hydration mismatch.
    return null
  }

  const state =
    consent === "granted"
      ? "You have accepted. Analytics and the registration form can store things on your device."
      : consent === "denied"
        ? "You have declined. Nothing is being stored on your device, and analytics are not running."
        : "You have not answered yet, so nothing is being stored on your device."

  return (
    <div className="cut-panel mt-4 p-6">
      <p className="prose-wzd font-body">{state}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {consent !== "granted" ? (
          <button
            type="button"
            onClick={() => writeConsent("granted")}
            className="btn btn-primary"
          >
            Accept
          </button>
        ) : null}
        {consent !== "denied" ? (
          <button
            type="button"
            onClick={() => writeConsent("denied")}
            className="btn btn-secondary"
          >
            Withdraw
          </button>
        ) : null}
      </div>
      {consent === "granted" ? (
        <p className="prose-wzd mt-4 font-body text-sm text-muted">
          Withdrawing stops anything further loading. Anything already running
          in this tab stops when you reload the page, and you can clear what is
          stored through your browser at any time.
        </p>
      ) : null}
    </div>
  )
}
