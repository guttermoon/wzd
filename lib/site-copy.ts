import { cache } from "react"
import { Client } from "@notionhq/client"
import { config } from "./config"
import defaults from "@/content/site-copy.json"

const notion = new Client({ auth: config.notion.token })

export type SiteCopy = Record<string, string>

/** Keys look like `home.hero.title` — dotted, lowercase, no spaces. */
const KEY_PATTERN = /^[a-z][a-z0-9]*(\.[a-z0-9-]+)+$/

function extractPlainText(richText: any[]): string {
  return richText?.map((text) => text.plain_text).join("") || ""
}

/**
 * Every string on the site, keyed. The built-in copy in
 * content/site-copy.json is the base layer; any live row in the Notion
 * database whose title is a matching key overrides it.
 *
 * A row counts as live if it is marked so by whichever gate the database
 * actually has — a `Published` checkbox, or a `Status` set to a done-type
 * value. A database with neither treats every row as live. That flexibility
 * is deliberate: the owner sets the database up in Notion, and the site
 * adapts rather than demanding one exact property name.
 *
 * The site renders complete and correct with no Notion credentials at all —
 * Notion only ever replaces text that already exists.
 */
export const getSiteCopy = cache(async (): Promise<SiteCopy> => {
  const copy: SiteCopy = { ...(defaults as SiteCopy) }

  const { databaseId, token } = config.notion
  if (!databaseId || !token) return copy

  try {
    let cursor: string | undefined = undefined
    do {
      // No server-side filter: the gate property differs per database, so
      // the decision is made below. The whole table is one small query.
      const response: any = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
      })
      for (const page of response.results) {
        const properties = page.properties || {}
        const titleProp: any = Object.values(properties).find(
          (prop: any) => prop?.type === "title",
        )
        const key = extractPlainText(titleProp?.title || []).trim()
        const text = extractPlainText(properties.Text?.rich_text || [])
        if (KEY_PATTERN.test(key) && text && isLive(properties)) copy[key] = text
      }
      cursor = response.has_more ? response.next_cursor : undefined
    } while (cursor)
  } catch (error) {
    // A Notion outage must never take the site down — fall back to built-ins.
    console.error("Error fetching site copy from Notion:", error)
  }

  return copy
})

/** Statuses that mean "ready to show", case-insensitively. */
const DONE = new Set(["done", "published", "live", "complete", "completed"])

function isLive(properties: Record<string, any>): boolean {
  const published = properties.Published
  if (published?.type === "checkbox") return published.checkbox === true

  const status = properties.Status
  if (status?.type === "status") return DONE.has(status.status?.name?.toLowerCase() ?? "")
  if (status?.type === "select") return DONE.has(status.select?.name?.toLowerCase() ?? "")

  // No gate configured: everything in the database is live.
  return true
}
