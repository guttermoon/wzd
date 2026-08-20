"use client"

import { useState } from "react"
import Script from "next/script"
import { useConsent } from "@/lib/consent"

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

  // Before consent, a button straight to the form on Zeffy's site. It used
  // to be a panel explaining the cookie position, which nobody else does
  // and which put a paragraph about cookies in the place where the form
  // people came for should be. The cookie bar has already asked; this only
  // has to work.
  if (consent !== "granted") {
    return (
      <a
        href={FORM_URL}
        rel="noopener noreferrer"
        target="_blank"
        className="btn btn-primary"
      >
        Register on Zeffy
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
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
