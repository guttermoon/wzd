/**
 * The after-party ticket widget, against the shape it actually has.
 *
 *   npx next start -p 3111 &
 *   node scripts/check-dmn-widget.mjs
 *
 * DesignMyNight's widget renders into our document rather than an iframe,
 * and with one ticket type on sale it left ~450px of nothing between the
 * ticket and the Book tickets button: its outer element carries a height
 * and the content inside is `flex: 1 1` with `overflow-y: auto`. The rule
 * in app/globals.css under "the after-party ticket widget" releases that.
 *
 * designmynight.com is not reachable from the development environment, so
 * this rebuilds their markup from the element tree observed in DevTools —
 * the class-name prefixes, the flex column, the height, the overflow — and
 * checks the rule still wins against it. That is a regression test for our
 * CSS, and it is honest about what it is not: it cannot notice the day
 * **they** rename a component, because the hashes after the underscore
 * change on their every deploy and only the prefix is matched. If the gap
 * ever comes back on the live page, look there first.
 *
 * It asserts the button survives as well as the gap closing. The rule only
 * ever loosens a constraint — no max-height, no `overflow: hidden` — so
 * nothing it does should be able to hide the control that takes the money,
 * and that is worth proving rather than assuming.
 */
import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
const c = await b.newContext({ viewport: { width: 1200, height: 900 } })

/**
 * Their widget, rebuilt from the element tree in DevTools: a flex column
 * with a height, a content div at `flex: 1 1` with `overflow-y: auto`,
 * one ticket card in it, and a Book tickets button below. The hashes are
 * theirs; the prefixes are what the rule matches.
 */
await c.route("**://widgets.designmynight.com/**", (r) =>
  r.fulfill({ status: 200, contentType: "application/javascript", body: `
    (function () {
      var s = document.currentScript || document.querySelector('script[data-dmn="1"]')
      var host = s.parentElement
      var main = document.createElement("main")
      main.className = "page_main___scjt page_embeddedWidget__vSXL_"
      main.style.cssText = "display:flex;flex-direction:column;height:558px"
      var content = document.createElement("div")
      content.className = "page_content__Gr1Nd"
      content.style.cssText = "flex:1 1;display:flex;flex-direction:column;overflow-y:auto"
      content.innerHTML = '<div class="layout_ticketsSelectionC" style="height:120px;background:#eee">VIP Lounge Access</div>'
      var foot = document.createElement("div")
      foot.textContent = "Book tickets"
      foot.id = "mock-book"
      main.appendChild(content); main.appendChild(foot); host.appendChild(main)
    })()
  ` }))

await c.addInitScript(() => { localStorage.setItem("theme","light"); localStorage.setItem("wzd-consent","denied") })
const p = await c.newPage()
await p.goto(`${process.env.BASE_URL || "http://localhost:3111"}/after-party`, { waitUntil: "networkidle" })
await p.waitForSelector("#mock-book", { timeout: 8000 })
await p.waitForTimeout(400)

const m = await p.evaluate(() => {
  const main = document.querySelector('[class*="page_embeddedWidget"]')
  const content = document.querySelector('[class*="page_content"]')
  const ticket = document.querySelector('[class*="layout_ticketsSelection"]')
  const book = document.getElementById("mock-book")
  const cs = getComputedStyle(content)
  return {
    mainHeight: Math.round(main.getBoundingClientRect().height),
    contentHeight: Math.round(content.getBoundingClientRect().height),
    contentOverflowY: cs.overflowY,
    gapBelowTicket: Math.round(book.getBoundingClientRect().top - ticket.getBoundingClientRect().bottom),
    bookVisible: book.getBoundingClientRect().height > 0,
  }
})
console.log("\n── the widget, rebuilt from its element tree ──")
console.log(m)
let bad = 0
const ok = (l, c, d="") => { console.log(`${c?"  ✓":"  ✗"} ${l}${d?"  — "+d:""}`); if(!c) bad++ }
ok("the 558px height is released", m.mainHeight < 300, `${m.mainHeight}px`)
ok("content is no taller than its ticket", m.contentHeight <= 140, `${m.contentHeight}px`)
ok("no internal scroller", m.contentOverflowY === "visible", m.contentOverflowY)
ok("no dead space above Book tickets", m.gapBelowTicket < 20, `${m.gapBelowTicket}px`)
ok("Book tickets is still on the page", m.bookVisible)
await b.close()
process.exit(bad ? 1 : 0)

