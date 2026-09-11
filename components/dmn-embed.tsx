"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink } from "@/components/external-link"
import { EVENT } from "@/lib/event"

/**
 * The after-party ticket widget, from DesignMyNight.
 *
 * A second ticketing embed from a second company, because the after party
 * is the venue's event and BLOODSport sells its tickets on their platform.
 * The walk's own registration is Zeffy's and stays Zeffy's.
 *
 * Like the Zeffy form, it **loads on sight rather than behind the cookie
 * dialog**, on the same reasoning and the owner's same decision: a
 * ticketing form is the reason anyone opens this page, and the claim that
 * it is strictly necessary to the service the visitor came for is a strong
 * one for a booking form in a way it never is for analytics. It sets
 * whatever it sets as soon as the page opens, whatever the visitor
 * answered. **`/privacy` says so in as many words, and the two have to be
 * changed together.**
 *
 * ── The lesson from components/zeffy-embed.tsx, applied ───────────────
 *
 * Their snippet is a `<script>` carrying `data-dmn-ticket-widget`, which
 * means the tag is the anchor: the widget goes where the script is. That
 * is friendlier than Zeffy's find-a-div, but it fails the same way on a
 * client-side navigation — Next keeps a loaded script loaded, an identical
 * tag already in the document has run and will not run again, and the
 * second page gets nothing. So the script is injected by hand, into this
 * component's own container, on every mount.
 *
 * And the result is checked rather than assumed. `onerror` only fires when
 * the file does not arrive; a script that loads and paints nothing — a
 * blocker cutting its XHR, a bad deploy at their end — leaves a silent
 * hole where the tickets should be. A MutationObserver watches, and if
 * nothing has appeared by the deadline the page shows a plain link to the
 * booking page instead.
 *
 * **It has not been possible to test the widget itself from the
 * development environment**, whose egress policy refuses
 * designmynight.com. The structure above is what makes that survivable:
 * whatever their script does or does not do, there is always a way to buy
 * a ticket on the page, and the no-JavaScript path is a plain anchor
 * rather than a guessed iframe URL.
 */
const DEADLINE_MS = 2500

export function DmnEmbed({
  trouble,
  troubleCta,
  missing,
}: {
  /** Passed in from the page: this is a client component. */
  trouble?: string
  troubleCta?: string
  /** Shown in place of the widget when it never paints. */
  missing?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    if (fallback) return

    let settled = false
    const painted = () => (host.current?.childElementCount ?? 0) > 1

    const give = () => {
      if (settled) return
      settled = true
      setFallback(true)
    }

    const observer = new MutationObserver(() => {
      if (painted()) {
        settled = true
        observer.disconnect()
      }
    })
    if (host.current) observer.observe(host.current, { childList: true, subtree: true })

    const previous = document.querySelector<HTMLScriptElement>('script[data-dmn="1"]')
    previous?.remove()

    const { widgetItemId, widgetPrimary, widgetPrimaryLight } = EVENT.afterParty
    const script = document.createElement("script")
    script.src =
      "https://widgets.designmynight.com/tonic/ticket-widget-v2.min.js" +
      `?item-ids=${widgetItemId}&theme=custom` +
      `&primary=${widgetPrimary}&primaryLight=${widgetPrimaryLight}`
    script.async = true
    script.dataset.dmn = "1"
    script.setAttribute("data-dmn-ticket-widget", "true")
    script.onerror = give
    // Into our own container, not the body: the tag is the anchor, so this
    // is what puts their widget inside this block rather than at the foot
    // of the page.
    host.current?.appendChild(script)

    const timer = window.setTimeout(() => {
      if (!painted()) give()
      else settled = true
    }, DEADLINE_MS)

    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [fallback])

  return (
    <div className="zeffy-embed w-full">
      {/* React renders this with only the script in it and their widget
          fills it, which is two owners for one node — survivable only
          because the script is injected from an effect, after hydration.
          suppressHydrationWarning says the same to React: whatever ends up
          in here, do not compare it. */}
      <div ref={host} suppressHydrationWarning />

      {fallback ? (
        <p className="prose-wzd font-body">
          {missing}{" "}
          <ExternalLink className="link" href={EVENT.afterParty.ticketsUrl}>
            {troubleCta}
          </ExternalLink>
        </p>
      ) : null}

      {/* With no JavaScript nothing above can run. A plain anchor works
          anyway — and it is a link rather than a guessed iframe, because
          their widget has no documented no-script embed to fall back on. */}
      <noscript>
        <p className="prose-wzd font-body">
          {missing}{" "}
          {/* ExternalLink, not a bare anchor. It renders as plain markup —
              an anchor and a span — so it needs no JavaScript to be
              correct, and it carries the three things an outbound link
              owes a reader: the new tab, rel="noopener noreferrer", and
              the announcement that a tab is opening. A hand-written <a>
              here had none of them, and `npm run check:links` reads
              inside <noscript> and said so. */}
          <ExternalLink className="link" href={EVENT.afterParty.ticketsUrl}>
            {troubleCta}
          </ExternalLink>
        </p>
      </noscript>

      {/* A strict blocker can stop the widget without stopping the page,
          and this is out of the way when the tickets are there. */}
      {fallback ? null : (
        <p className="mt-4 font-body text-sm text-muted">
          {trouble}{" "}
          <ExternalLink className="link" href={EVENT.afterParty.ticketsUrl}>
            {troubleCta}
          </ExternalLink>
        </p>
      )}
    </div>
  )
}
