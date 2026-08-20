"use client"

import { useConsent } from "@/lib/consent"

/**
 * The mailing-list signup, hosted by paa.ge.
 *
 * Third party, so it waits for the same answer the analytics and the
 * registration form wait for: nothing of theirs is fetched until consent
 * is "granted". Until then the band carries an ordinary button that opens
 * the same form on paa.ge's own site, where the visitor deals with paa.ge
 * directly. No panel of explanation: the cookie bar has already asked, and
 * a signup band should look like a signup band.
 *
 * The iframe carries a real `title`. The embed code as supplied has an
 * empty one, which is a frame with no accessible name: a screen reader
 * announces "frame" and nothing else, and axe fails it.
 *
 * Height is fixed rather than the `100%` the supplied code asks for. A
 * percentage height resolves against a parent that has no height of its
 * own, so it collapses to nothing; the frame scrolls internally if the
 * form is taller.
 *
 * It is lazy, because this band is on every page: a consenting visitor
 * should not fetch paa.ge on a page they never scroll to the foot of.
 */
const FORM_URL = "https://paa.ge/worldzombieday/email-signup"

export function EmailSignup() {
  const consent = useConsent()

  // Before consent, a button and nothing else. The earlier version put a
  // paragraph of cookie explanation where the form should be, which is not
  // how anyone else does this and reads as an apology on every page. The
  // button goes straight to the form on paa.ge, so someone who declined
  // cookies is not shut out and never has to read about why.
  if (consent !== "granted") {
    return (
      <a
        href={FORM_URL}
        rel="noopener noreferrer"
        target="_blank"
        className="btn btn-primary"
      >
        Join the newsletter
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }

  // What is inside the frame is paa.ge's document on paa.ge's origin, so
  // none of this site's CSS can reach it: the type, the fields and the
  // button are theirs. What can be matched is everything around it, and
  // whether the site's own ground shows through. `background: transparent`
  // lets it through if their document does not paint its own; if it does,
  // the frame keeps a hard border so it reads as a deliberate panel rather
  // than a white rectangle that has fallen onto the page.
  return (
    <div className="w-full max-w-xl border-2 border-rule bg-bg">
      <iframe
        title="Email signup form, hosted by paa.ge"
        src={`${FORM_URL}?embedded=true`}
        loading="lazy"
        className="block h-[520px] w-full border-0 bg-transparent"
        allow="autoplay; fullscreen; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}
