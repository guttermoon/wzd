import { NextResponse } from "next/server"

/**
 * Placeholder for a mailing-list signup.
 *
 * No form on the site posts here yet — a provider hasn't been chosen. It
 * deliberately returns 501 rather than pretending to succeed, so that if a
 * form is ever wired up before the provider is, the failure is loud instead
 * of quietly dropping people's email addresses.
 *
 * To implement: send the address to the provider, and return 200 only once
 * the provider has accepted it.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Newsletter signup is not configured yet." },
    { status: 501 },
  )
}
