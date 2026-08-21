"use client"

import { useState } from "react"

/**
 * The photograph submission form.
 *
 * The site's own form posting to our own origin, the same way the
 * newsletter works: nothing third party runs in the page, so it needs no
 * consent and there is nothing to gate.
 *
 * The part worth reading is the failure path. Someone filling this in has
 * just typed out where their folder lives and how to get into it, and if
 * the send fails that is the worst possible moment to lose it. So when
 * the post does not go through — the sender is unconfigured, the network
 * is down, anything — the form does not clear and does not just apologise:
 * it hands over a mail link with everything they typed already in it, so
 * the same submission can leave from their own client instead. Nothing
 * they wrote is thrown away, in any branch.
 */
export type SubmitCopy = {
  creditLabel: string
  creditHelp: string
  linksLabel: string
  linksHelp: string
  notesLabel: string
  notesHelp: string
  accessLabel: string
  required: string
  send: string
  sending: string
  done: string
  missing: string
  failed: string
  failedCta: string
}

type State = "idle" | "sending" | "done" | "missing" | "failed"

export function PhotoSubmission({
  copy,
  to,
}: {
  copy: SubmitCopy
  /** Where a fallback mail is addressed. */
  to: string
}) {
  const [state, setState] = useState<State>("idle")
  const [credit, setCredit] = useState("")
  const [links, setLinks] = useState("")
  const [notes, setNotes] = useState("")
  const [access, setAccess] = useState(false)

  /** Everything typed so far, as a mail their own client can send. */
  const mailto = () => {
    const body = [
      `Credit: ${credit}`,
      "",
      "Links:",
      links,
      ...(notes ? ["", "Notes:", notes] : []),
      "",
      `Access confirmed: ${access ? "yes" : "no"}`,
    ].join("\n")
    return `mailto:${to}?subject=${encodeURIComponent(
      `Photo submission from ${credit || "a photographer"}`,
    )}&body=${encodeURIComponent(body)}`
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!credit.trim() || !links.trim()) {
      setState("missing")
      return
    }
    setState("sending")
    try {
      const response = await fetch("/api/photo-submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ credit, links, notes, access }),
      })
      setState(response.ok ? "done" : "failed")
    } catch {
      setState("failed")
    }
  }

  if (state === "done") {
    return (
      <p className="prose-wzd font-body text-lg" role="status">
        {copy.done}
      </p>
    )
  }

  const field = "min-h-[44px] w-full border-2 border-rule bg-bg px-4 py-3 font-body text-text placeholder:text-muted"

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-[42rem]">
      <div>
        <label htmlFor="submit-credit" className="display block text-base">
          {copy.creditLabel}{" "}
          <span className="font-body text-sm normal-case text-accent-text">
            {copy.required}
          </span>
        </label>
        <p id="submit-credit-help" className="mt-2 font-body text-sm text-muted">
          {copy.creditHelp}
        </p>
        <input
          id="submit-credit"
          name="credit"
          type="text"
          required
          maxLength={300}
          value={credit}
          aria-describedby="submit-credit-help"
          onChange={(e) => {
            setCredit(e.target.value)
            if (state !== "idle") setState("idle")
          }}
          className={`mt-3 ${field}`}
        />
      </div>

      <div className="mt-8">
        <label htmlFor="submit-links" className="display block text-base">
          {copy.linksLabel}{" "}
          <span className="font-body text-sm normal-case text-accent-text">
            {copy.required}
          </span>
        </label>
        <p id="submit-links-help" className="mt-2 font-body text-sm text-muted">
          {copy.linksHelp}
        </p>
        <textarea
          id="submit-links"
          name="links"
          required
          rows={4}
          maxLength={4000}
          value={links}
          aria-describedby="submit-links-help"
          onChange={(e) => {
            setLinks(e.target.value)
            if (state !== "idle") setState("idle")
          }}
          className={`mt-3 ${field}`}
        />
      </div>

      <div className="mt-8">
        <label htmlFor="submit-notes" className="display block text-base">
          {copy.notesLabel}
        </label>
        <p id="submit-notes-help" className="mt-2 font-body text-sm text-muted">
          {copy.notesHelp}
        </p>
        <textarea
          id="submit-notes"
          name="notes"
          rows={3}
          maxLength={4000}
          value={notes}
          aria-describedby="submit-notes-help"
          onChange={(e) => {
            setNotes(e.target.value)
            if (state !== "idle") setState("idle")
          }}
          className={`mt-3 ${field}`}
        />
      </div>

      {/* Not required, deliberately. The help above tells people a public
          link is fine, and for one of those there is no access to grant
          and no password to set: a required box would turn a perfectly
          good submission away. Ticked or not, the answer is in the email,
          so whoever opens it knows whether to expect a locked folder. */}
      <div className="mt-8 flex items-start gap-3">
        <input
          id="submit-access"
          name="access"
          type="checkbox"
          checked={access}
          onChange={(e) => {
            setAccess(e.target.checked)
            if (state !== "idle") setState("idle")
          }}
          className="mt-1 h-5 w-5 shrink-0 accent-accent-strong"
        />
        <label htmlFor="submit-access" className="font-body">
          {copy.accessLabel}
        </label>
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-primary mt-8 disabled:opacity-70"
      >
        {state === "sending" ? copy.sending : copy.send}
      </button>

      {/* In the DOM from the start, so it is a live region before it has
          anything to say: one inserted at the moment of the message is
          often not announced at all. */}
      <p
        id="submit-status"
        role="status"
        className="mt-4 min-h-[1.5rem] font-body text-sm"
      >
        {state === "missing" ? copy.missing : null}
        {state === "failed" ? (
          <>
            {copy.failed}{" "}
            {/* mailto: hands off to another application rather than
                opening a page, so no new tab and nothing to announce. */}
            <a className="link" href={mailto()}>
              {copy.failedCta}
            </a>
          </>
        ) : null}
      </p>
    </form>
  )
}
