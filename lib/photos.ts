import registry from "@/content/photos.json"
import renditions from "@/content/photo-renditions.json"

export interface Photo {
  /** Stable id, and the basename of every rendition on disk. */
  slug: string
  /** Original filename as supplied — kept so credits can be traced back. */
  source: string
  /** Photographer. Required: nothing renders without one. */
  credit: string
  creditUrl?: string
  /** Describes the scene for someone who can't see it. Never the credit. */
  alt: string
  slot?: string
  /** Note about an uncertain or disputed credit, surfaced in IMAGES.md. */
  creditNote?: string
  /** Whether the photo is offered on the press page. */
  press?: boolean
}

const photos = registry as Photo[]

const bySlug = new Map(photos.map((photo) => [photo.slug, photo]))

/**
 * Look up a photo by slug. Throws at build time rather than rendering an
 * uncredited or broken image — a missing photo is a bug, not a blank space.
 */
export function photo(slug: string): Photo {
  const found = bySlug.get(slug)
  if (!found) throw new Error(`Unknown photo "${slug}" — add it to content/photos.json`)
  if (!found.credit) throw new Error(`Photo "${slug}" has no credit; every photo must credit its photographer`)
  return found
}

export function allPhotos(): Photo[] {
  return photos
}

export function pressPhotos(): Photo[] {
  return photos.filter((p) => p.press !== false)
}

interface Rendition {
  widths: number[]
  aspect: number
}

/**
 * What scripts/prepare-images.mjs actually wrote for each photo. Originals
 * smaller than a given width are never upscaled, so this varies per photo.
 */
function rendition(photo: Photo): Rendition {
  const found = (renditions as Record<string, Rendition>)[photo.slug]
  if (!found?.widths?.length) {
    throw new Error(
      `No renditions for "${photo.slug}" — run: node scripts/prepare-images.mjs`,
    )
  }
  return found
}

export function widths(photo: Photo): number[] {
  return rendition(photo).widths
}

export function widestWidth(photo: Photo): number {
  const list = widths(photo)
  return list[list.length - 1]
}

/** Intrinsic width ÷ height, for reserving space before the image loads. */
export function aspect(photo: Photo): number {
  return rendition(photo).aspect
}

export function srcSet(photo: Photo): string {
  return widths(photo)
    .map((w) => `/photos/${photo.slug}-${w}.webp ${w}w`)
    .join(", ")
}

export function fallbackSrc(photo: Photo): string {
  return `/photos/${photo.slug}-${widestWidth(photo)}.jpg`
}

export function pressSrc(photo: Photo): string {
  return `/press/${photo.slug}-press.jpg`
}
