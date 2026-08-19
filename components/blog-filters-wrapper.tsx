"use client"

import { Suspense } from "react"
import { BlogFilters } from "./blog-filters"
import { LoadingSpinner } from "./loading-spinner"

interface BlogFiltersWrapperProps {
  categories: string[]
  tags: string[]
}

export function BlogFiltersWrapper({ categories, tags }: BlogFiltersWrapperProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BlogFilters categories={categories} tags={tags} />
    </Suspense>
  )
}
