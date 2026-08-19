// Configuration validation for build time
export const config = {
  notion: {
    token: process.env.NOTION_TOKEN,
    databaseId: process.env.NOTION_DATABASE_ID,
  },
  revalidation: {
    secret: process.env.REVALIDATION_SECRET,
  },
}

// Validate required environment variables
export function validateConfig() {
  const errors: string[] = []

  if (!config.notion.token) {
    errors.push("NOTION_TOKEN is required")
  }

  if (!config.notion.databaseId) {
    errors.push("NOTION_DATABASE_ID is required")
  }

  if (errors.length > 0) {
    console.warn("Missing environment variables:", errors.join(", "))
    console.warn("Some features may not work properly. Check your .env file.")
  }

  return errors.length === 0
}

// Call validation on import (but don't fail the build)
if (typeof window === "undefined") {
  validateConfig()
}
