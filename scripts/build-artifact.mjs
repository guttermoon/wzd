/**
 * Builds the self-contained artifact HTML of the homepage.
 *
 * Usage (from a work dir containing home-raw.html and layout.css):
 *   1. npm run dev, then save http://localhost:3000/ as home-raw.html and
 *      its /_next/static/css/app/layout.css as layout.css
 *   2. node <repo>/scripts/build-artifact.mjs
 *   3. publish dead-good-club-home.html (needs `sharp` installed in the
 *      work dir: npm i sharp)
 *
 * Inlines latin-subset next/font woff2 files as base64 @font-face rules,
 * downscales photos to WebP data URIs stored once as :root variables, and
 * keeps only the site's inline scripts. See CLAUDE.md → Artifact preview.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

// sharp is installed in the work dir, not the repo
const require = createRequire(path.join(process.cwd(), 'noop.js'))
const sharp = require('sharp')

const SCRATCH = process.cwd()
const REPO = path.resolve(new URL('..', import.meta.url).pathname)
const MEDIA = path.join(REPO, '.next/static/media')

const html = fs.readFileSync(path.join(SCRATCH, 'home-raw.html'), 'utf8')
let css = fs.readFileSync(path.join(SCRATCH, 'layout.css'), 'utf8')

// ── 1 · body content + classes ──────────────────────────────────────────
const bodyMatch = html.match(/<body([^>]*)>([\s\S]*)<\/body>/)
if (!bodyMatch) throw new Error('no <body> found')
const bodyClass = (bodyMatch[1].match(/class="([^"]*)"/) || [])[1] || ''
let body = bodyMatch[2]

// strip scripts except the inline ENEMY intersection-observer
body = body.replace(/<script\b[\s\S]*?<\/script>/g, (m) =>
  m.includes('enemy-arch') || m.includes('redact-poster') ? m : '')
// strip next.js dev leftovers
body = body
  .replace(/<link\b[^>]*>/g, '')
  .replace(/<next-route-announcer>[\s\S]*?<\/next-route-announcer>/g, '')
  .replace(/<nextjs-portal>[\s\S]*?<\/nextjs-portal>/g, '')
  .replace(/<template\b[\s\S]*?<\/template>/g, '')

// ── 2 · fonts: keep needed families, latin subset only, inline as base64 ─
const NEEDED_VARS = [
  '--font-display', '--font-serif', '--font-mono', '--font-grotesk',
  '--font-oswald', '--font-playfair', '--font-basker', '--font-typewriter',
  '--font-spicy', '--font-grand', '--font-archblack',
]
// map css variables -> internal '__Family_hash' names (incl. fallbacks)
const neededFamilies = new Set()
for (const v of NEEDED_VARS) {
  const re = new RegExp(`${v}:\\s*([^;}]+)`, 'g')
  let m
  while ((m = re.exec(css))) {
    for (const fam of m[1].split(',')) {
      const name = fam.trim().replace(/^['"]|['"]$/g, '')
      if (name.startsWith('__')) neededFamilies.add(name)
    }
  }
}
console.log('needed families:', [...neededFamilies].join(', '))

let kept = 0, dropped = 0, inlinedBytes = 0
css = css.replace(/@font-face\s*\{[^}]*\}/g, (block) => {
  const fam = (block.match(/font-family:\s*['"]?([^;'"]+)['"]?;/) || [])[1]
  if (!fam || !neededFamilies.has(fam)) { dropped++; return '' }
  const url = (block.match(/url\((\/_next\/static\/media\/[^)]+)\)/) || [])[1]
  if (!url) { kept++; return block } // fallback/local() block
  const isLatin = /U\+0000-00FF/i.test(block) || !/unicode-range/i.test(block)
  if (!isLatin) { dropped++; return '' }
  const file = path.join(MEDIA, path.basename(url))
  const buf = fs.readFileSync(file)
  inlinedBytes += buf.length
  kept++
  return block.replace(url, `data:font/woff2;base64,${buf.toString('base64')}`)
})
console.log(`font-face kept ${kept}, dropped ${dropped}, inlined ${(inlinedBytes / 1024).toFixed(0)}KB raw`)
// remove leftover preload hints if any
css = css.replace(/url\(\/_next\/[^)]+\)/g, 'url()')

// ── 3 · images -> downscaled webp data URIs ──────────────────────────────
// each image is embedded once as a :root custom property; every reference
// (inline style attrs use HTML-escaped quotes) becomes var(--img-*)
const images = [
  { file: '574b42abfa2555952d3273c85e9cec76.webp', vn: '--img-plate', width: 1800, quality: 55 },
  { file: 'grassy-field.webp', vn: '--img-field', width: 1200, quality: 50 },
  { file: 'birch-trees.webp', vn: '--img-trees', width: null },
  { file: 'doyle.webp', vn: '--img-doyle', width: null },
  { file: 'moon-landscape.webp', vn: '--img-moonland', width: null },
  { file: 'moon.webp', vn: '--img-moon', width: null },
]
const rootVars = []
for (const img of images) {
  const src = path.join(REPO, 'public', img.file)
  let buf
  if (img.width) {
    buf = await sharp(src).resize({ width: img.width, withoutEnlargement: true })
      .webp({ quality: img.quality }).toBuffer()
  } else {
    buf = fs.readFileSync(src)
  }
  console.log(`${img.file}: ${(fs.statSync(src).size / 1024).toFixed(0)}KB -> ${(buf.length / 1024).toFixed(0)}KB`)
  const uri = `data:image/webp;base64,${buf.toString('base64')}`
  for (const q of ['&#x27;', "'", '&quot;', '"', '']) {
    body = body.split(`url(${q}/${img.file}${q})`).join(`var(${img.vn})`)
  }
  css = css.split(`url(/${img.file})`).join(`var(${img.vn})`)
  // attribute references (img src, svg <image href>) can't use CSS vars —
  // inline the data URI directly
  for (const attr of ['src', 'href', 'srcset', 'srcSet']) {
    body = body.split(`${attr}="/${img.file}"`).join(`${attr}="${uri}"`)
  }
  // only embed the :root variable if something references it
  if (body.includes(`var(${img.vn})`) || css.includes(`var(${img.vn})`)) {
    rootVars.push(`${img.vn}:url("${uri}")`)
  }
}
css += `\n:root{${rootVars.join(';')}}\n`

// ── 4 · assemble ─────────────────────────────────────────────────────────
const out = `<title>The Dead Good Club — live homepage</title>
<style>
${css}
</style>
<div class="${bodyClass}" style="min-height:100vh">
${body}
</div>
`
fs.writeFileSync(path.join(SCRATCH, 'dead-good-club-home.html'), out)
console.log('final size:', (out.length / 1024 / 1024).toFixed(2), 'MB')
const leftover = out.match(/url\((?!['"]?data:)['"]?\/[^)]*\)/g)
console.log('non-data url() leftovers:', leftover ? leftover.slice(0, 10) : 'none')
