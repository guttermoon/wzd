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
 *   wordmark-light-bg.png / wordmark-dark-bg.png / brain.png
 *                  the press kit's downloads, copied straight from
 *                  public/logos as supplied. Renamed, never resized.
 * and app/icon.svg, the favicon.
 *
 * Two sources, because they are different kinds of thing:
 *
 *  - The brain-globe is supplied as vector, so it is used as-is. Only the
 *    coordinate precision is reduced, and the viewBox tightened to the
 *    drawing.
 *  - The lock-up's lettering is Crackhouse, for which we hold no webfont
 *    licence. It is never served as a font: the supplied vector already
 *    carries the letterforms as paths, and only their fill is changed, to
 *    currentColor, so one file serves both themes.
 *
 * The style guide forbids stretching, recolouring and effects. Nothing
 * here alters proportion or hue; the lettering is themed only between the
 * two inks the lock-up already ships in.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs"
import { execFileSync } from "node:child_process"
import sharp from "sharp"
const OUT = "public/brand"
mkdirSync(OUT, { recursive: true })

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
// The favicon and the masthead mark both render at 44px or less, where the
// reduced coordinate precision is invisible and the file is a third of the
// weight. The masthead copy is inlined into every page, so that matters.
const brainSmall = optimise("/tmp/mark-tight.svg", "/tmp/brain-small.svg", 0)
writeFileSync("app/icon.svg", brainSmall)
writeFileSync(`${OUT}/brain-mark.svg`, brainSmall)

await sharp(Buffer.from(brainFull)).resize({ width: 512 }).png().toFile(`${OUT}/brain-512.png`)

// ── The full lock-up, from the supplied vector ───────────────────────
// The owner supplied both variants. The dark-background one is the better
// base: its lettering is pure white (#FEFEFE) and nothing else in the
// drawing uses that ink, so the lettering can be swapped to currentColor
// and the one file then serves both themes. In the light-background
// variant the lettering shares its grey with the globe's continents, which
// would make the same swap recolour the artwork.
const LOCKUP = "public/logos/LOGOWZD dark background.svg"
const lockup = readFileSync(LOCKUP, "utf8")
  .replace(/<metadata>[\s\S]*?<\/metadata>/g, "")
  .replace(/\sxmlns:(c2pa|xlink)="[^"]*"/g, "")

const LETTER_INK = /#FEFEFE/gi
const letterPaths = (lockup.match(LETTER_INK) || []).length
if (letterPaths < 20) {
  throw new Error(`Expected the lettering to be #FEFEFE; found ${letterPaths} uses. Check the artwork before shipping.`)
}
writeFileSync("/tmp/wordmark-raw.svg", lockup.replace(LETTER_INK, "currentColor"))
const wordmark = optimise("/tmp/wordmark-raw.svg", `${OUT}/wordmark.svg`, 1)

// ── The PNGs the press kit hands out ────────────────────────────────
// The owner's own files, copied rather than rendered. An earlier version
// rasterised the vector and recoloured the ink, which produced bigger
// files but not the artwork as drawn; these are what was supplied, byte
// for byte, so what a journalist downloads is the real thing. They are
// only renamed, never resized: upscaling a raster would be worse than
// handing over the size that exists.
const COPIES = [
  ["public/logos/LOGOWZD light background .png", "wordmark-light-bg.png"],
  ["public/logos/LOGOWZD dark background.png", "wordmark-dark-bg.png"],
  ["public/logos/zombie brain no background.png", "brain.png"],
]
for (const [from, to] of COPIES) {
  copyFileSync(from, `${OUT}/${to}`)
}

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1)
console.log(`brain.svg    ${kb(brainFull)}KB   (full detail)`)
console.log(`app/icon.svg ${kb(brainSmall)}KB   (favicon + masthead)`)
console.log(`wordmark.svg ${kb(wordmark)}KB   (${letterPaths} lettering paths → currentColor)`)
console.log(`PNGs         ${COPIES.map(([, to]) => to).join(", ")} (copied as supplied)`)
