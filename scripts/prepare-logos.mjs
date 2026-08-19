/**
 * Builds the shipped brand assets from the official artwork in
 * public/logos/, which is the source of truth from the style guide kit.
 *
 *   node scripts/prepare-logos.mjs
 *
 * Writes to public/brand/:
 *   wordmark.svg   the full lock-up, lettering as currentColor
 *   brain.svg      the brain-globe on its own, full detail
 *   brain-512.png  raster fallback, and for anyone who needs a PNG
 * and app/icon.svg, the favicon.
 *
 * Two sources, because they are different kinds of thing:
 *
 *  - The brain-globe is supplied as vector, so it is used as-is. Only the
 *    coordinate precision is reduced, and the viewBox tightened to the
 *    drawing.
 *  - The lettering is Crackhouse, for which there is no vector and no
 *    webfont licence, so it is traced from the supplied lock-up into
 *    paths. That puts the letterforms on the page without ever serving
 *    the font.
 *
 * The style guide forbids stretching, recolouring and effects. Nothing
 * here alters proportion or hue; the lettering is themed only between the
 * two inks the lock-up already ships in.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { promisify } from "node:util"
import sharp from "sharp"
import { trace } from "potrace"

const traceP = promisify(trace)
const OUT = "public/brand"
mkdirSync(OUT, { recursive: true })

const sat = (r, g, b) => { const mx = Math.max(r,g,b), mn = Math.min(r,g,b); return mx === 0 ? 0 : (mx-mn)/mx }
const lum = (r, g, b) => 0.2126*r + 0.7152*g + 0.0722*b

/** Run the supplied vector mark through svgo at a given precision. */
function optimise(input, output, precision) {
  execFileSync("npx", ["svgo", "--multipass", `--precision=${precision}`, "-i", input, "-o", output], { stdio: "pipe" })
  return readFileSync(output, "utf8")
}

// ── The brain-globe, from the supplied SVG ───────────────────────────
const rawMark = "public/logos/zombie brain no background.svg"
const stripped = readFileSync(rawMark, "utf8")
  .replace(/<metadata>[\s\S]*?<\/metadata>/g, "") // C2PA manifest, ~12KB
  .replace(/\sxmlns:(c2pa|xlink)="[^"]*"/g, "")
writeFileSync("/tmp/mark-stripped.svg", stripped)

// The artwork sits inside a padded canvas; crop the viewBox to the drawing
// so callers can size it without fighting the margin. Measured once, from
// the drawing itself.
const BOX = { x: 127.6, y: 327.3, w: 1941.8, h: 1942.1 }
const retarget = (svg) =>
  svg.replace(/width="[^"]*"\s*height="[^"]*"\s*viewBox="[^"]*"/, `viewBox="${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}"`)
     .replace(/viewBox="0 0 \d+ \d+"/, `viewBox="${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}"`)

writeFileSync("/tmp/mark-tight.svg", retarget(stripped))
const brainFull = optimise("/tmp/mark-tight.svg", `${OUT}/brain.svg`, 1)
// The favicon and the O of LONDON both render small; a coarser trace is
// indistinguishable there and a third of the weight.
const brainSmall = optimise("/tmp/mark-tight.svg", "/tmp/brain-small.svg", 0)
writeFileSync("app/icon.svg", brainSmall)

await sharp(Buffer.from(brainFull)).resize({ width: 512 }).png().toFile(`${OUT}/brain-512.png`)

// ── The lettering, traced from the lock-up ───────────────────────────
const SRC = "public/logos/LOGOWZD light background .png"
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info

async function traceLayer(keep) {
  const mask = Buffer.alloc(W * H, 255)
  let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y*W + x) * C
    if (data[i+3] > 128 && keep(data[i], data[i+1], data[i+2])) {
      mask[y*W + x] = 0
      if (x < minX) minX = x; if (x > maxX) maxX = x
      if (y < minY) minY = y; if (y > maxY) maxY = y
    }
  }
  const png = await sharp(mask, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer()
  const svg = await traceP(png, { threshold: 128, turdSize: 2, optCurve: true, alphaMax: 1.2 })
  const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(" ").replace(/(\d+\.\d)\d+/g, "$1")
  return { d, box: { minX, minY, maxX, maxY } }
}

const letters = await traceLayer((r,g,b) => sat(r,g,b) < 0.25 && lum(r,g,b) < 45)
// Everything that isn't lettering is the globe: that's the slot to fill.
const slot = await traceLayer((r,g,b) => (sat(r,g,b) < 0.25 && lum(r,g,b) >= 45) || sat(r,g,b) >= 0.28)

const inner = brainSmall.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")
const scale = Math.min(
  (slot.box.maxX - slot.box.minX + 1) / BOX.w,
  (slot.box.maxY - slot.box.minY + 1) / BOX.h,
)
const tx = slot.box.minX - BOX.x * scale
const ty = slot.box.minY - BOX.y * scale

writeFileSync("/tmp/wordmark-raw.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none">
<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(5)})">${inner}</g>
<path fill="currentColor" d="${letters.d}"/>
</svg>
`)
const wordmark = optimise("/tmp/wordmark-raw.svg", `${OUT}/wordmark.svg`, 1)

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1)
console.log(`brain.svg    ${kb(brainFull)}KB   (full detail)`)
console.log(`app/icon.svg ${kb(brainSmall)}KB   (favicon)`)
console.log(`wordmark.svg ${kb(wordmark)}KB   lettering ${(letters.d.length/1024).toFixed(1)}KB`)
