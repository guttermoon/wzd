"use client"

import { ThemeProvider as NextThemes } from "next-themes"
import type React from "react"

/**
 * Dark by default — the nostalgic one — but a first-time visitor who has
 * asked their OS for light gets light.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  )
}
