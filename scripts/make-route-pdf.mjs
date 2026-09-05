/**
 * Renders /the-route/sheet to content/route.pdf.
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
 * It prints /the-route/sheet, not /the-route. The page is a web page and
 * scrolls; set on A4 it ran to five sheets, and a running order somebody
 * has to hold on a street corner is one sheet or it is nothing. The sheet
 * is a second rendering of the same copy rows against a fixed 186x269mm
 * block. That it still fits is asserted below rather than assumed — a
 * Notion edit three words too long is exactly the kind of change that
 * quietly adds a second page.
 *
 * It prints the unlocked page, which is the whole point, so it needs the
 * password — the same one the running server was started with.
 */
import { mkdirSync, readFileSync } from "node:fs"
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
// Scoped by the URL the run is actually against, not a hard-coded
// localhost. `[baseUrl]` is a documented argument, so pointing it at
// 127.0.0.1 is supported usage — and a cookie pinned to localhost would
// not be sent, the page would render locked, and the failure would
// surface below as "the map is not on the page", which blames the map.
await context.addCookies([{ name, value, url: base }])
// Light, explicitly. The print sheet forces it anyway, but a PDF built
// from a dark page would depend on that working rather than prove it.
await context.addInitScript(() => {
  localStorage.setItem("theme", "light")
  localStorage.setItem("wzd-consent", "denied")
})

const page = await context.newPage()
await page.goto(`${base}/the-route/sheet`, { waitUntil: "networkidle" })

// The sheet carries no entrances, so there is nothing to wait out — but
// the display face is a webfont, and a PDF taken before it lands is set
// in the fallback and measures differently, which is how a sheet that
// fits becomes a sheet that does not.
await page.evaluate(() => document.fonts.ready)

if (!(await page.locator("svg.wzdmap").count())) {
  console.error(
    "The sheet rendered locked — /the-route/sheet 404s without a valid " +
      "cookie, so the map is not on it and there is nothing worth " +
      `printing. The session cookie did not survive the trip to ${base}; ` +
      "check that it is the same origin the server is serving.",
  )
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

// One page, and it is checked. The sheet is laid out to a fixed height,
// so overflow does not push anything visible off the edge — it silently
// starts a second sheet carrying two lines of small print. Failing here
// is the only place that is cheap to notice.
const pdf = readFileSync(out)
const pages = countPages(pdf)
if (pages !== 1) {
  console.error(
    `${out} came out ${pages} pages. The sheet is sized for exactly one; ` +
      "something on it has grown — most likely a copy row edited longer " +
      "in Notion. Shorten it, or take a line out of app/the-route/sheet.",
  )
  process.exit(1)
}

console.log(`✓ wrote ${out} (1 page, ${Math.round(pdf.length / 1024)}kB)`)

/**
 * How many pages the PDF has.
 *
 * Chromium writes an uncompressed page tree, so the count is readable
 * without a PDF library: `/Type /Page` marks each page object and
 * `/Type /Pages` the node above them, hence the negative lookahead on the
 * `s`. Counting `/Count` instead would read whichever node came first,
 * which is not necessarily the root.
 */
function countPages(buffer) {
  const text = buffer.toString("latin1")
  return (text.match(/\/Type\s*\/Page(?![s\w])/g) || []).length
}
