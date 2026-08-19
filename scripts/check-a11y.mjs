/**
 * Runs axe-core over every route in both themes, then does the keyboard
 * checks axe can't: skip link, focus visibility, the FAQ disclosure, and
 * the theme toggle.
 *
 *   npx next start & node scripts/check-a11y.mjs [baseUrl]
 *
 * Needs @playwright/test and axe-core (dev-only; not runtime dependencies).
 */
import { readFileSync } from "node:fs"
import { chromium } from "@playwright/test"

const base = process.argv[2] || "http://localhost:3000"
const axe = readFileSync("node_modules/axe-core/axe.min.js", "utf8")
const ROUTES = ["/", "/register", "/rules", "/faq", "/sponsors", "/press", "/photo-policy", "/privacy"]
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
})
let failures = 0

for (const theme of ["dark", "light"]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme)
  const page = await ctx.newPage()
  console.log(`\n── ${theme} ──────────────────────────────`)

  for (const route of ROUTES) {
    await page.goto(base + route, { waitUntil: "networkidle" })
    const applied = await page.evaluate(() => document.documentElement.className)
    if (!applied.includes(theme)) {
      console.error(`FAIL  ${route}: theme "${theme}" never applied (class="${applied}")`)
      failures++
    }
    await page.addScriptTag({ content: axe })
    const { violations } = await page.evaluate(
      async (tags) => await window.axe.run(document, { runOnly: { type: "tag", values: tags } }),
      TAGS,
    )
    failures += violations.length
    console.log(`  ${route.padEnd(15)} ${violations.length} violations`)
    for (const v of violations) {
      console.error(`    ${v.impact}: ${v.id} — ${v.help}`)
      for (const node of v.nodes.slice(0, 3)) console.error(`      ${node.html.slice(0, 140)}`)
    }
  }
  await ctx.close()
}

// ── Keyboard behaviour ───────────────────────────────────────────────
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await ctx.newPage()
console.log(`\n── keyboard ────────────────────────────`)

await page.goto(base + "/", { waitUntil: "networkidle" })
await page.keyboard.press("Tab")
const first = await page.evaluate(() => document.activeElement?.textContent?.trim())
if (first !== "Skip to content") {
  console.error(`FAIL  first Tab stop is "${first}", expected the skip link`)
  failures++
} else console.log("  ✓ skip link is the first tab stop")

const outlined = await page.evaluate(() => {
  const s = getComputedStyle(document.activeElement)
  return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0
})
if (!outlined) {
  console.error("FAIL  focused element has no visible outline")
  failures++
} else console.log("  ✓ focus is visible")

await page.goto(base + "/faq", { waitUntil: "networkidle" })
// Scope to <main>: the header also has a <details> for the mobile menu.
const faqItem = page.locator("main details").first()
await faqItem.locator("summary").focus()
await page.keyboard.press("Enter")
if (!(await faqItem.evaluate((d) => d.open))) {
  console.error("FAIL  FAQ disclosure does not open with Enter")
  failures++
} else console.log("  ✓ FAQ opens from the keyboard")

await page.goto(base + "/", { waitUntil: "networkidle" })
const toggle = page.getByRole("button", { name: /switch to (light|dark) theme/i })
const before = await page.evaluate(() => document.documentElement.className)
await toggle.click()
await page.waitForFunction((b) => document.documentElement.className !== b, before)
console.log("  ✓ theme toggle has an accessible name and switches theme")

await ctx.close()
await browser.close()
console.log(failures ? `\n${failures} FAILURE(S)` : "\n✓ all accessibility checks passed")
process.exit(failures ? 1 : 0)
