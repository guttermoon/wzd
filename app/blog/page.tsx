import { Suspense } from "react"
import { BlogGrid } from "@/components/blog-grid"
import { BlogFiltersWrapper } from "@/components/blog-filters-wrapper"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorBoundary } from "@/components/error-boundary"
import { Reveal } from "@/components/fx/reveal"
import { getCategories, getTags } from "@/lib/notion"
import { getSectionContent } from "@/lib/notion-content"

export const metadata = {
  title: "The Classified Index | The Dead Good Club",
  description: "Browse every dispatch in the archive of The Dead Good Club.",
}

// Force dynamic rendering to handle search params
export const dynamic = "force-dynamic"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string; search?: string }
}) {
  const [categories, tags, intro] = await Promise.all([
    getCategories(),
    getTags(),
    getSectionContent("blog-intro"),
  ])

  return (
    <div className="container overflow-x-clip py-10 md:py-14">
      <Reveal effect="fade" className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60">
          The archive
        </p>
        <h1 className="mt-1 font-display uppercase leading-none text-ink">
          <span
            className="overprint text-[clamp(2.5rem,8vw,5rem)]"
            data-text="Classified Index"
          >
            Classified Index
          </span>
        </h1>
        {intro?.html ? (
          <div
            className="mt-4 max-w-2xl font-serif text-lg italic text-ink/75 [&_p]:my-1"
            dangerouslySetInnerHTML={{ __html: intro.html }}
          />
        ) : (
          <p className="mt-4 max-w-2xl font-serif text-lg italic text-ink/75">
            Every dispatch on file — sorted, stamped, and cross-referenced.
          </p>
        )}
        <div className="rule-double mt-6" />
      </Reveal>

      <ErrorBoundary>
        <BlogFiltersWrapper categories={categories} tags={tags} />
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <BlogGrid searchParams={searchParams} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
