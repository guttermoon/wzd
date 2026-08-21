"use client"

import { useState } from "react"
import { EVENT } from "@/lib/event"

/**
 * The newsletter signup, in the site's own type and colours.
 *
 * It used to be an iframe of the list provider's own page. Nothing of
 * ours could reach inside it, so it could never be made to match, and it
 * brought their cookie notice onto every page of ours. This posts to
 * app/api/newsletter, which hands the address to Brevo from the server,
 * so nothing third party runs in the visitor's browser and the form needs
 * no consent at all. Swapping the list from paa.ge to Brevo changed that
 * route and nothing here: the form looks and behaves exactly as it did.
 *
 * The states are: idle, sending, done, and two failures worth telling
 * apart. `bad-email` is the visitor's to fix and the message says so;
 * anything else is ours, and rather than leave someone stuck it offers a
 * way to be added by hand.
 *
 * The status line is a live region so the outcome is announced rather than
 * only shown, and the input points at it so an error is read as part of
 * the field.
 */
/** Where the failure message sends someone. A mail we will act on beats
 *  a form that has just refused them. */
const FALLBACK_URL = `mailto:${EVENT.email}?subject=${encodeURIComponent("Newsletter signup")}`

type State = "idle" | "sending" | "done" | "bad-email" | "failed"

/** Passed in from the footer, which is a server component with the copy. */
export type SignupCopy = {
  label: string
  placeholder: string
  submit: string
  sending: string
  done: string
  bademail: string
  failed: string
  failedCta: string
}

export function EmailSignup({ copy }: { copy: SignupCopy }) {
  const [state, setState] = useState<State>("idle")
  const [email, setEmail] = useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState("sending")
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        setState("done")
        setEmail("")
      } else {
        setState(response.status === 400 ? "bad-email" : "failed")
      }
    } catch {
      setState("failed")
    }
  }

  if (state === "done") {
    return (
      <p className="font-body text-lg" role="status">
        {copy.done}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          {copy.label}
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={copy.placeholder}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (state !== "idle") setState("idle")
          }}
          aria-describedby={state === "idle" ? undefined : "newsletter-status"}
          aria-invalid={state === "bad-email" ? true : undefined}
          className="min-h-[44px] w-full border-2 border-rule bg-bg px-4 py-3 font-body text-text placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="btn btn-primary shrink-0 disabled:opacity-70"
        >
          {state === "sending" ? copy.sending : copy.submit}
        </button>
      </div>

      {/* Always in the DOM, so the live region exists before it has
          anything to say: one inserted at the moment of the message is
          often not announced at all. */}
      <p
        id="newsletter-status"
        role="status"
        className="mt-3 min-h-[1.5rem] font-body text-sm"
      >
        {state === "bad-email" ? copy.bademail : null}
        {state === "failed" ? (
          <>
            {copy.failed}{" "}
            <a className="link" href={FALLBACK_URL}>
              {copy.failedCta}
            </a>
          </>
        ) : null}
      </p>
    </form>
  )
}
