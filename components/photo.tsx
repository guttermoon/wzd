import type React from "react"
import {
  type Photo as PhotoData,
  srcSet,
  fallbackSrc,
  widestWidth,
  aspect,
} from "@/lib/photos"

/**
 * The only way a photograph appears on this site.
 *
 * Every photo renders inside a <figure> with a visible photographer credit
 * in its <figcaption> — the credit is not optional, and is not merely alt
 * text. lib/photos.ts refuses to return a photo without one, so an
 * uncredited image cannot reach the page.
 *
 * Renditions are pre-built by scripts/prepare-images.mjs, so this is a
 * plain <picture>: WebP where supported, JPEG everywhere else, and real
 * width/height so nothing shifts as it loads.
 */
export function Photo({
  photo,
  sizes = "100vw",
  priority = false,
  className = "",
  imageClassName = "",
  caption,
}: {
  photo: PhotoData
  sizes?: string
  priority?: boolean
  className?: string
  imageClassName?: string
  /** Optional editorial caption, shown above the credit. */
  caption?: React.ReactNode
}) {
  const width = widestWidth(photo)
  const height = Math.round(width / aspect(photo))

  return (
    <figure className={className}>
      <picture>
        <source type="image/webp" srcSet={srcSet(photo)} sizes={sizes} />
        <img
          src={fallbackSrc(photo)}
          alt={photo.alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : undefined}
          className={`h-auto w-full ${imageClassName}`}
        />
      </picture>
      <figcaption className="mt-2 font-body text-sm leading-snug text-muted">
        {caption ? <span className="mb-1 block text-text">{caption}</span> : null}
        <span>
          Photo:{" "}
          {photo.creditUrl ? (
            <a className="link" href={photo.creditUrl} rel="noopener noreferrer">
              {photo.credit}
            </a>
          ) : (
            photo.credit
          )}
        </span>
      </figcaption>
    </figure>
  )
}
