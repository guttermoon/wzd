/**
 * Builds the shipped logo assets from the official artwork in
 * public/logos/, which is the source of truth from the style guide kit.
 *
 *   node scripts/prepare-logos.mjs
 *
 * Writes to public/brand/:
 *   wordmark-light-{640,320}.webp   the greige lock-up, for dark grounds
 *   wordmark-dark-{640,320}.webp    the black lock-up, for greige grounds
 *   brain-{512,256}.webp            the brain-globe mark on its own
 *   plus a PNG of each at the larger size, as a fallback and for press
 *
 * The artwork is only ever trimmed and resized. The style guide is explicit
 * that the logo must not be stretched, recoloured, or given effects, so
 * nothing here alters colour or proportion.
 */
import { mkdirSync } from "node:fs"
import { join } from "node:path"
import sharp from "sharp"

const OUT = "public/brand"
mkdirSync(OUT, { recursive: true })

const SOURCES = [
  // The filenames describe the background they are *for*.
  { src: "public/logos/LOGOWZD dark background.png", name: "wordmark-light", widths: [640, 320] },
  { src: "public/logos/LOGOWZD light background .png", name: "wordmark-dark", widths: [640, 320] },
  { src: "public/logos/zombie brain no background 512 x512.png", name: "brain", widths: [512, 256] },
]

for (const { src, name, widths } of SOURCES) {
  // Trim the transparent margin so layout can control the clear space,
  // which the guide sets at one "W" — see components/wordmark.tsx.
  const base = sharp(src).trim({ threshold: 8 })
  const meta = await sharp(await base.toBuffer()).metadata()

  for (const width of widths) {
    await sharp(await base.toBuffer())
      .resize({ width, fit: "inside" })
      .webp({ quality: 92, alphaQuality: 100 })
      .toFile(join(OUT, `${name}-${width}.webp`))
  }
  await sharp(await base.toBuffer())
    .resize({ width: widths[0], fit: "inside" })
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, `${name}-${widths[0]}.png`))

  console.log(`${name.padEnd(16)} trimmed to ${meta.width}×${meta.height} → ${widths.join("/")}`)
}
