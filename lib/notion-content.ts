import { cache } from "react"
import { Client } from "@notionhq/client"
import { config } from "./config"
import { convertNotionToMarkdown, convertMarkdownToHtml } from "./notion"

const notion = new Client({
  auth: config.notion.token,
})

export interface SectionContent {
  heading: string | null
  html: string
}

function extractPlainText(richText: any[]): string {
  return richText?.map((text) => text.plain_text).join("") || ""
}

/**
 * Fetches an editable text section from the "Site Content" Notion database
 * by its Key (title property). The page body becomes the section's HTML.
 *
 * Returns null when the content database isn't configured, the key doesn't
 * exist, or the API errors — callers render their built-in default copy in
 * that case, so the site never shows a blank section.
 */
export const getSectionContent = cache(
  async (key: string): Promise<SectionContent | null> => {
    try {
      const databaseId = config.notion.contentDatabaseId
      if (!databaseId || !config.notion.token) {
        return null
      }

      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            {
              property: "Key",
              title: {
                equals: key,
              },
            },
            {
              property: "Published",
              checkbox: {
                equals: true,
              },
            },
          ],
        },
        page_size: 1,
      })

      const page: any = response.results[0]
      if (!page) {
        return null
      }

      const heading =
        extractPlainText(page.properties.Heading?.rich_text || []) || null

      const markdown = await convertNotionToMarkdown(page.id)
      if (!markdown.trim() && !heading) {
        return null
      }

      return {
        heading,
        html: markdown.trim() ? convertMarkdownToHtml(markdown) : "",
      }
    } catch (error) {
      console.error(`Error fetching section content "${key}":`, error)
      return null
    }
  },
)
