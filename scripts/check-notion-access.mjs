/**
 * Checks what the site's Notion integration is actually allowed to do.
 *
 *   NOTION_TOKEN=ntn_… node scripts/check-notion-access.mjs
 *
 * The site only ever reads: one `databases.query` per regeneration and
 * nothing else. The token in Vercel should therefore be a **read-only**
 * integration, so that a token which leaks cannot rewrite every word on
 * the site. Notion shows a capability setting but not what it means in
 * practice, so this asks the API rather than the settings page.
 *
 * Two probes:
 *
 *   1. READ  — the query the site actually makes. This must succeed, or
 *              the site silently falls back to its built-in copy.
 *   2. WRITE — deliberately the least destructive write that exists here:
 *              it reads one row, then writes that row's `Text` back with
 *              the value it already has. Nothing changes. A read-only
 *              token is refused before anything is written at all.
 *
 * Pass --read-only to skip the second probe entirely.
 *
 * The token is never printed, and never leaves this process.
 */
import { Client } from "@notionhq/client"

const token = process.env.NOTION_TOKEN
const databaseId =
  process.env.NOTION_DATABASE_ID || "3c16f6ccb2c180e087a4da55703d5792"
const skipWrite = process.argv.includes("--read-only")

if (!token) {
  console.error("NOTION_TOKEN is not set. Run it with the token you put in Vercel:")
  console.error("  NOTION_TOKEN=ntn_… node scripts/check-notion-access.mjs")
  process.exit(2)
}

// logLevel "error": the SDK warns loudly on every non-2xx, and a refused
// write is the result this script is looking for, not a problem.
const notion = new Client({ auth: token, timeoutMs: 15000, logLevel: "error" })
const plain = (rich) => (rich || []).map((t) => t.plain_text).join("")

// ── 1. Read ───────────────────────────────────────────────────────────
let firstRow
try {
  const page = await notion.databases.query({
    database_id: databaseId,
    page_size: 1,
  })
  firstRow = page.results[0]
  console.log(`READ   ✓ the copy query works (${page.results.length ? "rows returned" : "database empty"})`)
} catch (error) {
  console.log(`READ   ✗ FAILED — ${error.code ?? error.message}`)
  console.log("\nThe site cannot read its copy with this token, so every page")
  console.log("would fall back to the built-in text. Check the token is right")
  console.log("and that the database is shared with the integration.")
  process.exit(1)
}

if (skipWrite) process.exit(0)
if (!firstRow) {
  console.log("WRITE  – skipped: no row to probe with.")
  process.exit(0)
}

// ── 2. Write ──────────────────────────────────────────────────────────
// Writing the value back unchanged. If this is refused, the token cannot
// write. If it is allowed, the row is identical to how it started.
const current = plain(firstRow.properties?.Text?.rich_text)
try {
  await notion.pages.update({
    page_id: firstRow.id,
    properties: {
      Text: { rich_text: current ? [{ text: { content: current } }] : [] },
    },
  })
  console.log("WRITE  ✗ ALLOWED — this token can modify the database.")
  console.log("\nNothing was changed: the row was written back with the value it")
  console.log("already had. But a token that can do this can rewrite every word")
  console.log("on the site, and the site never needs to.")
  console.log("\nFix it at https://www.notion.so/my-integrations → your")
  console.log("integration → Capabilities → Read content only. Keep a separate")
  console.log("write-capable token for scripts/seed-notion.mjs, and run that")
  console.log("from your own machine rather than storing it in Vercel.")
  process.exit(1)
} catch (error) {
  const code = error.code ?? ""
  if (code === "restricted_resource" || code === "unauthorized" || error.status === 403) {
    console.log(`WRITE  ✓ REFUSED (${code || error.status}) — the token is read-only.`)
    console.log("\nThis is what it should say: the site can read its copy and")
    console.log("nothing more.")
    process.exit(0)
  }
  console.log(`WRITE  ? inconclusive — ${code || error.message}`)
  console.log("\nThe write did not succeed, but not for a permissions reason.")
  process.exit(1)
}
