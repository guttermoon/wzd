/**
 * Every photograph on this site must name its photographer, visibly.
 *
 *   node scripts/check-credits.mjs [baseUrl]
 *
 * Checks three things:
 *   1. every entry in content/photos.json has a non-empty credit
 *   2. every file in public/photos is claimed by exactly one entry
 *   3. no component renders an <img> outside components/photo.tsx, which is
 *      the only place that emits a credit
 * and then, if a server is running, that each rendered page shows as many
 * credits as it shows photographs.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"

const base = process.argv[2] || "http://localhost:3000"
const photos = JSON.parse(readFileSync("content/photos.json", "utf8"))
let failures = 0
const fail = (msg) => {
  console.error(`FAIL  ${msg}`)
  failures++
}

// 1 ── every photo credits someone
for (const photo of photos) {
  if (!photo.credit?.trim()) fail(`${photo.slug} has no credit`)
  if (!photo.alt?.trim()) fail(`${photo.slug} has no alt text`)
  if (photo.alt && photo.credit && photo.alt.includes(photo.credit)) {
    fail(`${photo.slug} repeats the credit inside its alt text`)
  }
}
console.log(`✓ ${photos.length} photos, all credited (${new Set(photos.map((p) => p.credit)).size} photographers)`)

// 2 ── no orphan or unreferenced renditions
const slugs = new Set(photos.map((p) => p.slug))
const rendered = new Set()
for (const file of readdirSync("public/photos")) {
  const match = file.match(/^(.*)-(\d+)\.(webp|jpg)$/)
  if (!match) continue // the video and its poster
  if (!slugs.has(match[1])) fail(`public/photos/${file} belongs to no photo entry`)
  rendered.add(match[1])
}
for (const slug of slugs) {
  if (!rendered.has(slug)) fail(`${slug} has no renditions — run scripts/prepare-images.mjs`)
}
console.log(`✓ every rendition maps to a credited photo`)

// 3 ── <img> only ever comes from the credit-bearing component
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
for (const path of [...walk("app"), ...walk("components")]) {
  // components/photo.tsx is the credit-bearing component; wordmark.tsx
  // renders the logo, which is artwork rather than a photograph.
  const ALLOWED = ["components/photo.tsx", "components/wordmark.tsx"]
  if (!/\.tsx$/.test(path) || ALLOWED.some((a) => path.endsWith(a))) continue
  const source = readFileSync(path, "utf8")
  if (/<img[\s>]/.test(source)) fail(`${path} renders a raw <img>; use <Photo> so a credit is emitted`)
}
console.log(`✓ <img> is only emitted by components/photo.tsx`)

// 4 ── the rendered pages actually show the credits
const ROUTES = ["/", "/register", "/rules", "/faq", "/sponsors", "/press", "/photo-policy"]
try {
  await fetch(base, { signal: AbortSignal.timeout(2000) })
} catch {
  console.log(`\n(no server at ${base} — skipping the rendered-page check)`)
  process.exit(failures ? 1 : 0)
}

for (const route of ROUTES) {
  const html = await (await fetch(base + route)).text()
  // Count only the real DOM, not the streamed RSC payload that follows it.
  const body = html.split("<script>self.__next_f")[0]
  const figures = (body.match(/<figure/g) || []).length
  const credits = (body.match(/Photo:/g) || []).length
  // Only photographs count here. The logo lives under /brand/ and is
  // artwork, not a photograph, so it carries no credit line.
  const photoImgs = (body.match(/<img[^>]+\/photos\//g) || []).length
  if (photoImgs !== figures) fail(`${route}: ${photoImgs} photo <img> but ${figures} <figure>`)
  if (credits < figures) fail(`${route}: ${figures} figures but only ${credits} credits`)
  console.log(`  ${route.padEnd(15)} ${figures} photos, ${credits} credits`)
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\n✓ all credit checks passed")
process.exit(failures ? 1 : 0)
