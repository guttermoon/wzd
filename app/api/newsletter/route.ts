import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Here you would integrate with your email service (e.g., Mailchimp, ConvertKit, etc.)
    // For now, we'll just simulate success
    console.log("Newsletter signup:", email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Newsletter signup error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
