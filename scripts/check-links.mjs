/**
 * Every link that leaves the site opens in a new tab, says so, and cannot
 * reach back through window.opener. Every link that stays on it does none
 * of those things.
 *
 * Checked against the rendered pages rather than the source, because that
 * is what a visitor gets: a component can be right and still be used
 * wrongly, and a raw <a> written in a hurry looks fine in review.
 *
 * The rules:
 *
 *   1. An href to another origin has target="_blank".
 *   2. It also has rel with noopener, so the page it opens cannot reach
 *      back through window.opener.
 *   3. It announces the new tab, because with target="_blank" the back
 *      button no longer returns you and someone who cannot see the tab
 *      open has no other way of knowing.
 *   4. An href that stays on this site does *not* have target="_blank".
 *      mailto: and tel: are left alone: they hand off to another
 *      application rather than opening a page.
 *
 * Run with the production server up; it exits quietly if there is none, so
 * it can sit in a chain that does not always have one.
 */
const base = process.env.BASE_URL ?? "http://localhost:3000"
const ROUTES = [
  "/",
  "/register",
  "/survival",
  "/faq",
  "/become-a-sponsor",
  "/donate",
  "/press",
  "/photo-policy",
  "/privacy",
]

let failures = 0
const fail = (message) => {
  console.error(`FAIL  ${message}`)
  failures++
}

try {
  await fetch(base, { signal: AbortSignal.timeout(2000) })
} catch {
  console.log(`(no server at ${base} — skipping the link check)`)
  process.exit(0)
}

const ANNOUNCEMENT = /opens in a new tab/i

for (const route of ROUTES) {
  const html = await (await fetch(base + route)).text()
  // The real DOM only, not the streamed RSC payload that follows it.
  const body = html.split("<script>self.__next_f")[0]

  // Each anchor with everything up to its closing tag, so the announcement
  // inside it can be seen.
  const anchors = body.match(/<a\s[^>]*>[\s\S]*?<\/a>/g) || []
  let external = 0
  let internal = 0

  for (const anchor of anchors) {
    const href = anchor.match(/\shref="([^"]*)"/)?.[1] ?? ""
    if (/^(mailto:|tel:)/i.test(href)) continue

    const isExternal = /^https?:\/\//i.test(href)
    const opensNewTab = /\starget="_blank"/.test(anchor)
    const where = `${route}: ${href.slice(0, 60)}`

    if (isExternal) {
      external++
      if (!opensNewTab) fail(`${where} leaves the site without target="_blank"`)
      if (!/\srel="[^"]*noopener/.test(anchor)) fail(`${where} has no rel="noopener"`)
      if (!ANNOUNCEMENT.test(anchor)) fail(`${where} does not say it opens a new tab`)
    } else {
      internal++
      if (opensNewTab) fail(`${where} stays on the site but opens a new tab`)
    }
  }

  console.log(`  ${route.padEnd(18)} ${external} external, ${internal} internal`)
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\n✓ every outbound link opens in a new tab and says so")
process.exit(failures ? 1 : 0)
