import type { makeT } from "@/components/notion-text"

// Photography shared across the strip's sections
export const IMG = "/574b42abfa2555952d3273c85e9cec76.webp"
export const TREES = "/birch-trees.webp"
export const FIELD = "/grassy-field.webp"
export const MOON = "/moon.webp"
export const MOON_LANDSCAPE = "/moon-landscape.webp"
export const DOYLE = "/doyle.webp"

/** Notion-backed text slot renderer — see components/notion-text.tsx */
export type TSlot = ReturnType<typeof makeT>

export interface SectionProps {
  T: TSlot
}
