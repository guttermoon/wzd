import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { path, secret } = await request.json()

    // Optional: Add a secret to prevent unauthorized revalidation
    if (secret && secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
    }

    if (path) {
      revalidatePath(path)
      return NextResponse.json({ revalidated: true, path })
    } else {
      // Revalidate common paths
      revalidatePath("/")
      revalidatePath("/blog")
      return NextResponse.json({ revalidated: true, paths: ["/", "/blog"] })
    }
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Revalidation endpoint. Use POST to trigger revalidation.",
  })
}
