"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Script from "next/script"
import posthog from "posthog-js"
import { useConsent } from "@/lib/consent"

/**
 * PostHog and GA4, neither of which loads until the visitor has accepted.
 *
 * UK PECR requires consent before anything is stored on or read from a
 * device, and analytics is not strictly necessary. Consent has to come
 * first, so the scripts are not merely configured to behave once they are
 * running: they are never fetched at all until the answer is "granted".
 * Anonymising the IP and honouring Do Not Track are on top of that, not
 * instead of it.
 *
 * A key still has to be set for either to load, so nothing is collected
 * locally or on an unconfigured preview.
 *
 * The privacy page describes exactly this: change one and change the other.
 */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com"
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function Analytics() {
  const pathname = usePathname()
  const consent = useConsent()
  const allowed = consent === "granted"

  useEffect(() => {
    if (!allowed || !POSTHOG_KEY) return
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // sent below, so client navigation counts too
      persistence: "localStorage",
      disable_session_recording: true,
      respect_dnt: true,
      autocapture: false,
    })
  }, [allowed])

  // App-router navigation doesn't reload the page, so each route change is
  // reported explicitly to both.
  useEffect(() => {
    if (!allowed || !pathname) return
    if (POSTHOG_KEY) posthog.capture("$pageview")
    if (GA_ID) {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
      gtag?.("event", "page_view", { page_path: pathname })
    }
  }, [allowed, pathname])

  if (!allowed || !GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());
gtag('config','${GA_ID}',{anonymize_ip:true,send_page_view:false});`}
      </Script>
    </>
  )
}
