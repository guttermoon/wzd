"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink } from "@/components/external-link"

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
 * ── Why this is not simply their snippet ──────────────────────────────
 *
 * Zeffy's embed is a div their script finds by `[data-zeffy-embed]` and
 * fills in. That works once, on a full page load, and it is the reason
 * the form kept coming up blank:
 *
 *  - Their script scans when it executes. Next keeps a loaded script
 *    loaded across client-side navigations, so walking from /register to
 *    /donate rendered a fresh, empty div that nothing ever scanned. The
 *    form appeared or did not depending on which page you happened to
 *    open first, which is exactly the "sometimes it is there" this fixes.
 *  - A scan that runs before React has put the div on the page finds
 *    nothing and does not look again.
 *  - `onError` only fires when the file fails to arrive. A script that
 *    loads and paints nothing — an ad blocker cutting its XHR, a bad
 *    deploy at their end — leaves a silent hole.
 *
 * So the script is injected by hand on every mount, which makes it scan
 * against the div that is on the page now; and the result is checked
 * rather than assumed. If nothing has been painted by the time the
 * deadline passes, the form is loaded directly in an iframe instead.
 * Their own snippet ships that same iframe as its no-script fallback, so
 * it is a supported way in, not a trick.
 *
 * The net effect: the form is always on the page, by one route or the
 * other. That is the point — everything else here is preference.
 */
const SCRIPT_SRC = "https://www.zeffy.com/embed/v2/zeffy-embed.js"

/**
 * How long their script gets before the iframe takes over. Long enough
 * not to trip over a slow connection, short enough that nobody sits and
 * looks at a gap wondering whether it is broken.
 */
const DEADLINE_MS = 2500

/**
 * Two forms, because Zeffy has two: the ticketing form takes a
 * registration for the walk, and the donation form takes money without
 * one. /register wants the first and /donate the second, and pointing
 * both at the ticketing form asked a donor to buy a ticket.
 *
 * `away` is where the "trouble with the form" link goes: the public page
 * for the same thing, on Zeffy's own site. `height` is what the iframe
 * gets when it is doing the work, chosen tall enough that the form is not
 * scrolling inside a box on a normal screen — their script sizes itself
 * and the iframe cannot.
 */
const FORMS = {
  ticketing: {
    path: "/embed/ticketing/world-zombie-day-london--2026",
    title: "Registration form powered by Zeffy",
    away: "https://www.zeffy.com/embed/ticketing/world-zombie-day-london--2026",
    height: 1100,
  },
  donation: {
    path: "/embed/donation-form/world-zombie-day-london",
    title: "Donation form powered by Zeffy",
    away: "https://www.zeffy.com/en-GB/peer-to-peer/world-zombie-day-london",
    height: 900,
  },
} as const

export function ZeffyEmbed({
  form = "ticketing",
}: {
  form?: keyof typeof FORMS
}) {
  const { path, title, away, height } = FORMS[form]
  const host = useRef<HTMLDivElement>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    // A mount that has already given up stays given up: re-running the
    // script under a live iframe would load the form twice.
    if (fallback) return

    let settled = false

    // Painted means their form is on the page — not merely that our div
    // has children. Their script is free to replace the div it was given
    // rather than fill it, which would leave this ref pointing at a
    // detached node and put two forms on the page. Anything of theirs
    // anywhere counts.
    const painted = () =>
      (host.current?.childElementCount ?? 0) > 0 ||
      document.querySelector('iframe[src*="zeffy.com"]') !== null

    const give = () => {
      if (settled) return
      settled = true
      setFallback(true)
    }
    const keep = () => {
      settled = true
    }

    // As soon as they paint anything, the deadline is off.
    const observer = new MutationObserver(() => {
      if (painted()) {
        keep()
        observer.disconnect()
      }
    })
    if (host.current) {
      observer.observe(host.current, { childList: true })
      // And on the document, for the replace-the-node case above.
      observer.observe(document.body, { childList: true, subtree: true })
    }

    // Re-injected rather than reused. An identical <script> already in the
    // document has run and will not run again, and it is that second run —
    // against the div on the page now — that this whole component is for.
    const previous = document.querySelector<HTMLScriptElement>(
      `script[data-zeffy="1"]`,
    )
    previous?.remove()

    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    script.dataset.zeffy = "1"
    script.onerror = give
    document.body.appendChild(script)

    const timer = window.setTimeout(() => {
      if (!painted()) give()
      else keep()
    }, DEADLINE_MS)

    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [path, fallback])

  // `zeffy-embed` (globals.css) pins whatever their script injects to the
  // width of this block and to its left edge. Left, not centred: the rest
  // of the page is left-aligned, and their widget otherwise sizes and
  // centres itself and runs off the right of the container.
  return (
    <div className="zeffy-embed w-full">
      {fallback ? (
        // Loaded straight from Zeffy, no script of theirs involved. The
        // height is fixed because nothing is here to measure the form, so
        // it is set generously and the iframe scrolls if it has to.
        <iframe
          title={title}
          src={`https://www.zeffy.com${path}`}
          allow="payment"
          loading="eager"
          className="w-full border-0"
          style={{ height: `${height}px` }}
        />
      ) : (
        // Keyed by form, so moving between /register and /donate builds a
        // new element rather than handing their script a div it has
        // already claimed.
        //
        // React renders this empty and their script fills it, which is two
        // owners for one node. That is survivable only because the script
        // is injected from an effect, after hydration has finished — the
        // previous version let next/script start it during hydration, and
        // when the paint landed mid-render React recovered by rebuilding
        // the root and took the whole embed with it. The form vanished,
        // the DOM looked healthy, and it happened often enough to be the
        // bug this fixes. `suppressHydrationWarning` says the same thing
        // to React: whatever ends up inside here, do not compare it.
        <div
          key={path}
          ref={host}
          suppressHydrationWarning
          data-zeffy-embed
          data-form-url={path}
        />
      )}

      {/* With no JavaScript, neither route above can run: the div stays
          empty because nothing fills it, and the fallback never gets to
          decide. The iframe is plain markup, so it works anyway. */}
      <noscript>
        <iframe
          title={title}
          src={`https://www.zeffy.com${path}`}
          allow="payment"
          className="w-full border-0"
          style={{ height: `${height}px` }}
        />
      </noscript>

      {/* Both routes can still be blocked outright — a strict blocker, a
          network that does not like iframes — and then there is a way
          through that is not an embed at all. It is not in anyone's way
          when the form is there. */}
      <p className="mt-4 font-body text-sm text-muted">
        Trouble with the form?{" "}
        <ExternalLink className="link" href={away}>
          Open it on Zeffy
        </ExternalLink>
      </p>
    </div>
  )
}
