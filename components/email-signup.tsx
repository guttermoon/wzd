"use client"

import { useState } from "react"

/**
 * The newsletter signup, in the site's own type and colours.
 *
 * It used to be paa.ge's page in an iframe. Nothing of ours could reach
 * inside it, so it could never be made to match, and it brought paa.ge's
 * own cookie notice onto our page. This posts to app/api/newsletter, which
 * hands the address on to paa.ge from the server, so nothing third party
 * runs in the visitor's browser and the form needs no consent at all.
 *
 * The states are: idle, sending, done, and two failures worth telling
 * apart. `bad-email` is the visitor's to fix and the message says so;
 * anything else is ours, and rather than leave someone stuck it offers the
 * form on paa.ge, where they can sign up directly.
 *
 * The status line is a live region so the outcome is announced rather than
 * only shown, and the input points at it so an error is read as part of
 * the field.
 */
const FORM_URL = "https://paa.ge/worldzombieday/email-signup"

type State = "idle" | "sending" | "done" | "bad-email" | "failed"

export function EmailSignup() {
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
        You are on the list. Watch your inbox.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
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
          {state === "sending" ? "Signing up" : "Sign up"}
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
        {state === "bad-email" ? "That does not look like an email address." : null}
        {state === "failed" ? (
          <>
            That did not go through.{" "}
            <a
              className="link"
              href={FORM_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Sign up on paa.ge instead
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </>
        ) : null}
      </p>
    </form>
  )
}
