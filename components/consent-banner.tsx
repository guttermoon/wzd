"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useConsent, writeConsent } from "@/lib/consent"

/**
 * The cookie dialog.
 *
 * A real modal, at the owner's instruction: it sits over the page, on a
 * scrim, and the question has to be answered before the site can be used.
 * What is left of the third party on this site — the registration and
 * donation form, and the analytics — sets its own cookies, so the page
 * cannot honestly load them without an answer. The newsletter is no longer
 * one of them: it is the site's own form now.
 *
 * Rejecting is still there, the same size and the same weight as
 * accepting. A dialog that only offers "yes" is not consent, and nothing
 * on the site is a dead end without it: every embed falls back to the
 * same form on the provider's own site, where the visitor deals with them
 * directly.
 *
 * `role="dialog"` with `aria-modal` and a name, focus moved into it on
 * open and held there while it is up, and the page behind it locked from
 * scrolling. Escape deliberately does nothing: the two buttons are the way
 * out, and both are one tab apart.
 *
 * It arrives the way everything else here does — a hard slide up with a
 * three-pixel overshoot, and the scrim cutting in behind it
 * (`.consent-dialog` / `.consent-scrim` in globals.css). Under
 * prefers-reduced-motion it is simply there.
 */
export function ConsentBanner() {
  const consent = useConsent()
  const open = consent === null
  const panel = useRef<HTMLDivElement>(null)
  const first = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    first.current?.focus()

    // Hold focus inside the dialog. Tab from the last control wraps to the
    // first, and anything focused outside is pulled back in.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !panel.current) return
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        "a[href], button",
      )
      if (focusable.length === 0) return
      const start = focusable[0]
      const end = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === start) {
        event.preventDefault()
        end.focus()
      } else if (!event.shiftKey && document.activeElement === end) {
        event.preventDefault()
        start.focus()
      }
    }

    function onFocusIn(event: FocusEvent) {
      if (panel.current && !panel.current.contains(event.target as Node)) {
        first.current?.focus()
      }
    }

    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("focusin", onFocusIn)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("focusin", onFocusIn)
    }
  }, [open])

  // undefined: not mounted. null: not answered. Anything else: answered.
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* The scrim is the modal part: it covers the page and swallows the
          clicks. No dismiss on click, because there is nothing to dismiss
          to. */}
      <div className="consent-scrim absolute inset-0 bg-black/70" aria-hidden="true" />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
          className="consent-dialog relative w-full max-w-lg border-4 border-blood-text bg-blood p-6 text-blood-text sm:p-8"
        >
          <h2 id="consent-title" className="display text-[clamp(1.5rem,4vw,2rem)]">
            Cookies
          </h2>
          <p className="mt-4 font-body">
            This site needs your consent for third-party cookies: the
            registration and donation form, and analytics. Neither loads until
            you say yes.{" "}
            <Link
              href="/privacy"
              className="underline decoration-2 underline-offset-4"
            >
              What we collect
            </Link>
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              ref={first}
              type="button"
              onClick={() => writeConsent("granted")}
              className="btn bg-blood-text text-blood"
            >
              Okay
            </button>
            <button
              type="button"
              onClick={() => writeConsent("denied")}
              className="btn border-2 border-blood-text text-blood-text"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
