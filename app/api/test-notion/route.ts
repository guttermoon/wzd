import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export async function GET() {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID

    if (!databaseId) {
      return NextResponse.json({
        error: "NOTION_DATABASE_ID is not set",
        hasToken: !!process.env.NOTION_TOKEN,
        hasDbId: !!process.env.NOTION_DATABASE_ID,
      })
    }

    // Get database info
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    })

    // Extract schema options
    const categoryProperty = database.properties.Category
    const tagsProperty = database.properties.Tags

    const categoryOptions =
      categoryProperty?.type === "select" && categoryProperty.select?.options
        ? categoryProperty.select.options.map((option: any) => option.name)
        : []

    const tagOptions =
      tagsProperty?.type === "multi_select" &&
      tagsProperty.multi_select?.options
        ? tagsProperty.multi_select.options.map((option: any) => option.name)
        : []

    // Get all pages (including unpublished ones)
    const allPages = await notion.databases.query({
      database_id: databaseId,
    })

    // Get only published pages
    const publishedPages = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
    })

    // Extract categories and tags from all pages
    const allCategories = new Set<string>()
    const allTags = new Set<string>()

    allPages.results.forEach((page: any) => {
      // Extract category
      const categoryProperty = page.properties.Category
      if (
        categoryProperty?.type === "select" &&
        categoryProperty.select?.name
      ) {
        allCategories.add(categoryProperty.select.name)
      }

      // Extract tags
      const tagsProperty = page.properties.Tags
      if (tagsProperty?.type === "multi_select") {
        tagsProperty.multi_select.forEach((tag: any) => {
          if (tag.name) {
            allTags.add(tag.name)
          }
        })
      }
    })

    return NextResponse.json({
      success: true,
      environment: {
        hasToken: !!process.env.NOTION_TOKEN,
        hasDbId: !!process.env.NOTION_DATABASE_ID,
      },
      database: {
        title: database.title?.[0]?.plain_text || "Untitled",
        properties: Object.keys(database.properties),
      },
      pages: {
        total: allPages.results.length,
        published: publishedPages.results.length,
      },
      categories: Array.from(allCategories),
      tags: Array.from(allTags),
      samplePage: allPages.results[0]
        ? {
            id: allPages.results[0].id,
            properties: Object.keys((allPages.results[0] as any).properties),
            published: (allPages.results[0] as any).properties.Published
              ?.checkbox,
            category: (allPages.results[0] as any).properties.Category?.select
              ?.name,
            tags: (
              allPages.results[0] as any
            ).properties.Tags?.multi_select?.map((t: any) => t.name),
          }
        : null,
    })
  } catch (error: any) {
    console.error("Notion API Error:", error)
    return NextResponse.json({
      error: error.message,
      code: error.code,
      hasToken: !!process.env.NOTION_TOKEN,
      hasDbId: !!process.env.NOTION_DATABASE_ID,
    })
  }
}
