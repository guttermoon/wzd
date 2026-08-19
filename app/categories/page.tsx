import Link from "next/link"
import { Reveal } from "@/components/fx/reveal"
import { getCategories, getAllPosts } from "@/lib/notion"

export const metadata = {
  title: "Table of Contents | The Dead Good Club",
  description: "Every section of The Dead Good Club, indexed and on file.",
}

export const revalidate = 60

const ACCENTS = ["bg-press-red", "bg-cobalt", "bg-mustard", "bg-avocado"]

export default async function CategoriesPage() {
  const [categories, allPosts] = await Promise.all([getCategories(), getAllPosts()])

  const categoryStats = categories.map((category) => {
    const postsInCategory = allPosts.filter((post) => post.category === category)
    return {
      name: category,
      count: postsInCategory.length,
      latestPost: postsInCategory[0] || null,
    }
  })

  return (
    <div className="min-h-screen overflow-x-clip">
      {/* Page header */}
      <section className="border-b border-ink/80">
        <div className="container py-14 md:py-20">
          <Reveal effect="fade">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60">
              Find your section
            </p>
          </Reveal>
          <Reveal effect="settle" delay={80}>
            <h1 className="mt-2 font-display uppercase leading-[0.95] text-ink">
              <span
                className="overprint text-[clamp(2.5rem,8vw,5.5rem)]"
                data-text="Table of"
              >
                Table of
              </span>
              <br />
              <span
                className="overprint text-[clamp(2.5rem,8vw,5.5rem)]"
                data-text="Contents"
              >
                Contents
              </span>
            </h1>
          </Reveal>
          <Reveal effect="fade" delay={200}>
            <p className="mt-6 max-w-2xl font-serif text-lg italic text-ink/75">
              Every section of the publication,{" "}
              <span className="highlight-green">indexed and on file.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Index cards */}
      <section className="container py-14 md:py-16">
        {categoryStats.length === 0 ? (
          <Reveal effect="stamp" className="py-14 text-center">
            <span className="stamp px-6 py-3 text-lg">Index being compiled</span>
            <p className="mt-6 font-serif italic text-ink/60">
              Sections will appear here once the first dispatches are published.
            </p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categoryStats.map((category, index) => (
              <Reveal
                key={category.name}
                effect="settle"
                delay={(index % 3) * 110}
                rotate={index % 2 === 0 ? -1 : 1.2}
              >
                <Link
                  href={`/blog?category=${encodeURIComponent(category.name)}`}
                  className="block h-full"
                >
                  <div
                    className="clipping flex h-full flex-col p-6"
                    style={{ "--clip-rot": `${index % 2 === 0 ? -1 : 1.2}deg` } as React.CSSProperties}
                  >
                    {/* Corner swatch */}
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`${ACCENTS[index % ACCENTS.length]} h-10 w-10 shrink-0 border border-ink/70`}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
                        {category.count} {category.count === 1 ? "article" : "articles"} on file
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-2xl uppercase leading-tight text-ink sm:text-3xl">
                      {category.name}
                    </h2>

                    {category.latestPost && (
                      <div className="mt-auto pt-5">
                        <div className="rule" />
                        <p className="pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                          Latest filing
                        </p>
                        <p className="mt-1 font-serif italic leading-snug text-ink/80 line-clamp-2">
                          {category.latestPost.title}
                        </p>
                        <time className="mt-1 block font-mono text-[11px] uppercase tracking-wider text-ink/50">
                          {new Date(category.latestPost.publishedAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Most-thumbed sections */}
      {categoryStats.length > 0 && (
        <section className="torn-top bg-paper-2 pt-4">
          <div className="container py-14 md:py-16">
            <Reveal effect="fade">
              <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase leading-none text-ink">
                <span className="highlight">Most thumbed</span>
              </h2>
              <div className="rule-thick mt-4" />
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-4">
              {[...categoryStats]
                .sort((a, b) => b.count - a.count)
                .slice(0, 6)
                .map((category, index) => (
                  <Reveal key={category.name} effect="stamp" delay={index * 90}>
                    <Link
                      href={`/blog?category=${encodeURIComponent(category.name)}`}
                      className={`stamp ${index % 3 === 1 ? "stamp-cobalt" : index % 3 === 2 ? "stamp-avocado" : ""} px-4 py-2 text-sm transition-transform hover:scale-[1.05]`}
                      style={{ "--stamp-rot": `${index % 2 === 0 ? -2 : 2}deg` } as React.CSSProperties}
                    >
                      {category.name} ({category.count})
                    </Link>
                  </Reveal>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
