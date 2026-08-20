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
/**
 * Two forms, because Zeffy has two: the ticketing form takes a
 * registration for the walk, and the donation form takes money without
 * one. /register wants the first and /donate the second, and pointing
 * both at the ticketing form asked a donor to buy a ticket.
 *
 * `away` is where the "trouble with the form" link goes: the public page
 * for the same thing, on Zeffy's own site.
 */
const FORMS = {
  ticketing: {
    path: "/embed/ticketing/world-zombie-day-london--2026",
    title: "Registration form powered by Zeffy",
    away: "https://www.zeffy.com/embed/ticketing/world-zombie-day-london--2026",
  },
  donation: {
    path: "/embed/donation-form/world-zombie-day-london",
    title: "Donation form powered by Zeffy",
    away: "https://www.zeffy.com/en-GB/peer-to-peer/world-zombie-day-london",
  },
} as const

export function ZeffyEmbed({
  form = "ticketing",
}: {
  form?: keyof typeof FORMS
}) {
  const [failed, setFailed] = useState(false)
  const { path: FORM_PATH, title, away: FORM_URL } = FORMS[form]

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
            title={title}
            src={`https://www.zeffy.com${FORM_PATH}`}
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

/**
 * The fundraising thermometer, also Zeffy's.
 *
 * Their snippet, kept to their contract: a fixed 120px frame pointed at
 * the thermometer embed. It is a picture of a number rather than a
 * control, so it is not gated and it is not focusable in any way that
 * matters; the total it shows is also stated in the copy around it when
 * there is anything to state.
 *
 * A real `title`, because the supplied code has none and a frame with no
 * accessible name is announced as "frame" and nothing else. Theirs also
 * says "Donation form", which this is not.
 */
const THERMOMETER_URL =
  "https://www.zeffy.com/embed/thermometer/world-zombie-day-london"

export function ZeffyThermometer({ className = "" }: { className?: string }) {
  return (
    <div className={`zeffy-embed relative h-[120px] w-full overflow-hidden ${className}`}>
      <iframe
        title="How much has been raised so far, from Zeffy"
        src={THERMOMETER_URL}
        allowTransparency
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  )
}
