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
 * Someone who has declined is not left without a way to register: they get
 * a link straight to the same form on Zeffy's own site, where they are
 * dealing with Zeffy directly and our consent question does not apply.
 * Blocking registration behind a cookie banner would be a worse outcome
 * than the banner exists to prevent.
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

  if (consent !== "granted") {
    return (
      <div className="cut-panel p-6">
        <p className="prose-wzd font-body">
          The form is hosted by Zeffy, who set their own cookies, so it only
          loads if you agree to that. You can also open it on Zeffy's site
          instead, where you deal with them directly.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
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
            Open it on Zeffy
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div data-zeffy-embed data-form-url={FORM_PATH} />

      {failed ? (
        <div className="relative h-[450px] w-full overflow-hidden">
          <iframe
            title="Registration and donation form, powered by Zeffy"
            src={FORM_URL}
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
