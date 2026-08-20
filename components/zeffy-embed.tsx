"use client"

import { useState } from "react"
import Script from "next/script"
import { useConsent, writeConsent } from "@/lib/consent"

/**
 * The Zeffy registration and donation form, embedded.
 *
 * Zeffy sets its own cookies, so like the analytics it waits for consent
 * and nothing of theirs is fetched before the answer is "granted".
 *
 * Until the answer is yes, the page carries an ordinary button to the same
 * form on Zeffy's own site, where the visitor deals with Zeffy directly and
 * our consent question does not apply. Blocking registration behind a
 * cookie banner would be a worse outcome than the banner exists to
 * prevent, and so would explaining the banner where the form should be.
 *
 * Zeffy's own snippet is a div their script fills in, plus a hidden iframe
 * revealed by an inline `onerror` handler if the script fails. The markup
 * here keeps their contract — the script still looks for
 * `[data-zeffy-embed]` and `data-form-url` — but the fallback is React
 * state, because an inline handler would need dangerouslySetInnerHTML and
 * would not survive a re-render. The iframe `src` is only set once the
 * fallback is showing, or Zeffy would load twice.
 */
const FORM_PATH = "/embed/ticketing/world-zombie-day-london--2026"
const FORM_URL = `https://www.zeffy.com${FORM_PATH}`

export function ZeffyEmbed() {
  const [failed, setFailed] = useState(false)
  const consent = useConsent()

  // This only shows to someone who answered "No thanks" in the cookie
  // dialog: Zeffy sets its own cookies, so their form cannot load after a
  // refusal. Two ways on rather than one, because a refusal should not
  // cost anyone their place on the walk: change your mind and the embed
  // appears in place, or go to Zeffy and deal with them directly.
  if (consent !== "granted") {
    return (
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => writeConsent("granted")}
          className="btn btn-primary"
        >
          Load the form here
        </button>
        <a
          href={FORM_URL}
          rel="noopener noreferrer"
          target="_blank"
          className="btn btn-secondary"
        >
          Register on Zeffy
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    )
  }

  // `zeffy-embed` (globals.css) pins whatever their script injects to the
  // width of this block and to its left edge. Left, not centred: the rest
  // of the page is left-aligned, and their widget otherwise sizes and
  // centres itself and runs off the right of the container.
  return (
    <div className="zeffy-embed w-full">
      <div data-zeffy-embed data-form-url={FORM_PATH} />

      {failed ? (
        <div className="relative h-[450px] w-full overflow-hidden">
          <iframe
            title="Donation form powered by Zeffy"
            src={FORM_URL}
            allow="payment"
            allowTransparency
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      ) : null}

      <Script
        src="https://www.zeffy.com/embed/v2/zeffy-embed.js"
        strategy="afterInteractive"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
