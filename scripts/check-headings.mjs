/**
 * The heading outline of every route, checked against the rules that make
 * one useful to a screen reader and to a search engine.
 *
 *   npx next start &  node scripts/check-headings.mjs
 *
 * `check:a11y` already runs axe with the best-practice tags, which catches
 * a skipped level and a page with no h1 at all. Two things it does not
 * catch matter here:
 *
 *  - **More than one h1.** Axe is content with one *or more*. A second h1
 *    is the easy mistake — a section heading typed as h1 because it should
 *    look big — and it flattens the outline for anyone navigating by
 *    heading.
 *  - **What the outline actually says.** A page can pass every rule and
 *    still be a list of headings nobody would choose. Printing it is the
 *    point; the assertions are the floor, not the goal.
 *
 * Only <main> is read. The masthead and footer repeat on every page, and
 * their headings are not this page's outline.
 */
const base = process.env.BASE_URL ?? "http://localhost:3000"

const ROUTES = [
  "/", "/register", "/survival", "/faq", "/donate",
  "/become-a-sponsor", "/press", "/photo-policy", "/submit-photos", "/privacy", "/confirmed",
  // Gated: the checkers see the password form, which is a page like any
  // other and has to pass like any other.
  "/the-route",
]

/** Headings carry markup — <br>, the per-word spans the Swipe animation adds. */
const text = (html) =>
  html
    .replace(/<!--.*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()

let failures = 0

for (const route of ROUTES) {
  let html
  try {
    const response = await fetch(base + route)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    html = await response.text()
  } catch (error) {
    console.error(`FAIL  ${route}: could not be fetched — ${error.message}`)
    console.error(`      Is the server running? \`npx next start\` first.`)
    failures++
    continue
  }

  const start = html.indexOf("<main")
  const end = html.indexOf("</main>")
  if (start < 0 || end < 0) {
    console.error(`FAIL  ${route}: no <main> landmark`)
    failures++
    continue
  }

  const headings = [...html.slice(start, end).matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/g)]
    .map((m) => ({ level: Number(m[1][1]), text: text(m[2]) }))

  console.log(`\n${route}`)
  if (headings.length === 0) {
    console.error(`  FAIL: no headings at all`)
    failures++
    continue
  }

  for (const h of headings) {
    console.log(`  ${"  ".repeat(h.level - 1)}h${h.level}  ${h.text || "‹EMPTY›"}`)
  }

  const h1s = headings.filter((h) => h.level === 1)
  if (h1s.length !== 1) {
    console.error(`  FAIL: ${h1s.length} h1 elements — a page has exactly one`)
    failures++
  }
  if (headings[0].level !== 1) {
    console.error(`  FAIL: outline opens at h${headings[0].level}, not h1`)
    failures++
  }

  let previous = 0
  for (const h of headings) {
    if (!h.text) {
      console.error(`  FAIL: empty h${h.level}`)
      failures++
    }
    // Going deeper may only ever go one level at a time. Coming back up
    // any distance is fine: h3 → h2 closes a subsection.
    if (previous !== 0 && h.level > previous + 1) {
      console.error(`  FAIL: h${previous} → h${h.level} skips a level ("${h.text}")`)
      failures++
    }
    previous = h.level
  }
}

console.log(
  failures
    ? `\n✗ ${failures} heading problem${failures === 1 ? "" : "s"}`
    : `\n✓ every route: one h1, no skipped levels, no empty headings`,
)
process.exit(failures ? 1 : 0)
