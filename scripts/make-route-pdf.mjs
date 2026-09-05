/**
 * Renders /the-route to content/route.pdf.
 *
 *   ROUTE_PASSWORD=… npx next start &
 *   ROUTE_PASSWORD=… node scripts/make-route-pdf.mjs [baseUrl]
 *
 * Built here rather than in the lambda on request. Printing a page to PDF
 * needs a browser, and a browser is 100MB of binary that a serverless
 * function has no business carrying to answer one download. So the file is
 * generated against a local build, committed, and served — gated — by
 * app/the-route/download/route.ts.
 *
 * The cost of that trade is staleness: the PDF is a photograph of the page
 * on the day it was taken, and a copy edit in Notion changes the page and
 * not the photograph. Re-run this after any edit that matters. The route
 * that serves it says as much in its own comment, and docs/NOTION_SETUP.md
 * says it where the owner will read it.
 *
 * It prints the unlocked page, which is the whole point, so it needs the
 * password — the same one the running server was started with.
 */
import { mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { chromium } from "@playwright/test"

const base = process.argv[2] || process.env.BASE_URL || "http://localhost:3000"
const password = process.env.ROUTE_PASSWORD
const out = "content/route.pdf"

if (!password) {
  console.error("ROUTE_PASSWORD is not set — the page would print locked.")
  process.exit(1)
}

try {
  await fetch(base, { signal: AbortSignal.timeout(3000) })
} catch {
  console.error(`No server at ${base}. Run \`npx next start\` first.`)
  process.exit(1)
}

const unlock = await fetch(`${base}/api/route-access`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ password }),
})
if (!unlock.ok) {
  console.error(`The password was refused (${unlock.status}).`)
  process.exit(1)
}
const cookie = (unlock.headers.get("set-cookie") || "").split(";")[0]
const [name, value] = cookie.split("=")
if (name !== "wzd_route" || !value) {
  console.error("No session cookie came back from /api/route-access.")
  process.exit(1)
}

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
})
const context = await browser.newContext()
await context.addCookies([{ name, value, domain: "localhost", path: "/" }])
// Light, explicitly. The print sheet forces it anyway, but a PDF built
// from a dark page would depend on that working rather than prove it.
await context.addInitScript(() => {
  localStorage.setItem("theme", "light")
  localStorage.setItem("wzd-consent", "denied")
})

const page = await context.newPage()
await page.goto(`${base}/the-route`, { waitUntil: "networkidle" })

// Entrances are opt-in and fire on scroll, so a page that has not been
// scrolled has sections still waiting to arrive. Walk it first, or the
// PDF is a photograph of a half-played animation.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.7
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 220))
  }
  window.scrollTo(0, 0)
  await new Promise((r) => setTimeout(r, 400))
})

if (!(await page.locator("svg.wzdmap").count())) {
  console.error("The map is not on the page — it printed locked.")
  process.exit(1)
}

mkdirSync(dirname(out), { recursive: true })
await page.pdf({
  path: out,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
})
await browser.close()

console.log(`✓ wrote ${out}`)
