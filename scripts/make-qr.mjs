/**
 * Draws the printable QR code for every entry in `QR_CODES`.
 *
 *   npm run qr
 *
 * Writes public/brand/qr-go-<code>.svg and .png. The `go-` is not
 * decoration: public/brand already holds qr-donate.png and three siblings,
 * which are the owner's own Zeffy donation code assembled by
 * `npm run logos`, and a code named `donate` here would have quietly
 * overwritten one of them — it did, once, before this prefix existed. The
 * name says which QR codes this script owns.
 *
 * Both formats, because they are for different jobs: the SVG is what goes
 * to a printer,
 * where a QR code has to be crisp at whatever size it lands and a raster
 * is a guess about that size made months early; the PNG is what gets
 * dropped into Canva, a slide or a social post by someone who should not
 * have to think about file formats.
 *
 * ── Every code is decoded before it is written ───────────────────────
 *
 * A QR code is the one asset on this site whose failure is invisible
 * until it is already printed on two hundred posters. It cannot be
 * proofread by looking at it. So each one is rendered, decoded back with
 * an independent reader, and compared against the URL it was asked for —
 * and the script refuses to write anything if that round trip does not
 * come back exactly. Rendering and reading are different libraries on
 * purpose: a bug shared by both is the only way this passes wrongly.
 *
 * ── Four versions of each, and what each one is for ─────────────────
 *
 * A sticker or a flag is not a sheet of A4: it has a colour of its own,
 * and a white square dropped on it looks like a mistake. So each code is
 * drawn four ways — on white, and then black, white and brand red on a
 * transparent ground, for placing straight onto artwork.
 *
 * The three transparent ones move the quiet zone's job onto whoever
 * places them. The margin is still in the file, but it is now the colour
 * of the artwork underneath, so **the four modules of clear space around
 * the code have to stay clear of type, edges and anything else**. A code
 * butted up against a border does not scan, and on a transparent version
 * nothing in the file stops that happening.
 *
 * Each variant is decoded flattened onto the ground it is meant for —
 * the white one against black, the other two against white — so what is
 * proved is the thing that matters: that this ink scans on that surface.
 * jsQR reads in greyscale, which is what makes it a real test of the red
 * rather than a look at it.
 *
 * ── Why plain black, and no logo in the middle ───────────────────────
 *
 * The style guide's colours are for things people read. A QR code is read
 * by a camera in bad light on a wet pavement, and every departure from
 * maximum contrast — a tint, a gradient, a brain mark punched out of the
 * centre — spends error correction that was there to survive the wet
 * pavement. The brand goes around it on the poster, not inside it.
 *
 * Error correction is level Q (25%), which is more than a clean code
 * needs and roughly what a code that has been folded, rained on, or
 * printed on fabric does need. A flag is fabric.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { readFileSync } from "node:fs"
import { join } from "node:path"

import QRCode from "qrcode"
import jsQR from "jsqr"
import sharp from "sharp"

const OUT = "public/brand"
const PNG_PX = 2048

/**
 * The site the codes point at.
 *
 * A QR code outlives the deploy that made it, so this is the real domain
 * rather than whatever `NEXT_PUBLIC_SITE_URL` happens to be in the shell
 * that runs the script — a code accidentally printed with a vercel.app
 * address in it is a code that stops working the day the preview is
 * cleaned up. Override deliberately with SITE_URL if you ever need to.
 */
const SITE = (process.env.SITE_URL || "https://worldzombieday.co.uk").replace(/\/+$/, "")

/**
 * The codes, read out of lib/event.ts rather than listed again here.
 *
 * Two lists that have to agree is how a poster gets printed pointing at a
 * code the site does not serve. This is a regex over TypeScript, which is
 * not elegant, but the failure mode is loud — no matches means no output
 * and an error — and the alternative is a build step for one script.
 */
function codes() {
  const source = readFileSync("lib/event.ts", "utf8")
  const block = source.match(/export const QR_CODES = \[([\s\S]*?)\n\] as const/)
  if (!block) throw new Error("QR_CODES not found in lib/event.ts")
  const found = [...block[1].matchAll(/code:\s*"([a-z0-9-]+)"/g)].map((m) => m[1])
  if (!found.length) throw new Error("QR_CODES is empty — nothing to draw")
  return found
}

/** What the code has to read back as, character for character. */
const urlFor = (code) => `${SITE}/go/${code}`

const common = {
  errorCorrectionLevel: "Q",
  margin: 4, // The quiet zone. Four modules is the spec's minimum, and a
             // code butted against artwork is a code that does not scan.
}

/**
 * `dark` is the ink, `light` the ground — `#00000000` for none — and `on`
 * is the surface the variant exists to be placed on, which is what it is
 * flattened against before being decoded.
 *
 * The red is #b03c2e, the value asked for. It is one hex digit off the
 * site's own `--accent-strong` (#b03a2e) and that is not worth
 * reconciling here: this is ink for a printer, not a colour the site
 * renders, and it is the value on the artwork order.
 */
const VARIANTS = [
  { suffix: "", dark: "#000000ff", light: "#ffffffff", on: "#ffffff" },
  { suffix: "-transparent", dark: "#000000ff", light: "#00000000", on: "#ffffff" },
  { suffix: "-white", dark: "#ffffffff", light: "#00000000", on: "#000000" },
  { suffix: "-red", dark: "#b03c2eff", light: "#00000000", on: "#ffffff" },
]

/**
 * Renders, reads back, and returns the PNG — or throws with the mismatch.
 *
 * jsQR wants raw RGBA, which is what sharp hands over, so the decode sees
 * the actual pixels that will be printed rather than the matrix that
 * produced them.
 */
async function proof(url, variant) {
  const options = { ...common, color: { dark: variant.dark, light: variant.light } }
  const png = await QRCode.toBuffer(url, { ...options, type: "png", width: PNG_PX })

  // Flattened onto the surface this variant is for, because that is the
  // thing being claimed. A transparent code decoded against its own
  // absent background proves nothing about whether it reads on a sticker.
  const { data, info } = await sharp(png)
    .flatten({ background: variant.on })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const read = jsQR(new Uint8ClampedArray(data), info.width, info.height)
  const name = `${url}${variant.suffix || " (on white)"}`
  if (!read) throw new Error(`${name} did not decode at all on ${variant.on}`)
  if (read.data !== url) {
    throw new Error(`${name} decoded as ${JSON.stringify(read.data)}`)
  }
  return { png, options }
}

mkdirSync(OUT, { recursive: true })

for (const code of codes()) {
  const url = urlFor(code)
  for (const variant of VARIANTS) {
    const { png, options } = await proof(url, variant)
    const svg = await QRCode.toString(url, { ...options, type: "svg" })
    const name = `qr-go-${code}${variant.suffix}`

    writeFileSync(join(OUT, `${name}.png`), png)
    writeFileSync(join(OUT, `${name}.svg`), svg)
    console.log(`✓ ${name.padEnd(28)} decoded back exactly on ${variant.on}`)
  }
  console.log(`  …all four point at ${url}\n`)
}
