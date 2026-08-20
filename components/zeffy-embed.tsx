"use client"

import { useState } from "react"
import Script from "next/script"

/**
 * The Zeffy ticketing form, embedded.
 *
 * Zeffy's own snippet is a div their script fills in, plus a hidden iframe
 * revealed by an inline `onerror` handler if the script fails to load. The
 * markup here is the same contract — their script still looks for
 * `[data-zeffy-embed]` and `data-form-url` — but the fallback is React
 * state rather than an inline handler, because an inline handler would
 * need `dangerouslySetInnerHTML` and would not survive a re-render.
 *
 * The iframe's `src` is only set once the fallback is showing. Left in the
 * markup it would load Zeffy twice, and on a page where the script did
 * work, invisibly.
 *
 * This is the one third-party thing on the site that touches the visitor's
 * device, and it is deliberately confined to the register page: the
 * analytics store nothing precisely so that the site needs no consent
 * banner (see components/analytics.tsx). See /privacy, which says so.
 */
const FORM_PATH = "/embed/ticketing/world-zombie-day-london--2026"

export function ZeffyEmbed() {
  const [failed, setFailed] = useState(false)

  return (
    <div>
      <div data-zeffy-embed data-form-url={FORM_PATH} />

      {failed ? (
        <div className="relative h-[450px] w-full overflow-hidden">
          <iframe
            title="Registration and donation form, powered by Zeffy"
            src={`https://www.zeffy.com${FORM_PATH}`}
            allow="payment"
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
