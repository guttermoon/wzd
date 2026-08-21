import { chromium } from "playwright"
const S = "/tmp/claude-0/-home-user-wzd/a5e28354-270b-55f8-8fa0-61608b02cc46/scratchpad"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" })
for (const theme of ["dark", "light"]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 } })
  await ctx.addInitScript(() => { try { localStorage.setItem("wzd-consent","denied") } catch {} })
  const p = await ctx.newPage()
  await p.goto("http://localhost:3000/donate", { waitUntil: "domcontentloaded" })
  await p.waitForTimeout(3000)
  await p.evaluate((t) => document.documentElement.classList.toggle("dark", t === "dark"), theme)
  await p.waitForTimeout(400)
  const link = p.locator('a[href="https://deadgoodclub.com/"]').first()
  // Centre it in the viewport: scrollIntoViewIfNeeded can leave it under
  // the sticky masthead, and then the hover lands on the header instead.
  await link.evaluate((el) => el.scrollIntoView({ block: "center" }))
  await p.waitForTimeout(600)
  const state = () => p.evaluate(() => {
    const marks = [...document.querySelectorAll(".dgc-mark")]
    const visible = marks.find((m) => m.getBoundingClientRect().width > 0)
    const tint = visible?.querySelector(".dgc-mark-tint")
    return { mask: getComputedStyle(tint).maskImage.slice(0, 60), opacity: getComputedStyle(tint).opacity }
  })
  const box = await link.boundingBox()
  const rest = await state()
  await p.screenshot({ path: `${S}/dgc-${theme}-rest.png`, clip: box })
  await link.hover({ force: true })
  await p.waitForTimeout(600)
  const hov = await state()
  await p.screenshot({ path: `${S}/dgc-${theme}-hover.png`, clip: box })
  console.log(`${theme.padEnd(6)} rest opacity ${rest.opacity} -> hover ${hov.opacity} | mask ${hov.mask.includes(theme === "dark" ? "dgc-dark" : "dgc-light") ? "correct" : "WRONG: " + hov.mask}`)
  await ctx.close()
}
await b.close()
