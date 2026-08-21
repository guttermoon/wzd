"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useConsent, writeConsent } from "@/lib/consent"

/**
 * The cookie dialog.
 *
 * A real modal, at the owner's instruction: it sits over the page, on a
 * scrim, and the question has to be answered before the site can be used.
 *
 * It covers the analytics and nothing else now. The newsletter is the
 * site's own form, and the Zeffy ticketing form loads on sight because it
 * is what the register and donate pages are for; see
 * components/zeffy-embed.tsx and the wording on /privacy, which has to
 * match it.
 *
 * Rejecting is still there, the same size and the same weight as
 * accepting. A dialog that only offers "yes" is not consent, and declining
 * costs the visitor nothing: the analytics simply never load.
 *
 * `role="dialog"` with `aria-modal` and a name, focus moved into it on
 * open and held there while it is up, and the page behind it locked from
 * scrolling. Escape deliberately does nothing: the two buttons are the way
 * out, and both are one tab apart.
 *
 * It hangs from a string and swings in, which is why there are two
 * wrappers around the panel: transform is one property, so a drop and a
 * swing on the same element would not compose, and the pivot has to be the
 * top of the string rather than the middle of the panel. See
 * `.consent-drop` / `.consent-swing` / `.consent-string` in globals.css.
 * Under prefers-reduced-motion it is simply there, hanging still.
 */
/**
 * The words are passed in rather than read here: this is a client
 * component and getSiteCopy is server-only, so app/layout.tsx — which
 * already has the copy for the footer — hands over the five strings this
 * needs. They are editable in Notion like everything else.
 */
export type ConsentCopy = {
  title: string
  body: string
  link: string
  accept: string
  reject: string
}

export function ConsentBanner({ copy }: { copy: ConsentCopy }) {
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

      {/* Hung from the top rather than centred, because it is on a string.
          The string takes whatever height is going: a tenth of the
          viewport, floored so it is still a string on a short screen and
          capped so it is not a rope on a tall one. */}
      <div className="absolute inset-0 flex items-start justify-center overflow-y-auto p-4">
        <div className="consent-drop w-full max-w-lg">
          <div className="consent-swing">
            <div
              aria-hidden="true"
              className="consent-string mx-auto h-[max(2rem,min(10vh,5rem))] w-[3px]"
            />
            <div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="consent-title"
              className="relative w-full border-4 border-blood-text bg-blood p-6 text-blood-text sm:p-8"
            >
              <h2
                id="consent-title"
                className="display text-[clamp(1.5rem,4vw,2rem)]"
              >
                {copy.title}
              </h2>
              <p className="mt-4 font-body">
                {copy.body}{" "}
                <Link
                  href="/privacy"
                  className="underline decoration-2 underline-offset-4"
                >
                  {copy.link}
                </Link>
              </p>
              {/* Decline first, confirm on the right, which is where a
                  dialog's affirmative action belongs. Focus still opens on
                  Okay rather than on whatever happens to be first in the
                  markup, and the two are the same size either way. */}
              <div className="mt-7 flex flex-wrap gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => writeConsent("denied")}
                  className="btn border-2 border-blood-text text-blood-text"
                >
                  {copy.reject}
                </button>
                <button
                  ref={first}
                  type="button"
                  onClick={() => writeConsent("granted")}
                  className="btn bg-blood-text text-blood"
                >
                  {copy.accept}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
