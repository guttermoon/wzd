/**
 * Turns the photographers’ original files into the web renditions
 * the site ships.
 *
 *   node scripts/prepare-images.mjs
 *
 * Reads content/photos.json (the credit registry — see lib/photos.ts) and
 * for each entry writes:
 *   public/photos/<slug>-{640,1024,1600}.webp   responsive web renditions
 *   public/photos/<slug>-1600.jpg               fallback
 *
 * Originals are moved to assets/originals/ (gitignored) so nothing is lost.
 * Re-running is cheap: existing outputs are skipped unless --force is passed.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, statSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { join } from "node:path"
import sharp from "sharp"

const force = process.argv.includes("--force")
const photos = JSON.parse(readFileSync("content/photos.json", "utf8"))

const PHOTOS = "public/photos"
const ORIGINALS = "assets/originals"
for (const dir of [PHOTOS, ORIGINALS]) mkdirSync(dir, { recursive: true })

const WIDTHS = [640, 1024, 1600]

const kb = (p) => Math.round(statSync(p).size / 1024)
let built = 0
/** slug → {widths, aspect} actually written, so lib/photos.ts never guesses. */
const renditions = {}

for (const photo of photos) {
  // The original may still be at the repo root (first run) or already moved.
  const stashed = join(ORIGINALS, photo.source)
  const src = existsSync(photo.source) ? photo.source : stashed
  if (!existsSync(src)) {
    console.error(`missing original for ${photo.slug}: ${photo.source}`)
    process.exitCode = 1
    continue
  }

  const meta = await sharp(src).metadata()
  // Never upscale: a 640px-wide original should not be blown up to 1600.
  const widths = WIDTHS.filter((w) => w <= meta.width)
  if (widths.length === 0) widths.push(meta.width)

  for (const width of widths) {
    const webp = join(PHOTOS, `${photo.slug}-${width}.webp`)
    if (force || !existsSync(webp)) {
      await sharp(src).rotate().resize({ width }).webp({ quality: 78 }).toFile(webp)
      built++
    }
  }

  const widest = widths[widths.length - 1]
  const jpg = join(PHOTOS, `${photo.slug}-${widest}.jpg`)
  if (force || !existsSync(jpg)) {
    await sharp(src).rotate().resize({ width: widest }).jpeg({ quality: 80, mozjpeg: true }).toFile(jpg)
    built++
  }

  renditions[photo.slug] = {
    widths,
    // Intrinsic aspect ratio, so <img> can reserve space and avoid shift.
    aspect: Number((meta.width / meta.height).toFixed(4)),
  }
  if (existsSync(photo.source) && photo.source !== stashed) renameSync(photo.source, stashed)
  console.log(`${photo.slug.padEnd(24)} ${meta.width}×${meta.height} → ${widths.join("/")}  (${kb(jpg)}KB jpg)`)
}

writeFileSync(
  "content/photo-renditions.json",
  JSON.stringify(renditions, null, 2) + "\n",
)

console.log(`\nwrote ${built} files`)
