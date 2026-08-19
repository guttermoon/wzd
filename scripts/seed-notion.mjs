/**
 * Fills the Notion copy database with one row per key in
 * content/site-copy.json, so every string on the site is editable from
 * Notion on day one.
 *
 *   NOTION_TOKEN=ntn_… node scripts/seed-notion.mjs [--dry-run]
 *
 * Safe to re-run: existing rows are matched by their title and updated in
 * place rather than duplicated. Rows in Notion that no longer correspond to
 * a key are reported, never deleted — the owner may have added them
 * deliberately.
 *
 * Requires the database to have, besides its title property:
 *   Text                    Rich text
 *   Published or Status     whichever gate the database uses
 */
import { readFileSync } from "node:fs"
import { Client } from "@notionhq/client"

const dryRun = process.argv.includes("--dry-run")
const token = process.env.NOTION_TOKEN
const databaseId =
  process.env.NOTION_CONTENT_DATABASE_ID ||
  process.env.NOTION_DATABASE_ID ||
  "3c16f6ccb2c180e087a4da55703d5792"

if (!token) {
  console.error("NOTION_TOKEN is not set. See NOTION_SETUP.md.")
  process.exit(1)
}

const notion = new Client({ auth: token })
const copy = JSON.parse(readFileSync("content/site-copy.json", "utf8"))
const keys = Object.keys(copy).sort()

// ── Check the schema before writing anything ──────────────────────────
const db = await notion.databases.retrieve({ database_id: databaseId })
const props = db.properties
const titleProp = Object.entries(props).find(([, p]) => p.type === "title")?.[0]
const missing = []
if (!titleProp) missing.push("a title property")
if (props.Text?.type !== "rich_text") missing.push('"Text" (Rich text)')
const gate =
  props.Published?.type === "checkbox"
    ? "checkbox"
    : props.Status?.type === "status" || props.Status?.type === "select"
      ? "status"
      : null
if (!gate) missing.push('"Published" (Checkbox) or "Status"')
if (missing.length) {
  console.error(`The database is missing: ${missing.join(", ")}.`)
  console.error("Add them in Notion, then re-run. See NOTION_SETUP.md.")
  process.exit(1)
}
console.log(`Database OK — title "${titleProp}", gate "${gate}".`)

// ── Read what's already there ─────────────────────────────────────────
const plain = (rich) => (rich || []).map((t) => t.plain_text).join("")
const existing = new Map()
let cursor
do {
  const page = await notion.databases.query({
    database_id: databaseId,
    start_cursor: cursor,
    page_size: 100,
  })
  for (const row of page.results) {
    const key = plain(row.properties[titleProp]?.title).trim()
    if (key) existing.set(key, row)
  }
  cursor = page.has_more ? page.next_cursor : undefined
} while (cursor)
console.log(`${existing.size} rows already in the database.`)

// ── Create or update ──────────────────────────────────────────────────
let created = 0
let updated = 0
let unchanged = 0

for (const key of keys) {
  const text = copy[key]
  const row = existing.get(key)
  const properties = {
    [titleProp]: { title: [{ text: { content: key } }] },
    // Notion caps a single rich-text run at 2000 characters.
    Text: { rich_text: chunk(text).map((content) => ({ text: { content } })) },
    ...(gate === "checkbox"
      ? { Published: { checkbox: true } }
      : { Status: { status: { name: "Done" } } }),
  }

  if (!row) {
    if (!dryRun) await notion.pages.create({ parent: { database_id: databaseId }, properties })
    created++
  } else if (plain(row.properties.Text?.rich_text) !== text || !isLive(row.properties)) {
    if (!dryRun) await notion.pages.update({ page_id: row.id, properties })
    updated++
  } else {
    unchanged++
  }
}

/** Mirrors isLive() in lib/site-copy.ts. */
function isLive(properties) {
  if (properties.Published?.type === "checkbox") return properties.Published.checkbox === true
  const name = (properties.Status?.status ?? properties.Status?.select)?.name?.toLowerCase()
  if (name != null) return ["done", "published", "live", "complete", "completed"].includes(name)
  return true
}

function chunk(value, size = 2000) {
  const parts = []
  for (let i = 0; i < value.length; i += size) parts.push(value.slice(i, i + size))
  return parts.length ? parts : [""]
}

const orphans = [...existing.keys()].filter((key) => !(key in copy))
console.log(
  `${dryRun ? "[dry run] " : ""}created ${created}, updated ${updated}, unchanged ${unchanged}, of ${keys.length} keys.`,
)
if (orphans.length) {
  console.log(`\n${orphans.length} row(s) in Notion with no matching key (left alone):`)
  for (const key of orphans) console.log(`  ${key}`)
}
