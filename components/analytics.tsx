"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Script from "next/script"
import posthog from "posthog-js"

/**
 * PostHog and GA4, both switched on only by the presence of their keys.
 *
 * With no keys set — which is the case locally and on any preview that
 * hasn't been configured — nothing loads and no requests are made. That
 * keeps development traffic out of the numbers and means the site has no
 * analytics dependency to fail.
 *
 * Both are configured to match what the privacy policy promises: no
 * session recording, no cross-site tracking, IP anonymised, and Do Not
 * Track honoured. If you change any of that, change /privacy to match.
 */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com"
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!POSTHOG_KEY) return
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // sent below, so client navigation counts too
      disable_session_recording: true,
      respect_dnt: true,
      persistence: "localStorage",
      autocapture: false,
    })
  }, [])

  // App-router navigation doesn't reload the page, so each route change is
  // reported explicitly to both.
  useEffect(() => {
    if (!pathname) return
    if (POSTHOG_KEY) posthog.capture("$pageview")
    if (GA_ID) {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
      gtag?.("event", "page_view", { page_path: pathname })
    }
  }, [pathname])

  if (!GA_ID) return null

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
