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
const ROUTES = ["/", "/register", "/survival", "/faq", "/become-a-sponsor", "/donate", "/press", "/photo-policy", "/privacy"]
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

// ── The consent dialog ───────────────────────────────────────────────
// It is modal and it comes up before anything else, so it is checked on
// its own terms and then answered: every check below is about the page
// behind it, which nobody reaches until the question is settled.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  console.log(`\n── consent dialog ──────────────────────`)
  await page.goto(base + "/", { waitUntil: "networkidle" })
  await page.waitForSelector('[role="dialog"]')

  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim())
  if (focused !== "Okay") {
    console.error(`FAIL  focus opens on "${focused}", expected the first button`)
    failures++
  } else console.log("  ✓ focus moves into the dialog")

  // Tab past the last control and it has to come back to the first.
  await page.keyboard.press("Tab")
  await page.keyboard.press("Tab")
  await page.keyboard.press("Tab")
  const wrapped = await page.evaluate(() => document.activeElement?.textContent?.trim())
  if (wrapped !== "Okay") {
    console.error(`FAIL  focus escaped the dialog to "${wrapped}"`)
    failures++
  } else console.log("  ✓ focus stays inside it")

  if (await page.evaluate(() => document.body.style.overflow) !== "hidden") {
    console.error("FAIL  the page behind the dialog still scrolls")
    failures++
  } else console.log("  ✓ the page behind it is locked")

  await page.getByRole("button", { name: "No thanks" }).click()
  if (await page.locator('[role="dialog"]').count() !== 0) {
    console.error("FAIL  the dialog survived an answer")
    failures++
  } else console.log("  ✓ answering closes it and unlocks the page")
  await ctx.close()
}

// ── Keyboard behaviour ───────────────────────────────────────────────
// The answer is seeded, so the dialog is not up: these are checks on the
// page itself.
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
await ctx.addInitScript(() => localStorage.setItem("wzd-consent", "denied"))
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
// Entrance animations run on load; let them finish before driving the UI.
await page.waitForTimeout(1200)
const toggle = page.getByRole("button", { name: /switch to (light|dark) mode/i })
const before = await page.evaluate(() => document.documentElement.className)
await toggle.click()
await page.waitForFunction((b) => document.documentElement.className !== b, before)
console.log("  ✓ theme toggle has an accessible name and switches mode")

await ctx.close()
await browser.close()
console.log(failures ? `\n${failures} FAILURE(S)` : "\n✓ all accessibility checks passed")
process.exit(failures ? 1 : 0)
