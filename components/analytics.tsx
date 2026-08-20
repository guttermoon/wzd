"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import posthog from "posthog-js"

/**
 * PostHog, and nothing else, storing nothing on the visitor's device.
 *
 * `persistence: "memory"` is the whole point of this file. UK PECR needs
 * consent before anything is written to or read from a device unless it is
 * strictly necessary for something the visitor asked for, and analytics is
 * not strictly necessary — the ICO is explicit about that. Anonymising the
 * IP and honouring Do Not Track do not change it, because PECR is about
 * the storage, not what happens to the data afterwards.
 *
 * So nothing is stored. No cookie, no localStorage entry, no device
 * identifier that outlives the tab. There is nothing to consent to, and
 * therefore no consent banner on the site.
 *
 * What that costs: a returning visitor is a new visitor every time, so
 * there are no unique-visitor or retention numbers. What it keeps: page
 * views, which pages get read, where people arrive from, rough location
 * and device.
 *
 * Google Analytics was removed rather than gated. It cannot do this — its
 * identifiers are the product — so keeping it would have meant a banner
 * for everyone.
 *
 * Switched on only by the presence of a key, so nothing loads locally or
 * on an unconfigured preview. The privacy page describes exactly this:
 * change one and change the other.
 */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com"

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!POSTHOG_KEY) return
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // sent below, so client navigation counts too
      // Nothing touches the device. Do not change this without adding a
      // consent gate first.
      persistence: "memory",
      disable_session_recording: true,
      respect_dnt: true,
      autocapture: false,
    })
  }, [])

  // App-router navigation doesn't reload the page, so each route change is
  // reported explicitly.
  useEffect(() => {
    if (!POSTHOG_KEY || !pathname) return
    posthog.capture("$pageview")
  }, [pathname])

  return null
}
