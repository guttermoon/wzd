import { chromium } from "playwright"
const S = "/tmp/claude-0/-home-user-wzd/a5e28354-270b-55f8-8fa0-61608b02cc46/scratchpad"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" })
for (const theme of ["dark", "light"]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1200 } })
  await ctx.addInitScript(() => { try { localStorage.setItem("wzd-consent","denied") } catch {} })
  const p = await ctx.newPage()
  await p.goto("http://localhost:3000/donate", { waitUntil: "domcontentloaded" })
  await p.waitForTimeout(3000)
  await p.evaluate((t) => document.documentElement.classList.toggle("dark", t === "dark"), theme)
  await p.waitForTimeout(400)
  const link = p.locator('a[href="https://deadgoodclub.com/"]').first()
  await link.evaluate((el) => el.scrollIntoView({ block: "center" }))
  await p.waitForTimeout(600)
  const mark = p.locator(".dgc-mark").filter({ has: p.locator("img") }).nth(theme === "dark" ? 1 : 0)
  await link.hover({ force: true })
  await p.waitForTimeout(600)
  await mark.screenshot({ path: `${S}/mark-${theme}-hover.png` })
  await ctx.close()
}
await b.close()
