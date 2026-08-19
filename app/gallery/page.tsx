import type { Metadata } from "next"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT } from "@/components/notion-text"
import { PageShell } from "@/components/page-shell"
import { Photo } from "@/components/photo"
import { allPhotos } from "@/lib/photos"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from a decade of World Zombie Day: London, by the photographers who came along.",
  alternates: { canonical: "/gallery" },
}

export default async function GalleryPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const photos = allPhotos()

  return (
    <PageShell title={<T k="gallery.title" />} standfirst={<T k="gallery.standfirst" />}>
      <p className="prose-wzd mt-6 font-body text-muted">
        <T k="gallery.credit.note" />
      </p>

      {/* A plain masonry-ish grid. No lightbox: each image is already a
          full-width link-free figure with its credit attached, and a
          modal would add a focus trap for no real gain. */}
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <Photo
            key={p.slug}
            photo={p}
            sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 45vw, 100vw"
            imageClassName="border-2 border-rule"
          />
        ))}
      </div>
    </PageShell>
  )
}
