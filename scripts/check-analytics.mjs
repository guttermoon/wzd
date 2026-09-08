/**
 * The consent gate, tested over the network.
 *
 *   npx next start -p 3111 &
 *   node scripts/check-analytics.mjs
 *
 * This is the check that actually matters for the analytics, and it is the
 * one that cannot be done by reading the code: the claim is that **nothing
 * third-party is contacted before the visitor answers the dialog**, and the
 * only way to know that is to watch the requests. A refactor that moves a
 * script tag out from behind the consent check breaks UK PECR and makes
 * /privacy untrue, and nothing on the page looks any different.
 *
 * It also pins the two things that make the privacy page's "we do not track
 * you across other websites" true rather than hopeful — Google Signals and
 * ad personalisation, both of which gtag turns ON unless told otherwise —
 * and the pageview accounting, which is easy to get silently wrong in the
 * app router because a navigation does not reload the page.
 *
 * ── Nothing here reaches Google ──────────────────────────────────────
 *
 * Every request to googletagmanager.com and google-analytics.com is
 * intercepted and answered locally, so running this does not put test
 * traffic in the real property. Reading window.dataLayer is enough to see
 * what would have been sent.
 *
 * ── It needs the live hostname ───────────────────────────────────────
 *
 * The measurement ID applies on worldzombieday.co.uk and nowhere else, so
 * half of this cannot be tested on localhost. Point the name at your own
 * machine first:
 *
 *   echo "127.0.0.1 worldzombieday.co.uk" | sudo tee -a /etc/hosts
 */

import { chromium } from "@playwright/test"

const PORT = process.env.PORT || "3111"
const LOCAL = `http://localhost:${PORT}`
const LIVE = `http://${process.env.GA_HOST || "worldzombieday.co.uk"}:${PORT}`

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
})

/** Nothing in this test is allowed to reach Google. */
async function harness(consent) {
  const ctx = await browser.newContext()
  const google = []
  await ctx.route("**://*.googletagmanager.com/**", (r) => {
    google.push(r.request().url())
    return r.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  })
  await ctx.route("**://*.google-analytics.com/**", (r) => {
    google.push(r.request().url())
    return r.fulfill({ status: 204, body: "" })
  })
  await ctx.addInitScript((c) => {
    if (c) localStorage.setItem("wzd-consent", c)
    localStorage.setItem("theme", "dark")
  }, consent)
  const page = await ctx.newPage()
  return { ctx, page, google }
}

const dataLayer = (page) =>
  page.evaluate(() =>
    (window.dataLayer || []).map((a) => Array.from(a)).filter((a) => a[0] !== "js"),
  )

for (const [name, url] of [["the server", LOCAL], ["the live hostname", LIVE]]) {
  try {
    await fetch(url, { signal: AbortSignal.timeout(4000) })
  } catch {
    console.error(`No ${name} at ${url}.`)
    console.error(
      url === LOCAL
        ? "Run `npx next start -p 3111` first."
        : 'Add it to your hosts file:\n  echo "127.0.0.1 worldzombieday.co.uk" | sudo tee -a /etc/hosts',
    )
    await browser.close()
    process.exit(1)
  }
}

let failures = 0
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "  ✓" : "  ✗"} ${label}${detail ? `  — ${detail}` : ""}`)
  if (!ok) failures++
}

// ── 1. No consent: nothing is fetched at all ────────────────────────────
{
  const { ctx, page, google } = await harness(null)
  await page.goto(LIVE + "/", { waitUntil: "networkidle" })
  await page.waitForTimeout(1200)
  console.log("\n── no answer yet ──")
  check("no Google request", google.length === 0, google.join(" "))
  check("no gtag script on the page", (await page.locator('script[src*="googletagmanager"]').count()) === 0)
  await ctx.close()
}

// ── 2. Declined: still nothing ─────────────────────────────────────────
{
  const { ctx, page, google } = await harness("denied")
  await page.goto(LIVE + "/", { waitUntil: "networkidle" })
  await page.waitForTimeout(1200)
  console.log("\n── declined ──")
  check("no Google request", google.length === 0, google.join(" "))
  await ctx.close()
}

// ── 3. Accepted on localhost: the built-in ID must not apply ───────────
{
  const { ctx, page, google } = await harness("granted")
  await page.goto(LOCAL + "/", { waitUntil: "networkidle" })
  await page.waitForTimeout(1500)
  console.log("\n── accepted, on localhost ──")
  check("no Google request", google.length === 0, google.join(" "))
  check("no gtag script", (await page.locator('script[src*="googletagmanager"]').count()) === 0)
  await ctx.close()
}

// ── 4. Accepted on the live hostname: GA loads, once, configured ───────
{
  const { ctx, page, google } = await harness("granted")
  await page.goto(LIVE + "/", { waitUntil: "networkidle" })
  await page.waitForTimeout(1500)
  console.log("\n── accepted, on worldzombieday.co.uk ──")
  check("gtag.js requested once", google.length === 1, google.join(" "))
  check("with the right measurement ID", google[0]?.includes("id=G-X2YY32RNLP"), google[0] || "")

  const dl = await dataLayer(page)
  const config = dl.find((a) => a[0] === "config")
  check("config sent", !!config, JSON.stringify(config))
  check("anonymize_ip on", config?.[2]?.anonymize_ip === true)
  check("google signals off", config?.[2]?.allow_google_signals === false)
  check("ad personalisation off", config?.[2]?.allow_ad_personalization_signals === false)
  check(
    "no duplicate page_view for the landing page",
    dl.filter((a) => a[0] === "event" && a[1] === "page_view").length === 0,
    JSON.stringify(dl),
  )

  // A client-side navigation has to be reported, because the page does not reload.
  await page.getByRole("link", { name: /^FAQ$/i }).first().click()
  await page.waitForURL("**/faq")
  await page.waitForTimeout(900)
  const after = await dataLayer(page)
  const views = after.filter((a) => a[0] === "event" && a[1] === "page_view")
  check("one page_view after navigating", views.length === 1, JSON.stringify(views))
  check("and it names the new path", views[0]?.[2]?.page_path === "/faq", JSON.stringify(views[0]))
  await ctx.close()
}

await browser.close()
console.log(failures ? `\n✗ ${failures} failed` : "\n✓ all analytics checks passed")
process.exit(failures ? 1 : 0)
