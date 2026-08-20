/**
 * Fails if a class the site depends on is missing from the built CSS.
 *
 * Tailwind scans the source for literal class names and drops anything in
 * `@layer components` it cannot find. A name assembled at runtime — say
 * `cut-${n}` or `frame-${n}` — is invisible to that scan, so the rule is
 * deleted and the class silently does nothing. Nothing errors. The class is
 * on the element in the DOM, the source looks correct, and devtools shows
 * the class applied with no rules behind it. The only place the problem is
 * visible is the compiled stylesheet, which is what this reads.
 *
 * That is not hypothetical: every hash-picked frame and cut on this site
 * was being stripped this way, so the "deepened" photo cuts and the varying
 * band angles were never rendering at all. The only angles on screen came
 * from the two classes that happen to appear as literals.
 *
 *   npm run build && node scripts/check-css.mjs
 */
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

const DIR = ".next/static/css"

const REQUIRED = [
  // Photograph frames, picked per photo by a hash of its slug.
  "cut-0", "cut-1", "cut-2", "cut-3", "cut-4", "cut-5",
  "cut-band-0", "cut-band-1", "cut-band-2", "cut-band-3", "cut-band-4",
  "frame-0", "frame-1", "frame-2", "frame-3", "frame-4",
  "photo-frame", "frame-accent",
  "cut-inner-l", "cut-inner-r",
  "tilt-a", "tilt-b", "tilt-c",
  // Motion.
  "bar-left", "bar-right", "bar-top", "bar-bottom",
  "hand-left", "hand-right",
  "swipe-word", "wipe", "slide-up", "slide-left", "slide-right",
  "in-view",
  // Layout devices.
  "edge-left", "edge-right", "breakout", "panel-ground", "torn-bar",
  "credit-inset", "photo-mini", "on-blood", "vhs",
]

let files
try {
  files = readdirSync(DIR).filter((f) => f.endsWith(".css"))
} catch {
  console.error(`No built CSS in ${DIR}. Run npm run build first.`)
  process.exit(1)
}

const css = files.map((f) => readFileSync(join(DIR, f), "utf8")).join("\n")

const missing = REQUIRED.filter((name) => !new RegExp(`\\.${name}[{ ,:.>]`).test(css))

if (missing.length) {
  console.error(`✗ ${missing.length} class(es) missing from the built CSS:`)
  for (const name of missing) console.error(`    .${name}`)
  console.error(
    "\nTailwind drops @layer components rules whose class name never appears\n" +
      "literally in the source. Write the name out in full — a lookup array of\n" +
      "complete strings, never a template literal.",
  )
  process.exit(1)
}

console.log(`✓ all ${REQUIRED.length} required classes are in the built CSS`)
