import { cache } from "react"
import { Client } from "@notionhq/client"
import { config } from "./config"

const notion = new Client({
  auth: config.notion.token,
})

export type HomeContent = Record<string, string>

function extractPlainText(richText: any[]): string {
  return richText?.map((text) => text.plain_text).join("") || ""
}

/**
 * Fetches every homepage text override from the site's Notion database
 * (dgc-pages — the same database as the site's pages, via
 * NOTION_DATABASE_ID; NOTION_CONTENT_DATABASE_ID overrides it if set)
 * in one paginated query: rows whose title starts with "home." and are
 * Published. The row's "Text" rich-text property is the value.
 *
 * Returns an empty map when Notion isn't configured or errors, so every
 * slot renders its built-in default copy.
 */
export const getHomeText = cache(async (): Promise<HomeContent> => {
  try {
    const databaseId =
      config.notion.contentDatabaseId || config.notion.databaseId
    if (!databaseId || !config.notion.token) {
      return {}
    }

    const map: HomeContent = {}
    let cursor: string | undefined = undefined
    do {
      const response: any = await notion.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            { property: "title", title: { starts_with: "home." } },
            { property: "Published", checkbox: { equals: true } },
          ],
        },
        start_cursor: cursor,
        page_size: 100,
      })
      for (const page of response.results) {
        const titleProp: any = Object.values(page.properties || {}).find(
          (prop: any) => prop?.type === "title",
        )
        const key = extractPlainText(titleProp?.title || [])
        const text = extractPlainText(page.properties.Text?.rich_text || [])
        if (key && text) map[key] = text
      }
      cursor = response.has_more ? response.next_cursor : undefined
    } while (cursor)
    return map
  } catch (error) {
    console.error("Error fetching homepage text:", error)
    return {}
  }
})
