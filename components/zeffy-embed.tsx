"use client"

import { useState } from "react"
import Script from "next/script"

/**
 * The Zeffy ticketing and donation form, embedded.
 *
 * It loads on sight, not behind the cookie dialog. That is the owner's
 * decision, taken after the gated version put a button where the form
 * should be: the form is the reason anyone is on these two pages, and the
 * argument that it is strictly necessary to the service the visitor came
 * for is a far stronger one for a ticketing form than it would ever be for
 * analytics. The analytics are still gated; this is not.
 *
 * What that means in practice: Zeffy sets its own cookies as soon as
 * /register or /donate is opened, whatever the visitor answered in the
 * dialog. /privacy says so in as many words, and the two have to be
 * changed together.
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
            title="Ticketing and donation form powered by Zeffy"
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

      {/* If their script loads but paints nothing — an ad blocker, a bad
          deploy at their end — there is still a way through, and it is not
          in anyone's way when the form is there. */}
      <p className="mt-4 font-body text-sm text-muted">
        Trouble with the form?{" "}
        <a className="link" href={FORM_URL} rel="noopener noreferrer" target="_blank">
          Open it on Zeffy
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </div>
  )
}
