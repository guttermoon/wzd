/**
 * Turns the photographers' original files into the web and press renditions
 * the site ships, and converts the animated GIF into video.
 *
 *   node scripts/prepare-images.mjs
 *
 * Reads content/photos.json (the credit registry — see lib/photos.ts) and
 * for each entry writes:
 *   public/photos/<slug>-{640,1024,1600}.webp   responsive web renditions
 *   public/photos/<slug>-1600.jpg               fallback
 *   public/press/<slug>-press.jpg               2400px press download
 *   public/video/world-zombie.{mp4,webm}        the broadcast, from the GIF
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
const VIDEO = "public/video"
const PRESS = "public/press"
const ORIGINALS = "assets/originals"
for (const dir of [PHOTOS, VIDEO, PRESS, ORIGINALS]) mkdirSync(dir, { recursive: true })

const WIDTHS = [640, 1024, 1600]
const PRESS_WIDTH = 2400

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

  if (photo.press !== false) {
    const press = join(PRESS, `${photo.slug}-press.jpg`)
    if (force || !existsSync(press)) {
      await sharp(src)
        .rotate()
        .resize({ width: Math.min(PRESS_WIDTH, meta.width) })
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(press)
      built++
    }
  }

  renditions[photo.slug] = {
    widths,
    // Intrinsic aspect ratio, so <img> can reserve space and avoid shift.
    aspect: Number((meta.width / meta.height).toFixed(4)),
  }
  if (existsSync(photo.source) && photo.source !== stashed) renameSync(photo.source, stashed)
  console.log(`${photo.slug.padEnd(24)} ${meta.width}×${meta.height} → ${widths.join("/")}  (${kb(jpg)}KB jpg)`)
}

// ── The animated GIF → video ───────────────────────────────────────────
// A 6.9MB looping GIF cannot be paused, which fails WCAG 2.2.2. As MP4/WebM
// it is a fraction of the size and the player gets real controls.
const GIF = "world-zombie-1-min.gif"
const gifSrc = existsSync(GIF) ? GIF : join(ORIGINALS, GIF)
if (existsSync(gifSrc)) {
  const { default: ffmpeg } = await import("ffmpeg-static")
  const run = (args) => execFileSync(ffmpeg, args, { stdio: "pipe" })
  const mp4 = join(VIDEO, "world-zombie.mp4")
  const webm = join(VIDEO, "world-zombie.webm")
  const poster = join(VIDEO, "world-zombie-poster.jpg")
  // yuv420p + even dimensions keep the MP4 playable on Safari/iOS.
  const scale = "scale=trunc(iw/2)*2:trunc(ih/2)*2"
  if (force || !existsSync(mp4)) run(["-y", "-i", gifSrc, "-movflags", "faststart", "-pix_fmt", "yuv420p", "-vf", scale, "-crf", "28", mp4])
  if (force || !existsSync(webm)) run(["-y", "-i", gifSrc, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-vf", scale, webm])
  if (force || !existsSync(poster)) run(["-y", "-i", gifSrc, "-frames:v", "1", "-q:v", "3", poster])
  if (existsSync(GIF)) renameSync(GIF, join(ORIGINALS, GIF))
  console.log(`gif → mp4 ${kb(mp4)}KB · webm ${kb(webm)}KB · poster ${kb(poster)}KB (was ${kb(join(ORIGINALS, GIF))}KB)`)
}

writeFileSync(
  "content/photo-renditions.json",
  JSON.stringify(renditions, null, 2) + "\n",
)

console.log(`\nwrote ${built} files`)
