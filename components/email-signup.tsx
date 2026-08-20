"use client"

import { useConsent, writeConsent } from "@/lib/consent"

/**
 * The mailing-list signup, hosted by paa.ge.
 *
 * Third party, so it waits for the same answer the analytics and the
 * registration form wait for: nothing of theirs is fetched until consent
 * is "granted". Someone who has declined gets a link to the same form on
 * paa.ge's own site, where they are dealing with paa.ge directly.
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

  if (consent !== "granted") {
    return (
      <div className="cut-panel mx-auto max-w-xl p-6 text-left">
        <p className="prose-wzd font-body">
          The signup form is hosted by paa.ge, who set their own cookies, so it
          only loads if you agree to that. You can also open it on their site
          instead.
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
            Open it on paa.ge
          </a>
        </div>
      </div>
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
    <div className="mx-auto w-full max-w-xl border-2 border-rule bg-bg">
      <iframe
        title="Email signup form, hosted by paa.ge"
        src={`${FORM_URL}?embedded=true`}
        loading="lazy"
        className="block h-[520px] w-full border-0 bg-transparent"
        allow="clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}
