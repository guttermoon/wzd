import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { BlogPost } from "@/components/blog-post"
import { RelatedPosts } from "@/components/related-posts"
import { getPostBySlug, getAllPosts } from "@/lib/notion"

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | The Dead Good Club`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

// Revalidate every 60 seconds
export const revalidate = 60

// For development: uncomment the line below to disable static generation
// export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container overflow-x-clip py-10 md:py-14">
      <BlogPost post={post} />
      <RelatedPosts currentPostId={post.id} category={post.category} />
    </div>
  )
}
