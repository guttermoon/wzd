"use client"

import { useState } from "react"

/**
 * The password form on /the-route.
 *
 * Its words are props, not strings typed in here: this is a client
 * component, `getSiteCopy` is server-only, and a string written into a
 * client component is a string the owner cannot edit. Same arrangement as
 * the consent dialog and the newsletter form.
 *
 * The form posts rather than navigating, so a wrong answer costs a
 * message rather than a page load, and the password never appears in a
 * URL — a query string ends up in browser history, in the referrer, and
 * in the access logs of everything it passes through.
 */
export function RouteUnlock({
  label,
  button,
  working,
  wrong,
  problem,
  unconfigured,
}: {
  label: string
  button: string
  working: string
  wrong: string
  problem: string
  unconfigured: string
}) {
  const [value, setValue] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "wrong" | "error" | "unset">("idle")

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setState("sending")
    try {
      const response = await fetch("/api/route-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: value }),
      })
      if (response.ok) {
        // A full reload, not a client-side navigation: the answer is a
        // cookie, and the page that reads it is rendered on the server.
        window.location.reload()
        return
      }
      setState(response.status === 503 ? "unset" : response.status === 401 ? "wrong" : "error")
    } catch {
      setState("error")
    }
  }

  const message =
    state === "wrong" ? wrong : state === "unset" ? unconfigured : state === "error" ? problem : ""

  return (
    <form onSubmit={submit} className="mt-6 max-w-sm">
      <label htmlFor="route-password" className="display block text-sm">
        {label}
      </label>
      <input
        id="route-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          if (state !== "idle") setState("idle")
        }}
        aria-describedby="route-password-status"
        className="mt-2 w-full border-2 border-text bg-bg px-3 py-2 font-body text-text"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-primary mt-4 disabled:opacity-60"
      >
        {state === "sending" ? working : button}
      </button>
      {/* Live, and present from the first render: an element that only
          appears when there is something to say is often announced late or
          not at all, because the region was not there to be watched. */}
      <p
        id="route-password-status"
        role="status"
        aria-live="polite"
        className="prose-wzd mt-4 font-body text-accent-text"
      >
        {message}
      </p>
    </form>
  )
}
