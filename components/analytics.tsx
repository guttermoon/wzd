"use client"

import { useEffect, useRef, useState } from "react"
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
 * The privacy page describes exactly this: change one and change the other.
 */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com"

/**
 * The walk's own GA4 property.
 *
 * A measurement ID is not a secret — it is in the page source of every
 * site that uses one — so it lives here rather than in an environment
 * variable somebody has to remember to set. What an environment variable
 * was really buying was the second rule below, and that is kept.
 */
const GA_ID_BUILT_IN = "G-X2YY32RNLP"

/**
 * Where the built-in ID is allowed to be used. Nowhere else counts.
 *
 * A preview deployment and a laptop are not the audience, and their
 * traffic in the same property is worse than no traffic: it is a real
 * number that is wrong, mixed in with real numbers that are right, and
 * nothing downstream can separate them again. So the ID applies on the
 * live domain and its subdomains, and a vercel.app preview or localhost
 * measures nothing at all — which is exactly what requiring a key used to
 * achieve, without anyone having to set one.
 *
 * `NEXT_PUBLIC_GA_ID` still wins where it is set, so a preview can be
 * pointed at a test property deliberately.
 */
const GA_HOSTS = ["worldzombieday.co.uk"]

/**
 * Decided in the browser, not at build time, because the answer depends on
 * the hostname the page is actually being served from — one build is
 * deployed to the live domain and to previews alike.
 *
 * Only ever called from an effect. `useConsent` returns undefined until it
 * has mounted, so nothing here renders on the server either way, and this
 * cannot put the two renders out of step.
 */
function resolveGaId(): string {
  const configured = process.env.NEXT_PUBLIC_GA_ID
  if (configured) return configured
  const host = window.location.hostname
  const live = GA_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
  return live ? GA_ID_BUILT_IN : ""
}

type Gtag = (...args: unknown[]) => void

export function Analytics() {
  const pathname = usePathname()
  const consent = useConsent()
  const allowed = consent === "granted"

  const [gaId, setGaId] = useState("")
  useEffect(() => setGaId(resolveGaId()), [])

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
  // reported explicitly. PostHog can be told about the first one here —
  // posthog.init above is synchronous and has already run this commit.
  useEffect(() => {
    if (!allowed || !POSTHOG_KEY || !pathname) return
    posthog.capture("$pageview")
  }, [allowed, pathname])

  /**
   * GA4 cannot be told about the first one here, and that is the whole
   * reason this is a second effect with a ref in it.
   *
   * This runs on the commit that first puts the <Script> tags on the page,
   * which is before either of them has executed: `window.gtag` is
   * undefined, the call goes nowhere, and the landing page — the single
   * most useful pageview there is — is silently never counted. It is not
   * an error and nothing in the DOM looks wrong.
   *
   * So the first one is left to the config snippet below, which sends it
   * itself the moment gtag.js is ready and cannot be early. This effect
   * records the path GA loaded on, skips it, and takes every navigation
   * after it.
   */
  const lastGaPath = useRef<string | null>(null)
  useEffect(() => {
    if (!allowed || !gaId || !pathname) return
    if (lastGaPath.current === null) {
      lastGaPath.current = pathname
      return
    }
    if (lastGaPath.current === pathname) return
    lastGaPath.current = pathname
    const gtag = (window as unknown as { gtag?: Gtag }).gtag
    gtag?.("event", "page_view", { page_path: pathname })
  }, [allowed, gaId, pathname])

  if (!allowed || !gaId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      {/* The two `allow_` flags are what make the privacy page's "we do not
          track you across other websites" true rather than hopeful. Both
          default to on in gtag: Google Signals joins this visit to a
          signed-in Google identity across sites and apps, and ad
          personalisation lets the measurement feed advertising. Neither is
          needed to count who read which page, and neither is something a
          cookie dialog offering "analytics" has asked for. */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());
gtag('config','${gaId}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  )
}
