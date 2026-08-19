import { type NextRequest, NextResponse } from "next/server"
import { getAllPosts } from "@/lib/notion"

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")

    const posts = await getAllPosts({
      category: category || undefined,
      tag: tag || undefined,
      search: search || undefined,
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}
