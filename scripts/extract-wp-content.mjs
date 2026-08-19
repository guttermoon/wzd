/**
 * Extracts the text content of the WordPress export (WXR) into plain text,
 * so the migration mapping from WordPress → Notion copy keys is reproducible.
 *
 *   node scripts/extract-wp-content.mjs <path-to-wxr.xml> [--json]
 *
 * Prints each published page/FAQ as readable text. The copy keys themselves
 * live in content/site-copy.json; this script is the audit trail showing
 * where that copy came from.
 */
import { readFileSync } from "node:fs"

const file = process.argv[2]
if (!file) {
  console.error("usage: node scripts/extract-wp-content.mjs <wxr.xml> [--json]")
  process.exit(1)
}
const xml = readFileSync(file, "utf8")

const items = xml.split("<item>").slice(1).map((chunk) => chunk.split("</item>")[0])

const tag = (chunk, name) => {
  const m = chunk.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`))
  return m ? m[1] : ""
}

const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#8217": "’", "#8216": "‘", "#8220": "“", "#8221": "”", "#8211": "–", "#8212": "—", "#038": "&", "#39": "'" }

/** WordPress HTML + shortcodes → readable plain text, keeping paragraph breaks. */
export function toText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/\[\/?[a-z_][^\]]*\]/gi, "")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&([a-z]+|#\d+);/gi, (m, e) => entities[e.toLowerCase()] ?? m)
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

const wanted = new Set(["page", "faqs"])
const out = []
for (const chunk of items) {
  const type = tag(chunk, "wp:post_type")
  if (!wanted.has(type)) continue
  const status = tag(chunk, "wp:status")
  if (status !== "publish") continue
  out.push({
    type,
    slug: tag(chunk, "wp:post_name"),
    title: toText(tag(chunk, "title")),
    text: toText(tag(chunk, "content:encoded")),
  })
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(out, null, 2))
} else {
  for (const entry of out) {
    console.log("=".repeat(72))
    console.log(`${entry.type}  ${entry.slug || "(no slug)"}  —  ${entry.title}`)
    console.log("=".repeat(72))
    console.log(entry.text || "(empty)")
    console.log()
  }
}
