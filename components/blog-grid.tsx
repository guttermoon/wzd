import { getAllPosts } from "@/lib/notion"
import { PostClipping } from "@/components/post-clipping"
import { Reveal } from "@/components/fx/reveal"

interface BlogGridProps {
  searchParams: {
    category?: string
    tag?: string
    search?: string
  }
}

export async function BlogGrid({ searchParams }: BlogGridProps) {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = []

  try {
    posts = await getAllPosts(searchParams)
  } catch (error) {
    console.error("Error loading posts:", error)
    return (
      <Reveal effect="stamp" className="py-16 text-center">
        <span className="stamp px-6 py-3 text-lg">Press malfunction</span>
        <p className="mt-6 font-serif italic text-ink/60">
          There was an error loading the archive. Please try again later.
        </p>
      </Reveal>
    )
  }

  if (posts.length === 0) {
    return (
      <Reveal effect="stamp" className="py-16 text-center">
        <span className="stamp px-6 py-3 text-lg">Nothing on file</span>
        <p className="mt-6 font-serif italic text-ink/60">
          Try adjusting your filters or search terms.
        </p>
      </Reveal>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <PostClipping key={post.id} post={post} index={index} />
      ))}
    </div>
  )
}
