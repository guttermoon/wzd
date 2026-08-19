import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import { config } from "./config"

const notion = new Client({
  auth: config.notion.token,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

export interface Author {
  id: string
  name: string
  avatar: string
  bio: string
  social: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  publishedAt: string
  updatedAt: string
  category: string
  tags: string[]
  author: Author
  featured: boolean
  readingTime: number
}

// Helper functions
function extractPlainText(richText: any[]): string {
  return richText?.map((text) => text.plain_text).join("") || ""
}

function createSlug(title: string): string {
  if (!title || typeof title !== "string") {
    return "untitled-post"
  }
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function calculateReadingTime(content: string): number {
  if (!content || typeof content !== "string") {
    return 1
  }
  const wordsPerMinute = 200
  const words = content.split(/\s+/).filter((word) => word.length > 0).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

function extractCoverImage(page: any): string | undefined {
  // First check the Cover Image property (Files & Media)
  const coverImageProperty = page.properties["Cover Image"]
  if (
    coverImageProperty?.type === "files" &&
    coverImageProperty.files.length > 0
  ) {
    const file = coverImageProperty.files[0]
    if (file.type === "external") {
      return file.external.url
    }
    if (file.type === "file") {
      return file.file.url
    }
  }

  // Fallback to page cover
  if (page.cover?.type === "external") {
    return page.cover.external.url
  }
  if (page.cover?.type === "file") {
    return page.cover.file.url
  }
  return undefined
}

function extractTags(page: any): string[] {
  const tagsProperty = page.properties.Tags || page.properties.tags
  if (tagsProperty?.type === "multi_select") {
    return tagsProperty.multi_select.map((tag: any) => tag.name)
  }
  return []
}

function extractCategory(page: any): string {
  const categoryProperty = page.properties.Category || page.properties.category
  if (categoryProperty?.type === "select") {
    return categoryProperty.select?.name || "Uncategorized"
  }
  return "Uncategorized"
}

function extractAuthor(page: any): Author {
  const authorProperty = page.properties.Author || page.properties.author
  if (authorProperty?.type === "people" && authorProperty.people.length > 0) {
    const person = authorProperty.people[0]
    return {
      id: person.id,
      name: person.name || "Anonymous",
      avatar: person.avatar_url || "/placeholder.svg?height=100&width=100",
      bio: "",
      social: {},
    }
  }

  // Fallback to created_by if no author property
  const createdBy = page.created_by
  return {
    id: createdBy.id,
    name: createdBy.name || "Anonymous",
    avatar: createdBy.avatar_url || "/placeholder.svg?height=100&width=100",
    bio: "",
    social: {},
  }
}

export async function convertNotionToMarkdown(pageId: string): Promise<string> {
  try {
    // Add retry logic and better error handling for the clone issue
    let retries = 3
    while (retries > 0) {
      try {
        const mdblocks = await n2m.pageToMarkdown(pageId)
        const mdString = n2m.toMarkdownString(mdblocks)
        return mdString?.parent || ""
      } catch (error: any) {
        if (
          error.message?.includes("Body has already been consumed") &&
          retries > 1
        ) {
          console.warn(
            `Retrying markdown conversion for page ${pageId}, attempts left: ${
              retries - 1
            }`
          )
          retries--
          // Wait a bit before retrying
          await new Promise((resolve) => setTimeout(resolve, 100))
          continue
        }
        throw error
      }
    }
    return ""
  } catch (error) {
    console.error("Error converting Notion page to markdown:", error)
    return ""
  }
}

export function convertMarkdownToHtml(markdown: string): string {
  // Handle null/undefined markdown
  if (!markdown || typeof markdown !== "string") {
    return "<p>Content not available</p>"
  }

  // Basic markdown to HTML conversion
  return markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
    .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n\n/gim, "</p><p>")
    .replace(/^(.*)$/gim, "<p>$1</p>")
    .replace(/<p><\/p>/gim, "")
}

async function transformNotionPageToBlogPost(page: any): Promise<BlogPost> {
  try {
    const title =
      extractPlainText(
        page.properties.Title?.title || page.properties.Name?.title || []
      ) || "Untitled Post"

    // Use the Slug field from your database, fallback to generated slug
    const slug =
      extractPlainText(page.properties.Slug?.rich_text || []) ||
      createSlug(title)

    const excerpt =
      extractPlainText(page.properties.Excerpt?.rich_text || []) ||
      (title.length > 150 ? title.substring(0, 150) + "..." : title)

    // Get page content
    const markdown = await convertNotionToMarkdown(page.id)
    const content = convertMarkdownToHtml(markdown)

    const coverImage = extractCoverImage(page)

    // Use Published Date field, fallback to created time
    const publishedAt =
      page.properties["Published Date"]?.date?.start || page.created_time
    const updatedAt = page.last_edited_time
    const category = extractCategory(page)
    const tags = extractTags(page)
    const author = extractAuthor(page)
    const featured = page.properties.Featured?.checkbox || false
    const readingTime = calculateReadingTime(content)

    return {
      id: page.id,
      title,
      slug,
      excerpt,
      content,
      coverImage,
      publishedAt,
      updatedAt,
      category,
      tags,
      author,
      featured,
      readingTime,
    }
  } catch (error) {
    console.error("Error transforming Notion page to blog post:", error)
    // Return a fallback blog post
    return {
      id: page.id,
      title: "Error Loading Post",
      slug: "error-loading-post",
      excerpt: "There was an error loading this post.",
      content: "<p>There was an error loading this post content.</p>",
      coverImage: undefined,
      publishedAt: page.created_time || new Date().toISOString(),
      updatedAt: page.last_edited_time || new Date().toISOString(),
      category: "Uncategorized",
      tags: [],
      author: {
        id: "unknown",
        name: "Unknown Author",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "",
        social: {},
      },
      featured: false,
      readingTime: 1,
    }
  }
}

export async function getAllPosts(filters?: {
  category?: string
  tag?: string
  search?: string
}): Promise<BlogPost[]> {
  try {
    const databaseId = config.notion.databaseId
    if (!databaseId) {
      console.error("NOTION_DATABASE_ID is not set")
      return []
    }

    let filter: any = {
      and: [
        {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
      ],
    }

    // Add category filter
    if (filters?.category && filters.category !== "all") {
      filter.and.push({
        property: "Category",
        select: {
          equals: filters.category,
        },
      })
    }

    // Add tag filter
    if (filters?.tag && filters.tag !== "all") {
      filter.and.push({
        property: "Tags",
        multi_select: {
          contains: filters.tag,
        },
      })
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter,
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    })

    // Process posts with error handling for each individual post
    const posts: BlogPost[] = []
    for (const page of response.results) {
      try {
        // home.* rows are homepage copy (see lib/homepage-content.ts),
        // not pages/posts
        const titleProp: any = Object.values((page as any).properties || {}).find(
          (prop: any) => prop?.type === "title",
        )
        const rowTitle = (titleProp?.title || [])
          .map((t: any) => t.plain_text)
          .join("")
        if (rowTitle.startsWith("home.")) continue
        const post = await transformNotionPageToBlogPost(page)
        posts.push(post)
      } catch (error) {
        console.error(`Error processing post ${page.id}:`, error)
        // Continue processing other posts instead of failing completely
      }
    }

    // Apply search filter if provided
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase()
      return posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm)
      )
    }

    return posts
  } catch (error) {
    console.error("Error fetching posts from Notion:", error)
    return []
  }
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const databaseId = config.notion.databaseId
    if (!databaseId) {
      console.error("NOTION_DATABASE_ID is not set")
      return []
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Featured",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    })

    return Promise.all(response.results.map(transformNotionPageToBlogPost))
  } catch (error) {
    console.error("Error fetching featured posts from Notion:", error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getAllPosts()
    return posts.find((post) => post.slug === slug) || null
  } catch (error) {
    console.error("Error fetching post by slug:", error)
    return null
  }
}

export async function getRelatedPosts(
  currentPostId: string,
  category: string
): Promise<BlogPost[]> {
  try {
    const posts = await getAllPosts({ category })
    return posts.filter((post) => post.id !== currentPostId).slice(0, 3)
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return []
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const posts = await getAllPosts()
    const categories = [...new Set(posts.map((post) => post.category))]
    return categories.sort()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getTags(): Promise<string[]> {
  try {
    const posts = await getAllPosts()
    const tags = [...new Set(posts.flatMap((post) => post.tags))]
    return tags.sort()
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
}
